"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { motion } from "@/components/Motion";
import {
  Award,
  Check,
  Heart,
  LoaderCircle,
  RefreshCw,
  Sparkles,
  Star,
} from "lucide-react";
import LuxuryFrame from "@/components/LuxuryFrame";
import PetalField from "@/components/PetalField";
import { useGameAudio } from "@/contexts/GameAudioContext";
import { ACHIEVEMENT_COPY, ENDINGS, GAME_CONTENT } from "@/lib/gameContent";
import { GAME_COPY, GAME_STORAGE_KEY } from "@/lib/escapeGame";

export default function SuccessPage() {
  const router = useRouter();
  const { play } = useGameAudio();
  const [guest, setGuest] = useState(null);
  const [error, setError] = useState("");
  const [isReplaying, setIsReplaying] = useState(false);

  useEffect(() => {
    async function loadCertificate() {
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
        if (result.guest.currentLevel < 5) {
          router.replace("/game");
          return;
        }
        setGuest(result.guest);
        play("correct");
      } catch (loadError) {
        setError(loadError.message || "暫時無法讀取通關憑證。");
      }
    }
    loadCertificate();
  }, [play, router]);

  const ending = useMemo(
    () => ENDINGS[guest?.endingType] || ENDINGS.starlight,
    [guest?.endingType]
  );

  async function replay() {
    setIsReplaying(true);
    setError("");
    try {
      const token = localStorage.getItem(GAME_STORAGE_KEY);
      const response = await fetch("/api/game/replay", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      play("chapter");
      router.push("/game");
    } catch (replayError) {
      setError(replayError.message || "暫時無法重新展開星軌。");
      setIsReplaying(false);
    }
  }

  if (!guest) {
    return (
      <div className="page-wrap grid place-items-center text-center">
        <div>
          <LoaderCircle className="mx-auto animate-spin text-rose" size={30} />
          <p className="mt-4 font-story text-xs tracking-widest text-white/45">
            {error || "正在繪製你的幸福結局…"}
          </p>
        </div>
      </div>
    );
  }

  const achievements =
    guest.achievements?.length > 0 ? guest.achievements : ["first_clear", "keen_eye", "vow_keeper"];
  const stars = guest.endingType === "eternal" ? 3 : guest.endingType === "promise" ? 1 : 2;

  return (
    <div className="ending-page">
      <Image
        src="/game/ending.png"
        alt="維港煙花下牽手的新人"
        fill
        priority
        className="ending-art"
        sizes="(max-width: 480px) 100vw, 480px"
      />
      <PetalField count={16} />

      <div className="ending-content">
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="result-stars">
            {[1, 2, 3].map((star) => (
              <Star key={star} size={20} className={star <= stars ? "fill-gold-light" : "opacity-20"} />
            ))}
          </div>
          <p className="eyebrow mt-4">True Ending Unlocked</p>
          <h1 className="mt-2 font-story text-4xl font-semibold tracking-wider text-ivory">
            {ending.title}
          </h1>
          <p className="mx-auto mt-3 max-w-xs text-xs leading-6 text-white/58">{ending.subtitle}</p>
          <p className="mx-auto mt-4 max-w-sm font-story text-sm leading-7 text-blush">
            「{ending.quote}」
          </p>
        </motion.section>

        <LuxuryFrame className="mt-7">
          <div className="mb-4 flex items-center justify-center gap-2">
            <Award size={17} className="text-gold-light" />
            <h2 className="font-story text-sm tracking-[.14em]">本輪解鎖成就</h2>
          </div>
          <div className="achievement-grid">
            {achievements.map((key, index) => {
              const achievement = ACHIEVEMENT_COPY[key];
              if (!achievement) return null;
              return (
                <motion.div
                  key={key}
                  className="achievement-card"
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: .12 * index }}
                >
                  <Check className="mx-auto mb-2 text-gold-light" size={16} />
                  <p className="font-story text-xs text-ivory">{achievement.title}</p>
                  <p className="mt-1 text-[9px] leading-4 text-white/35">{achievement.detail}</p>
                </motion.div>
              );
            })}
          </div>
          <div className="mt-4 flex justify-center gap-4 text-[10px] text-white/42">
            <span>心動值 {guest.affectionScore || 0}</span>
            <span>提示 {guest.hintsUsed || 0}</span>
            <span>挑戰 {guest.playthroughCount + 1}</span>
          </div>
        </LuxuryFrame>

        <LuxuryFrame className="mt-5">
          <p className="eyebrow mb-4 text-center">Memory Gallery</p>
          <div className="grid grid-cols-2 gap-2">
            {Object.values(GAME_CONTENT.levels).map((level) => (
              <div key={level.chapter} className="rounded-lg border border-white/8 bg-white/4 p-3 text-left">
                <p className="font-romance text-lg text-gold-light">{level.chapter}</p>
                <p className="mt-1 font-story text-[11px] text-white/70">{level.title}</p>
              </div>
            ))}
          </div>
        </LuxuryFrame>

        <section className="certificate-card mt-5 rounded-[1.4rem] p-6 shadow-[0_25px_70px_rgba(0,0,0,.45)]">
          <div className="ornament mb-4">
            <Heart size={10} className="fill-gold" />
          </div>
          <p className="text-[9px] font-semibold tracking-[.24em] text-plum/60">WEDDING QUEST PASS</p>
          <div className="mx-auto my-4 w-fit rounded-xl border-4 border-white bg-white p-2 shadow-lg">
            <QRCodeSVG
              value={guest.completionCode}
              size={168}
              bgColor="#ffffff"
              fgColor="#251238"
              level="H"
              title="婚宴通關憑證"
            />
          </div>
          <p className="text-[9px] tracking-[.18em] text-plum/45">CERTIFICATE CODE</p>
          <p className="mt-2 font-romance text-lg font-semibold tracking-[.12em] text-plum">
            {guest.completionCode}
          </p>
          <p className="mt-4 text-[10px] leading-5 text-plum/62">
            請截圖保存，並向 {GAME_COPY.venue} 現場招待人員出示以兌換小禮物。
          </p>
        </section>

        <div className="mt-6">
          <button type="button" className="primary-button" onClick={replay} disabled={isReplaying}>
            <RefreshCw size={15} className={isReplaying ? "animate-spin" : ""} />
            {isReplaying ? "重新編織星軌中…" : "再玩一次 · 收集不同結局"}
          </button>
          <p className="mt-3 text-[9px] leading-5 text-white/32">
            重玩會隨機改變尋物順序，但保留原有 QR Code，不會重複取得兌獎資格。
          </p>
          {error && <p className="status-message mt-3">{error}</p>}
          <div className="ornament mx-auto mt-7 max-w-52">
            <Sparkles size={11} />
          </div>
          <p className="mt-4 font-romance text-lg tracking-[.14em] text-blush">{GAME_COPY.couple}</p>
          <p className="mt-1 text-[9px] tracking-[.2em] text-white/25">{GAME_COPY.date}</p>
        </div>
      </div>
    </div>
  );
}
