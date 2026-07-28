"use client";

import { useLanguage } from "@/contexts/LanguageContext";

export default function LanguageSwitcher() {
  const { locale, setLocale, locales } = useLanguage();

  return (
    <div className="fixed right-3 top-3 z-[60] flex gap-0.5 rounded-full border border-luxury-gold/25 bg-luxury-cream/95 p-0.5 shadow-sm backdrop-blur-sm md:right-5 md:top-4">
      {locales.map((item) => (
        <button
          key={item.code}
          type="button"
          onClick={() => setLocale(item.code)}
          className={`rounded-full px-2.5 py-1 text-[10px] tracking-wide transition-colors ${
            locale === item.code
              ? "bg-luxury-charcoal font-medium text-luxury-cream"
              : "text-luxury-stone hover:text-luxury-charcoal"
          }`}
          aria-label={item.label}
          aria-pressed={locale === item.code}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
