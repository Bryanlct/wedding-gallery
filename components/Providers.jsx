"use client";

import { LanguageProvider } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { usePathname } from "next/navigation";

export default function Providers({ children }) {
  const pathname = usePathname();
  const showLanguageSwitcher = pathname === "/upload" || pathname === "/download";

  return (
    <LanguageProvider>
      {showLanguageSwitcher && <LanguageSwitcher />}
      {children}
    </LanguageProvider>
  );
}
