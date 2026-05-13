"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Play, Sparkles } from "lucide-react";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden pt-32 pb-24">
      <div className="absolute inset-0 -z-10 bg-radial-fade" />
      <div className="absolute inset-0 -z-10 grid-bg opacity-30" />
      <div className="absolute top-1/2 left-1/2 -z-10 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-vibe-gradient opacity-20 blur-[120px]" />

      <div className="mx-auto max-w-7xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex"
        >
          <span className="chip">
            <Sparkles className="h-3 w-3 text-vibe-400" />
            Nouvelle saison 2026 disponible
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05 }}
          className="mt-6 font-display text-balance text-5xl leading-[1.05] tracking-tight md:text-7xl lg:text-[88px]"
        >
          Le cinéma a une <br />
          <span className="bg-vibe-gradient bg-clip-text text-transparent">
            nouvelle ambiance.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mx-auto mt-6 max-w-2xl text-balance text-base text-white/70 md:text-lg"
        >
          Des milliers de films et séries, curatés par humeurs. Gratuit avec
          quelques pubs — ou Premium, pour le silence complet.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Link href="/signup" className="btn-primary">
            <Play className="h-4 w-4 fill-current" />
            Regarder gratuitement
          </Link>
          <Link href="/pricing" className="btn-ghost">
            Voir Premium
          </Link>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-6 text-xs text-white/40"
        >
          Aucune carte bancaire requise. Sans engagement.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="relative mt-20"
        >
          <div className="relative mx-auto max-w-5xl">
            <div className="absolute -inset-x-10 -inset-y-6 -z-10 bg-vibe-gradient opacity-30 blur-3xl" />
            <div className="overflow-hidden rounded-2xl border border-white/10 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]">
              <img
                src="https://images.unsplash.com/photo-1542204165-65bf26472b9b?auto=format&fit=crop&w=1800&q=80"
                alt="VibeFlix preview"
                className="aspect-[16/9] w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <div className="text-xs text-white/60">À l'affiche</div>
                  <div className="font-display text-3xl">Neon Horizon</div>
                </div>
                <div className="flex gap-2">
                  <span className="chip">Sci-Fi</span>
                  <span className="chip">Thriller</span>
                  <span className="chip">2025</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
