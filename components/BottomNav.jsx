"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Images, Camera, Download } from "lucide-react";

const navItems = [
  { href: "/", label: "Feed", icon: Images },
  { href: "/upload", label: "Upload", icon: Camera, isCenter: true },
  { href: "/download", label: "Gallery", icon: Download },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="nav-luxury fixed bottom-0 left-0 right-0 z-50 bg-luxury-cream/95 backdrop-blur-md">
      <div className="mx-auto flex h-[4.5rem] max-w-md items-end justify-around px-8">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          const Icon = item.icon;

          if (item.isCenter) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="group relative -mt-8 flex flex-col items-center"
                aria-label={item.label}
              >
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-full border transition-all duration-300 group-active:scale-95 ${
                    isActive
                      ? "border-luxury-gold bg-luxury-charcoal shadow-lg shadow-black/20"
                      : "border-luxury-gold/40 bg-luxury-charcoal shadow-md group-hover:border-luxury-gold/70"
                  }`}
                >
                  <Icon
                    className="h-5 w-5 text-luxury-gold-light"
                    strokeWidth={1.5}
                  />
                </div>
                <span
                  className={`mt-2 text-[9px] uppercase tracking-[0.15em] ${
                    isActive ? "text-luxury-charcoal" : "text-luxury-stone"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-1.5 py-2"
              aria-label={item.label}
            >
              <Icon
                className={`h-[18px] w-[18px] ${
                  isActive ? "text-luxury-charcoal" : "text-luxury-stone-light"
                }`}
                strokeWidth={isActive ? 1.75 : 1.25}
              />
              <span
                className={`text-[9px] uppercase tracking-[0.15em] ${
                  isActive
                    ? "font-medium text-luxury-charcoal"
                    : "text-luxury-stone"
                }`}
              >
                {item.label}
              </span>
              {isActive && (
                <span className="h-px w-4 bg-luxury-gold" />
              )}
            </Link>
          );
        })}
      </div>
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}
