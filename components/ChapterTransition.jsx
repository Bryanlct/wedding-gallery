"use client";

import { AnimatePresence, motion } from "@/components/Motion";
import { Sparkles } from "lucide-react";

export default function ChapterTransition({ level, title, visible }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="chapter-transition"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45 }}
        >
          <motion.div
            initial={{ scale: 0.86, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.08, opacity: 0 }}
            transition={{ duration: 0.55 }}
            className="text-center"
          >
            <Sparkles className="mx-auto mb-5 text-gold-light" />
            <p className="eyebrow">Memory Chapter</p>
            <p className="mt-3 font-romance text-6xl text-gold-light">0{level}</p>
            <div className="ornament mx-auto my-4 w-40" />
            <h2 className="text-lg tracking-[.18em] text-ivory">{title}</h2>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
