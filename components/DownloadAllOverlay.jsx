"use client";

import { Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function DownloadAllOverlay({ progress }) {
  const { t } = useLanguage();

  if (!progress) return null;

  const { current, total, phase, percent = 0 } = progress;
  const fetchProgress =
    phase === "fetching" && total > 0
      ? Math.round((current / total) * 100)
      : percent;

  const title =
    phase === "packing"
      ? t("gallery.downloadAllPacking")
      : t("gallery.downloadAllFetching");

  const detail =
    phase === "packing"
      ? t("gallery.downloadAllPackingDetail", { percent })
      : t("gallery.downloadAllFetchingDetail", { current, total });

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-luxury-ink/85 backdrop-blur-sm">
      <div className="mx-8 w-full max-w-sm border border-luxury-gold/30 bg-luxury-cream px-8 py-10 text-center shadow-2xl">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center border border-luxury-gold/40 bg-white">
          <Loader2
            className="h-8 w-8 animate-spin text-luxury-gold"
            strokeWidth={1.5}
          />
        </div>

        <h2 className="font-[family-name:var(--font-cormorant)] text-xl tracking-wide text-luxury-charcoal">
          {title}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-luxury-stone">{detail}</p>

        <div className="mt-6">
          <div className="mb-2 flex justify-between text-[10px] uppercase tracking-widest text-luxury-stone">
            <span>{t("gallery.downloadAll")}</span>
            <span>{fetchProgress}%</span>
          </div>
          <div className="h-1 overflow-hidden bg-luxury-parchment">
            <div
              className="h-full bg-luxury-gold transition-all duration-500"
              style={{ width: `${fetchProgress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
