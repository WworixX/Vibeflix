"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Play, Info } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MovieRow } from "@/components/MovieRow";
import { rows, titles } from "@/lib/mock-data";

export default function BrowsePage() {
  const featured = titles.find((t) => t.featured) ?? titles[0];

  return (
    <>
      <Navbar />
      <main className="pb-24">
        <section className="relative h-[85vh] min-h-[560px] w-full overflow-hidden">
          <img
            src={featured.backdrop}
            alt={featured.title}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-transparent to-transparent" />

          <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-end px-6 pb-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl"
            >
              <span className="chip">À l'affiche</span>
              <h1 className="mt-4 font-display text-5xl md:text-7xl text-balance">
                {featured.title}
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-white/70">
                <span>{featured.year}</span>
                <span>•</span>
                <span>{featured.rating}</span>
                <span>•</span>
                <span>{featured.genres.join(", ")}</span>
              </div>
              <p className="mt-4 max-w-xl text-white/80">{featured.synopsis}</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href={`/watch/${featured.id}`} className="btn-primary">
                  <Play className="h-4 w-4 fill-current" />
                  Regarder
                </Link>
                <Link href={`/watch/${featured.id}`} className="btn-ghost">
                  <Info className="h-4 w-4" />
                  Plus d'infos
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        <div className="-mt-16 relative z-10">
          {rows.map((r) => (
            <MovieRow
              key={r.name}
              name={r.name}
              items={titles.filter(r.filter)}
            />
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
