"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "@/components/Motion";
import { Heart, LoaderCircle, Sparkles } from "lucide-react";
import ChapterTransition from "@/components/ChapterTransition";
import LevelOne from "@/components/LevelOne";
import LevelTwo from "@/components/LevelTwo";
import LevelThree from "@/components/LevelThree";
import LevelFour from "@/components/LevelFour";
import PetalField from "@/components/PetalField";
import { useGameAudio } from "@/contexts/GameAudioContext";
import { GAME_CONTENT } from "@/lib/gameContent";
import { GAME_STORAGE_KEY } from "@/lib/escapeGame";

const levels = { 1: LevelOne, 2: LevelTwo, 3: LevelThree, 4: LevelFour };

export default function GamePage() {
  const router = useRouter();
  const { play } = useGameAudio();
  const [guest, setGuest] = useState(null);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [showTransition, setShowTransition] = useState(false);

  const revealChapter = useCallback((duration = 1250) => {
    setShowTransition(true);
    window.setTimeout(() => setShowTransition(false), duration);
  }, []);

  useEffect(() => {
    async function loadProgress() {
      const token = localStorage.getItem(GAME_STORAGE_KEY);
      if (!token) {
        router.replace("/");
        return;
      }

      try {
        const response = await fetch("/api/game/progress", {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error);
        if (result.guest.currentLevel >= 5) {
          router.replace("/success");
          return;
        }
        setGuest(result.guest);
        revealChapter();
        play("chapter");
      } catch (loadError) {
        setError(loadError.message || "找不到你的遊戲進度，請返回首頁重新登入。");
      }
    }
    loadProgress();
  }, [play, revealChapter, router]);

  const handleVerify = useCallback(
    async (answer, meta) => {
      if (!guest || isSaving) return { correct: false, message: "星軌正在判讀中。" };
      setIsSaving(true);
      setError("");

      try {
        const token = localStorage.getItem(GAME_STORAGE_KEY);
        const response = await fetch("/api/game/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            level: guest.currentLevel,
            answer,
            attempts: meta.attempts,
            hintsUsed: meta.hintsUsed,
          }),
        });
        const result = await response.json();
        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem(GAME_STORAGE_KEY);
            router.replace("/");
          }
          throw new Error(result.error);
        }

        if (!result.correct) {
          setIsSaving(false);
          return result;
        }

        if (result.completed) {
          window.setTimeout(() => router.push("/success"), 900);
          return result;
        }

        window.setTimeout(() => {
          setGuest(result.guest);
          setIsSaving(false);
          revealChapter();
          play("chapter");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }, 750);
        return result;
      } catch (verifyError) {
        const message = verifyError.message || "星軌暫時中斷，請稍後再試。";
        setError(message);
        setIsSaving(false);
        return { correct: false, message };
      }
    },
    [guest, isSaving, play, revealChapter, router]
  );

  if (!guest) {
    return (
      <div className="page-wrap grid place-items-center text-center">
        <div>
          <div className="relative mx-auto size-16">
            <div className="absolute inset-0 animate-ping rounded-full border border-rose/30" />
            <LoaderCircle className="absolute inset-4 animate-spin text-gold-light" size={32} />
          </div>
          <p className="mt-5 font-story text-xs tracking-[.16em] text-white/50">
            {error || "正在展開你的星海軌跡…"}
          </p>
          {error && (
            <button className="primary-button mt-6 px-8" onClick={() => router.replace("/")}>
              返回命運序章
            </button>
          )}
        </div>
      </div>
    );
  }

  const CurrentLevel = levels[guest.currentLevel];
  const currentContent = GAME_CONTENT.levels[guest.currentLevel];

  return (
    <div className="page-wrap">
      <PetalField count={7} />
      <ChapterTransition
        level={guest.currentLevel}
        title={currentContent.title}
        visible={showTransition}
      />

      <header className="game-hud">
        <div className="mb-2 flex items-center justify-between">
          <div>
            <p className="text-[9px] tracking-[.18em] text-white/30">DESTINY PLAYER</p>
            <p className="mt-1 font-story text-xs text-white/72">{guest.guestName}</p>
          </div>
          <div className="text-right">
            <div className="affection-meter">
              <Heart size={12} className="fill-rose/40 text-rose" />
              心動值 {guest.affectionScore || 0}
            </div>
            <p className="mt-1 text-[9px] tracking-[.14em] text-gold-light">
              CHAPTER 0{guest.currentLevel} / 04
            </p>
          </div>
        </div>
        <div className="progress-track">
          <motion.div
            className="progress-fill"
            animate={{ width: `${guest.currentLevel * 25}%` }}
            transition={{ duration: 0.6 }}
          />
        </div>
      </header>

      <motion.div key={guest.currentLevel} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <CurrentLevel onVerify={handleVerify} isSaving={isSaving} />
      </motion.div>
      {error && (
        <p className="status-message mt-5">
          <Sparkles className="mr-1 inline text-gold" size={12} /> {error}
        </p>
      )}
    </div>
  );
}
