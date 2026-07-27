import { WEDDING } from "@/lib/wedding";

export default function WeddingHeader({
  title,
  subtitle,
  showDetails = true,
  compact = false,
}) {
  return (
    <header className="relative bg-luxury-charcoal px-6 text-luxury-cream">
      {/* 頂部金色細線 */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-luxury-gold/50 to-transparent" />

      <div className={`relative text-center ${compact ? "py-5" : "py-8"}`}>
        {showDetails && (
          <>
            <p className="text-[9px] font-medium uppercase tracking-[0.35em] text-luxury-gold-light/70">
              {WEDDING.dateEn}
            </p>
            <h1 className="mt-2 font-[family-name:var(--font-cormorant)] text-3xl font-light tracking-[0.08em] text-luxury-cream">
              {WEDDING.couple}
            </h1>
            <p className="mt-1.5 text-[10px] uppercase tracking-[0.25em] text-luxury-stone-light/80">
              {WEDDING.venueEn}
            </p>

            <div className="luxury-divider mx-auto my-5 max-w-[200px]">
              <span className="text-[10px] text-luxury-gold">◆</span>
            </div>
          </>
        )}

        {title && (
          <p
            className={`font-[family-name:var(--font-cormorant)] font-light tracking-[0.15em] text-luxury-gold-light ${
              showDetails ? "text-base uppercase" : "text-xl"
            }`}
          >
            {title}
          </p>
        )}

        {subtitle && (
          <p className="mt-2 text-[11px] tracking-wide text-luxury-stone-light/70">
            {subtitle}
          </p>
        )}
      </div>

      {/* 底部金色細線 */}
      <div className="h-px bg-gradient-to-r from-transparent via-luxury-gold/30 to-transparent" />
    </header>
  );
}
