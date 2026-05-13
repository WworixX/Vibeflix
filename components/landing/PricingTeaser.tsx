"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Crown } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "0",
    badge: "Idéal pour tester",
    features: [
      "Catalogue complet en HD",
      "1 profil",
      "Pubs courtes (max 15s)",
      "1 appareil simultané",
    ],
    cta: "Commencer gratuitement",
    href: "/signup",
    highlight: false,
  },
  {
    name: "Premium",
    price: "8,99",
    badge: "Le plus aimé",
    features: [
      "Tout du plan Free, sans pub",
      "4K Dolby Vision + Atmos",
      "5 profils + Kids",
      "4 appareils simultanés",
      "Téléchargements offline",
    ],
    cta: "Passer Premium",
    href: "/pricing",
    highlight: true,
  },
];

export function PricingTeaser() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="text-center max-w-2xl mx-auto">
        <span className="chip">Tarifs simples</span>
        <h2 className="mt-4 font-display text-4xl md:text-5xl">
          Gratuit. Ou Premium. <br /> Rien entre les deux.
        </h2>
      </div>

      <div className="mt-14 grid gap-5 md:grid-cols-2 max-w-4xl mx-auto">
        {plans.map((p, i) => (
          <motion.div
            key={p.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className={`relative rounded-3xl p-8 ${
              p.highlight
                ? "bg-gradient-to-br from-vibe-500/20 via-ink-900 to-vibe-700/20 border border-vibe-500/30"
                : "glass"
            }`}
          >
            {p.highlight && (
              <div className="absolute -top-3 right-6">
                <span className="inline-flex items-center gap-1 rounded-full bg-vibe-gradient px-3 py-1 text-xs font-semibold">
                  <Crown className="h-3 w-3" /> {p.badge}
                </span>
              </div>
            )}
            <div className="flex items-baseline justify-between">
              <h3 className="text-xl font-semibold">{p.name}</h3>
              {!p.highlight && (
                <span className="text-xs text-white/50">{p.badge}</span>
              )}
            </div>
            <div className="mt-6 flex items-baseline gap-1">
              <span className="text-5xl font-bold">{p.price}€</span>
              <span className="text-sm text-white/50">/ mois</span>
            </div>
            <ul className="mt-6 space-y-3 text-sm">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-vibe-400" />
                  <span className="text-white/80">{f}</span>
                </li>
              ))}
            </ul>
            <Link
              href={p.href}
              className={`mt-8 block text-center ${
                p.highlight ? "btn-primary w-full" : "btn-ghost w-full"
              }`}
            >
              {p.cta}
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
