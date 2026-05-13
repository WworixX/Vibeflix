"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Play } from "lucide-react";

export function CTA() {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-24">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-vibe-500/20 via-ink-900 to-vibe-700/20 p-12 md:p-20 text-center"
      >
        <div className="absolute inset-0 -z-10 grid-bg opacity-20" />
        <div className="absolute -top-32 left-1/2 -z-10 h-64 w-[600px] -translate-x-1/2 rounded-full bg-vibe-gradient opacity-30 blur-3xl" />

        <h2 className="font-display text-4xl md:text-6xl text-balance">
          Votre prochain film préféré <br />
          attend à un clic.
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-white/70">
          Gratuit pour toujours. Premium quand vous voulez. Annulable à tout moment.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link href="/signup" className="btn-primary">
            <Play className="h-4 w-4 fill-current" />
            Créer mon compte gratuit
          </Link>
          <Link href="/browse" className="btn-ghost">
            Explorer le catalogue
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
