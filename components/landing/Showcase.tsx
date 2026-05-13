"use client";

import { motion } from "framer-motion";
import { titles } from "@/lib/mock-data";

export function Showcase() {
  const featured = titles.slice(0, 6);

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-vibe-700/10 to-transparent" />
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="chip">Au catalogue</span>
            <h2 className="mt-3 font-display text-4xl md:text-5xl">
              Des titres qui ont du caractère.
            </h2>
          </div>
          <p className="max-w-sm text-sm text-white/60">
            Nouveau chaque semaine. Pas de filler, pas de remake.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {featured.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="group relative aspect-[2/3] overflow-hidden rounded-xl border border-white/5"
            >
              <img
                src={t.poster}
                alt={t.title}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/20 to-transparent" />
              <div className="absolute inset-x-3 bottom-3">
                <div className="text-xs text-white/60">{t.year}</div>
                <div className="text-sm font-semibold truncate">{t.title}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
