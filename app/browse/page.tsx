"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Play, Info, Radio } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MovieRow } from "@/components/MovieRow";
import { rows, titles, liveNow } from "@/lib/mock-data";

export default function BrowsePage() {
  const featured = titles.find((t) => t.featured) ?? titles[0];

  return (
    <>
      <Navbar />
      <main className="pb-32">
        <section className="relative h-[92vh] min-h-[600px] w-full overflow-hidden">
          <motion.img
            initial={{ scale: 1.08, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 2, ease: [0.22, 0.61, 0.36, 1] }}
            src={featured.backdrop}
            alt={featured.title}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-char-950 via-char-950/55 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-char-950 via-transparent to-char-950/60" />

          <div className="relative mx-auto flex h-full max-w-[1280px] flex-col justify-end px-6 pb-28">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.22, 0.61, 0.36, 1] }}
              className="max-w-2xl"
            >
              <span className="chip-mint">À l'affiche</span>
              <h1 className="h-display mt-5 text-balance text-5xl md:text-8xl">
                {featured.title}
              </h1>
              <div className="mt-4 flex flex-wrap items-center gap-2 text-[12px] uppercase tracking-[0.16em] text-white/55">
                <span>{featured.year}</span>
                <span>·</span>
                <span>{featured.rating}</span>
                <span>·</span>
                <span>{featured.genres.join(" · ")}</span>
              </div>
              <p className="mt-5 max-w-xl text-pretty text-[15px] leading-relaxed text-white/75">
                {featured.synopsis}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href={`/watch/${featured.id}`} className="btn-primary">
                  <Play className="h-4 w-4 fill-current" />
                  Regarder
                </Link>
                <Link href={`/watch/${featured.id}`} className="btn-ghost">
                  <Info className="h-4 w-4" />
                  Détails
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        <div className="relative -mt-20 z-10">
          {liveNow.length > 0 && (
            <section className="mt-2">
              <div className="mx-auto flex max-w-[1280px] items-center gap-3 px-6">
                <span className="grid h-2 w-2 place-items-center">
                  <span className="absolute h-2 w-2 animate-ping rounded-full bg-rose-400/70" />
                  <span className="relative h-2 w-2 rounded-full bg-rose-400" />
                </span>
                <h2 className="text-[20px] font-medium tracking-tight md:text-2xl">
                  En direct maintenant
                </h2>
                <Link href="/live" className="ml-auto inline-flex items-center gap-1.5 text-sm text-white/55 hover:text-white">
                  <Radio className="h-3.5 w-3.5" /> Voir tout
                </Link>
              </div>
              <div className="mx-auto mt-5 grid max-w-[1280px] gap-3 px-6 md:grid-cols-2">
                {liveNow.map((t) => (
                  <Link
                    key={t.id}
                    href={`/watch/${t.id}`}
                    className="group relative aspect-[16/8] overflow-hidden rounded-2xl border border-white/[0.06]"
                  >
                    <img src={t.backdrop} alt={t.title} className="h-full w-full object-cover transition-transform duration-1000 ease-exhale group-hover:scale-[1.04]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-char-950 via-char-950/20 to-transparent" />
                    <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-rose-500/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white">
                      <span className="grid h-1.5 w-1.5 place-items-center">
                        <span className="absolute h-1.5 w-1.5 animate-ping rounded-full bg-white/70" />
                        <span className="relative h-1.5 w-1.5 rounded-full bg-white" />
                      </span>
                      Live
                    </div>
                    <div className="absolute inset-x-5 bottom-5">
                      <div className="text-[11px] uppercase tracking-[0.16em] text-white/55">{t.genres.join(" · ")}</div>
                      <div className="mt-1 text-lg font-medium">{t.title}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {rows.map((r) => (
            <MovieRow key={r.name} name={r.name} items={titles.filter(r.filter)} />
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
