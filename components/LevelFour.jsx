"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, RotateCcw } from "lucide-react";
import GameStage from "@/components/GameStage";
import HintPanel from "@/components/HintPanel";
import LevelIntro from "@/components/LevelIntro";
import { useGameAudio } from "@/contexts/GameAudioContext";
import { GAME_CONTENT } from "@/lib/gameContent";

const content = GAME_CONTENT.levels[4];

function shuffle(list) {
  return [...list].sort(() => Math.random() - 0.5);
}

export default function LevelFour({ onVerify, isSaving }) {
  const [bank, setBank] = useState(content.words);
  const [fills, setFills] = useState({});
  const [selected, setSelected] = useState("");
  const [combo, setCombo] = useState(0);
  const [hints, setHints] = useState(0);
  const [misses, setMisses] = useState(0);
  const [message, setMessage] = useState("先點詞語，再點句子的空格。填完四句後長按告白。");
  const [hold, setHold] = useState(0);
  const holdTimer = useRef(null);
  const sent = useRef(false);
  const { play } = useGameAudio();

  useEffect(() => {
    setBank(shuffle(content.words));
    return () => window.clearInterval(holdTimer.current);
  }, []);

  const complete = content.lines.every((line) => fills[line.id] === line.answer);

  function pickWord(word) {
    if (isSaving) return;
    play("tap");
    setSelected(word);
    setMessage(`已選「${word}」，再點一句空白的位置。`);
  }

  function placeWord(line) {
    if (isSaving) return;
    if (fills[line.id]) {
      const returned = fills[line.id];
      play("tap");
      setFills((current) => {
        const next = { ...current };
        delete next[line.id];
        return next;
      });
      setBank((current) => shuffle([returned, ...current]));
      setSelected(returned);
      setMessage(`已拿回「${returned}」。`);
      return;
    }
    if (!selected) {
      setMessage("先從下面選一個詞。");
      return;
    }
    if (selected !== line.answer) {
      setMisses((current) => current + 1);
      setCombo(0);
      play("wrong");
      navigator.vibrate?.(16);
      setMessage(`「${selected}」不是這一句要的詞。`);
      return;
    }
    setFills((current) => ({ ...current, [line.id]: selected }));
    setBank((current) => current.filter((word) => word !== selected));
    setSelected("");
    setCombo((current) => current + 1);
    play("correct");
    const nextCount = Object.keys(fills).length + 1;
    setMessage(nextCount === 4 ? "四句都填對了！長按下方按鈕，把告白說出口。" : `填對了！還有 ${4 - nextCount} 句。`);
  }

  function reset() {
    setBank(shuffle(content.words));
    setFills({});
    setSelected("");
    setHold(0);
    sent.current = false;
    setMessage("重新開始填詞。");
  }

  function startHold() {
    if (!complete || isSaving || sent.current) return;
    window.clearInterval(holdTimer.current);
    const started = Date.now();
    holdTimer.current = window.setInterval(() => {
      const next = Math.min(100, Math.round(((Date.now() - started) / 900) * 100));
      setHold(next);
      if (next >= 100 && !sent.current) {
        sent.current = true;
        window.clearInterval(holdTimer.current);
        submit();
      }
    }, 40);
  }

  function cancelHold() {
    window.clearInterval(holdTimer.current);
    if (!sent.current) setHold(0);
  }

  async function submit() {
    const result = await onVerify(content.lines.map((line) => line.id), {
      attempts: Math.max(1, misses + 1),
      hintsUsed: hints,
    });
      if (!result.correct) {
      play("wrong");
      sent.current = false;
      setHold(0);
      setMessage(result.message);
    } else {
      play("correct");
      setMessage("告白完成了。");
    }
  }

  return (
    <LevelIntro {...content}>
      <GameStage current={complete ? 2 : 1} total={2} combo={combo} />
      <p className="mb-3 text-center font-story text-sm leading-7">把正確的詞填進告白空格</p>
      <div className="lyric-sheet">
        {content.lines.map((line, index) => (
          <button
            key={line.id}
            type="button"
            className={`lyric-line ${fills[line.id] ? "filled" : ""} ${hints >= 2 && !fills[line.id] ? "hinted" : ""}`}
            onClick={() => placeWord(line)}
          >
            <span className="lyric-index">{index + 1}</span>
            <span>
              {line.before}
              <span className="lyric-blank">{fills[line.id] || "　　"}</span>
              {line.after}
            </span>
          </button>
        ))}
      </div>
      <div className="word-bank">
        {bank.map((word) => (
          <button
            key={word}
            type="button"
            className={`word-chip ${selected === word ? "selected" : ""}`}
            onClick={() => pickWord(word)}
          >
            {word}
          </button>
        ))}
      </div>
      <div className="mt-3 flex justify-end">
        <button type="button" onClick={reset} className="flex items-center gap-1.5 text-[11px] text-white/35">
          <RotateCcw size={12} /> 全部重填
        </button>
      </div>
      <HintPanel hints={content.hints} revealed={hints} onReveal={setHints} />
      <p className="status-message mt-3">{message}</p>
      <button
        type="button"
        className="primary-button hold-button mt-2"
        disabled={isSaving || !complete}
        onPointerDown={startHold}
        onPointerUp={cancelHold}
        onPointerLeave={cancelHold}
        onContextMenu={(event) => event.preventDefault()}
      >
        <span className="hold-fill" style={{ width: `${hold}%` }} />
        <span className="relative z-10 flex items-center gap-2">
          {isSaving ? "送出告白中…" : complete ? "長按完成告白" : "先填完四句"}
          <ArrowRight size={17} />
        </span>
      </button>
    </LevelIntro>
  );
}
