"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  DEFAULT_LOCALE,
  LOCALES,
  translate,
} from "@/lib/i18n/translations";

const STORAGE_KEY = "wedding-gallery-locale";

const LanguageContext = createContext(null);

function getInitialLocale() {
  if (typeof window === "undefined") return DEFAULT_LOCALE;

  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved && LOCALES.some((l) => l.code === saved)) {
    return saved;
  }

  const browser = navigator.language;
  if (browser.startsWith("zh")) {
    return browser.includes("TW") || browser.includes("HK") ? "zh-TW" : "zh-CN";
  }
  if (browser.startsWith("en")) return "en";

  return DEFAULT_LOCALE;
}

export function LanguageProvider({ children }) {
  const [locale, setLocaleState] = useState(DEFAULT_LOCALE);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setLocaleState(getInitialLocale());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    document.documentElement.lang = locale;
    localStorage.setItem(STORAGE_KEY, locale);
  }, [locale, ready]);

  const setLocale = useCallback((code) => {
    if (LOCALES.some((l) => l.code === code)) {
      setLocaleState(code);
    }
  }, []);

  const t = useCallback(
    (key, vars) => translate(locale, key, vars),
    [locale]
  );

  const value = useMemo(
    () => ({ locale, setLocale, t, locales: LOCALES }),
    [locale, setLocale, t]
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return ctx;
}
