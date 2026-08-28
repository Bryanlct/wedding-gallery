/**
 * 觸發瀏覽器下載 Blob 檔案。
 */
export function downloadBlob(blob, filename) {
  const blobUrl = URL.createObjectURL(blob);

  const anchor = document.createElement("a");
  anchor.href = blobUrl;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);

  URL.revokeObjectURL(blobUrl);
}

/**
 * 觸發瀏覽器下載遠端圖片。
 */
export async function downloadImage(url, filename = "wedding-photo.jpg") {
  const response = await fetch(url);
  if (!response.ok) throw new Error("下載失敗");

  const blob = await response.blob();
  downloadBlob(blob, filename);
}

function sanitizeFilename(value) {
  return value
    .trim()
    .replace(/[^\w\u4e00-\u9fff-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
}

function getPhotoFilename(photo, index) {
  const user = photo.user_name ? sanitizeFilename(photo.user_name) : "guest";
  const id = photo.id.slice(0, 8);
  const order = String(index + 1).padStart(3, "0");
  return `${order}-agnes-bryan-${user}-${id}.jpg`;
}

/**
 * 將所有照片打包成 ZIP 並下載。
 * @param {Array} photos
 * @param {{ onProgress?: (progress: { current: number, total: number, phase: 'fetching' | 'packing', percent?: number }) => void }} options
 */
export async function downloadAllPhotos(photos, { onProgress } = {}) {
  if (!photos.length) {
    throw new Error("NO_PHOTOS");
  }

  const JSZip = (await import("jszip")).default;
  const zip = new JSZip();
  const folder = zip.folder("agnes-bryan-wedding-photos");
  let added = 0;

  for (let i = 0; i < photos.length; i++) {
    onProgress?.({
      current: i + 1,
      total: photos.length,
      phase: "fetching",
    });

    const photo = photos[i];
    const response = await fetch(photo.image_url);
    if (!response.ok) continue;

    const blob = await response.blob();
    folder.file(getPhotoFilename(photo, i), blob);
    added++;
  }

  if (added === 0) {
    throw new Error("DOWNLOAD_FAILED");
  }

  const date = new Date().toISOString().slice(0, 10);
  const zipBlob = await zip.generateAsync({ type: "blob" }, (metadata) => {
    onProgress?.({
      current: photos.length,
      total: photos.length,
      phase: "packing",
      percent: Math.round(metadata.percent),
    });
  });

  downloadBlob(zipBlob, `agnes-bryan-wedding-${date}.zip`);
  return added;
}
