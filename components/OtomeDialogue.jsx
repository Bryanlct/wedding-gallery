"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "@/components/Motion";
import { ChevronDown, FastForward, Sparkles } from "lucide-react";
import { useGameAudio } from "@/contexts/GameAudioContext";

export default function OtomeDialogue({ lines, onComplete, compact = false }) {
  const [lineIndex, setLineIndex] = useState(0);
  const [visibleText, setVisibleText] = useState("");
  const [finished, setFinished] = useState(false);
  const { play } = useGameAudio();
  const line = lines[lineIndex];

  useEffect(() => {
    setVisibleText("");
    setFinished(false);
    if (!line?.text) return;

    let character = 0;
    const timer = window.setInterval(() => {
      character += 1;
      setVisibleText(line.text.slice(0, character));
      if (character >= line.text.length) {
        window.clearInterval(timer);
        setFinished(true);
      }
    }, compact ? 14 : 24);

    return () => window.clearInterval(timer);
  }, [compact, line]);

  function advance() {
    play("tap");
    if (!finished) {
      setVisibleText(line.text);
      setFinished(true);
      return;
    }
    if (lineIndex < lines.length - 1) {
      setLineIndex((current) => current + 1);
      return;
    }
    onComplete?.();
  }

  function skip() {
    play("tap");
    onComplete?.();
  }

  if (!line) return null;

  return (
    <div className={`dialogue-wrap ${compact ? "dialogue-compact" : ""}`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={lineIndex}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.25 }}
          className="dialogue-box"
        >
          <div className="dialogue-name">
            <Sparkles size={11} />
            {line.speaker}
          </div>
          <button type="button" className="dialogue-body" onClick={advance}>
            <span>{visibleText}</span>
            <ChevronDown
              size={16}
              className={`dialogue-next ${finished ? "opacity-100" : "opacity-0"}`}
            />
          </button>
        </motion.div>
      </AnimatePresence>
      <button type="button" className="dialogue-skip" onClick={skip}>
        <FastForward size={11} /> 跳過對話
      </button>
    </div>
  );
}
