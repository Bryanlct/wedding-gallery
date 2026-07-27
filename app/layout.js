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
        <div className="pointer-events-none fixed inset-0 bg-luxury-ink">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_40%_30%,rgba(196,163,90,0.07),transparent_55%)]" />
        </div>

        <div className="relative mx-auto min-h-dvh max-w-md overflow-hidden bg-luxury-cream shadow-[0_0_60px_rgba(0,0,0,0.4)] ring-1 ring-luxury-gold/15">
          <main className="texture-linen pb-[5.5rem]">{children}</main>
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
