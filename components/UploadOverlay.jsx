"use client";

import { Loader2, Check } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function UploadOverlay({
  phase,
  current,
  total,
  success,
}) {
  const { t } = useLanguage();

  if (!phase && !success) return null;

  const progress = total > 0 ? Math.round((current / total) * 100) : 0;

  const phaseText = success
    ? t("upload.overlay.success")
    : phase === "compressing"
      ? t("upload.overlay.compressing")
      : phase === "uploading"
        ? t("upload.overlay.uploading")
        : t("upload.overlay.processing");

  const detailText = success
    ? t("upload.overlay.successDetail")
    : phase === "compressing"
      ? t("upload.overlay.compressDetail", { current, total })
      : phase === "uploading"
        ? t("upload.overlay.uploadDetail", { current, total })
        : "";

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-luxury-ink/85 backdrop-blur-sm">
      <div className="mx-8 w-full max-w-sm border border-luxury-gold/30 bg-luxury-cream px-8 py-10 text-center shadow-2xl">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center border border-luxury-gold/40 bg-white">
          {success ? (
            <Check className="h-8 w-8 text-luxury-gold" strokeWidth={1.5} />
          ) : (
            <Loader2 className="h-8 w-8 animate-spin text-luxury-gold" strokeWidth={1.5} />
          )}
        </div>

        <h2 className="font-[family-name:var(--font-cormorant)] text-xl tracking-wide text-luxury-charcoal">
          {phaseText}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-luxury-stone">{detailText}</p>

        {!success && total > 0 && (
          <div className="mt-6">
            <div className="mb-2 flex justify-between text-[10px] uppercase tracking-widest text-luxury-stone">
              <span>
                {phase === "compressing"
                  ? t("upload.overlay.compressLabel")
                  : t("upload.overlay.uploadLabel")}
              </span>
              <span>{progress}%</span>
            </div>
            <div className="h-1 overflow-hidden bg-luxury-parchment">
              <div
                className="h-full bg-luxury-gold transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
