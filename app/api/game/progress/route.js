import { NextResponse } from "next/server";
import { authenticateGameRequest, publicGuest } from "@/lib/gameServer";

export async function GET(request) {
  try {
    const guest = await authenticateGameRequest(request);
    if (!guest) {
      return NextResponse.json({ error: "遊戲憑證已失效，請重新登入。" }, { status: 401 });
    }
    return NextResponse.json({ guest: publicGuest(guest) });
  } catch (error) {
    console.error("load game progress", error);
    return NextResponse.json({ error: "暫時無法讀取遊戲進度。" }, { status: 500 });
  }
}
