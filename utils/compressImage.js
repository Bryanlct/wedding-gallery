/**
 * 使用 Canvas 壓縮圖片，減少上傳體積與 Storage 用量。
 */
export async function compressImage(
  file,
  { maxWidth = 1920, maxHeight = 1920, quality = 0.82 } = {}
) {
  if (!file.type.startsWith("image/")) {
    return file;
  }

  // 小於 500KB 且非 HEIC 等格式時跳過壓縮
  if (file.size < 500 * 1024 && file.type === "image/jpeg") {
    return file;
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      let { width, height } = img;
      const ratio = Math.min(maxWidth / width, maxHeight / height, 1);
      width = Math.round(width * ratio);
      height = Math.round(height * ratio);

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("圖片壓縮失敗"));
            return;
          }
          const baseName = file.name.replace(/\.[^.]+$/, "") || "photo";
          resolve(
            new File([blob], `${baseName}.jpg`, {
              type: "image/jpeg",
              lastModified: Date.now(),
            })
          );
        },
        "image/jpeg",
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      // 壓縮失敗時退回原檔
      resolve(file);
    };

    img.src = objectUrl;
  });
}
