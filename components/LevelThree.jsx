"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { motion } from "@/components/Motion";
import { ArrowRight, Check, Search, Sparkles } from "lucide-react";
import HintPanel from "@/components/HintPanel";
import LevelIntro from "@/components/LevelIntro";
import { useGameAudio } from "@/contexts/GameAudioContext";
import { GAME_CONTENT } from "@/lib/gameContent";

const content = GAME_CONTENT.levels[3];

export default function LevelThree({ onVerify, isSaving }) {
  const [order, setOrder] = useState(content.objects.map((object) => object.id));
  const [found, setFound] = useState([]);
  const [hints, setHints] = useState(0);
  const [misses, setMisses] = useState(0);
  const [message, setMessage] = useState("");
  const { play } = useGameAudio();

  useEffect(() => {
    setOrder((current) => [...current].sort(() => Math.random() - 0.5));
  }, []);

  const currentTarget = order[found.length];
  const currentObject = useMemo(
    () => content.objects.find((object) => object.id === currentTarget),
    [currentTarget]
  );

  function miss() {
    if (found.length === content.objects.length) return;
    setMisses((current) => current + 1);
    setMessage(`這裡只有花瓣。下一件要找的是「${currentObject?.label}」。`);
    play("wrong");
    navigator.vibrate?.(20);
  }

  function selectObject(event, object) {
    event.stopPropagation();
    if (found.includes(object.id) || isSaving) return;
    if (object.id !== currentTarget) {
      miss();
      return;
    }
    const nextFound = [...found, object.id];
    setFound(nextFound);
    setMessage(
      nextFound.length === content.objects.length
        ? "五件信物全部回到月光下，花園深處的門已經打開。"
        : `找到了「${object.label}」！星光正指向下一件信物。`
    );
    play("correct");
    navigator.vibrate?.([20, 25, 20]);
  }

  async function submit() {
    const result = await onVerify(found, {
      attempts: Math.max(1, misses + 1),
      hintsUsed: hints,
    });
    if (!result.correct) {
      play("wrong");
      setMessage(result.message);
    }
  }

  return (
    <LevelIntro
      chapter={content.chapter}
      title={content.title}
      subtitle={content.subtitle}
      dialogues={content.dialogues}
    >
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-[10px] tracking-[.16em] text-white/35">CURRENT TARGET</p>
          <p className="mt-1 font-story text-sm text-gold-light">
            {currentObject ? currentObject.label : "所有信物已找回"}
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-blush">
          <Search size={14} /> {found.length} / {content.objects.length}
        </div>
      </div>

      <motion.div className="hidden-scene" onClick={miss} whileTap={{ scale: 0.995 }}>
        <Image
          src={content.scene}
          alt="維港月夜下的酒店花園，藏有五件回憶信物"
          fill
          priority
          sizes="(max-width: 480px) 100vw, 480px"
        />
        {content.objects.map((object) => {
          const isFound = found.includes(object.id);
          const assisted = hints >= 2 && object.id === currentTarget;
          return (
            <button
              key={object.id}
              type="button"
              className={`object-hotspot ${isFound ? "found" : ""} ${assisted ? "assisted" : ""}`}
              style={{
                left: `${object.x}%`,
                top: `${object.y}%`,
                width: `${object.size}%`,
                aspectRatio: "1",
              }}
              onClick={(event) => selectObject(event, object)}
              aria-label={`查看${object.label}`}
            >
              {isFound && <Check size={15} />}
            </button>
          );
        })}
      </motion.div>

      <div className="object-list">
        {order.map((id) => {
          const object = content.objects.find((item) => item.id === id);
          return (
            <span key={id} className={`object-chip ${found.includes(id) ? "found" : ""}`}>
              {found.includes(id) && "✓ "}{object.label}
            </span>
          );
        })}
      </div>

      <HintPanel hints={content.hints} revealed={hints} onReveal={setHints} />
      <p className="status-message mt-3">{message}</p>
      <button
        type="button"
        className="primary-button mt-2"
        onClick={submit}
        disabled={isSaving || found.length !== content.objects.length}
      >
        {isSaving ? "封存回憶中…" : "封存五件信物"}
        {found.length === content.objects.length ? <ArrowRight size={17} /> : <Sparkles size={15} />}
      </button>
    </LevelIntro>
  );
}
