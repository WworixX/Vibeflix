"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Play, Pause, Volume2, VolumeX, Maximize, SkipForward, X, Crown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Title } from "@/lib/mock-data";
import { useStore } from "@/lib/store";

const AD_DURATION = 15;
const AD_SKIPPABLE_AT = 5;

export function VideoPlayer({ title }: { title: Title }) {
  const isPremium = useStore((s) => s.isPremium);
  const [showAd, setShowAd] = useState(!isPremium);
  const [adRemaining, setAdRemaining] = useState(AD_DURATION);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(8);
  const playerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showAd) return;
    const id = setInterval(() => {
      setAdRemaining((r) => {
        if (r <= 1) {
          clearInterval(id);
          setShowAd(false);
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [showAd]);

  useEffect(() => {
    if (showAd || !playing) return;
    const id = setInterval(() => {
      setProgress((p) => Math.min(100, p + 0.4));
    }, 1000);
    return () => clearInterval(id);
  }, [showAd, playing]);

  const enterFullscreen = () => {
    playerRef.current?.requestFullscreen?.();
  };

  return (
    <div
      ref={playerRef}
      className="relative aspect-video w-full overflow-hidden rounded-2xl border border-white/5 bg-black"
    >
      <img
        src={title.backdrop}
        alt={title.title}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/60" />

      <AnimatePresence>
        {showAd && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-30 grid place-items-center bg-black/85 backdrop-blur"
          >
            <div className="text-center max-w-md px-6">
              <span className="chip">Publicité</span>
              <h3 className="mt-4 font-display text-3xl md:text-4xl">
                Découvrez Aurora Pods.
              </h3>
              <p className="mt-2 text-white/60 text-sm">
                Le son que vos films méritent. -20% avec le code VIBE.
              </p>

              <div className="mt-8 flex items-center justify-center gap-3">
                {adRemaining > AD_DURATION - AD_SKIPPABLE_AT ? (
                  <span className="rounded-full bg-white/10 px-4 py-2 text-sm text-white/70">
                    Passable dans {adRemaining - (AD_DURATION - AD_SKIPPABLE_AT)}s
                  </span>
                ) : (
                  <button
                    onClick={() => {
                      setShowAd(false);
                      setAdRemaining(0);
                    }}
                    className="btn-ghost"
                  >
                    Passer la pub
                    <SkipForward className="h-4 w-4" />
                  </button>
                )}
                <Link href="/pricing" className="btn-primary">
                  <Crown className="h-4 w-4" />
                  Supprimer les pubs
                </Link>
              </div>

              <div className="mt-6 text-xs text-white/40">
                Reprise du film dans {adRemaining}s
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute top-4 left-4 z-20">
        <Link
          href="/browse"
          className="grid h-10 w-10 place-items-center rounded-full bg-black/40 backdrop-blur text-white hover:bg-black/60"
        >
          <X className="h-5 w-5" />
        </Link>
      </div>

      <div className="absolute bottom-0 inset-x-0 z-20 p-6">
        <div className="mb-3 font-display text-2xl md:text-3xl">{title.title}</div>

        <div className="relative h-1 w-full overflow-hidden rounded-full bg-white/15">
          <div
            className="absolute inset-y-0 left-0 bg-vibe-gradient"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setPlaying((p) => !p)}
              className="grid h-11 w-11 place-items-center rounded-full bg-white text-ink-950"
            >
              {playing ? (
                <Pause className="h-5 w-5 fill-current" />
              ) : (
                <Play className="h-5 w-5 fill-current" />
              )}
            </button>
            <button
              onClick={() => setMuted((m) => !m)}
              className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
            >
              {muted ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </button>
            <span className="text-sm text-white/70">
              {Math.round((progress / 100) * title.runtime)}m / {title.runtime}m
            </span>
          </div>

          <button
            onClick={enterFullscreen}
            className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <Maximize className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
