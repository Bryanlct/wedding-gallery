import { ALLOWED_IMAGE_TYPES } from "@/lib/upload";

/**
 * 驗證上傳檔案是否為允許的圖片格式（禁止影片）。
 * @returns {'ok' | 'video' | 'invalid'}
 */
export function validateUploadFile(file) {
  if (file.type.startsWith("video/")) {
    return "video";
  }

  const isImage =
    file.type.startsWith("image/") ||
    ALLOWED_IMAGE_TYPES.includes(file.type) ||
    /\.(jpe?g|png|webp|gif|heic|heif)$/i.test(file.name);

  if (!isImage) {
    return "invalid";
  }

  return "ok";
}
