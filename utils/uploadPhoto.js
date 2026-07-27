import { supabase, STORAGE_BUCKET, PHOTOS_TABLE } from "@/utils/supabase";
import { compressImage } from "@/utils/compressImage";

/**
 * 壓縮並上傳單張照片至 Supabase Storage，並寫入 photos 資料表。
 */
export async function uploadPhoto(file, { userName, message } = {}) {
  const compressed = await compressImage(file);

  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`;

  const { error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(fileName, compressed, {
      cacheControl: "3600",
      upsert: false,
      contentType: "image/jpeg",
    });

  if (uploadError) throw uploadError;

  const { data: urlData } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(fileName);

  const { data, error: dbError } = await supabase
    .from(PHOTOS_TABLE)
    .insert({
      image_url: urlData.publicUrl,
      user_name: userName?.trim() || null,
      message: message?.trim() || null,
    })
    .select()
    .single();

  if (dbError) throw dbError;

  return data;
}
