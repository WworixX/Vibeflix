"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, X, Sparkles } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useStore } from "@/lib/store";
import { AtmosphereBg } from "@/components/AtmosphereBg";

const matrix = [
  { feat: "Catalogue complet HD", free: true, premium: true },
  { feat: "Sans publicité", free: false, premium: true },
  { feat: "4K Dolby Vision + Atmos", free: false, premium: true },
  { feat: "Nombre de profils", free: "1", premium: "5 + Kids" },
  { feat: "Écrans simultanés", free: "1", premium: "4" },
  { feat: "Téléchargements offline", free: false, premium: true },
  { feat: "Lives premium", free: false, premium: true },
  { feat: "Annulation à tout moment", free: true, premium: true },
];

function Cell({ value }: { value: boolean | string }) {
  if (typeof value === "string") return <span className="text-sm font-medium text-white/85">{value}</span>;
  return value ? (
    <Check className="h-5 w-5 text-mint-300" strokeWidth={1.8} />
  ) : (
    <X className="h-5 w-5 text-white/15" strokeWidth={1.8} />
  );
}

export default function PricingPage() {
  const { isPremium, billing, upgrade, downgrade } = useStore();
  const [period, setPeriod] = useState<"monthly" | "yearly">(billing);

  return (
    <>
      <Navbar />
      <main className="relative pb-32 pt-36 overflow-hidden">
        <AtmosphereBg />

        <section className="mx-auto max-w-[1280px] px-6 text-center">
          <span className="chip">
            <Sparkles className="h-3 w-3 text-mint-300" /> Tarifs honnêtes
          </span>
          <h1 className="h-display mx-auto mt-6 max-w-3xl text-balance text-5xl md:text-8xl">
            Le streaming, à{" "}
            <span className="italic text-mint-300/90" style={{ fontVariationSettings: "'SOFT' 80" }}>
              prix juste.
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-white/65">
            1 € par mois ou 5 € pour l'année. Tout le catalogue, sans publicité.
            Annulable en un clic depuis votre profil.
          </p>

          <div className="mx-auto mt-10 inline-flex rounded-full border border-white/10 bg-white/[0.03] p-1 text-sm">
            <button
              onClick={() => setPeriod("monthly")}
              className={`rounded-full px-5 py-2 transition ${
                period === "monthly" ? "bg-white text-char-950" : "text-white/65 hover:text-white"
              }`}
            >
              Mensuel
            </button>
            <button
              onClick={() => setPeriod("yearly")}
              className={`relative rounded-full px-5 py-2 transition ${
                period === "yearly" ? "bg-white text-char-950" : "text-white/65 hover:text-white"
              }`}
            >
              Annuel
              <span className="ml-2 rounded-full bg-mint-400/20 px-1.5 py-0.5 text-[10px] font-medium text-mint-200">
                −58 %
              </span>
            </button>
          </div>
        </section>

        <section className="mx-auto mt-16 max-w-5xl px-6">
          <div className="grid gap-4 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 0.61, 0.36, 1] }}
              className="glass rounded-[28px] p-8"
            >
              <div className="flex items-start justify-between">
                <h2 className="text-lg font-medium">Free</h2>
                <span className="chip">Toujours gratuit</span>
              </div>
              <div className="mt-6 flex items-baseline gap-2">
                <span className="font-display text-6xl tracking-[-0.02em]">0 €</span>
                <span className="text-sm text-white/45">/ mois</span>
              </div>
              <p className="mt-2 text-sm text-white/55">
                Tout le catalogue, avec quelques pubs courtes.
              </p>
              <button
                onClick={downgrade}
                disabled={!isPremium}
                className="btn-ghost mt-8 w-full disabled:opacity-60"
              >
                {isPremium ? "Repasser en Free" : "Votre plan actuel"}
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 0.61, 0.36, 1] }}
              className="relative overflow-hidden rounded-[28px] border border-mint-400/30 bg-gradient-to-br from-mint-500/15 via-char-900 to-mint-700/15 p-8"
            >
              <div className="absolute -top-24 right-0 h-48 w-48 rounded-full bg-mint-500/30 blur-3xl" />
              <div className="relative">
                <div className="flex items-start justify-between">
                  <h2 className="text-lg font-medium">Premium</h2>
                  <span className="chip-mint">
                    <Sparkles className="h-3 w-3" /> Sans pub
                  </span>
                </div>
                <div className="mt-6 flex items-baseline gap-2">
                  <span className="font-display text-6xl tracking-[-0.02em]">
                    {period === "monthly" ? "1 €" : "5 €"}
                  </span>
                  <span className="text-sm text-white/45">
                    / {period === "monthly" ? "mois" : "an"}
                  </span>
                </div>
                <p className="mt-2 text-sm text-white/55">
                  {period === "monthly"
                    ? "Le café du dimanche, en moins cher."
                    : "Moins de 0,42 €/mois. Vraiment."}
                </p>
                <button
                  onClick={() => upgrade(period)}
                  disabled={isPremium}
                  className="btn-primary mt-8 w-full disabled:opacity-70"
                >
                  {isPremium ? "Vous êtes Premium" : "Passer Premium"}
                </button>
                <p className="mt-3 text-center text-xs text-white/40">
                  Sans engagement. Annulable à tout moment.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="mx-auto mt-28 max-w-5xl px-6">
          <h2 className="text-center font-display text-3xl">Tout, en détail</h2>
          <div className="mt-10 overflow-hidden rounded-3xl border border-white/[0.06]">
            <table className="w-full text-left">
              <thead className="bg-white/[0.02]">
                <tr>
                  <th className="px-6 py-5 text-[11px] uppercase tracking-[0.16em] text-white/40">Fonctionnalité</th>
                  <th className="px-6 py-5 text-[11px] uppercase tracking-[0.16em] text-white/40">Free</th>
                  <th className="px-6 py-5 text-[11px] uppercase tracking-[0.16em] text-mint-300">Premium</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {matrix.map((row) => (
                  <tr key={row.feat}>
                    <td className="px-6 py-4 text-sm text-white/85">{row.feat}</td>
                    <td className="px-6 py-4"><Cell value={row.free} /></td>
                    <td className="px-6 py-4"><Cell value={row.premium} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
