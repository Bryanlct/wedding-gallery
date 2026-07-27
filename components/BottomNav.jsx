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
    <nav className="nav-shadow fixed bottom-0 left-0 right-0 z-50 border-t border-purple-100/80 bg-white/95 backdrop-blur-lg">
      <div className="mx-auto flex h-[4.25rem] max-w-md items-end justify-around px-6 pb-0.5">
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
                className="group relative -mt-7 flex flex-col items-center"
                aria-label={item.label}
              >
                <div
                  className={`flex h-[3.75rem] w-[3.75rem] items-center justify-center rounded-full transition-all duration-300 group-active:scale-95 ${
                    isActive
                      ? "bg-gradient-to-br from-wedding-primary to-wedding-primary-light shadow-lg shadow-purple-900/40 ring-4 ring-purple-100"
                      : "bg-gradient-to-br from-wedding-primary-light to-purple-500 shadow-lg shadow-purple-700/30 group-hover:shadow-purple-700/50"
                  }`}
                >
                  <Icon className="h-6 w-6 text-white" strokeWidth={2.5} />
                </div>
                <span
                  className={`mt-1.5 text-[11px] font-semibold tracking-wide ${
                    isActive ? "text-wedding-primary" : "text-purple-400"
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
              className="flex flex-col items-center gap-1 py-2 transition-colors"
              aria-label={item.label}
            >
              <div
                className={`rounded-xl p-1.5 transition-colors ${
                  isActive ? "bg-purple-50" : ""
                }`}
              >
                <Icon
                  className={`h-5 w-5 ${
                    isActive ? "text-wedding-primary" : "text-purple-300"
                  }`}
                  strokeWidth={isActive ? 2.5 : 2}
                />
              </div>
              <span
                className={`text-[11px] font-semibold tracking-wide ${
                  isActive ? "text-wedding-primary" : "text-purple-400"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}
