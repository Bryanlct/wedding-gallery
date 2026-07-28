"use client";

import { WEDDING } from "@/lib/wedding";
import { useLanguage } from "@/contexts/LanguageContext";
import BotanicalCorners from "@/components/BotanicalCorners";
import CoupleName from "@/components/CoupleName";

export default function WeddingHeader({
  title,
  subtitle,
  showDetails = true,
  showHero = false,
  compact = false,
}) {
  const { t } = useLanguage();
  const withHero = showHero && showDetails;
  const displayTitle = title ?? t("wedding.tagline");
  const weddingDate = t("wedding.date");
  const weddingVenue = t("wedding.venue");

  return (
    <header className="relative overflow-hidden bg-luxury-charcoal text-luxury-cream">
      {withHero && (
        <div className="relative aspect-[4/3] w-full sm:aspect-[16/10] md:aspect-[21/9] lg:aspect-[2/1]">
          <img
            src="/images/hero-wedding.png"
            alt={`${WEDDING.couple} wedding`}
            className="h-full w-full object-cover object-[center_35%]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-luxury-charcoal via-luxury-charcoal/50 to-luxury-ink/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-luxury-ink/30 via-transparent to-luxury-ink/30" />

          <div className="absolute inset-x-0 bottom-0 px-6 pb-6 pt-16 text-center md:pb-8 md:pt-20">
            <BotanicalCorners className="opacity-60" />
            <p className="text-[9px] font-medium uppercase tracking-[0.4em] text-luxury-gold-light/90 md:text-[10px]">
              {weddingDate}
            </p>
            <div className="mt-2">
              <CoupleName variant="hero" />
            </div>
            <p className="mt-1.5 text-[9px] uppercase tracking-[0.3em] text-luxury-cream/70 md:text-[10px]">
              {weddingVenue}
            </p>
            <div className="luxury-divider mx-auto my-4 max-w-[180px] md:my-5 md:max-w-[240px]">
              <span className="text-[9px] text-luxury-gold">◆</span>
            </div>
            {displayTitle && (
              <p className="font-[family-name:var(--font-cormorant)] text-sm uppercase tracking-[0.2em] text-foil md:text-base">
                {displayTitle}
              </p>
            )}
          </div>
        </div>
      )}

      {!withHero && (
        <>
          <BotanicalCorners />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-luxury-gold/60 to-transparent" />

          <div
            className={`relative px-6 text-center ${compact ? "py-5 md:py-6" : "py-9 md:py-12"}`}
          >
            {showDetails && (
              <>
                <p className="text-[9px] font-medium uppercase tracking-[0.4em] text-luxury-gold-light/80 md:text-[10px]">
                  {weddingDate}
                </p>
                <div className="mt-3">
                  <CoupleName />
                </div>
                <p className="mt-2 text-[9px] uppercase tracking-[0.3em] text-luxury-stone-light/70 md:text-[10px]">
                  {weddingVenue}
                </p>
                <div className="luxury-divider mx-auto my-6 max-w-[180px] md:my-8 md:max-w-[240px]">
                  <span className="text-[9px] text-luxury-gold">◆</span>
                </div>
              </>
            )}

            {displayTitle && (
              <p
                className={`font-[family-name:var(--font-cormorant)] tracking-[0.2em] text-foil ${
                  showDetails
                    ? "text-sm uppercase md:text-base"
                    : "text-xl md:text-2xl"
                }`}
              >
                {displayTitle}
              </p>
            )}

            {subtitle && (
              <p className="mt-2 text-[10px] tracking-[0.15em] text-luxury-stone-light/60">
                {subtitle}
              </p>
            )}
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-luxury-gold/40 to-transparent" />
        </>
      )}

      {withHero && subtitle && (
        <p className="px-6 py-3 text-center text-[10px] tracking-[0.15em] text-luxury-stone-light/60">
          {subtitle}
        </p>
      )}
    </header>
  );
}
