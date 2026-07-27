import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import { WEDDING } from "@/lib/wedding";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  title: `${WEDDING.couple} | ${WEDDING.tagline}`,
  description: `${WEDDING.couple} 婚宴即時相簿 — ${WEDDING.date} @ ${WEDDING.venue}`,
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-TW" className={`${playfair.variable} ${inter.variable}`}>
      <body className="min-h-dvh font-[family-name:var(--font-inter)] antialiased">
        {/* 桌面背景裝飾 */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute -left-20 top-1/4 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl" />
          <div className="absolute -right-20 bottom-1/4 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl" />
        </div>

        {/* 手機外框容器 */}
        <div className="relative mx-auto min-h-dvh max-w-md overflow-hidden bg-wedding-bg shadow-2xl shadow-black/30 ring-1 ring-white/10">
          <main className="pb-24">{children}</main>
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
