"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";

const GameAudioContext = createContext(null);
const AUDIO_KEY = "wedding_escape_audio";

export function GameAudioProvider({ children }) {
  const audioRef = useRef(null);
  const [enabled, setEnabled] = useState(false);

  const ensureAudio = useCallback(() => {
    if (audioRef.current) return audioRef.current;
    const AudioEngine = window.AudioContext || window.webkitAudioContext;
    if (!AudioEngine) return null;

    const context = new AudioEngine();
    const master = context.createGain();
    master.gain.value = 0.42;
    master.connect(context.destination);

    const ambience = context.createGain();
    ambience.gain.value = 0.018;
    ambience.connect(master);

    const filter = context.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 520;
    filter.connect(ambience);

    [110, 164.81].forEach((frequency, index) => {
      const oscillator = context.createOscillator();
      oscillator.type = index === 0 ? "sine" : "triangle";
      oscillator.frequency.value = frequency;
      oscillator.connect(filter);
      oscillator.start();
    });

    audioRef.current = { context, master };
    return audioRef.current;
  }, []);

  const toggle = useCallback(async () => {
    const audio = ensureAudio();
    if (!audio) return;
    if (audio.context.state === "running") {
      await audio.context.suspend();
      setEnabled(false);
      localStorage.setItem(AUDIO_KEY, "off");
    } else {
      await audio.context.resume();
      setEnabled(true);
      localStorage.setItem(AUDIO_KEY, "on");
    }
  }, [ensureAudio]);

  const play = useCallback(
    (type = "tap") => {
      const audio = audioRef.current;
      if (!audio || audio.context.state !== "running") return;

      const frequencies = {
        tap: [520, 0.06],
        hint: [392, 0.18],
        correct: [659.25, 0.34],
        wrong: [196, 0.2],
        chapter: [440, 0.55],
      };
      const [frequency, duration] = frequencies[type] || frequencies.tap;
      const now = audio.context.currentTime;
      const oscillator = audio.context.createOscillator();
      const gain = audio.context.createGain();

      oscillator.type = type === "wrong" ? "sawtooth" : "sine";
      oscillator.frequency.setValueAtTime(frequency, now);
      if (type === "correct") {
        oscillator.frequency.exponentialRampToValueAtTime(frequency * 1.5, now + duration);
      }
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.12, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      oscillator.connect(gain);
      gain.connect(audio.master);
      oscillator.start(now);
      oscillator.stop(now + duration + 0.03);
    },
    []
  );

  return (
    <GameAudioContext.Provider value={{ enabled, toggle, play }}>
      {children}
    </GameAudioContext.Provider>
  );
}

export function useGameAudio() {
  const value = useContext(GameAudioContext);
  if (!value) throw new Error("useGameAudio 必須在 GameAudioProvider 內使用");
  return value;
}
