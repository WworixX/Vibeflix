"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Play, ArrowRight } from "lucide-react";
import { titles } from "@/lib/mock-data";
import { AtmosphereBg } from "../AtmosphereBg";

export function Hero() {
  const featured = titles.find((t) => t.featured) ?? titles[0];

  return (
    <section className="relative isolate overflow-hidden pt-36 pb-20 md:pt-44 md:pb-32">
      <AtmosphereBg />

      <div className="mx-auto max-w-[1280px] px-6">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 0.61, 0.36, 1] }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="chip-mint">
            <span className="relative grid h-1.5 w-1.5 place-items-center">
              <span className="absolute inset-0 animate-ping rounded-full bg-mint-400/60" />
              <span className="relative h-1.5 w-1.5 rounded-full bg-mint-400" />
            </span>
            Saison 2026 — nouvelle vague
          </span>
          <h1 className="h-display mt-7 text-balance text-[56px] md:text-[88px] lg:text-[112px]">
            Le streaming,
            <br />
            <span className="italic text-mint-300" style={{ fontVariationSettings: "'SOFT' 80" }}>
              en plus beau.
            </span>
          </h1>
          <p className="mx-auto mt-7 max-w-xl text-pretty text-[17px] leading-relaxed text-white/65">
            Films, séries et lives — curatés avec goût. Gratuit avec quelques pubs
            courtes, ou Premium à 1 € par mois pour le silence complet.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/signup" className="btn-primary">
              <Play className="h-4 w-4 fill-current" />
              Commencer gratuitement
            </Link>
            <Link href="/pricing" className="btn-ghost group">
              Voir Premium
              <ArrowRight className="h-4 w-4 transition-transform duration-500 ease-exhale group-hover:translate-x-0.5" />
            </Link>
          </div>
          <p className="mt-5 text-xs text-white/40">Aucune carte requise.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.22, 0.61, 0.36, 1] }}
          className="relative mx-auto mt-24 max-w-5xl"
        >
          <div className="absolute -inset-12 -z-10 rounded-[40px] bg-mint-soft blur-2xl" />
          <Link
            href={`/watch/${featured.id}`}
            className="group relative block overflow-hidden rounded-[28px] border border-white/8 shadow-[0_50px_120px_-30px_rgba(0,0,0,0.7)]"
          >
            <img
              src={featured.backdrop}
              alt={featured.title}
              className="aspect-[16/9] w-full object-cover transition-transform duration-1000 ease-exhale group-hover:scale-[1.03]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-char-950 via-char-950/30 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-char-950/60 via-transparent to-transparent" />

            <div className="absolute bottom-7 left-7 right-7 flex flex-wrap items-end justify-between gap-5">
              <div className="max-w-md">
                <span className="chip-mint">À l'affiche</span>
                <h3 className="h-display mt-3 text-3xl md:text-5xl">{featured.title}</h3>
                <p className="mt-2 text-sm text-white/70 line-clamp-2">{featured.synopsis}</p>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur px-4 py-2 text-xs text-white/85 transition group-hover:bg-white/15">
                <Play className="h-3.5 w-3.5 fill-current" />
                Lecture
              </span>
            </div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
