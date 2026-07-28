"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { isPhotoLiked, setPhotoLiked } from "@/utils/likes";
import { togglePhotoLike } from "@/utils/togglePhotoLike";
import { useLanguage } from "@/contexts/LanguageContext";

export default function LikeButton({
  photoId,
  initialCount = 0,
  onCountChange,
  className = "",
}) {
  const { t } = useLanguage();
  const [liked, setLiked] = useState(() => isPhotoLiked(photoId));
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);

  const handleClick = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (loading) return;

    const nextLiked = !liked;
    const prevCount = count;
    const optimistic = Math.max(0, count + (nextLiked ? 1 : -1));

    setLiked(nextLiked);
    setCount(optimistic);
    setPhotoLiked(photoId, nextLiked);
    setLoading(true);

    try {
      const newCount = await togglePhotoLike(photoId, prevCount, liked);
      setCount(newCount);
      onCountChange?.(photoId, newCount);
    } catch {
      setLiked(liked);
      setCount(prevCount);
      setPhotoLiked(photoId, liked);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className={`flex items-center gap-1 transition-opacity disabled:opacity-50 ${className}`}
      aria-label={liked ? t("like.unlike") : t("like.like")}
    >
      <Heart
        className={`h-3.5 w-3.5 transition-colors ${
          liked
            ? "fill-red-400 text-red-400"
            : "text-luxury-stone-light hover:text-red-300"
        }`}
        strokeWidth={1.5}
      />
      {count > 0 && (
        <span className="text-[10px] tabular-nums text-luxury-stone">{count}</span>
      )}
    </button>
  );
}
