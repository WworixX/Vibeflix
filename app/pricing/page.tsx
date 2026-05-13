"use client";

import { motion } from "framer-motion";
import { Check, X, Crown, Sparkles } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useStore } from "@/lib/store";

const matrix = [
  { feat: "Catalogue complet HD", free: true, premium: true },
  { feat: "Sans publicité", free: false, premium: true },
  { feat: "4K Dolby Vision + Atmos", free: false, premium: true },
  { feat: "Nombre de profils", free: "1", premium: "5 + Kids" },
  { feat: "Appareils simultanés", free: "1", premium: "4" },
  { feat: "Téléchargements offline", free: false, premium: true },
  { feat: "Annulation à tout moment", free: true, premium: true },
];

function Cell({ value }: { value: boolean | string }) {
  if (typeof value === "string")
    return <span className="text-sm font-medium">{value}</span>;
  return value ? (
    <Check className="h-5 w-5 text-vibe-400" />
  ) : (
    <X className="h-5 w-5 text-white/20" />
  );
}

export default function PricingPage() {
  const { isPremium, upgrade, downgrade } = useStore();

  return (
    <>
      <Navbar />
      <main className="pt-32 pb-24">
        <section className="mx-auto max-w-7xl px-6 text-center">
          <span className="chip">
            <Sparkles className="h-3 w-3 text-vibe-400" />
            Tarification simple
          </span>
          <h1 className="mt-6 font-display text-5xl md:text-7xl text-balance">
            Choisissez votre <span className="bg-vibe-gradient bg-clip-text text-transparent">ambiance.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-white/65">
            Tout le catalogue est disponible dès l'inscription. Le plan Premium retire les pubs et améliore tout le reste.
          </p>
        </section>

        <section className="mx-auto mt-16 max-w-5xl px-6">
          <div className="grid gap-5 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="glass rounded-3xl p-8"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Free</h2>
                <span className="chip">Toujours gratuit</span>
              </div>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-5xl font-bold">0€</span>
                <span className="text-white/50">/ mois</span>
              </div>
              <p className="mt-2 text-sm text-white/55">
                Catalogue complet avec quelques pubs courtes.
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
              transition={{ duration: 0.4, delay: 0.1 }}
              className="relative rounded-3xl p-8 bg-gradient-to-br from-vibe-500/20 via-ink-900 to-vibe-700/20 border border-vibe-500/30"
            >
              <div className="absolute -top-3 right-6">
                <span className="inline-flex items-center gap-1 rounded-full bg-vibe-gradient px-3 py-1 text-xs font-semibold">
                  <Crown className="h-3 w-3" /> Le plus populaire
                </span>
              </div>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Premium</h2>
                <span className="chip">Sans pub</span>
              </div>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-5xl font-bold">8,99€</span>
                <span className="text-white/50">/ mois</span>
              </div>
              <p className="mt-2 text-sm text-white/55">
                Plus de pubs. Plus de qualité. Plus d'écrans.
              </p>
              <button
                onClick={upgrade}
                disabled={isPremium}
                className="btn-primary mt-8 w-full disabled:opacity-60"
              >
                {isPremium ? "Vous êtes Premium ✨" : "Passer Premium"}
              </button>
              <p className="mt-3 text-center text-xs text-white/40">
                Premier mois à 1€. Annulable à tout moment.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="mx-auto mt-24 max-w-5xl px-6">
          <h2 className="font-display text-3xl text-center">Tout comparer</h2>
          <div className="mt-8 overflow-hidden rounded-2xl border border-white/10">
            <table className="w-full text-left">
              <thead className="bg-white/[0.03]">
                <tr>
                  <th className="px-6 py-4 text-sm font-medium text-white/60">Fonctionnalité</th>
                  <th className="px-6 py-4 text-sm font-medium text-white/60">Free</th>
                  <th className="px-6 py-4 text-sm font-medium text-vibe-400">Premium</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {matrix.map((row) => (
                  <tr key={row.feat}>
                    <td className="px-6 py-4 text-sm">{row.feat}</td>
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
