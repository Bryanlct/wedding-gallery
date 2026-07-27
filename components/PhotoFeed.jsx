"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Camera } from "lucide-react";
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
      <WeddingHeader title={`${WEDDING.tagline} ❤️`} />

      <div className="space-y-3 px-4 py-4">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-purple-400" />
          <input
            type="search"
            placeholder="Search photos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-full border border-purple-100 bg-white py-3 pl-10 pr-4 text-sm text-purple-900 shadow-sm placeholder:text-purple-300 focus:border-wedding-primary-light focus:outline-none focus:ring-2 focus:ring-purple-200/60"
          />
        </div>

        <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-1">
          {filters.map((filter) => (
            <button
              key={filter.key}
              onClick={() => setActiveFilter(filter.key)}
              className={`shrink-0 rounded-full px-5 py-2 text-xs font-semibold tracking-wide transition-all ${
                activeFilter === filter.key
                  ? "bg-gradient-to-r from-wedding-primary to-wedding-primary-light text-white shadow-md shadow-purple-900/20"
                  : "bg-white text-purple-600 shadow-sm ring-1 ring-purple-100 hover:bg-purple-50"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {loading && <LoadingSpinner />}

      {error && (
        <div className="mx-4 rounded-2xl bg-red-50 px-4 py-3 text-center text-sm text-red-600 ring-1 ring-red-100">
          {error}
          <p className="mt-1 text-xs text-red-400">
            請確認 Supabase 環境變數與資料表已正確設定
          </p>
        </div>
      )}

      {!loading && !error && photos.length === 0 && (
        <EmptyState
          title={search ? "找不到符合的照片" : "尚無照片"}
          description={
            search
              ? "試試其他關鍵字"
              : "成為第一個分享美好時刻的人吧！"
          }
        />
      )}

      {!loading && photos.length > 0 && (
        <div className="grid grid-cols-2 gap-3 px-4 pb-20">
          {photos.map((photo, index) => {
            const displayName = photo.user_name || "Guest";
            return (
              <article
                key={photo.id}
                onClick={() => setLightboxIndex(index)}
                className="card-elegant group cursor-pointer overflow-hidden rounded-2xl bg-white ring-1 ring-purple-50 transition-all duration-300 active:scale-[0.98]"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-purple-50">
                  <img
                    src={photo.image_url}
                    alt={`${displayName} 的照片`}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
                <div className="flex items-center gap-2.5 px-3 py-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-wedding-accent-soft to-purple-100 text-xs font-bold text-wedding-primary ring-2 ring-white">
                    {displayName[0].toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-purple-900">
                      {displayName}
                    </p>
                    <p className="text-[11px] text-purple-400">
                      {formatRelativeTime(photo.created_at)}
                    </p>
                  </div>
                </div>
                {photo.message && (
                  <p className="line-clamp-2 px-3 pb-3 text-xs leading-relaxed text-purple-500">
                    {photo.message}
                  </p>
                )}
              </article>
            );
          })}
        </div>
      )}

      {/* 浮動上傳按鈕 */}
      <Link
        href="/upload"
        className="fixed bottom-24 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-wedding-primary to-wedding-primary-light text-white shadow-lg shadow-purple-900/30 transition-transform active:scale-95 max-md:right-4 md:right-[max(1rem,calc(50vw-13rem))]"
        aria-label="上傳照片"
      >
        <Camera className="h-5 w-5" strokeWidth={2.5} />
      </Link>

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
