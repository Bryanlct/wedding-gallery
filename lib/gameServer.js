import { createHash, randomBytes } from "node:crypto";
import { supabaseAdmin } from "@/utils/supabaseAdmin";

const TABLE = "guest_progress";
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function hashSessionToken(token) {
  return createHash("sha256").update(token).digest("hex");
}

export function createSessionToken() {
  return randomBytes(32).toString("base64url");
}

export function createServerCompletionCode() {
  return `WED-2026-${randomBytes(5).toString("hex").toUpperCase()}`;
}

export function getBearerToken(request) {
  const header = request.headers.get("authorization") || "";
  return header.startsWith("Bearer ") ? header.slice(7).trim() : "";
}

export async function issueSession(guest) {
  const token = createSessionToken();
  const { error } = await supabaseAdmin
    .from(TABLE)
    .update({ session_token_hash: hashSessionToken(token) })
    .eq("id", guest.id);

  if (error) {
    // 讓尚未執行新版 migration 的本機環境仍可測試；正式上線須使用雜湊 token。
    return { token: guest.id, secure: false };
  }
  return { token, secure: true };
}

export async function findGuestByToken(token) {
  if (!token) return null;

  if (!uuidPattern.test(token)) {
    const { data } = await supabaseAdmin
      .from(TABLE)
      .select("*")
      .eq("session_token_hash", hashSessionToken(token))
      .maybeSingle();
    if (data) return data;
  }

  if (uuidPattern.test(token)) {
    const { data } = await supabaseAdmin
      .from(TABLE)
      .select("*")
      .eq("id", token)
      .maybeSingle();
    return data || null;
  }

  return null;
}

export async function authenticateGameRequest(request) {
  return findGuestByToken(getBearerToken(request));
}

export function publicGuest(guest) {
  return {
    id: guest.id,
    guestName: guest.guest_name,
    currentLevel: guest.current_level,
    isCompleted: guest.is_completed,
    completionCode: guest.completion_code,
    hintsUsed: guest.hints_used || 0,
    attempts: guest.attempts || 0,
    affectionScore: guest.affection_score || 0,
    achievements: guest.achievements || [],
    endingType: guest.ending_type || null,
    playthroughCount: guest.playthrough_count || 0,
  };
}
