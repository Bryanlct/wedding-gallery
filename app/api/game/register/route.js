import { NextResponse } from "next/server";
import { issueSession, publicGuest } from "@/lib/gameServer";
import { normalizePhone } from "@/lib/escapeGame";
import { supabaseAdmin } from "@/utils/supabaseAdmin";

const TABLE = "guest_progress";

export async function POST(request) {
  try {
    const body = await request.json();
    const guestName = String(body.name || "").trim();
    const phoneNumber = normalizePhone(String(body.phone || ""));

    if (guestName.length < 2 || phoneNumber.length < 4) {
      return NextResponse.json({ error: "請輸入有效的姓名與手機號碼。" }, { status: 400 });
    }

    let { data: guest, error } = await supabaseAdmin
      .from(TABLE)
      .select("*")
      .eq("phone_number", phoneNumber)
      .maybeSingle();

    if (error) throw error;

    if (!guest) {
      const result = await supabaseAdmin
        .from(TABLE)
        .insert({ guest_name: guestName, phone_number: phoneNumber })
        .select("*")
        .single();
      guest = result.data;
      error = result.error;

      if (error?.code === "23505") {
        const retry = await supabaseAdmin
          .from(TABLE)
          .select("*")
          .eq("phone_number", phoneNumber)
          .single();
        guest = retry.data;
        error = retry.error;
      }
      if (error) throw error;
    }

    const session = await issueSession(guest);
    return NextResponse.json({
      token: session.token,
      secureSession: session.secure,
      guest: publicGuest(guest),
    });
  } catch (error) {
    console.error("register game guest", error);
    return NextResponse.json(
      { error: "命運之門暫時未能開啟，請稍後再試。" },
      { status: 500 }
    );
  }
}
