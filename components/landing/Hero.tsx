"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Play, Info, Sparkles } from "lucide-react";
import { titles } from "@/lib/mock-data";

export function Hero() {
  const featured = titles.find((t) => t.featured) ?? titles[0];

  return (
    <section className="relative h-[100svh] min-h-[640px] w-full overflow-hidden">
      <motion.img
        key={featured.id}
        initial={{ scale: 1.12, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 2.2, ease: [0.22, 0.61, 0.36, 1] }}
        src={featured.backdrop}
        alt={featured.title}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-char-950 via-char-950/55 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-char-950 via-char-950/20 to-char-950/70" />

      <div className="relative mx-auto flex h-full max-w-[1280px] flex-col justify-end px-6 pb-24 md:pb-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.22, 0.61, 0.36, 1] }}
          className="max-w-2xl"
        >
          <div className="flex flex-wrap items-center gap-3">
            <span className="chip-mint">
              <span className="relative grid h-1.5 w-1.5 place-items-center">
                <span className="absolute h-1.5 w-1.5 animate-ping rounded-full bg-mint-400/70" />
                <span className="relative h-1.5 w-1.5 rounded-full bg-mint-400" />
              </span>
              À l'affiche
            </span>
            <span className="chip">
              <Sparkles className="h-3 w-3 text-mint-300" /> Sans pub dès 1 €/mois
            </span>
          </div>

          <h1 className="h-display mt-6 text-balance text-[56px] leading-[0.92] md:text-[112px]">
            {featured.title}
          </h1>

          <div className="mt-5 flex flex-wrap items-center gap-2 text-[12px] uppercase tracking-[0.16em] text-white/55">
            <span>{featured.year}</span>
            <span>·</span>
            <span>{featured.rating}</span>
            <span>·</span>
            <span>{featured.genres.join(" · ")}</span>
          </div>

          <p className="mt-5 max-w-xl text-pretty text-[16px] leading-relaxed text-white/80 md:text-[17px]">
            {featured.synopsis}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={`/watch/${featured.id}`} className="btn-primary">
              <Play className="h-4 w-4 fill-current" />
              Regarder maintenant
            </Link>
            <Link href={`/watch/${featured.id}`} className="btn-ghost">
              <Info className="h-4 w-4" />
              Plus d'infos
            </Link>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.6, ease: [0.22, 0.61, 0.36, 1] }}
        className="absolute right-6 bottom-24 hidden lg:block"
      >
        <ThumbnailPreview />
      </motion.div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="grid h-9 w-6 place-items-start rounded-full border border-white/20 pt-2"
        >
          <span className="h-1.5 w-px rounded-full bg-white/60" />
        </motion.div>
      </div>
    </section>
  );
}

function ThumbnailPreview() {
  const peeks = [
    titles.find((t) => t.id === "stranger-things"),
    titles.find((t) => t.id === "the-last-of-us"),
    titles.find((t) => t.id === "wednesday"),
  ].filter(Boolean) as typeof titles;

  return (
    <div className="flex items-end gap-3">
      <div className="text-right">
        <div className="text-[10px] uppercase tracking-[0.16em] text-white/45">Ensuite</div>
        <div className="mt-1 text-sm text-white/85">À ne pas manquer</div>
      </div>
      <div className="flex -space-x-3">
        {peeks.map((t, i) => (
          <Link
            key={t.id}
            href={`/watch/${t.id}`}
            className="group relative block aspect-[2/3] w-[72px] overflow-hidden rounded-xl border border-white/15 shadow-[0_15px_30px_-10px_rgba(0,0,0,0.7)] transition-all duration-500 ease-exhale hover:scale-105 hover:z-10"
            style={{ zIndex: peeks.length - i }}
          >
            <img src={t.poster} alt={t.title} className="h-full w-full object-cover" />
          </Link>
        ))}
      </div>
    </div>
  );
}
