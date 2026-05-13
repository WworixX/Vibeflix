"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Camille R.",
    role: "Scénariste",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    quote:
      "La curation par humeur est dingue. J'ai redécouvert le plaisir de chercher un film, pas juste de scroller.",
  },
  {
    name: "Antoine L.",
    role: "Étudiant en cinéma",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    quote:
      "Free avec 15s de pub, c'est largement supportable. Et le passage Premium se fait en deux clics quand tu craques.",
  },
  {
    name: "Naïma B.",
    role: "Designer produit",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80",
    quote:
      "Enfin une plateforme qui ne sacrifie pas le design pour l'algorithme. La sensation de salle obscure, à la maison.",
  },
];

export function Testimonials() {
  return (
    <section className="relative py-24">
      <div className="absolute inset-0 -z-10 bg-radial-fade opacity-50" />
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center max-w-2xl mx-auto">
          <span className="chip">Ils en parlent</span>
          <h2 className="mt-4 font-display text-4xl md:text-5xl">
            Plus de 240 000 spectateurs déjà installés.
          </h2>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="glass rounded-2xl p-6"
            >
              <div className="flex gap-0.5 text-vibe-400">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="mt-4 text-white/85 leading-relaxed">"{t.quote}"</p>
              <div className="mt-6 flex items-center gap-3">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div>
                  <div className="text-sm font-medium">{t.name}</div>
                  <div className="text-xs text-white/50">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
