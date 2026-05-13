"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { titles } from "@/lib/mock-data";

export function Showcase() {
  const selection = titles.slice(0, 8);

  return (
    <section className="relative overflow-hidden py-28">
      <div className="absolute inset-x-0 top-1/2 -z-10 h-[420px] -translate-y-1/2 bg-mint-soft" />
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <span className="chip">Au catalogue</span>
            <h2 className="h-display mt-4 text-balance text-4xl md:text-6xl">
              Des titres qui ont quelque chose à dire.
            </h2>
          </div>
          <p className="max-w-sm text-sm text-white/55">
            Nouveau chaque semaine. Pas de filler, pas de remplissage. Une sélection
            tenue par des éditeurs qui regardent vraiment.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-3 md:grid-cols-4">
          {selection.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.04, ease: [0.22, 0.61, 0.36, 1] }}
            >
              <Link
                href={`/watch/${t.id}`}
                className="group relative block aspect-[2/3] overflow-hidden rounded-2xl border border-white/5"
              >
                <img
                  src={t.poster}
                  alt={t.title}
                  className="h-full w-full object-cover transition-transform duration-1000 ease-exhale group-hover:scale-[1.06]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-char-950 via-char-950/10 to-transparent opacity-90" />
                <div className="absolute inset-x-4 bottom-4">
                  <div className="text-[11px] uppercase tracking-[0.16em] text-white/55">
                    {t.year} · {t.kind === "serie" ? "Série" : t.kind === "live" ? "Live" : "Film"}
                  </div>
                  <div className="mt-1 truncate text-[15px] font-medium">{t.title}</div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
