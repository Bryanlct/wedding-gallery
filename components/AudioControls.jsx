"use client";

import { Volume2, VolumeX } from "lucide-react";
import { motion } from "@/components/Motion";
import { useGameAudio } from "@/contexts/GameAudioContext";

export default function AudioControls() {
  const { enabled, toggle } = useGameAudio();

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.9 }}
      onClick={toggle}
      className="audio-control"
      aria-label={enabled ? "關閉遊戲聲音" : "開啟遊戲聲音"}
      title={enabled ? "關閉聲音" : "開啟聲音"}
    >
      {enabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
    </motion.button>
  );
}
