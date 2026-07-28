"use client";

import { LanguageProvider } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function Providers({ children }) {
  return (
    <LanguageProvider>
      <LanguageSwitcher />
      {children}
    </LanguageProvider>
  );
}
