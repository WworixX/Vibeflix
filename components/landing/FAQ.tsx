"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const faq = [
  {
    q: "VibeFlix est-il vraiment gratuit ?",
    a: "Oui. Le plan Free donne accès à l'intégralité du catalogue avec quelques pubs courtes (max 15s, deux par film). Aucune carte bancaire requise.",
  },
  {
    q: "Que change le plan Premium ?",
    a: "Premium supprime toutes les pubs, débloque la 4K HDR / Dolby Atmos, ajoute jusqu'à 5 profils et permet 4 lectures simultanées, plus les téléchargements offline.",
  },
  {
    q: "Puis-je annuler à tout moment ?",
    a: "Oui, sans engagement. L'annulation prend effet à la fin du cycle de facturation en cours.",
  },
  {
    q: "Sur quels appareils puis-je regarder ?",
    a: "Web, iOS, Android, Apple TV, Android TV, et la plupart des Smart TV. Une seule connexion synchronise toute la maison.",
  },
  {
    q: "Comment fonctionne la curation par humeurs ?",
    a: "Nos rédacteurs (de vrais humains) tagguent chaque titre par ambiance — Cozy, Adrénaline, Cérébral, Romantique, Dark, Uplifting — pour vous aider à trouver ce que vous cherchez vraiment.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="mx-auto max-w-3xl px-6 py-24">
      <div className="text-center">
        <span className="chip">FAQ</span>
        <h2 className="mt-4 font-display text-4xl md:text-5xl">
          Vos questions, démêlées.
        </h2>
      </div>

      <div className="mt-10 divide-y divide-white/5 border-y border-white/5">
        {faq.map((item, i) => {
          const isOpen = open === i;
          return (
            <div key={item.q}>
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between py-5 text-left"
              >
                <span className="text-base font-medium pr-4">{item.q}</span>
                {isOpen ? (
                  <Minus className="h-5 w-5 shrink-0 text-vibe-400" />
                ) : (
                  <Plus className="h-5 w-5 shrink-0 text-white/40" />
                )}
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <p className="pb-5 text-sm text-white/65 leading-relaxed">
                      {item.a}
                    </p>
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
