const LIKED_KEY = "wedding-liked-photos";

export function getLikedPhotoIds() {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(LIKED_KEY);
    return new Set(raw ? JSON.parse(raw) : []);
  } catch {
    return new Set();
  }
}

export function isPhotoLiked(photoId) {
  return getLikedPhotoIds().has(photoId);
}

export function setPhotoLiked(photoId, liked) {
  const ids = getLikedPhotoIds();
  if (liked) ids.add(photoId);
  else ids.delete(photoId);
  localStorage.setItem(LIKED_KEY, JSON.stringify([...ids]));
}
