"use client";

import { useEffect, useState } from "react";
import { Reorder, motion } from "@/components/Motion";
import {
  ArrowDown,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  GripVertical,
  RotateCcw,
  X,
} from "lucide-react";
import HintPanel from "@/components/HintPanel";
import LevelIntro from "@/components/LevelIntro";
import { useGameAudio } from "@/contexts/GameAudioContext";
import { GAME_CONTENT } from "@/lib/gameContent";

const content = GAME_CONTENT.levels[4];

export default function LevelFour({ onVerify, isSaving }) {
  const [options, setOptions] = useState(content.phrases);
  const [arranged, setArranged] = useState([]);
  const [hints, setHints] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [message, setMessage] = useState("");
  const { play } = useGameAudio();

  useEffect(() => {
    setOptions((current) => [...current].sort(() => Math.random() - 0.5));
  }, []);

  function addPhrase(phrase) {
    if (arranged.length >= 4) {
      setMessage("誓言信紙只有四行。先移除一句，再重新選擇。");
      return;
    }
    play("tap");
    setOptions((current) => current.filter((item) => item.id !== phrase.id));
    setArranged((current) => [...current, phrase]);
    setMessage("");
  }

  function removePhrase(phrase) {
    play("tap");
    setArranged((current) => current.filter((item) => item.id !== phrase.id));
    setOptions((current) => [...current, phrase]);
    setMessage("");
  }

  function movePhrase(index, direction) {
    const destination = index + direction;
    if (destination < 0 || destination >= arranged.length) return;
    play("tap");
    setArranged((current) => {
      const next = [...current];
      [next[index], next[destination]] = [next[destination], next[index]];
      return next;
    });
  }

  async function submit() {
    if (arranged.length !== 4) {
      setMessage("誓言仍未完整，請選出四段真正的心意。");
      return;
    }
    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);
    const result = await onVerify(
      arranged.map((phrase) => phrase.id),
      { attempts: nextAttempts, hintsUsed: hints }
    );
    if (result.correct) {
      play("correct");
      setMessage("誓言完整了——維港星光正為你們打開幸福結局。");
    } else {
      play("wrong");
      setMessage(result.message);
    }
  }

  function reset() {
    setOptions([...content.phrases].sort(() => Math.random() - 0.5));
    setArranged([]);
    setMessage("");
  }

  return (
    <LevelIntro {...content}>
      <p className="mb-4 text-center font-story text-sm leading-7">
        選出四句誓言，拖曳調整成正確順序
      </p>

      <div className="vow-paper">
        {arranged.length === 0 ? (
          <div className="grid min-h-48 place-items-center text-center text-xs leading-6 text-white/28">
            信紙仍是一片空白
            <br />
            從下方選擇誓言的第一句
          </div>
        ) : (
          <Reorder.Group values={arranged} onReorder={setArranged} className="space-y-2">
            {arranged.map((phrase, index) => (
              <Reorder.Item key={phrase.id} value={phrase} className="phrase-chip">
                <div className="choice-button selected">
                  <GripVertical size={15} className="shrink-0 text-gold/60" />
                  <span className="font-romance text-gold-light">{index + 1}.</span>
                  <span className="flex-1 text-xs leading-5">{phrase.text}</span>
                  <span className="flex shrink-0">
                    <button
                      type="button"
                      className="grid size-7 place-items-center rounded-full text-white/35"
                      onPointerDown={(event) => event.stopPropagation()}
                      onClick={() => movePhrase(index, -1)}
                      aria-label={`將${phrase.text}上移`}
                    >
                      <ChevronUp size={13} />
                    </button>
                    <button
                      type="button"
                      className="grid size-7 place-items-center rounded-full text-white/35"
                      onPointerDown={(event) => event.stopPropagation()}
                      onClick={() => movePhrase(index, 1)}
                      aria-label={`將${phrase.text}下移`}
                    >
                      <ChevronDown size={13} />
                    </button>
                  </span>
                  <button
                    type="button"
                    className="grid size-7 place-items-center rounded-full text-white/35"
                    onPointerDown={(event) => event.stopPropagation()}
                    onClick={() => removePhrase(phrase)}
                    aria-label={`移除${phrase.text}`}
                  >
                    <X size={13} />
                  </button>
                </div>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        )}
      </div>

      <ArrowDown className="mx-auto my-3 text-gold/45" size={17} />
      <div className="grid grid-cols-2 gap-2">
        {options.map((phrase) => (
          <motion.button
            key={phrase.id}
            type="button"
            whileTap={{ scale: 0.97 }}
            className="min-h-14 rounded-xl border border-white/10 bg-white/5 px-2 text-[11px] leading-5 text-white/65"
            onClick={() => addPhrase(phrase)}
          >
            {phrase.text}
          </motion.button>
        ))}
      </div>

      <div className="mt-3 flex justify-end">
        <button type="button" onClick={reset} className="flex items-center gap-1.5 text-[11px] text-white/35">
          <RotateCcw size={12} /> 洗牌重來
        </button>
      </div>
      <HintPanel hints={content.hints} revealed={hints} onReveal={setHints} />
      <p className="status-message mt-3">{message}</p>
      <button type="button" className="primary-button mt-2" onClick={submit} disabled={isSaving}>
        {isSaving ? "誓言封印中…" : "寫下永恆結局"} <ArrowRight size={17} />
      </button>
    </LevelIntro>
  );
}
