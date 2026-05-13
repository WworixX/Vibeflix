"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Play } from "lucide-react";

export function CTA() {
  return (
    <section className="mx-auto max-w-[1280px] px-6 pb-32">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.22, 0.61, 0.36, 1] }}
        className="relative overflow-hidden rounded-[36px] border border-white/8 bg-char-900 p-14 text-center md:p-24"
      >
        <div className="absolute inset-0 -z-10 bg-mesh opacity-90" />
        <div className="absolute -top-40 left-1/2 -z-10 h-80 w-[800px] -translate-x-1/2 rounded-full bg-mint-500/25 blur-[120px]" />

        <h2 className="h-display mx-auto max-w-3xl text-balance text-4xl md:text-7xl">
          Votre prochain film favori{" "}
          <span className="italic text-mint-300/90" style={{ fontVariationSettings: "'SOFT' 80" }}>
            attend à un clic.
          </span>
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-white/65">
          Gratuit, pour toujours. Premium quand vous voulez — 1 €/mois, annulable à tout instant.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link href="/signup" className="btn-primary">
            <Play className="h-4 w-4 fill-current" />
            Créer mon compte
          </Link>
          <Link href="/browse" className="btn-ghost">
            Explorer le catalogue
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
