/**
 * 將 ISO 時間字串轉為相對時間（如「2 hr ago」）。
 */
export function formatRelativeTime(isoString) {
  if (!isoString) return "";

  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffSec < 60) return "剛剛";
  if (diffMin < 60) return `${diffMin} min ago`;
  if (diffHr < 24) return `${diffHr} hr ago`;
  if (diffDay < 7) return `${diffDay} day ago`;

  return date.toLocaleDateString("zh-TW", {
    month: "short",
    day: "numeric",
  });
}
