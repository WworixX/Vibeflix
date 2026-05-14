"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Play, Pause, Volume2, VolumeX, Maximize, SkipForward, X, Sparkles, Loader2, AlertTriangle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Title } from "@/lib/mock-data";
import { SAMPLE_VIDEO_URL, buildEmbedUrl } from "@/lib/mock-data";
import { useStore } from "@/lib/store";

const AD_DURATION = 15;
const AD_SKIPPABLE_AT = 5;

export function VideoPlayer({ title }: { title: Title }) {
  const isPremium = useStore((s) => s.isPremium);
  const embedUrl = buildEmbedUrl(title);
  const useExternal = !!embedUrl;

  const [showAd, setShowAd] = useState(!isPremium);
  const [adRemaining, setAdRemaining] = useState(AD_DURATION);
  const wrapperRef = useRef<HTMLDivElement>(null);

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

  const enterFs = () => wrapperRef.current?.requestFullscreen?.();

  return (
    <div
      ref={wrapperRef}
      className="group relative aspect-video w-full overflow-hidden rounded-3xl border border-white/[0.06] bg-black"
    >
      {useExternal ? (
        <ExternalPlayer embedUrl={embedUrl!} hidden={showAd} title={title.title} />
      ) : (
        <NativePlayer title={title} hidden={showAd} />
      )}

      <AnimatePresence>
        {showAd && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 0.61, 0.36, 1] }}
            className="absolute inset-0 z-30 grid place-items-center bg-black/85 backdrop-blur"
          >
            <div className="max-w-md px-6 text-center">
              <span className="chip">Publicité</span>
              <h3 className="h-display mt-5 text-3xl md:text-4xl">
                Découvrez{" "}
                <span className="text-mint-300">
                  Aurora Pods.
                </span>
              </h3>
              <p className="mt-2 text-sm text-white/55">
                Le son que vos films méritent. −20% avec le code VIBE.
              </p>

              <div className="mt-8 flex items-center justify-center gap-3">
                {adRemaining > AD_DURATION - AD_SKIPPABLE_AT ? (
                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/70">
                    Skip dans {adRemaining - (AD_DURATION - AD_SKIPPABLE_AT)}s
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
                  <Sparkles className="h-4 w-4" />
                  Supprimer les pubs
                </Link>
              </div>

              <div className="mt-6 text-xs text-white/40">Reprise dans {adRemaining}s</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute left-5 top-5 z-20">
        <Link
          href="/browse"
          className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-black/40 text-white backdrop-blur transition hover:bg-black/60"
          aria-label="Fermer"
        >
          <X className="h-4 w-4" />
        </Link>
      </div>

      {useExternal && !showAd && (
        <div className="absolute right-5 top-5 z-20 flex items-center gap-2">
          <button
            onClick={enterFs}
            className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-black/40 text-white backdrop-blur transition hover:bg-black/60"
            aria-label="Plein écran"
          >
            <Maximize className="h-4 w-4" />
          </button>
        </div>
      )}

      {useExternal && !showAd && (
        <div className="pointer-events-none absolute bottom-4 left-1/2 z-20 -translate-x-1/2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/20 bg-black/50 px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-amber-200/80 backdrop-blur">
            <AlertTriangle className="h-3 w-3" />
            Lecteur externe
          </span>
        </div>
      )}
    </div>
  );
}

function ExternalPlayer({
  embedUrl,
  hidden,
  title,
}: {
  embedUrl: string;
  hidden: boolean;
  title: string;
}) {
  const [loaded, setLoaded] = useState(false);
  return (
    <>
      {!loaded && (
        <div className="absolute inset-0 z-10 grid place-items-center bg-black">
          <Loader2 className="h-8 w-8 animate-spin text-white/70" />
        </div>
      )}
      <iframe
        src={embedUrl}
        title={title}
        allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
        allowFullScreen
        referrerPolicy="origin"
        onLoad={() => setLoaded(true)}
        className={`absolute inset-0 h-full w-full transition-opacity duration-700 ${
          hidden ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      />
    </>
  );
}

function NativePlayer({ title, hidden }: { title: Title; hidden: boolean }) {
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffering, setBuffering] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (hidden) return;
    const v = videoRef.current;
    if (!v) return;
    v.play().then(() => setPlaying(true)).catch(() => {});
  }, [hidden]);

  const onTime = () => {
    const v = videoRef.current;
    if (!v) return;
    setProgress((v.currentTime / (v.duration || 1)) * 100);
    setDuration(v.duration);
  };

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const v = videoRef.current;
    if (!v) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    v.currentTime = pct * v.duration;
  };

  const fmt = (s: number) => {
    if (!s || !isFinite(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <>
      <video
        ref={videoRef}
        src={SAMPLE_VIDEO_URL}
        poster={title.backdrop}
        muted
        playsInline
        onTimeUpdate={onTime}
        onLoadedMetadata={onTime}
        onWaiting={() => setBuffering(true)}
        onPlaying={() => setBuffering(false)}
        onCanPlay={() => setBuffering(false)}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />

      {buffering && !hidden && (
        <div className="absolute inset-0 z-10 grid place-items-center">
          <Loader2 className="h-8 w-8 animate-spin text-white/70" />
        </div>
      )}

      <div className="absolute inset-x-0 bottom-0 z-20 p-5 md:p-7">
        <div className="mb-3 text-lg font-display tracking-tight md:text-2xl">
          {title.title}
        </div>

        <div
          onClick={seek}
          className="group/seek relative h-1 w-full cursor-pointer overflow-hidden rounded-full bg-white/15"
        >
          <div className="absolute inset-y-0 left-0 bg-mint-gradient" style={{ width: `${progress}%` }} />
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={togglePlay}
              className="grid h-11 w-11 place-items-center rounded-full bg-white text-char-950 transition hover:scale-[1.04]"
            >
              {playing ? <Pause className="h-5 w-5 fill-current" /> : <Play className="h-5 w-5 fill-current" />}
            </button>
            <button
              onClick={toggleMute}
              className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/15"
            >
              {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>
            <span className="text-xs text-white/65 tabular-nums">
              {fmt((progress / 100) * duration)} / {fmt(duration)}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
