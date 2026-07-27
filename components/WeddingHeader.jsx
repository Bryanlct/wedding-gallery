import { WEDDING } from "@/lib/wedding";

export default function WeddingHeader({
  title,
  subtitle,
  showDetails = true,
  compact = false,
}) {
  return (
    <header className="relative overflow-hidden bg-gradient-to-br from-wedding-primary via-[#5b21b6] to-wedding-primary-light px-4 text-white">
      {/* 裝飾光暈 */}
      <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-wedding-accent/20 blur-xl" />

      <div
        className={`relative text-center ${compact ? "py-4" : "py-6"}`}
      >
        {showDetails && (
          <>
            <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-purple-200/80">
              {WEDDING.dateEn}
            </p>
            <p className="mt-1 font-[family-name:var(--font-playfair)] text-2xl font-semibold tracking-wide">
              {WEDDING.couple}
            </p>
            <p className="mt-0.5 text-xs text-purple-200/70">
              {WEDDING.venue}
            </p>
            <div className="mx-auto my-3 flex items-center justify-center gap-2">
              <span className="h-px w-10 bg-gradient-to-r from-transparent to-wedding-accent/60" />
              <span className="text-wedding-accent">✦</span>
              <span className="h-px w-10 bg-gradient-to-l from-transparent to-wedding-accent/60" />
            </div>
          </>
        )}

        {title && (
          <h1
            className={`font-[family-name:var(--font-playfair)] font-semibold tracking-wide ${
              showDetails ? "text-lg" : "text-xl"
            }`}
          >
            {title}
          </h1>
        )}

        {subtitle && (
          <p className="mt-1 text-xs text-purple-200/80">{subtitle}</p>
        )}
      </div>
    </header>
  );
}
