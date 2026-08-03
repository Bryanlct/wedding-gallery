"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "@/components/Motion";
import { Heart, Sparkles } from "lucide-react";
import LuxuryFrame from "@/components/LuxuryFrame";
import OtomeDialogue from "@/components/OtomeDialogue";

export default function LevelIntro({
  chapter,
  title,
  subtitle,
  scene,
  dialogues = [],
  children,
}) {
  const [dialogueComplete, setDialogueComplete] = useState(dialogues.length === 0);

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55 }}
    >
      {!scene && (
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full border border-gold/25 bg-gold/5">
            <Heart size={19} className="fill-rose/20 text-blush" />
          </div>
          <p className="eyebrow mb-2">Chapter {chapter} · Love Memory</p>
          <h1 className="font-story text-3xl font-semibold tracking-wider text-ivory">{title}</h1>
          <p className="mx-auto mt-3 max-w-xs text-xs leading-6 text-white/50">{subtitle}</p>
        </div>
      )}

      <LuxuryFrame>
        {scene && (
          <div className="level-hero">
            <Image src={scene} alt="" fill priority sizes="(max-width: 480px) 100vw, 480px" />
            <div className="level-heading">
              <p className="eyebrow">Chapter {chapter} · Love Memory</p>
              <h1 className="mt-1 font-story text-3xl font-semibold tracking-wider text-ivory">
                {title}
              </h1>
              <p className="mx-auto mt-2 max-w-xs text-[11px] leading-5 text-white/55">{subtitle}</p>
            </div>
          </div>
        )}

        {!dialogueComplete ? (
          <OtomeDialogue lines={dialogues} onComplete={() => setDialogueComplete(true)} />
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key="puzzle"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
            >
              <Sparkles className="mx-auto mb-4 text-gold" size={17} />
              {children}
            </motion.div>
          </AnimatePresence>
        )}
      </LuxuryFrame>
    </motion.section>
  );
}
