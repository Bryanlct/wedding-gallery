import { supabase, PHOTOS_TABLE } from "@/utils/supabase";

export async function togglePhotoLike(photoId, currentCount, isLiked) {
  const newCount = Math.max(0, (currentCount || 0) + (isLiked ? -1 : 1));

  const { data, error } = await supabase
    .from(PHOTOS_TABLE)
    .update({ likes_count: newCount })
    .eq("id", photoId)
    .select("likes_count")
    .single();

  if (error) throw error;
  return data.likes_count;
}
