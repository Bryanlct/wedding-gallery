"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import GameStage from "@/components/GameStage";
import HintPanel from "@/components/HintPanel";
import LevelIntro from "@/components/LevelIntro";
import { useGameAudio } from "@/contexts/GameAudioContext";
import { GAME_CONTENT } from "@/lib/gameContent";

const content = GAME_CONTENT.levels[1];

function shuffle(list) {
  return [...list].sort(() => Math.random() - 0.5);
}

export default function LevelOne({ onVerify, isSaving }) {
  const [phase, setPhase] = useState("link");
  const [left, setLeft] = useState(content.pairs);
  const [right, setRight] = useState(content.pairs);
  const [pickedLeft, setPickedLeft] = useState("");
  const [pickedRight, setPickedRight] = useState("");
  const [matched, setMatched] = useState([]);
  const [routeStops, setRouteStops] = useState(content.route);
  const [progress, setProgress] = useState([]);
  const [combo, setCombo] = useState(0);
  const [hints, setHints] = useState(0);
  const [misses, setMisses] = useState(0);
  const [message, setMessage] = useState("先點左邊一件事，再點右邊對應的風景。");
  const [shake, setShake] = useState("");
  const { play } = useGameAudio();

  useEffect(() => {
    setLeft(shuffle(content.pairs));
    setRight(shuffle(content.pairs));
    setRouteStops(shuffle(content.route));
  }, []);

  function bumpShake(id) {
    setShake(id);
    window.setTimeout(() => setShake(""), 400);
  }

  function miss(text) {
    setMisses((current) => current + 1);
    setCombo(0);
    play("wrong");
    navigator.vibrate?.(16);
    setMessage(text);
  }

  function tryMatch(nextLeft, nextRight) {
    if (!nextLeft || !nextRight) return;
    if (nextLeft === nextRight) {
      const nextMatched = [...matched, nextLeft];
      setMatched(nextMatched);
      setPickedLeft("");
      setPickedRight("");
      setCombo((current) => current + 1);
      play("correct");
      navigator.vibrate?.([12, 16, 12]);
      if (nextMatched.length === content.pairs.length) {
        setPhase("route");
        setMessage("配對完成！接下來按順序點出那天的約會路線。");
      } else {
        setMessage(`配對成功！還有 ${content.pairs.length - nextMatched.length} 組。`);
      }
      return;
    }
    bumpShake(nextLeft);
    bumpShake(nextRight);
    setPickedLeft("");
    setPickedRight("");
    miss("這兩件不是同一段回憶，再配一次。");
  }

  function pickLeft(id) {
    if (matched.includes(id) || isSaving) return;
    play("tap");
    setPickedLeft(id);
    tryMatch(id, pickedRight);
  }

  function pickRight(id) {
    if (matched.includes(id) || isSaving) return;
    play("tap");
    setPickedRight(id);
    tryMatch(pickedLeft, id);
  }

  function pickStop(stop) {
    if (isSaving || phase !== "route") return;
    const expected = content.route.find((item) => item.step === progress.length + 1);
    if (stop.decoy || stop.id !== expected?.id) {
      bumpShake(stop.id);
      setProgress([]);
      miss(stop.decoy ? "那天沒有坐叮叮車，路線重新開始。" : "順序不對，從第一步再走一次。");
      return;
    }
    const nextProgress = [...progress, stop.id];
    setProgress(nextProgress);
    setCombo((current) => current + 1);
    play("correct");
    if (nextProgress.length === 4) {
      setMessage("路線走完了！那天的故事從尖沙咀海旁開始。");
    } else {
      setMessage(`對了！下一站是第 ${nextProgress.length + 1} 步。`);
    }
  }

  async function submit() {
    const result = await onVerify(progress, {
      attempts: Math.max(1, misses + 1),
      hintsUsed: hints,
    });
    if (!result.correct) {
      play("wrong");
      setMessage(result.message);
    }
  }

  return (
    <LevelIntro {...content}>
      <GameStage current={phase === "link" ? 1 : 2} total={2} combo={combo} />
      {phase === "link" ? (
        <>
          <p className="mb-3 text-center font-story text-sm leading-7">
            把「那天做過的事」連到對應的風景
          </p>
          <div className="link-board">
            <div className="space-y-2">
              {left.map((item) => (
                <button
                  key={`l-${item.id}`}
                  type="button"
                  className={`link-node ${matched.includes(item.id) ? "matched" : ""} ${pickedLeft === item.id ? "picked" : ""} ${shake === item.id ? "shake" : ""}`}
                  onClick={() => pickLeft(item.id)}
                  disabled={matched.includes(item.id)}
                >
                  {item.left}
                </button>
              ))}
            </div>
            <div className="space-y-2">
              {right.map((item) => (
                <button
                  key={`r-${item.id}`}
                  type="button"
                  className={`link-node ${matched.includes(item.id) ? "matched" : ""} ${pickedRight === item.id ? "picked" : ""} ${shake === item.id ? "shake" : ""}`}
                  onClick={() => pickRight(item.id)}
                  disabled={matched.includes(item.id)}
                >
                  {item.right}
                </button>
              ))}
            </div>
          </div>
        </>
      ) : (
        <>
          <p className="mb-3 text-center font-story text-sm leading-7">
            依順序點出約會四步，點錯會重來
          </p>
          <p className="mb-3 text-center text-[11px] text-blush">
            已走 {progress.length} / 4 步
          </p>
          <div className="route-board">
            {routeStops.map((stop) => {
              const done = progress.includes(stop.id);
              const next = content.route.find((item) => item.step === progress.length + 1)?.id === stop.id;
              return (
                <button
                  key={stop.id}
                  type="button"
                  className={`route-stop ${done ? "done" : ""} ${next ? "next" : ""} ${shake === stop.id ? "shake" : ""}`}
                  onClick={() => pickStop(stop)}
                  disabled={done}
                >
                  {done && <Sparkles size={14} />}
                  {stop.label}
                </button>
              );
            })}
          </div>
        </>
      )}
      <HintPanel hints={content.hints} revealed={hints} onReveal={setHints} />
      <p className="status-message mt-3">{message}</p>
      {phase === "route" && (
        <button
          type="button"
          className="primary-button mt-2"
          onClick={submit}
          disabled={isSaving || progress.length !== 4}
        >
          {isSaving ? "核對中…" : progress.length === 4 ? "完成第一次約會" : `還差 ${4 - progress.length} 步`}
          <ArrowRight size={17} />
        </button>
      )}
    </LevelIntro>
  );
}
