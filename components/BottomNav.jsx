"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Images, Camera, Download } from "lucide-react";

function NavItem({ href, label, icon: Icon, isActive }) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center justify-end gap-1.5 pb-0.5"
      aria-label={label}
    >
      <Icon
        className={`h-[18px] w-[18px] ${
          isActive ? "text-luxury-charcoal" : "text-luxury-stone-light"
        }`}
        strokeWidth={isActive ? 1.75 : 1.25}
      />
      <span
        className={`text-[9px] uppercase tracking-[0.18em] ${
          isActive ? "font-medium text-luxury-charcoal" : "text-luxury-stone"
        }`}
      >
        {label}
      </span>
      <span
        className={`h-px w-5 bg-luxury-gold transition-opacity ${
          isActive ? "opacity-100" : "opacity-0"
        }`}
      />
    </Link>
  );
}

export default function BottomNav() {
  const pathname = usePathname();
  const isFeed = pathname === "/";
  const isUpload = pathname.startsWith("/upload");
  const isGallery = pathname.startsWith("/download");

  return (
    <nav className="nav-luxury fixed bottom-0 left-0 right-0 z-50 border-t border-luxury-gold/15 bg-luxury-cream/98 backdrop-blur-md">
      <div className="relative mx-auto max-w-md">
        {/* 中央 Upload 按鈕 — 絕對置中 */}
        <Link
          href="/upload"
          className="absolute left-1/2 top-0 z-10 flex -translate-x-1/2 -translate-y-[55%] flex-col items-center"
          aria-label="Upload"
        >
          <div
            className={`flex h-[3.25rem] w-[3.25rem] items-center justify-center rounded-full border-2 shadow-md transition-all active:scale-95 ${
              isUpload
                ? "border-luxury-gold bg-luxury-charcoal shadow-black/25"
                : "border-luxury-gold/50 bg-luxury-charcoal shadow-black/15"
            }`}
          >
            <Camera
              className="h-[1.15rem] w-[1.15rem] text-luxury-gold-light"
              strokeWidth={1.5}
            />
          </div>
        </Link>

        {/* 三等分 Grid 確保左右對稱 */}
        <div className="grid h-[3.75rem] grid-cols-3 items-end px-6">
          <NavItem href="/" label="Feed" icon={Images} isActive={isFeed} />

          {/* 中欄只放 Upload 標籤，與圓形按鈕對齊 */}
          <div className="flex flex-col items-center justify-end pb-0.5">
            <div className="h-[1.125rem]" />
            <span
              className={`text-[9px] uppercase tracking-[0.18em] ${
                isUpload ? "font-medium text-luxury-charcoal" : "text-luxury-stone"
              }`}
            >
              Upload
            </span>
            <span
              className={`mt-1.5 h-px w-5 bg-luxury-gold transition-opacity ${
                isUpload ? "opacity-100" : "opacity-0"
              }`}
            />
          </div>

          <NavItem
            href="/download"
            label="Gallery"
            icon={Download}
            isActive={isGallery}
          />
        </div>
      </div>
      <div className="h-[env(safe-area-inset-bottom)] bg-luxury-cream/98" />
    </nav>
  );
}
