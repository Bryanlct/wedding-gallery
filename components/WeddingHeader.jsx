import { WEDDING } from "@/lib/wedding";
import BotanicalCorners from "@/components/BotanicalCorners";

export default function WeddingHeader({
  title,
  subtitle,
  showDetails = true,
  compact = false,
}) {
  return (
    <header className="relative overflow-hidden bg-luxury-charcoal px-6 text-luxury-cream">
      <BotanicalCorners />

      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-luxury-gold/60 to-transparent" />

      <div className={`relative text-center ${compact ? "py-5" : "py-9"}`}>
        {showDetails && (
          <>
            <p className="text-[9px] font-medium uppercase tracking-[0.4em] text-luxury-gold-light/80">
              {WEDDING.dateEn}
            </p>
            <h1 className="mt-3 font-[family-name:var(--font-cormorant)] text-[2rem] font-medium leading-tight tracking-[0.06em] text-luxury-cream">
              {WEDDING.couple}
            </h1>
            <p className="mt-2 text-[9px] uppercase tracking-[0.3em] text-luxury-stone-light/70">
              {WEDDING.venueEn}
            </p>

            <div className="luxury-divider mx-auto my-6 max-w-[180px]">
              <span className="text-[9px] text-luxury-gold">◆</span>
            </div>
          </>
        )}

        {title && (
          <p
            className={`font-[family-name:var(--font-cormorant)] tracking-[0.2em] text-foil ${
              showDetails ? "text-sm uppercase" : "text-xl"
            }`}
          >
            {title}
          </p>
        )}

        {subtitle && (
          <p className="mt-2 text-[10px] tracking-[0.15em] text-luxury-stone-light/60">
            {subtitle}
          </p>
        )}
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-luxury-gold/40 to-transparent" />
    </header>
  );
}
