"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Play, ArrowRight } from "lucide-react";
import { titles } from "@/lib/mock-data";
import { AtmosphereBg } from "../AtmosphereBg";

export function Hero() {
  const stack = [
    titles.find((t) => t.id === "dune-part-two"),
    titles.find((t) => t.id === "stranger-things"),
    titles.find((t) => t.id === "the-last-of-us"),
    titles.find((t) => t.id === "oppenheimer"),
  ].filter(Boolean) as typeof titles;

  return (
    <section className="relative isolate overflow-hidden pt-32 pb-16 md:pt-40 md:pb-24">
      <AtmosphereBg />

      <div className="mx-auto grid max-w-[1280px] items-center gap-14 px-6 lg:grid-cols-[1.05fr_1fr]">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 0.61, 0.36, 1] }}
          className="text-center lg:text-left"
        >
          <span className="chip-mint">
            <span className="relative grid h-1.5 w-1.5 place-items-center">
              <span className="absolute inset-0 animate-ping rounded-full bg-mint-400/60" />
              <span className="relative h-1.5 w-1.5 rounded-full bg-mint-400" />
            </span>
            Films, séries & live — sans pub dès 1€
          </span>
          <h1 className="h-display mt-7 text-balance text-[52px] leading-[0.95] md:text-[80px] lg:text-[96px]">
            Tout ce qu'il faut voir.
            <br />
            <span className="italic text-mint-300" style={{ fontVariationSettings: "'SOFT' 80" }}>
              Sans le superflu.
            </span>
          </h1>
          <p className="mx-auto mt-7 max-w-xl text-pretty text-[17px] leading-relaxed text-white/65 lg:mx-0">
            Dune, Stranger Things, The Last of Us, Oppenheimer… plus de 2 000 films,
            séries et lives. Gratuit avec quelques pubs, ou Premium à 1 € par mois.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
            <Link href="/signup" className="btn-primary">
              <Play className="h-4 w-4 fill-current" />
              Regarder gratuitement
            </Link>
            <Link href="/browse" className="btn-ghost group">
              Voir le catalogue
              <ArrowRight className="h-4 w-4 transition-transform duration-500 ease-exhale group-hover:translate-x-0.5" />
            </Link>
          </div>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs text-white/45 lg:justify-start">
            <span>✓ Aucune carte requise</span>
            <span>✓ Sans engagement</span>
            <span>✓ Sur tous vos écrans</span>
          </div>
        </motion.div>

        <PosterStack stack={stack} />
      </div>

      <Marquee />
    </section>
  );
}

function PosterStack({ stack }: { stack: typeof titles }) {
  const rotations = [-6, 3, -2, 5];
  const offsets = ["translate-y-6", "-translate-y-4", "translate-y-2", "-translate-y-8"];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, delay: 0.15, ease: [0.22, 0.61, 0.36, 1] }}
      className="relative mx-auto hidden h-[520px] w-full max-w-[560px] items-center justify-center lg:flex"
    >
      <div className="absolute inset-0 -z-10 rounded-full bg-mint-soft blur-3xl" />
      <div className="grid grid-cols-4 gap-3">
        {stack.map((t, i) => (
          <motion.div
            key={t.id}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.25 + i * 0.08, ease: [0.22, 0.61, 0.36, 1] }}
            whileHover={{ y: -8, rotate: 0, scale: 1.04 }}
            className={`relative ${offsets[i]}`}
            style={{ transform: `rotate(${rotations[i]}deg)` }}
          >
            <Link
              href={`/watch/${t.id}`}
              className="block overflow-hidden rounded-2xl border border-white/10 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)]"
            >
              <img
                src={t.poster}
                alt={t.title}
                className="aspect-[2/3] w-full object-cover"
              />
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function Marquee() {
  const row = [...titles, ...titles];
  return (
    <div className="relative mt-20 lg:mt-24">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-char-900 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-char-900 to-transparent" />
      <div className="overflow-hidden">
        <div className="flex w-max gap-3 animate-marquee">
          {row.map((t, i) => (
            <Link
              key={`${t.id}-${i}`}
              href={`/watch/${t.id}`}
              className="group relative block aspect-[2/3] w-[140px] shrink-0 overflow-hidden rounded-xl border border-white/[0.06]"
            >
              <img
                src={t.poster}
                alt={t.title}
                className="h-full w-full object-cover transition-transform duration-1000 ease-exhale group-hover:scale-[1.06]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-char-950 via-transparent to-transparent opacity-60" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
