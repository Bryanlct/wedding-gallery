import { ImageOff, Heart } from "lucide-react";

export default function EmptyState({
  title = "尚無照片",
  description = "成為第一個分享美好時刻的人吧！",
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 px-8 py-20 text-center">
      <div className="relative">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-purple-100 to-wedding-accent-soft">
          <ImageOff className="h-8 w-8 text-purple-300" />
        </div>
        <Heart className="absolute -bottom-1 -right-1 h-5 w-5 fill-wedding-accent text-wedding-accent" />
      </div>
      <div>
        <h3 className="font-[family-name:var(--font-playfair)] text-lg font-semibold text-purple-900">
          {title}
        </h3>
        <p className="mt-1.5 text-sm leading-relaxed text-purple-400">
          {description}
        </p>
      </div>
    </div>
  );
}
