"use client";

import { useEffect } from "react";
import { X, Download, ChevronLeft, ChevronRight } from "lucide-react";
import { downloadImage } from "@/utils/downloadImage";
import LikeButton from "@/components/LikeButton";
import { WEDDING } from "@/lib/wedding";
import { useLanguage } from "@/contexts/LanguageContext";

export default function PhotoLightbox({
  photos,
  currentIndex,
  onClose,
  onNavigate,
  onLikeChange,
}) {
  const { t } = useLanguage();
  const photo = photos[currentIndex];
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < photos.length - 1;

  useEffect(() => {
    if (!photo) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [photo]);

  useEffect(() => {
    if (!photo) return;

    function handleKey(e) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && hasPrev) onNavigate(currentIndex - 1);
      if (e.key === "ArrowRight" && hasNext) onNavigate(currentIndex + 1);
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [photo, currentIndex, hasPrev, hasNext, onClose, onNavigate]);

  if (!photo) return null;

  const handleDownload = async () => {
    try {
      const name = photo.user_name
        ? `agnes-bryan-${photo.user_name}-${photo.id}.jpg`
        : `agnes-bryan-photo-${photo.id}.jpg`;
      await downloadImage(photo.image_url, name);
    } catch {
      alert(t("gallery.downloadFailed"));
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-luxury-ink/97 backdrop-blur-sm">
      <div className="flex items-center justify-between px-5 py-4">
        <button
          onClick={onClose}
          className="p-2 text-luxury-stone-light transition-colors hover:text-luxury-cream"
          aria-label={t("lightbox.close")}
        >
          <X className="h-5 w-5" strokeWidth={1.25} />
        </button>
        <div className="text-center">
          <p className="text-[9px] uppercase tracking-[0.3em] text-luxury-gold/60">
            {WEDDING.couple}
          </p>
          <p className="mt-0.5 text-[11px] tracking-widest text-luxury-stone-light">
            {currentIndex + 1} — {photos.length}
          </p>
        </div>
        <button
          onClick={handleDownload}
          className="p-2 text-luxury-stone-light transition-colors hover:text-luxury-gold-light"
          aria-label={t("lightbox.download")}
        >
          <Download className="h-5 w-5" strokeWidth={1.25} />
        </button>
      </div>

      <div className="relative flex flex-1 items-center justify-center px-6">
        {hasPrev && (
          <button
            onClick={() => onNavigate(currentIndex - 1)}
            className="absolute left-3 z-10 border border-luxury-gold/20 p-2.5 text-luxury-gold-light/70 transition-colors hover:border-luxury-gold/50 hover:text-luxury-gold-light"
            aria-label={t("lightbox.prev")}
          >
            <ChevronLeft className="h-4 w-4" strokeWidth={1.25} />
          </button>
        )}

        <img
          src={photo.image_url}
          alt={photo.user_name || t("lightbox.weddingPhoto")}
          className="max-h-[70dvh] max-w-full object-contain md:max-h-[75dvh] lg:max-h-[80dvh]"
        />

        {hasNext && (
          <button
            onClick={() => onNavigate(currentIndex + 1)}
            className="absolute right-3 z-10 border border-luxury-gold/20 p-2.5 text-luxury-gold-light/70 transition-colors hover:border-luxury-gold/50 hover:text-luxury-gold-light"
            aria-label={t("lightbox.next")}
          >
            <ChevronRight className="h-4 w-4" strokeWidth={1.25} />
          </button>
        )}
      </div>

      <div className="space-y-2 px-8 py-6 text-center">
        {photo.user_name && (
          <p className="text-xs uppercase tracking-[0.2em] text-luxury-cream">
            {photo.user_name}
          </p>
        )}
        {photo.message && (
          <p className="font-[family-name:var(--font-cormorant)] text-base italic leading-relaxed text-luxury-stone-light">
            &ldquo;{photo.message}&rdquo;
          </p>
        )}
        <div className="mt-4 flex justify-center">
          <LikeButton
            photoId={photo.id}
            initialCount={photo.likes_count || 0}
            onCountChange={onLikeChange}
            className="[&_span]:text-luxury-stone-light"
          />
        </div>
        <button
          onClick={handleDownload}
          className="btn-luxury mt-4 w-full border border-luxury-gold/30 bg-transparent py-3.5 text-luxury-gold-light hover:bg-luxury-gold/10"
        >
          {t("lightbox.download")}
        </button>
      </div>
    </div>
  );
}
