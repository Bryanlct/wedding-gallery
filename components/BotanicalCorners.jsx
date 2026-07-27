export default function BotanicalCorners({ className = "" }) {
  return (
    <>
      {/* 左上 */}
      <svg
        className={`pointer-events-none absolute left-0 top-0 h-20 w-16 opacity-40 ${className}`}
        viewBox="0 0 64 80"
        fill="none"
        aria-hidden
      >
        <path
          d="M4 76C4 76 8 40 28 28C20 48 16 64 4 76Z"
          stroke="#9aab7a"
          strokeWidth="0.8"
          fill="none"
        />
        <path
          d="M2 60C12 52 20 36 24 20"
          stroke="#9aab7a"
          strokeWidth="0.6"
          fill="none"
        />
        <circle cx="26" cy="18" r="3" fill="#c4b5d4" fillOpacity="0.5" />
        <circle cx="14" cy="44" r="2" fill="#d4c4a0" fillOpacity="0.6" />
        <path
          d="M30 8C32 12 34 16 30 20"
          stroke="#8a9a6a"
          strokeWidth="0.5"
          fill="none"
        />
      </svg>
      {/* 右上 */}
      <svg
        className={`pointer-events-none absolute right-0 top-0 h-20 w-16 scale-x-[-1] opacity-40 ${className}`}
        viewBox="0 0 64 80"
        fill="none"
        aria-hidden
      >
        <path
          d="M4 76C4 76 8 40 28 28C20 48 16 64 4 76Z"
          stroke="#9aab7a"
          strokeWidth="0.8"
          fill="none"
        />
        <path
          d="M2 60C12 52 20 36 24 20"
          stroke="#9aab7a"
          strokeWidth="0.6"
          fill="none"
        />
        <circle cx="26" cy="18" r="3" fill="#c4b5d4" fillOpacity="0.5" />
        <circle cx="14" cy="44" r="2" fill="#d4c4a0" fillOpacity="0.6" />
      </svg>
      {/* 左下 */}
      <svg
        className={`pointer-events-none absolute bottom-0 left-0 h-16 w-20 scale-y-[-1] opacity-30 ${className}`}
        viewBox="0 0 80 64"
        fill="none"
        aria-hidden
      >
        <path
          d="M4 4C20 8 36 20 48 40C32 32 16 20 4 4Z"
          stroke="#9aab7a"
          strokeWidth="0.7"
          fill="none"
        />
        <circle cx="52" cy="36" r="2.5" fill="#b8c8e8" fillOpacity="0.5" />
        <circle cx="20" cy="12" r="2" fill="#d4c4a0" fillOpacity="0.5" />
      </svg>
      {/* 右下 */}
      <svg
        className={`pointer-events-none absolute bottom-0 right-0 h-16 w-20 scale-x-[-1] scale-y-[-1] opacity-30 ${className}`}
        viewBox="0 0 80 64"
        fill="none"
        aria-hidden
      >
        <path
          d="M4 4C20 8 36 20 48 40C32 32 16 20 4 4Z"
          stroke="#9aab7a"
          strokeWidth="0.7"
          fill="none"
        />
        <circle cx="52" cy="36" r="2.5" fill="#b8c8e8" fillOpacity="0.5" />
        <circle cx="20" cy="12" r="2" fill="#d4c4a0" fillOpacity="0.5" />
      </svg>
    </>
  );
}
