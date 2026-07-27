export default function EmptyState({
  title = "No moments yet",
  description = "Be the first to share a cherished moment",
}) {
  return (
    <div className="flex flex-col items-center px-10 py-24 text-center">
      <div className="luxury-divider mb-6 w-24">
        <span className="text-[8px] text-luxury-gold">◆</span>
      </div>
      <h3 className="font-[family-name:var(--font-cormorant)] text-xl font-light tracking-wide text-luxury-charcoal">
        {title}
      </h3>
      <p className="mt-3 text-[11px] leading-relaxed tracking-wide text-luxury-stone">
        {description}
      </p>
    </div>
  );
}
