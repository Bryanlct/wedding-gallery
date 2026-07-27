export default function LoadingSpinner({ label = "Loading" }) {
  return (
    <div className="flex flex-col items-center gap-4 py-20">
      <div className="h-px w-12 animate-pulse bg-luxury-gold/40" />
      <p className="text-[10px] uppercase tracking-[0.25em] text-luxury-stone">
        {label}
      </p>
    </div>
  );
}
