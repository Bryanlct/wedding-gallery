"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { usePhotos } from "@/hooks/usePhotos";
import { downloadImage } from "@/utils/downloadImage";
import WeddingHeader from "@/components/WeddingHeader";
import LoadingSpinner from "@/components/LoadingSpinner";
import EmptyState from "@/components/EmptyState";
import PhotoLightbox from "@/components/PhotoLightbox";

export default function PhotoGallery() {
  const { photos, loading, error } = usePhotos();
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);

  const handleQuickDownload = async (e, photo) => {
    e.stopPropagation();
    setDownloadingId(photo.id);
    try {
      const name = photo.user_name
        ? `agnes-bryan-${photo.user_name}-${photo.id}.jpg`
        : `agnes-bryan-photo-${photo.id}.jpg`;
      await downloadImage(photo.image_url, name);
    } catch {
      alert("下載失敗，請稍後再試");
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="flex flex-col">
      <WeddingHeader
        title="Gallery"
        subtitle="Tap to view · Hold to download"
        showDetails={false}
      />

      {!loading && photos.length > 0 && (
        <div className="border-b border-luxury-parchment/60 py-3 text-center text-[10px] uppercase tracking-[0.25em] text-luxury-stone">
          {photos.length} photographs
        </div>
      )}

      {loading && <LoadingSpinner />}

      {error && (
        <div className="mx-5 mt-4 border border-red-200/60 bg-red-50/50 px-4 py-3 text-center text-sm text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && photos.length === 0 && (
        <EmptyState description="Photographs will appear here once shared" />
      )}

      {!loading && photos.length > 0 && (
        <div className="grid grid-cols-3 gap-px bg-luxury-parchment/40 p-px md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {photos.map((photo, index) => (
            <div
              key={photo.id}
              onClick={() => setLightboxIndex(index)}
              className="group relative aspect-square cursor-pointer overflow-hidden bg-luxury-ivory"
            >
              <img
                src={photo.image_url}
                alt={photo.user_name || "Wedding photo"}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-luxury-ink/0 transition-colors duration-300 group-hover:bg-luxury-ink/10" />
              <button
                onClick={(e) => handleQuickDownload(e, photo)}
                disabled={downloadingId === photo.id}
                className="absolute bottom-2 right-2 flex h-7 w-7 items-center justify-center border border-luxury-gold/30 bg-luxury-charcoal/80 text-luxury-gold-light backdrop-blur-sm transition-opacity md:opacity-0 md:group-hover:opacity-100"
                aria-label="Download"
              >
                {downloadingId === photo.id ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Download className="h-3 w-3" strokeWidth={1.5} />
                )}
              </button>
            </div>
          ))}
        </div>
      )}

      {lightboxIndex !== null && (
        <PhotoLightbox
          photos={photos}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
    </div>
  );
}
