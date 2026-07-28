/**
 * 將 ISO 時間字串轉為相對時間。
 */
export function formatRelativeTime(isoString, locale = "zh-TW", t) {
  if (!isoString) return "";

  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (t) {
    if (diffSec < 60) return t("time.justNow");
    if (diffMin < 60) return t("time.minAgo", { n: diffMin });
    if (diffHr < 24) return t("time.hrAgo", { n: diffHr });
    if (diffDay < 7) return t("time.dayAgo", { n: diffDay });
  } else {
    if (diffSec < 60) return "剛剛";
    if (diffMin < 60) return `${diffMin} min ago`;
    if (diffHr < 24) return `${diffHr} hr ago`;
    if (diffDay < 7) return `${diffDay} day ago`;
  }

  const localeTag =
    locale === "en" ? "en-US" : locale === "zh-CN" ? "zh-CN" : "zh-TW";

  return date.toLocaleDateString(localeTag, {
    month: "short",
    day: "numeric",
  });
}
