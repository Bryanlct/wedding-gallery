"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { usePhotos } from "@/hooks/usePhotos";
import { formatRelativeTime } from "@/utils/formatTime";
import { useLanguage } from "@/contexts/LanguageContext";
import WeddingHeader from "@/components/WeddingHeader";
import LoadingSpinner from "@/components/LoadingSpinner";
import EmptyState from "@/components/EmptyState";
import LikeButton from "@/components/LikeButton";
import PhotoLightbox from "@/components/PhotoLightbox";

const FILTER_KEYS = ["latest", "top", "today"];

export default function PhotoFeed() {
  const { t, locale } = useLanguage();
  const [activeFilter, setActiveFilter] = useState("latest");
  const [search, setSearch] = useState("");
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const { photos, loading, error, patchPhoto } = usePhotos({
    filter: activeFilter,
    search,
  });

  const getErrorMessage = (err) => {
    if (err === "LOAD_FAILED") return t("errors.loadFailed");
    return err;
  };

  return (
    <div className="flex flex-col">
      <WeddingHeader showHero />

      <div className="page-content space-y-4 py-5 md:py-6">
        <div className="relative mx-auto max-w-xl md:max-w-2xl">
          <Search
            className="absolute left-4 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-luxury-stone-light"
            strokeWidth={1.5}
          />
          <input
            type="search"
            placeholder={t("feed.search")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-luxury w-full py-3 pl-10 pr-4 text-sm text-luxury-charcoal placeholder:text-luxury-stone-light/60 md:py-3.5 md:text-base"
          />
        </div>

        <div className="mx-auto flex max-w-md justify-center gap-6 md:max-w-none md:gap-10">
          {FILTER_KEYS.map((key) => (
            <button
              key={key}
              onClick={() => setActiveFilter(key)}
              className={`pb-1 text-[10px] uppercase tracking-[0.18em] transition-all ${
                activeFilter === key
                  ? "border-b border-luxury-gold font-medium text-luxury-charcoal"
                  : "text-luxury-stone hover:text-luxury-charcoal"
              }`}
            >
              {t(`feed.${key}`)}
            </button>
          ))}
        </div>
      </div>

      {loading && <LoadingSpinner />}

      {error && (
        <div className="mx-5 border border-red-200/60 bg-red-50/50 px-4 py-3 text-center text-sm text-red-700">
          {getErrorMessage(error)}
        </div>
      )}

      {!loading && !error && photos.length === 0 && (
        <EmptyState
          title={search ? t("feed.noResults") : t("feed.noMoments")}
          description={
            search ? t("feed.noResultsDesc") : t("feed.noMomentsDesc")
          }
        />
      )}

      {!loading && photos.length > 0 && (
        <div className="page-content grid grid-cols-2 gap-3 pb-6 sm:grid-cols-2 md:grid-cols-3 md:gap-4 lg:grid-cols-4 lg:gap-5">
          {photos.map((photo, index) => {
            const displayName = photo.user_name || t("feed.guest");
            return (
              <article
                key={photo.id}
                onClick={() => setLightboxIndex(index)}
                className="card-luxury group cursor-pointer overflow-hidden border border-luxury-parchment/50 bg-white"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-luxury-ivory">
                  <img
                    src={photo.image_url}
                    alt={displayName}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                    loading="lazy"
                  />
                </div>
                <div className="border-t border-luxury-parchment/40 px-3 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center border border-luxury-gold/40 text-[10px] font-medium uppercase text-luxury-gold-muted">
                      {displayName[0]}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-medium tracking-wide text-luxury-charcoal">
                        {displayName}
                      </p>
                      <p className="text-[10px] tracking-wide text-luxury-stone">
                        {formatRelativeTime(photo.created_at, locale, t)}
                      </p>
                    </div>
                    <LikeButton
                      photoId={photo.id}
                      initialCount={photo.likes_count || 0}
                      onCountChange={(id, count) =>
                        patchPhoto(id, { likes_count: count })
                      }
                    />
                  </div>
                  {photo.message && (
                    <p className="mt-2 line-clamp-2 font-[family-name:var(--font-cormorant)] text-sm italic leading-relaxed text-luxury-stone">
                      &ldquo;{photo.message}&rdquo;
                    </p>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}

      {lightboxIndex !== null && (
        <PhotoLightbox
          photos={photos}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
          onLikeChange={(id, count) => patchPhoto(id, { likes_count: count })}
        />
      )}
    </div>
  );
}
