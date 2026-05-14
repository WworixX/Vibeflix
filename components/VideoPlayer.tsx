"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Play, Pause, Volume2, VolumeX, Maximize, X, Loader2, RefreshCw } from "lucide-react";
import type { Title } from "@/lib/mock-data";
import { SAMPLE_VIDEO_URL } from "@/lib/mock-data";
import { PROVIDERS, buildProviderUrl } from "@/lib/providers";
import { cn } from "@/lib/utils";

export function VideoPlayer({ title }: { title: Title }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const hasTmdb = !!title.tmdbId && (title.kind === "film" || title.kind === "serie");

  const enterFs = () => wrapperRef.current?.requestFullscreen?.();

  return (
    <div
      ref={wrapperRef}
      className="group relative aspect-video w-full overflow-hidden rounded-3xl border border-white/[0.06] bg-black"
    >
      {hasTmdb ? (
        <ExternalPlayer title={title} onFullscreen={enterFs} />
      ) : (
        <NativePlayer title={title} />
      )}

      <div className="absolute left-5 top-5 z-30">
        <Link
          href="/browse"
          className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-black/40 text-white backdrop-blur transition hover:bg-black/60"
          aria-label="Fermer"
        >
          <X className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

function ExternalPlayer({ title, onFullscreen }: { title: Title; onFullscreen: () => void }) {
  const [providerIdx, setProviderIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);

  const provider = PROVIDERS[providerIdx];
  const url = buildProviderUrl(provider, title);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 3500);
    return () => clearTimeout(t);
  }, [providerIdx, reloadKey]);

  if (!url) return null;

  return (
    <>
      <iframe
        key={`${provider.id}-${reloadKey}`}
        src={url}
        title={`${title.title} — ${provider.name}`}
        allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
        allowFullScreen
        referrerPolicy="origin"
        onLoad={() => setLoading(false)}
        className="absolute inset-0 h-full w-full"
      />

      {loading && (
        <div className="pointer-events-none absolute inset-0 z-10 grid place-items-center bg-black/60 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-7 w-7 animate-spin text-white/70" />
            <span className="text-xs text-white/55">
              Chargement via {provider.name}…
            </span>
          </div>
        </div>
      )}

      <div className="absolute right-5 top-5 z-30 flex items-center gap-2">
        <button
          onClick={() => setReloadKey((k) => k + 1)}
          className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-black/40 text-white backdrop-blur transition hover:bg-black/60"
          aria-label="Recharger"
          title="Recharger la source"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
        <button
          onClick={onFullscreen}
          className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-black/40 text-white backdrop-blur transition hover:bg-black/60"
          aria-label="Plein écran"
        >
          <Maximize className="h-4 w-4" />
        </button>
      </div>

      <div className="absolute bottom-4 left-1/2 z-30 -translate-x-1/2">
        <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-black/55 p-1 backdrop-blur">
          <span className="hidden px-2 text-[10px] uppercase tracking-[0.16em] text-white/45 sm:inline">
            Source
          </span>
          {PROVIDERS.map((p, i) => (
            <button
              key={p.id}
              onClick={() => setProviderIdx(i)}
              className={cn(
                "rounded-full px-3 py-1 text-[11px] font-medium transition",
                i === providerIdx
                  ? "bg-mint-gradient text-char-950"
                  : "text-white/70 hover:bg-white/[0.08] hover:text-white"
              )}
              title={`Charger via ${p.name}`}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

function NativePlayer({ title }: { title: Title }) {
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffering, setBuffering] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.play().then(() => setPlaying(true)).catch(() => {});
  }, []);

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

      {buffering && (
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
