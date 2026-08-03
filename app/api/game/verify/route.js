import { NextResponse } from "next/server";
import {
  authenticateGameRequest,
  createServerCompletionCode,
  publicGuest,
} from "@/lib/gameServer";
import { getAchievements, getEnding, validateLevelAnswer } from "@/lib/gameServerConfig";
import { supabaseAdmin } from "@/utils/supabaseAdmin";

const TABLE = "guest_progress";

export async function POST(request) {
  try {
    const guest = await authenticateGameRequest(request);
    if (!guest) {
      return NextResponse.json({ error: "遊戲憑證已失效，請重新登入。" }, { status: 401 });
    }

    const body = await request.json();
    const level = Number(body.level);
    const levelAttempts = Math.max(1, Number(body.attempts) || 1);
    const levelHints = Math.max(0, Math.min(2, Number(body.hintsUsed) || 0));

    if (level !== Number(guest.current_level) || level < 1 || level > 4) {
      return NextResponse.json({ error: "章節進度不一致，請重新整理。" }, { status: 409 });
    }

    const totalAttempts = (guest.attempts || 0) + 1;
    const correct = validateLevelAnswer(level, body.answer);

    if (!correct) {
      await supabaseAdmin.from(TABLE).update({ attempts: totalAttempts }).eq("id", guest.id);
      return NextResponse.json({
        correct: false,
        message: "星光沒有回應。再讀一次線索，你已經很接近了。",
      });
    }

    const totalHints = (guest.hints_used || 0) + levelHints;
    const affectionGain = Math.max(10, 25 - levelHints * 4 - Math.max(0, levelAttempts - 1) * 2);
    const affectionScore = Math.min(100, (guest.affection_score || 0) + affectionGain);
    const isFinal = level === 4;
    const nextLevel = isFinal ? 5 : level + 1;
    const ending = getEnding({ hintsUsed: totalHints, attempts: totalAttempts });
    const achievements = isFinal
      ? getAchievements({ hintsUsed: totalHints, level })
      : guest.achievements || [];

    const changes = {
      current_level: nextLevel,
      hints_used: totalHints,
      attempts: totalAttempts,
      affection_score: affectionScore,
      ...(isFinal
        ? {
            is_completed: true,
            completion_code: guest.completion_code || createServerCompletionCode(),
            completed_at: guest.completed_at || new Date().toISOString(),
            ending_type: ending.endingType,
            achievements,
          }
        : {}),
    };

    let result = await supabaseAdmin
      .from(TABLE)
      .update(changes)
      .eq("id", guest.id)
      .eq("current_level", level)
      .select("*")
      .single();

    if (result.error) {
      // 舊 schema 的相容路徑；執行新版 migration 後會自動使用完整評分資料。
      const legacyChanges = isFinal
        ? {
            current_level: 5,
            is_completed: true,
            completion_code: guest.completion_code || createServerCompletionCode(),
            completed_at: guest.completed_at || new Date().toISOString(),
          }
        : { current_level: nextLevel };
      result = await supabaseAdmin
        .from(TABLE)
        .update(legacyChanges)
        .eq("id", guest.id)
        .eq("current_level", level)
        .select("*")
        .single();
    }

    if (result.error) throw result.error;

    return NextResponse.json({
      correct: true,
      completed: isFinal,
      score: ending.score,
      guest: publicGuest(result.data),
    });
  } catch (error) {
    console.error("verify game answer", error);
    return NextResponse.json({ error: "星軌暫時中斷，請稍後再試。" }, { status: 500 });
  }
}
