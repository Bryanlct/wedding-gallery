import { Cormorant_Garamond, Noto_Sans_TC, Zen_Old_Mincho } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const notoSans = Noto_Sans_TC({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-noto",
  display: "swap",
});

const zenMincho = Zen_Old_Mincho({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-mincho",
  display: "swap",
});

export const metadata = {
  title: "星海之約｜Agnes & Bryan",
  description: "在維港星光下找回四段記憶，見證 Agnes 與 Bryan 的永恆婚約。",
};

export const viewport = {
  themeColor: "#090818",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="zh-Hant"
      className={`${cormorant.variable} ${notoSans.variable} ${zenMincho.variable}`}
    >
      <body>
        <Providers>
          <div className="ambient-bg" aria-hidden="true">
            <div className="ambient-orb ambient-orb-one" />
            <div className="ambient-orb ambient-orb-two" />
            <div className="star-field" />
          </div>
          <div className="app-shell">
            <div className="shell-glow" aria-hidden="true" />
            <main className="relative min-h-dvh">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
