"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "@/components/Motion";
import { ArrowRight, Heart, KeyRound, Sparkles, UserRound } from "lucide-react";
import LuxuryFrame from "@/components/LuxuryFrame";
import OtomeDialogue from "@/components/OtomeDialogue";
import PetalField from "@/components/PetalField";
import { useGameAudio } from "@/contexts/GameAudioContext";
import { GAME_CONTENT } from "@/lib/gameContent";
import { GAME_COPY, GAME_STORAGE_KEY, normalizePhone } from "@/lib/escapeGame";

export default function HomePage() {
  const router = useRouter();
  const { play } = useGameAudio();
  const [phase, setPhase] = useState("title");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function enterStory() {
    play("chapter");
    setPhase("prologue");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const guestName = name.trim();
    const phoneNumber = normalizePhone(phone);

    if (guestName.length < 2) {
      setMessage("請告訴邀請函，你希望被如何稱呼。");
      return;
    }
    if (phoneNumber.length < 4) {
      setMessage("請輸入手機號碼，或至少輸入末四碼。");
      return;
    }

    setIsLoading(true);
    setMessage("");
    try {
      const response = await fetch("/api/game/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: guestName, phone: phoneNumber }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);

      localStorage.setItem(GAME_STORAGE_KEY, result.token);
      play("correct");
      router.push(result.guest.currentLevel >= 5 ? "/success" : "/game");
    } catch (error) {
      setMessage(error.message || "命運之門暫時未能開啟，請稍後再試。");
      setIsLoading(false);
    }
  }

  return (
    <AnimatePresence mode="wait">
      {phase === "title" ? (
        <motion.div
          key="title"
          className="title-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.035 }}
          transition={{ duration: 0.7 }}
        >
          <Image
            src="/game/title.png"
            alt="維港夜色下的婚宴戀愛故事"
            fill
            priority
            className="title-art"
            sizes="(max-width: 480px) 100vw, 480px"
          />
          <div className="title-vignette" />
          <PetalField count={15} />
          <div className="title-content">
            <motion.header
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <p className="logo-kicker">Agnes & Bryan · Wedding Story</p>
              <div className="ornament mx-auto mt-4 max-w-44">
                <Heart size={10} className="fill-gold" />
              </div>
            </motion.header>

            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              <p className="mb-3 font-story text-xs tracking-[.45em] text-blush/80">婚宴限定戀愛解謎</p>
              <h1 className="game-logo">星海<br />之約</h1>
              <p className="mt-3 font-romance text-lg tracking-[.18em] text-gold-light">
                Covenant of Starlight
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
            >
              <button type="button" className="primary-button title-enter" onClick={enterStory}>
                翻開命運序章 <Sparkles size={16} />
              </button>
              <p className="mt-4 text-[9px] tracking-[.22em] text-white/38">
                {GAME_COPY.date} · {GAME_COPY.venue}
              </p>
            </motion.div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="story"
          className="prologue-panel page-wrap"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <PetalField count={10} />
          {phase === "prologue" ? (
            <div className="flex min-h-[calc(100dvh-3rem)] items-end pb-5">
              <OtomeDialogue lines={GAME_CONTENT.prologue} onComplete={() => setPhase("login")} />
            </div>
          ) : (
            <motion.div
              className="login-sheet"
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", damping: 22 }}
            >
              <div className="mb-5 text-center">
                <p className="eyebrow">Invitation of Destiny</p>
                <h2 className="mt-2 font-story text-3xl tracking-wider text-ivory">寫下你的名字</h2>
                <p className="mt-2 text-xs leading-6 text-white/50">星海將為你保存每一段解謎進度</p>
              </div>

              <LuxuryFrame>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <label>
                    <span className="field-label">賓客姓名</span>
                    <span className="relative block">
                      <UserRound className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" size={17} />
                      <input
                        className="romance-input pl-11"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        placeholder="你的名字"
                        autoComplete="name"
                      />
                    </span>
                  </label>
                  <label>
                    <span className="field-label">手機號碼或末四碼</span>
                    <span className="relative block">
                      <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" size={17} />
                      <input
                        className="romance-input pl-11"
                        value={phone}
                        onChange={(event) => setPhone(event.target.value)}
                        placeholder="用作找回遊戲進度"
                        inputMode="numeric"
                        autoComplete="tel"
                      />
                    </span>
                  </label>
                  <p className="status-message" role="alert">{message}</p>
                  <button className="primary-button" disabled={isLoading} type="submit">
                    {isLoading ? "尋找你的星軌中…" : "接受這封邀請"}
                    {!isLoading && <ArrowRight size={17} />}
                  </button>
                </form>
              </LuxuryFrame>
              <p className="mt-5 text-center text-[9px] tracking-[.16em] text-white/30">
                進度會綁定輸入的號碼 · 通關約需 12–18 分鐘
              </p>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
