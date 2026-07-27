import { WEDDING } from "@/lib/wedding";

export default function CoupleName({ variant = "default" }) {
  const [first, second] = WEDDING.couple.split(" & ");
  const isHero = variant === "hero";

  return (
    <h1
      className={`couple-name flex flex-wrap items-baseline justify-center gap-x-2 gap-y-0 leading-none ${
        isHero
          ? "text-white drop-shadow-[0_2px_16px_rgba(0,0,0,0.45)]"
          : "text-luxury-cream"
      }`}
    >
      <span className="font-[family-name:var(--font-playfair)] font-medium tracking-[0.06em]">
        {first}
      </span>
      <span
        className={`font-[family-name:var(--font-cormorant)] font-light italic ${
          isHero ? "text-luxury-gold-light" : "text-luxury-gold"
        }`}
        aria-hidden
      >
        &amp;
      </span>
      <span className="font-[family-name:var(--font-playfair)] font-medium tracking-[0.06em]">
        {second}
      </span>
    </h1>
  );
}
