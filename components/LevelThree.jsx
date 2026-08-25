"use client";

import { useEffect, useState } from "react";
import {
  ArrowRight,
  Cake,
  Flower2,
  Gem,
  Heart,
  ImageIcon,
  Luggage,
  Umbrella,
  UserRound,
  Wine,
} from "lucide-react";
import GameStage from "@/components/GameStage";
import HintPanel from "@/components/HintPanel";
import LevelIntro from "@/components/LevelIntro";
import { useGameAudio } from "@/contexts/GameAudioContext";
import { GAME_CONTENT } from "@/lib/gameContent";

const content = GAME_CONTENT.levels[3];
const itemIcons = {
  cake: Cake,
  flowers: Flower2,
  rings: Gem,
  chairs: UserRound,
  champagne: Wine,
  photo: ImageIcon,
  umbrella: Umbrella,
  luggage: Luggage,
};

function shuffle(list) {
  return [...list].sort(() => Math.random() - 0.5);
}

export default function LevelThree({ onVerify, isSaving }) {
  const [tray, setTray] = useState(content.items);
  const [placed, setPlaced] = useState({});
  const [selected, setSelected] = useState("");
  const [combo, setCombo] = useState(0);
  const [hints, setHints] = useState(0);
  const [misses, setMisses] = useState(0);
  const [shake, setShake] = useState("");
  const [message, setMessage] = useState("先點一件物品，再點會場對應的位置。多餘的東西不要放。");
  const { play } = useGameAudio();

  useEffect(() => {
    setTray(shuffle(content.items));
  }, []);

  const filledIds = Object.values(placed);
  const remainingSlots = content.slots.length - filledIds.length;

  function pickItem(item) {
    if (filledIds.includes(item.id) || isSaving) return;
    play("tap");
    setSelected(item.id);
    setMessage(item.decoy ? `「${item.label}」看起來不太像婚禮用品…` : `已選「${item.label}」，再點會場格子。`);
  }

  function placeOnSlot(slot) {
    if (placed[slot.id] || isSaving) return;
    if (!selected) {
      setMessage("先從下面選一件物品。");
      return;
    }
    const item = content.items.find((entry) => entry.id === selected);
    if (item.decoy || selected !== slot.id) {
      setMisses((current) => current + 1);
      setCombo(0);
      setShake(slot.id);
      window.setTimeout(() => setShake(""), 400);
      play("wrong");
      navigator.vibrate?.(16);
      setMessage(
        item.decoy
          ? `「${item.label}」不是婚禮會場要的東西。`
          : `「${item.label}」不該放在「${slot.label}」。`
      );
      return;
    }
    const nextPlaced = { ...placed, [slot.id]: item.id };
    setPlaced(nextPlaced);
    setTray((current) => current.filter((entry) => entry.id !== item.id));
    setSelected("");
    setCombo((current) => current + 1);
    play("correct");
    navigator.vibrate?.([12, 16, 12]);
    const left = content.slots.length - Object.keys(nextPlaced).length;
    setMessage(left === 0 ? "會場佈置完成！今晚可以開始了。" : `放對了！還有 ${left} 個位置。`);
  }

  async function submit() {
    const result = await onVerify(content.slots.map((slot) => placed[slot.id]), {
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
      <GameStage current={1} total={1} combo={combo} />
      <p className="mb-3 text-center font-story text-sm leading-7">佈置黃昏花園婚禮會場</p>
      <p className="mb-3 text-center text-[11px] text-blush">
        已放好 {filledIds.length} / {content.slots.length}
        {selected ? ` · 手中拿著「${content.items.find((item) => item.id === selected)?.label}」` : ""}
      </p>
      <div className="venue-grid">
        {content.slots.map((slot) => {
          const filled = placed[slot.id];
          const Icon = itemIcons[filled || slot.id];
          const hinted = hints >= 2 && selected === slot.id && !filled;
          return (
            <button
              key={slot.id}
              type="button"
              className={`venue-slot ${filled ? "filled" : ""} ${selected ? "awaiting" : ""} ${hinted ? "hinted" : ""} ${shake === slot.id ? "shake" : ""}`}
              onClick={() => placeOnSlot(slot)}
            >
              <Icon size={18} />
              <span className="venue-slot-name">{slot.label}</span>
              <span className="venue-slot-item">
                {filled ? content.items.find((item) => item.id === filled)?.label : "點這裡放入"}
              </span>
            </button>
          );
        })}
      </div>
      <div className="keepsake-tray">
        {tray.map((item) => {
          const Icon = itemIcons[item.id] || Heart;
          return (
            <button
              key={item.id}
              type="button"
              className={`keepsake-token ${selected === item.id ? "selected" : ""} ${item.decoy ? "decoy" : ""}`}
              onClick={() => pickItem(item)}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
      <HintPanel hints={content.hints} revealed={hints} onReveal={setHints} />
      <p className="status-message mt-3">{message}</p>
      <button
        type="button"
        className="primary-button mt-2"
        onClick={submit}
        disabled={isSaving || remainingSlots > 0}
      >
        {isSaving ? "封存會場中…" : remainingSlots > 0 ? `還差 ${remainingSlots} 格` : "完成婚禮佈置"}
        <ArrowRight size={17} />
      </button>
    </LevelIntro>
  );
}
