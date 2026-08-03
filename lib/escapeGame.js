export const GAME_STORAGE_KEY = "wedding_escape_session";

export const GAME_COPY = {
  couple: "Agnes & Bryan",
  date: "2026 · 12 · 06",
  venue: "香港金普頓酒店",
};

export function normalizePhone(value) {
  return value.replace(/\D/g, "");
}
