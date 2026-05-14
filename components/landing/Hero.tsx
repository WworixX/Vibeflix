"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Info, Sparkles } from "lucide-react";
import { titles } from "@/lib/mock-data";

const FEATURED_IDS = [
  "dune-part-two",
  "stranger-things",
  "the-last-of-us",
  "oppenheimer",
  "house-of-the-dragon",
];

const ROTATION_MS = 5500;

export function Hero() {
  const slides = FEATURED_IDS
    .map((id) => titles.find((t) => t.id === id))
    .filter(Boolean) as typeof titles;

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const featured = slides[index];

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, ROTATION_MS);
    return () => clearInterval(id);
  }, [paused, slides.length]);

  return (
    <section
      className="relative h-[100svh] min-h-[640px] w-full overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <AnimatePresence mode="sync">
        <motion.img
          key={featured.id}
          initial={{ opacity: 0, scale: 1.1, x: 80 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 1.04, x: -60 }}
          transition={{ duration: 1.4, ease: [0.22, 0.61, 0.36, 1] }}
          src={featured.backdrop}
          alt={featured.title}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-r from-char-950 via-char-950/55 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-char-950 via-char-950/20 to-char-950/70" />

      <div className="relative mx-auto flex h-full max-w-[1280px] flex-col justify-end px-6 pb-28 md:pb-32">
        <AnimatePresence mode="wait">
          <motion.div
            key={featured.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.9, ease: [0.22, 0.61, 0.36, 1] }}
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

            <h1 className="h-display mt-6 text-balance text-[56px] leading-[0.92] md:text-[104px] lg:text-[112px]">
              {featured.title}
            </h1>

            <div className="mt-5 flex flex-wrap items-center gap-2 text-[12px] uppercase tracking-[0.16em] text-white/55">
              <span>{featured.year}</span>
              <span>·</span>
              <span>{featured.rating}</span>
              <span>·</span>
              <span>{featured.genres.join(" · ")}</span>
            </div>

            <p className="mt-5 max-w-xl text-pretty text-[16px] leading-relaxed text-white/80 md:text-[17px] line-clamp-3">
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
        </AnimatePresence>

        <div className="mt-10 flex items-center gap-2.5">
          {slides.map((s, i) => {
            const active = i === index;
            return (
              <button
                key={s.id}
                onClick={() => setIndex(i)}
                aria-label={`Voir ${s.title}`}
                className={`relative h-1 overflow-hidden rounded-full transition-all duration-500 ease-exhale ${
                  active ? "w-12 bg-white/15" : "w-6 bg-white/15 hover:bg-white/25"
                }`}
              >
                {active && !paused && (
                  <motion.span
                    key={`${s.id}-${index}`}
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: ROTATION_MS / 1000, ease: "linear" }}
                    className="absolute inset-y-0 left-0 bg-mint-gradient"
                  />
                )}
                {active && paused && (
                  <span className="absolute inset-0 bg-mint-gradient" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.4, ease: [0.22, 0.61, 0.36, 1] }}
        className="absolute right-6 bottom-32 hidden lg:block"
      >
        <NextUp slides={slides} currentIndex={index} onPick={setIndex} />
      </motion.div>
    </section>
  );
}

function NextUp({
  slides,
  currentIndex,
  onPick,
}: {
  slides: typeof titles;
  currentIndex: number;
  onPick: (i: number) => void;
}) {
  const peeks = slides
    .map((s, i) => ({ ...s, idx: i }))
    .filter((s) => s.idx !== currentIndex)
    .slice(0, 3);

  return (
    <div className="flex items-end gap-3">
      <div className="text-right">
        <div className="text-[10px] uppercase tracking-[0.16em] text-white/45">Ensuite</div>
        <div className="mt-1 text-sm text-white/85">À ne pas manquer</div>
      </div>
      <div className="flex -space-x-3">
        {peeks.map((t, i) => (
          <button
            key={t.id}
            onClick={() => onPick(t.idx)}
            className="group relative block aspect-[2/3] w-[72px] overflow-hidden rounded-xl border border-white/15 shadow-[0_15px_30px_-10px_rgba(0,0,0,0.7)] transition-all duration-500 ease-exhale hover:z-10 hover:scale-105"
            style={{ zIndex: peeks.length - i }}
            aria-label={`Mettre ${t.title} à l'affiche`}
          >
            <img src={t.poster} alt={t.title} className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
