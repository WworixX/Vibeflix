"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Flame } from "lucide-react";
import { titles } from "@/lib/mock-data";

export function TrendingPreview() {
  const trending = titles.filter((t) => t.trending).slice(0, 6);

  return (
    <section className="mx-auto max-w-[1280px] px-6 pt-8 pb-20 md:pt-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="chip">
            <Flame className="h-3 w-3 text-mint-300" />
            Tendances cette semaine
          </span>
          <h2 className="h-display mt-4 text-3xl md:text-5xl">
            Ce que tout le monde regarde.
          </h2>
        </div>
        <Link
          href="/browse"
          className="group inline-flex items-center gap-1.5 text-sm text-white/65 hover:text-white"
        >
          Tout le catalogue
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-500 ease-exhale group-hover:translate-x-0.5" />
        </Link>
      </div>

      <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {trending.map((t, i) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.05, ease: [0.22, 0.61, 0.36, 1] }}
          >
            <Link
              href={`/watch/${t.id}`}
              className="group relative block aspect-[2/3] overflow-hidden rounded-2xl border border-white/[0.06]"
            >
              <img
                src={t.poster}
                alt={t.title}
                className="h-full w-full object-cover transition-transform duration-1000 ease-exhale group-hover:scale-[1.06]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-char-950 via-char-950/10 to-transparent" />
              <span className="absolute left-3 top-3 inline-flex h-6 w-6 items-center justify-center rounded-full bg-mint-gradient text-[11px] font-semibold text-char-950">
                {i + 1}
              </span>
              <div className="absolute inset-x-3.5 bottom-3.5">
                <div className="text-[10px] uppercase tracking-[0.16em] text-white/55">
                  {t.year} · {t.kind === "serie" ? "Série" : t.kind === "live" ? "Live" : "Film"}
                </div>
                <div className="mt-0.5 truncate text-[13px] font-medium">{t.title}</div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
