"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { usePhotos } from "@/hooks/usePhotos";
import { formatRelativeTime } from "@/utils/formatTime";
import { WEDDING } from "@/lib/wedding";
import WeddingHeader from "@/components/WeddingHeader";
import LoadingSpinner from "@/components/LoadingSpinner";
import EmptyState from "@/components/EmptyState";
import PhotoLightbox from "@/components/PhotoLightbox";

const filters = [
  { key: "latest", label: "Latest" },
  { key: "top", label: "Top" },
  { key: "today", label: "Today" },
];

export default function PhotoFeed() {
  const [activeFilter, setActiveFilter] = useState("latest");
  const [search, setSearch] = useState("");
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const { photos, loading, error } = usePhotos({
    filter: activeFilter,
    search,
  });

  return (
    <div className="flex flex-col">
      <WeddingHeader title={WEDDING.tagline} />

      <div className="space-y-4 px-5 py-5">
        <div className="relative">
          <Search
            className="absolute left-4 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-luxury-stone-light"
            strokeWidth={1.5}
          />
          <input
            type="search"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-luxury w-full py-3 pl-10 pr-4 text-sm text-luxury-charcoal placeholder:text-luxury-stone-light/60"
          />
        </div>

        <div className="scrollbar-hide flex justify-center gap-6">
          {filters.map((filter) => (
            <button
              key={filter.key}
              onClick={() => setActiveFilter(filter.key)}
              className={`pb-1 text-[10px] uppercase tracking-[0.18em] transition-all ${
                activeFilter === filter.key
                  ? "border-b border-luxury-gold font-medium text-luxury-charcoal"
                  : "text-luxury-stone hover:text-luxury-charcoal"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {loading && <LoadingSpinner />}

      {error && (
        <div className="mx-5 border border-red-200/60 bg-red-50/50 px-4 py-3 text-center text-sm text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && photos.length === 0 && (
        <EmptyState
          title={search ? "No results" : "No moments yet"}
          description={
            search
              ? "Try a different search"
              : "Be the first to share a cherished moment"
          }
        />
      )}

      {!loading && photos.length > 0 && (
        <div className="grid grid-cols-2 gap-3 px-5 pb-6">
          {photos.map((photo, index) => {
            const displayName = photo.user_name || "Guest";
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
                        {formatRelativeTime(photo.created_at)}
                      </p>
                    </div>
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
        />
      )}
    </div>
  );
}
