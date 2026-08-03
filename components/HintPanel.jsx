"use client";

import { Lightbulb, Sparkles } from "lucide-react";
import { motion } from "@/components/Motion";
import { useGameAudio } from "@/contexts/GameAudioContext";

export default function HintPanel({ hints, revealed, onReveal }) {
  const { play } = useGameAudio();
  const canReveal = revealed < hints.length;

  function reveal() {
    if (!canReveal) return;
    play("hint");
    onReveal(revealed + 1);
  }

  return (
    <div className="hint-panel">
      {revealed > 0 && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
          {hints.slice(0, revealed).map((hint, index) => (
            <p key={hint} className="hint-text">
              <Sparkles size={11} /> 提示 {index + 1}：{hint}
            </p>
          ))}
        </motion.div>
      )}
      <button type="button" className="hint-button" onClick={reveal} disabled={!canReveal}>
        <Lightbulb size={14} />
        {canReveal ? `解鎖提示 ${revealed + 1}` : "提示已全部解鎖"}
      </button>
    </div>
  );
}
