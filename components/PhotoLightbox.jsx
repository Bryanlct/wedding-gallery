"use client";

import { useEffect } from "react";
import { X, Download, ChevronLeft, ChevronRight } from "lucide-react";
import { downloadImage } from "@/utils/downloadImage";
import { WEDDING } from "@/lib/wedding";

export default function PhotoLightbox({
  photos,
  currentIndex,
  onClose,
  onNavigate,
}) {
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
      alert("下載失敗，請稍後再試");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-luxury-ink/97 backdrop-blur-sm">
      <div className="flex items-center justify-between px-5 py-4">
        <button
          onClick={onClose}
          className="p-2 text-luxury-stone-light transition-colors hover:text-luxury-cream"
          aria-label="Close"
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
          aria-label="Download"
        >
          <Download className="h-5 w-5" strokeWidth={1.25} />
        </button>
      </div>

      <div className="relative flex flex-1 items-center justify-center px-6">
        {hasPrev && (
          <button
            onClick={() => onNavigate(currentIndex - 1)}
            className="absolute left-3 z-10 border border-luxury-gold/20 p-2.5 text-luxury-gold-light/70 transition-colors hover:border-luxury-gold/50 hover:text-luxury-gold-light"
            aria-label="Previous"
          >
            <ChevronLeft className="h-4 w-4" strokeWidth={1.25} />
          </button>
        )}

        <img
          src={photo.image_url}
          alt={photo.user_name || "Wedding photo"}
          className="max-h-[62dvh] max-w-full object-contain"
        />

        {hasNext && (
          <button
            onClick={() => onNavigate(currentIndex + 1)}
            className="absolute right-3 z-10 border border-luxury-gold/20 p-2.5 text-luxury-gold-light/70 transition-colors hover:border-luxury-gold/50 hover:text-luxury-gold-light"
            aria-label="Next"
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
        <button
          onClick={handleDownload}
          className="btn-luxury mt-4 w-full border border-luxury-gold/30 bg-transparent py-3.5 text-luxury-gold-light hover:bg-luxury-gold/10"
        >
          Download
        </button>
      </div>
    </div>
  );
}
