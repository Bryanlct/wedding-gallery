export default function LoadingSpinner({ label = "載入中..." }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-purple-200 border-t-wedding-primary" />
      <p className="text-sm text-purple-400">{label}</p>
    </div>
  );
}
