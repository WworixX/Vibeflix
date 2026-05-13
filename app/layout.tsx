import type { Metadata } from "next";
import { Fraunces, Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["opsz", "SOFT"],
});

export const metadata: Metadata = {
  title: "VibeFlix — Le streaming, en plus beau.",
  description:
    "Films, séries et live. Une expérience pensée pour celles et ceux qui regardent vraiment. Gratuit avec pub, ou Premium à 1€/mois.",
  metadataBase: new URL("https://vibeflix.local"),
  themeColor: "#0B1411",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${geist.variable} ${fraunces.variable}`}>
      <body className="relative min-h-screen font-sans antialiased">
        <div className="relative z-[2]">{children}</div>
      </body>
    </html>
  );
}
