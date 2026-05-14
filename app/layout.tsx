import type { Metadata } from "next";
import { Geist, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import { Splash } from "@/components/Splash";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  axes: ["opsz", "wdth"],
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
    <html lang="fr" className={`${geist.variable} ${bricolage.variable}`}>
      <body className="relative min-h-screen font-sans antialiased">
        <Splash />
        <div className="relative z-[2]">{children}</div>
      </body>
    </html>
  );
}
