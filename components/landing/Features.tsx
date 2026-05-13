"use client";

import { motion } from "framer-motion";
import { Film, Headphones, Smartphone, ShieldOff, Heart, Layers } from "lucide-react";

const features = [
  {
    icon: Film,
    title: "Catalogue curaté",
    desc: "Des milliers de films et séries triés par humeurs, pas par algorithmes opaques.",
  },
  {
    icon: ShieldOff,
    title: "Pubs minimales",
    desc: "Maximum une coupure de 15s par épisode. Et zéro en Premium.",
  },
  {
    icon: Smartphone,
    title: "Sur tous les écrans",
    desc: "Web, mobile, TV, tablette. Reprise instantanée sur tous vos appareils.",
  },
  {
    icon: Headphones,
    title: "Son cinéma",
    desc: "Dolby Atmos compatible, mixages multilingues, sous-titres soignés.",
  },
  {
    icon: Heart,
    title: "Profils & watchlists",
    desc: "Jusqu'à 5 profils, dont un Kids modéré. Vos goûts restent les vôtres.",
  },
  {
    icon: Layers,
    title: "Téléchargements illimités",
    desc: "Emportez vos films offline. Plus de loading dans le train.",
  },
];

export function Features() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="text-center max-w-2xl mx-auto">
        <span className="chip">Pourquoi VibeFlix</span>
        <h2 className="mt-4 font-display text-4xl md:text-5xl">
          Tout ce qu'une plateforme de streaming devrait faire — sans le reste.
        </h2>
      </div>

      <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="glass group relative overflow-hidden rounded-2xl p-6 transition hover:border-white/20"
          >
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-vibe-gradient opacity-0 blur-3xl transition group-hover:opacity-30" />
            <div className="relative">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-white/[0.06] border border-white/10">
                <f.icon className="h-5 w-5 text-vibe-400" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-white/60">{f.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
