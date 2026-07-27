/**
 * 觸發瀏覽器下載遠端圖片。
 */
export async function downloadImage(url, filename = "wedding-photo.jpg") {
  const response = await fetch(url);
  if (!response.ok) throw new Error("下載失敗");

  const blob = await response.blob();
  const blobUrl = URL.createObjectURL(blob);

  const anchor = document.createElement("a");
  anchor.href = blobUrl;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);

  URL.revokeObjectURL(blobUrl);
}
