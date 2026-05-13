"use client";

import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Camille R.",
    role: "Scénariste, 26",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    quote:
      "La première plateforme qui ne me donne pas l'impression de scroller dans un supermarché. Je redécouvre le plaisir de chercher un film.",
  },
  {
    name: "Antoine L.",
    role: "Étudiant cinéma, 21",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    quote:
      "1€ par mois pour zéro pub. C'est même pas une question. Je suis passé Premium en deux clics.",
  },
  {
    name: "Naïma B.",
    role: "Designer produit, 28",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80",
    quote:
      "Enfin un site de streaming qui respecte le contenu. La sensation de salle, sans bouger du canapé.",
  },
];

export function Testimonials() {
  return (
    <section className="relative py-28">
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="chip">Ils en parlent</span>
          <h2 className="h-display mt-4 text-balance text-4xl md:text-6xl">
            240 000 spectateurs déjà installés.
          </h2>
        </div>

        <div className="mt-16 grid gap-4 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.figure
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 0.61, 0.36, 1] }}
              className="glass relative overflow-hidden rounded-3xl p-7"
            >
              <svg className="absolute right-5 top-5 h-8 w-8 text-mint-400/20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 11H5a1 1 0 01-1-1V6a1 1 0 011-1h4a1 1 0 011 1v8a4 4 0 01-4 4v-2a2 2 0 002-2v-3zm10 0h-4a1 1 0 01-1-1V6a1 1 0 011-1h4a1 1 0 011 1v8a4 4 0 01-4 4v-2a2 2 0 002-2v-3z" />
              </svg>
              <blockquote className="text-[15px] leading-relaxed text-white/85 text-pretty">
                {t.quote}
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <img src={t.avatar} alt={t.name} className="h-9 w-9 rounded-full object-cover" />
                <div>
                  <div className="text-sm font-medium">{t.name}</div>
                  <div className="text-xs text-white/45">{t.role}</div>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
