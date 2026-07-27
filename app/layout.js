import { Cormorant_Garamond, Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import { WEDDING } from "@/lib/wedding";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-cormorant",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-playfair",
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
    <html lang="zh-TW" className={`${cormorant.variable} ${playfair.variable} ${inter.variable}`}>
      <body className="min-h-dvh font-[family-name:var(--font-inter)] font-light antialiased">
        <div className="pointer-events-none fixed inset-0 bg-luxury-ink">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_40%_30%,rgba(196,163,90,0.07),transparent_55%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_70%,rgba(58,47,53,0.12),transparent_50%)]" />
        </div>

        <div className="app-shell">
          <main className="texture-linen pb-[5.5rem] md:pb-[6rem]">
            {children}
          </main>
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
