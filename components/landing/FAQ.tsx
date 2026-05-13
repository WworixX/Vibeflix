"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";

const faq = [
  {
    q: "VibeFlix est vraiment gratuit ?",
    a: "Oui. Le plan Free donne accès à l'intégralité du catalogue avec quelques pubs courtes (max 15s, skippable à 5s). Aucune carte bancaire à fournir.",
  },
  {
    q: "Que change le plan Premium ?",
    a: "Premium retire toutes les pubs, débloque la 4K HDR / Dolby Atmos, ajoute jusqu'à 5 profils, et permet 4 lectures simultanées avec téléchargements illimités.",
  },
  {
    q: "Combien coûte Premium exactement ?",
    a: "1 € par mois, ou 5 € par an (soit 0,42 €/mois). Sans engagement, annulable à tout moment depuis votre profil.",
  },
  {
    q: "Sur quels appareils puis-je regarder ?",
    a: "Web, iOS, Android, Apple TV, Android TV, et la plupart des Smart TV. Votre progression se synchronise instantanément entre appareils.",
  },
  {
    q: "Comment fonctionne la curation par humeur ?",
    a: "Notre équipe éditoriale tague chaque titre par ambiance : Calme, Tension, Cérébral, Lumineux, Sombre, Romance. Vous trouvez ce que vous cherchez vraiment, pas ce que l'algo veut vous montrer.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="mx-auto max-w-3xl px-6 py-28">
      <div className="text-center">
        <span className="chip">FAQ</span>
        <h2 className="h-display mt-4 text-4xl md:text-6xl">Vos questions, démêlées.</h2>
      </div>

      <div className="mt-12 divide-y divide-white/[0.06] border-y border-white/[0.06]">
        {faq.map((item, i) => {
          const isOpen = open === i;
          return (
            <div key={item.q}>
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-6 py-6 text-left"
              >
                <span className="text-[16px] font-medium text-white/90 pr-4">{item.q}</span>
                <span
                  className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border border-white/10 transition-transform duration-500 ease-exhale ${
                    isOpen ? "rotate-45 bg-mint-400/15 border-mint-400/40 text-mint-200" : "text-white/55"
                  }`}
                >
                  <Plus className="h-4 w-4" strokeWidth={1.8} />
                </span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.45, ease: [0.22, 0.61, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="pb-6 pr-12 text-sm leading-relaxed text-white/60">{item.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
