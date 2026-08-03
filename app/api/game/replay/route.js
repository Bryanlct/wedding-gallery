import { NextResponse } from "next/server";
import { authenticateGameRequest, publicGuest } from "@/lib/gameServer";
import { supabaseAdmin } from "@/utils/supabaseAdmin";

const TABLE = "guest_progress";

export async function POST(request) {
  try {
    const guest = await authenticateGameRequest(request);
    if (!guest || !guest.is_completed) {
      return NextResponse.json({ error: "尚未解鎖再挑戰。" }, { status: 403 });
    }

    let result = await supabaseAdmin
      .from(TABLE)
      .update({
        current_level: 1,
        hints_used: 0,
        attempts: 0,
        affection_score: 0,
        ending_type: null,
        achievements: [],
        playthrough_count: (guest.playthrough_count || 0) + 1,
      })
      .eq("id", guest.id)
      .select("*")
      .single();

    if (result.error) {
      result = await supabaseAdmin
        .from(TABLE)
        .update({ current_level: 1 })
        .eq("id", guest.id)
        .select("*")
        .single();
    }

    if (result.error) throw result.error;
    return NextResponse.json({ guest: publicGuest(result.data) });
  } catch (error) {
    console.error("replay game", error);
    return NextResponse.json({ error: "暫時無法開啟新的星軌。" }, { status: 500 });
  }
}
