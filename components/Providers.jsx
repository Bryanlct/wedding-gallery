"use client";

import { LanguageProvider } from "@/contexts/LanguageContext";
import { GameAudioProvider } from "@/contexts/GameAudioContext";
import AudioControls from "@/components/AudioControls";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { usePathname } from "next/navigation";

export default function Providers({ children }) {
  const pathname = usePathname();
  const showLanguageSwitcher = pathname === "/upload" || pathname === "/download";
  const showGameAudio =
    pathname === "/" || pathname.startsWith("/game") || pathname.startsWith("/success");

  return (
    <LanguageProvider>
      <GameAudioProvider>
        {showLanguageSwitcher && <LanguageSwitcher />}
        {showGameAudio && <AudioControls />}
        {children}
      </GameAudioProvider>
    </LanguageProvider>
  );
}
