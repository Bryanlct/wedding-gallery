import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import { WEDDING } from "@/lib/wedding";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  title: `${WEDDING.couple} | ${WEDDING.tagline}`,
  description: `${WEDDING.couple} — ${WEDDING.date} @ ${WEDDING.venueEn}`,
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-TW" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="min-h-dvh font-[family-name:var(--font-inter)] font-light antialiased">
        {/* 桌面外框氛圍 */}
        <div className="pointer-events-none fixed inset-0 bg-[#141210]">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(181,160,103,0.06),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_80%,rgba(58,47,53,0.15),transparent_50%)]" />
        </div>

        <div className="relative mx-auto min-h-dvh max-w-md overflow-hidden bg-luxury-cream shadow-[0_0_80px_rgba(0,0,0,0.5)] ring-1 ring-luxury-gold/10">
          <main className="texture-linen pb-24">{children}</main>
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
