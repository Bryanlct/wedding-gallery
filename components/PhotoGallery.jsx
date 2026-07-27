"use client";

import { useState } from "react";
import { Download, Loader2, Images } from "lucide-react";
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
        title="Photo Gallery"
        subtitle="點擊照片檢視大圖並下載"
        showDetails={false}
      />

      {!loading && photos.length > 0 && (
        <div className="flex items-center justify-center gap-2 bg-purple-50/80 px-4 py-2.5 text-xs text-purple-500">
          <Images className="h-3.5 w-3.5" />
          共 {photos.length} 張照片
        </div>
      )}

      {loading && <LoadingSpinner />}

      {error && (
        <div className="mx-4 mt-4 rounded-2xl bg-red-50 px-4 py-3 text-center text-sm text-red-600 ring-1 ring-red-100">
          {error}
        </div>
      )}

      {!loading && !error && photos.length === 0 && (
        <EmptyState description="上傳照片後即可在此下載" />
      )}

      {!loading && photos.length > 0 && (
        <div className="grid grid-cols-3 gap-1 p-1.5">
          {photos.map((photo, index) => (
            <div
              key={photo.id}
              onClick={() => setLightboxIndex(index)}
              className="group relative aspect-square cursor-pointer overflow-hidden rounded-sm bg-purple-50"
            >
              <img
                src={photo.image_url}
                alt={photo.user_name ? `${photo.user_name} 的照片` : "婚禮照片"}
                className="h-full w-full object-cover transition-transform duration-300 group-active:scale-95"
                loading="lazy"
              />
              <div className="pointer-events-none absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
              <button
                onClick={(e) => handleQuickDownload(e, photo)}
                disabled={downloadingId === photo.id}
                className="absolute bottom-1.5 right-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-wedding-primary/90 text-white shadow-md backdrop-blur-sm transition-all md:opacity-0 md:group-hover:opacity-100"
                aria-label="下載"
              >
                {downloadingId === photo.id ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Download className="h-3.5 w-3.5" />
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
