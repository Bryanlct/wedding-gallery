"use client";

import { useState } from "react";
import { motion } from "@/components/Motion";
import { ArrowRight, MapPin, Sparkles } from "lucide-react";
import HintPanel from "@/components/HintPanel";
import LevelIntro from "@/components/LevelIntro";
import { useGameAudio } from "@/contexts/GameAudioContext";
import { GAME_CONTENT } from "@/lib/gameContent";

const content = GAME_CONTENT.levels[1];

export default function LevelOne({ onVerify, isSaving }) {
  const [selected, setSelected] = useState("");
  const [message, setMessage] = useState("");
  const [hints, setHints] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const { play } = useGameAudio();

  async function submit() {
    if (!selected) {
      setMessage("請先選擇一個藏著回憶的座標。");
      return;
    }
    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);
    const result = await onVerify(selected, { attempts: nextAttempts, hintsUsed: hints });
    if (result.correct) {
      play("correct");
      setMessage("記憶甦醒了——那晚，故事在尖沙咀海旁開始。");
    } else {
      play("wrong");
      setMessage(result.message);
    }
  }

  return (
    <LevelIntro {...content}>
      <p className="mb-4 text-center font-story text-sm leading-7 text-ivory">
        根據三道記憶線索，找出初遇座標
      </p>

      <div className="clue-grid mb-5">
        {content.clues.map((clue, index) => (
          <motion.div
            key={clue}
            className="clue-card"
            initial={{ opacity: 0, rotateY: 90 }}
            animate={{ opacity: 1, rotateY: 0 }}
            transition={{ delay: index * 0.12 }}
          >
            <span className="clue-number">0{index + 1}</span>
            {clue}
          </motion.div>
        ))}
      </div>

      <div className="space-y-2.5">
        {content.choices.map((choice, index) => (
          <motion.button
            key={choice.id}
            type="button"
            whileTap={{ scale: 0.98 }}
            className={`choice-button ${selected === choice.id ? "selected" : ""}`}
            onClick={() => {
              play("tap");
              setSelected(choice.id);
              setMessage("");
            }}
          >
            <span className="grid size-7 shrink-0 place-items-center rounded-full border border-gold/25 font-romance text-sm text-gold-light">
              {String.fromCharCode(65 + index)}
            </span>
            <MapPin size={15} className="text-rose" />
            <span>
              <span className="block text-sm">{choice.label}</span>
              <span className="mt-0.5 block text-[10px] text-white/35">{choice.detail}</span>
            </span>
            {selected === choice.id && <Sparkles className="ml-auto text-gold-light" size={14} />}
          </motion.button>
        ))}
      </div>

      <HintPanel hints={content.hints} revealed={hints} onReveal={setHints} />
      <p className="status-message mt-3">{message}</p>
      <button type="button" className="primary-button mt-2" onClick={submit} disabled={isSaving}>
        {isSaving ? "星軌判讀中…" : "確認這段記憶"} <ArrowRight size={17} />
      </button>
    </LevelIntro>
  );
}
