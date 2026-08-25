"use client";

import { useEffect, useState } from "react";
import {
  ArrowRight,
  Cake,
  Gem,
  Heart,
  Mail,
  MapPin,
} from "lucide-react";
import GameStage from "@/components/GameStage";
import HintPanel from "@/components/HintPanel";
import LevelIntro from "@/components/LevelIntro";
import { useGameAudio } from "@/contexts/GameAudioContext";
import { GAME_CONTENT } from "@/lib/gameContent";

const content = GAME_CONTENT.levels[2];
const pairIcons = {
  ring: Gem,
  harbour: MapPin,
  cake: Cake,
  letter: Mail,
};
const secret = content.digits.map((digit) => digit.value).join("");

function shuffle(list) {
  return [...list].sort(() => Math.random() - 0.5);
}

export default function LevelTwo({ onVerify, isSaving }) {
  const [phase, setPhase] = useState("memory");
  const [cards, setCards] = useState(content.cards);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [busy, setBusy] = useState(false);
  const [digits, setDigits] = useState(content.digits);
  const [typed, setTyped] = useState("");
  const [combo, setCombo] = useState(0);
  const [hints, setHints] = useState(0);
  const [misses, setMisses] = useState(0);
  const [message, setMessage] = useState("一次翻兩張牌，找出四組相同的回憶。");
  const { play } = useGameAudio();

  useEffect(() => {
    setCards(shuffle(content.cards));
    setDigits(shuffle(content.digits));
  }, []);

  function miss(text) {
    setMisses((current) => current + 1);
    setCombo(0);
    play("wrong");
    navigator.vibrate?.(16);
    setMessage(text);
  }

  function flipCard(card) {
    if (busy || isSaving || matched.includes(card.pair) || flipped.some((item) => item.id === card.id)) {
      return;
    }
    play("tap");
    const nextFlipped = [...flipped, card];
    setFlipped(nextFlipped);
    if (nextFlipped.length < 2) return;

    setBusy(true);
    const [first, second] = nextFlipped;
    window.setTimeout(() => {
      if (first.pair === second.pair) {
        const nextMatched = [...matched, first.pair];
        setMatched(nextMatched);
        setCombo((current) => current + 1);
        play("correct");
        navigator.vibrate?.([12, 16, 12]);
        if (nextMatched.length === 4) {
          setPhase("digits");
          setMessage("四組都配好了！按月份到日期的順序點出四個數字。");
        } else {
          setMessage(`配對成功！還有 ${4 - nextMatched.length} 組。`);
        }
      } else {
        miss("這兩張不是一對，再翻一次。");
      }
      setFlipped([]);
      setBusy(false);
    }, 650);
  }

  function tapDigit(digit) {
    if (isSaving) return;
    const next = typed + digit.value;
    const expected = secret.slice(0, next.length);
    play("tap");
    if (next !== expected) {
      setTyped("");
      miss("順序不對，數字重新開始。");
      return;
    }
    setTyped(next);
    setCombo((current) => current + 1);
    play("correct");
    if (next === secret) {
      setMessage("日期拼出來了！就是他們的婚宴那天。");
    } else {
      setMessage(`對了！再點下一個數字。已點 ${next.length} / 4`);
    }
  }

  async function submit() {
    const result = await onVerify(typed, {
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
      <GameStage current={phase === "memory" ? 1 : 2} total={2} combo={combo} />
      {phase === "memory" ? (
        <>
          <p className="mb-3 text-center font-story text-sm leading-7">翻開兩張牌，配對相同回憶</p>
          <div className="flip-grid">
            {cards.map((card) => {
              const Icon = pairIcons[card.pair] || Heart;
              const isOpen = flipped.some((item) => item.id === card.id) || matched.includes(card.pair);
              return (
                <button
                  key={card.id}
                  type="button"
                  className={`flip-card ${isOpen ? "open" : ""} ${matched.includes(card.pair) ? "matched" : ""}`}
                  onClick={() => flipCard(card)}
                  aria-label={isOpen ? card.label : "未翻開的回憶牌"}
                >
                  {isOpen ? (
                    <>
                      <Icon size={18} />
                      <span>{card.label}</span>
                    </>
                  ) : (
                    <Heart size={18} className="fill-rose/30" />
                  )}
                </button>
              );
            })}
          </div>
        </>
      ) : (
        <>
          <p className="mb-3 text-center font-story text-sm leading-7">依序點出婚宴日期的四個數字</p>
          <p className="date-progress">{typed.padEnd(4, "·")}</p>
          <div className="digit-grid">
            {digits.map((digit) => {
              const used = typed.includes(digit.value);
              return (
              <button
                key={digit.id}
                type="button"
                className={`digit-tile ${used ? "used" : ""}`}
                onClick={() => tapDigit(digit)}
                disabled={used}
              >
                {digit.value}
              </button>
              );
            })}
          </div>
        </>
      )}
      <HintPanel hints={content.hints} revealed={hints} onReveal={setHints} />
      <p className="status-message mt-3">{message}</p>
      {phase === "digits" && (
        <button
          type="button"
          className="primary-button mt-2"
          onClick={submit}
          disabled={isSaving || typed !== secret}
        >
          {isSaving ? "核對日期中…" : typed === secret ? "就是這一天" : "先點完四個數字"}
          <ArrowRight size={17} />
        </button>
      )}
    </LevelIntro>
  );
}
