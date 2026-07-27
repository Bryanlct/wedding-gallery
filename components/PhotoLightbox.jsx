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
    <div className="fixed inset-0 z-[100] flex flex-col bg-black/95 backdrop-blur-sm">
      <div className="flex items-center justify-between px-4 py-3">
        <button
          onClick={onClose}
          className="rounded-full p-2 text-white/80 transition-colors hover:bg-white/10"
          aria-label="關閉"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="text-center">
          <p className="text-[10px] uppercase tracking-widest text-white/40">
            {WEDDING.couple}
          </p>
          <span className="text-sm text-white/60">
            {currentIndex + 1} / {photos.length}
          </span>
        </div>
        <button
          onClick={handleDownload}
          className="rounded-full p-2 text-white/80 transition-colors hover:bg-white/10"
          aria-label="下載"
        >
          <Download className="h-5 w-5" />
        </button>
      </div>

      <div className="relative flex flex-1 items-center justify-center px-4">
        {hasPrev && (
          <button
            onClick={() => onNavigate(currentIndex - 1)}
            className="absolute left-2 z-10 rounded-full bg-white/10 p-2.5 text-white backdrop-blur-sm"
            aria-label="上一張"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        )}

        <img
          src={photo.image_url}
          alt={photo.user_name ? `${photo.user_name} 的照片` : "婚禮照片"}
          className="max-h-[65dvh] max-w-full rounded-xl object-contain shadow-2xl"
        />

        {hasNext && (
          <button
            onClick={() => onNavigate(currentIndex + 1)}
            className="absolute right-2 z-10 rounded-full bg-white/10 p-2.5 text-white backdrop-blur-sm"
            aria-label="下一張"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        )}
      </div>

      <div className="space-y-2 px-6 py-5 text-center">
        {photo.user_name && (
          <p className="text-sm font-semibold text-white">{photo.user_name}</p>
        )}
        {photo.message && (
          <p className="text-sm leading-relaxed text-white/70">{photo.message}</p>
        )}
        <button
          onClick={handleDownload}
          className="mt-3 w-full rounded-xl bg-gradient-to-r from-wedding-primary to-wedding-primary-light py-3.5 text-sm font-bold text-white shadow-lg"
        >
          Download High-Res
        </button>
      </div>
    </div>
  );
}
