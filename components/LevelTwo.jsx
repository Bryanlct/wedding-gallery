"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "@/components/Motion";
import { ArrowRight, CalendarDays, ChevronDown, ChevronUp } from "lucide-react";
import HintPanel from "@/components/HintPanel";
import LevelIntro from "@/components/LevelIntro";
import { useGameAudio } from "@/contexts/GameAudioContext";
import { GAME_CONTENT } from "@/lib/gameContent";

const content = GAME_CONTENT.levels[2];
const pad = (value) => String(value).padStart(2, "0");

export default function LevelTwo({ onVerify, isSaving }) {
  const [month, setMonth] = useState(3);
  const [day, setDay] = useState(18);
  const [hints, setHints] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [message, setMessage] = useState("");
  const { play } = useGameAudio();

  function shift(setter, current, delta, max) {
    play("tap");
    setter(((current - 1 + delta + max) % max) + 1);
    setMessage("");
    navigator.vibrate?.(12);
  }

  async function submit() {
    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);
    const result = await onVerify(`${pad(month)}${pad(day)}`, {
      attempts: nextAttempts,
      hintsUsed: hints,
    });
    if (result.correct) {
      play("correct");
      setMessage("兩枚星環同時亮起——婚約之日已被喚醒。");
    } else {
      play("wrong");
      setMessage(result.message);
    }
  }

  const wheel = (label, value, setter, max) => (
    <div className="date-wheel">
      <button className="wheel-button" type="button" onClick={() => shift(setter, value, 1, max)}>
        <ChevronUp size={18} />
      </button>
      <AnimatePresence mode="popLayout">
        <motion.div
          key={value}
          className="wheel-value"
          initial={{ opacity: 0, y: 16, rotate: -8 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          exit={{ opacity: 0, y: -16, rotate: 8 }}
          transition={{ duration: 0.18 }}
        >
          {pad(value)}
        </motion.div>
      </AnimatePresence>
      <p className="text-[9px] tracking-[.18em] text-white/35">{label}</p>
      <button className="wheel-button" type="button" onClick={() => shift(setter, value, -1, max)}>
        <ChevronDown size={18} />
      </button>
    </div>
  );

  return (
    <LevelIntro {...content}>
      <div className="mb-5 text-center">
        <CalendarDays className="mx-auto mb-3 text-gold-light" size={25} strokeWidth={1.4} />
        <p className="font-story text-sm leading-7">轉動月份與日期，校準婚約星時計</p>
      </div>

      <div className="wheel-wrap">
        {wheel("MONTH", month, setMonth, 12)}
        <span className="font-romance text-3xl text-gold-light">·</span>
        {wheel("DAY", day, setDay, 31)}
      </div>

      <div className="ornament mx-auto my-5 w-44">
        <span className="font-romance text-xs tracking-[.18em] text-gold-light">2026</span>
      </div>
      <HintPanel hints={content.hints} revealed={hints} onReveal={setHints} />
      <p className="status-message mt-3">{message}</p>
      <button type="button" className="primary-button mt-2" onClick={submit} disabled={isSaving}>
        {isSaving ? "星時計校準中…" : "啟動婚約星環"} <ArrowRight size={17} />
      </button>
    </LevelIntro>
  );
}
