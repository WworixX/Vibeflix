"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { liveNow } from "@/lib/mock-data";

export default function LivePage() {
  return (
    <>
      <Navbar />
      <main className="pt-36 pb-32">
        <div className="mx-auto max-w-[1280px] px-6">
          <div className="flex items-center gap-3">
            <span className="relative grid h-2 w-2 place-items-center">
              <span className="absolute h-2 w-2 animate-ping rounded-full bg-rose-400/70" />
              <span className="relative h-2 w-2 rounded-full bg-rose-400" />
            </span>
            <span className="chip">En direct</span>
          </div>
          <h1 className="h-display mt-5 text-5xl md:text-7xl">
            Ce qui passe{" "}
            <span className="text-mint-300/90">
              maintenant.
            </span>
          </h1>
          <p className="mt-4 max-w-xl text-white/55">
            Sport, musique, événements. Diffusés en direct, sans qualité dégradée.
          </p>

          <div className="mt-14 grid gap-4 md:grid-cols-2">
            {liveNow.map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: i * 0.08, ease: [0.22, 0.61, 0.36, 1] }}
              >
                <Link
                  href={`/watch/${t.id}`}
                  className="group relative block aspect-[16/9] overflow-hidden rounded-3xl border border-white/[0.06]"
                >
                  <img src={t.backdrop} alt={t.title} className="h-full w-full object-cover transition-transform duration-1000 ease-exhale group-hover:scale-[1.04]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-char-950 via-char-950/30 to-transparent" />
                  <div className="absolute left-5 top-5 inline-flex items-center gap-1.5 rounded-full bg-rose-500/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white">
                    Live
                  </div>
                  <div className="absolute inset-x-6 bottom-6">
                    <div className="text-[11px] uppercase tracking-[0.16em] text-white/55">
                      {t.genres.join(" · ")}
                    </div>
                    <div className="mt-2 font-display text-2xl md:text-3xl">{t.title}</div>
                    <p className="mt-2 text-sm text-white/65">{t.synopsis}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
