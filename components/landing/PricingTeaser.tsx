"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "0 €",
    note: "/ pour toujours",
    desc: "Catalogue complet, quelques pubs courtes.",
    features: ["1 profil", "Pubs max 15s", "1 écran à la fois", "HD"],
    href: "/signup",
    cta: "Commencer",
    highlight: false,
  },
  {
    name: "Premium",
    price: "1 €",
    note: "/ mois — ou 5 €/an",
    desc: "Plus de pub. Plus de qualité. Plus d'écrans.",
    features: [
      "Sans publicité",
      "4K Dolby Vision + Atmos",
      "5 profils + Kids",
      "4 écrans simultanés",
      "Téléchargements illimités",
    ],
    href: "/pricing",
    cta: "Passer Premium",
    highlight: true,
  },
];

export function PricingTeaser() {
  return (
    <section className="mx-auto max-w-[1280px] px-6 py-28">
      <div className="mx-auto max-w-2xl text-center">
        <span className="chip">Tarifs</span>
        <h2 className="h-display mt-4 text-balance text-4xl md:text-6xl">
          Gratuit. Ou Premium.{" "}
          <span className="text-mint-300/90">
            Rien entre.
          </span>
        </h2>
      </div>

      <div className="mx-auto mt-16 grid max-w-4xl gap-4 md:grid-cols-2">
        {plans.map((p, i) => (
          <motion.div
            key={p.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: i * 0.08, ease: [0.22, 0.61, 0.36, 1] }}
            className={`relative overflow-hidden rounded-[28px] p-8 ${
              p.highlight
                ? "border border-mint-400/30 bg-gradient-to-br from-mint-500/10 via-char-900 to-mint-700/10"
                : "glass"
            }`}
          >
            {p.highlight && (
              <span className="absolute right-6 top-6 chip-mint">
                <Sparkles className="h-3 w-3" /> Le plus aimé
              </span>
            )}
            <h3 className="text-lg font-medium">{p.name}</h3>
            <div className="mt-6 flex items-baseline gap-2">
              <span className="font-display text-6xl tracking-[-0.02em]">{p.price}</span>
              <span className="text-sm text-white/50">{p.note}</span>
            </div>
            <p className="mt-2 text-sm text-white/55">{p.desc}</p>
            <ul className="mt-7 space-y-2.5 text-sm">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-mint-300" strokeWidth={1.8} />
                  <span className="text-white/80">{f}</span>
                </li>
              ))}
            </ul>
            <Link
              href={p.href}
              className={`mt-9 block w-full text-center ${p.highlight ? "btn-primary" : "btn-ghost"}`}
            >
              {p.cta}
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
