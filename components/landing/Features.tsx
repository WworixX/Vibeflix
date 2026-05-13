"use client";

import { motion } from "framer-motion";
import { Sparkles, Film, Headphones, ShieldOff, Tv, DownloadCloud } from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "Curation humaine",
    desc: "Pas d'algorithme obscur. Une équipe qui regarde, tague, et range chaque titre par humeur.",
  },
  {
    icon: ShieldOff,
    title: "Pubs respectueuses",
    desc: "15 secondes maximum, skippable à 5. Et zéro publicité en Premium.",
  },
  {
    icon: Tv,
    title: "Tous les écrans",
    desc: "Web, mobile, tablette, Smart TV, Apple TV, Android TV. Reprise instantanée.",
  },
  {
    icon: Headphones,
    title: "Son cinéma",
    desc: "Dolby Atmos compatible, mixages multilingues, sous-titres soignés.",
  },
  {
    icon: Film,
    title: "Live & événements",
    desc: "Concerts, sports, festivals — diffusés en direct, sans qualité dégradée.",
  },
  {
    icon: DownloadCloud,
    title: "Hors-ligne illimité",
    desc: "Téléchargez ce que vous voulez. Aucune limite sur le nombre de titres.",
  },
];

export function Features() {
  return (
    <section className="mx-auto max-w-[1280px] px-6 py-32">
      <div className="mx-auto max-w-2xl text-center">
        <span className="chip">Pourquoi VibeFlix</span>
        <h2 className="h-display mt-5 text-balance text-4xl md:text-6xl">
          Tout ce qu'une plateforme devrait être.
          <span className="text-mint-300/90">
            {" "}Rien d'autre.
          </span>
        </h2>
      </div>

      <div className="mt-20 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: i * 0.05, ease: [0.22, 0.61, 0.36, 1] }}
            className="glass group relative overflow-hidden rounded-3xl p-7"
          >
            <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-mint-500/0 blur-3xl transition-all duration-700 ease-exhale group-hover:bg-mint-500/30" />
            <div className="relative">
              <div className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-white/[0.04]">
                <f.icon className="h-[18px] w-[18px] text-mint-300" strokeWidth={1.6} />
              </div>
              <h3 className="mt-6 text-[17px] font-medium tracking-tight">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/55">{f.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
