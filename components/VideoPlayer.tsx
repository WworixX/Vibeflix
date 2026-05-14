"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Play, Pause, Volume2, VolumeX, Maximize, X, Loader2, RefreshCw, ChevronDown } from "lucide-react";
import type { Title } from "@/lib/mock-data";
import { SAMPLE_VIDEO_URL } from "@/lib/mock-data";
import { PROVIDERS, LANG_ORDER, buildProviderUrl, type Lang, type Provider } from "@/lib/providers";
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
  const langs = useMemo(() => {
    const present = new Set(PROVIDERS.map((p) => p.lang));
    return LANG_ORDER.filter((l) => present.has(l));
  }, []);

  const [lang, setLang] = useState<Lang>(langs[0] ?? "MULTI");
  const providersForLang = useMemo(
    () => PROVIDERS.filter((p) => p.lang === lang),
    [lang]
  );
  const [providerId, setProviderId] = useState<string>(providersForLang[0]?.id ?? "");
  const provider = providersForLang.find((p) => p.id === providerId) ?? providersForLang[0];

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);

  // Re-sync when lang changes
  useEffect(() => {
    if (!providersForLang.find((p) => p.id === providerId)) {
      setProviderId(providersForLang[0]?.id ?? "");
    }
  }, [lang, providersForLang, providerId]);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 3500);
    return () => clearTimeout(t);
  }, [providerId, reloadKey]);

  const url = provider ? buildProviderUrl(provider, title) : null;
  if (!url || !provider) return null;

  return (
    <>
      <iframe
        key={`${provider.id}-${reloadKey}`}
        src={url}
        title={`${title.title} — ${provider.name}`}
        allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
        allowFullScreen
        referrerPolicy="origin"
        sandbox="allow-scripts allow-same-origin allow-forms allow-presentation allow-pointer-lock allow-orientation-lock"
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

      {/* Source switcher: tab langues + dropdown lecteurs */}
      <div className="absolute bottom-4 left-1/2 z-30 w-[min(94%,720px)] -translate-x-1/2">
        <div className="flex flex-col gap-2 rounded-3xl border border-white/10 bg-black/65 p-2 backdrop-blur-md">
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
            {langs.map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={cn(
                  "shrink-0 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] transition",
                  l === lang
                    ? "bg-mint-gradient text-char-950"
                    : "text-white/55 hover:bg-white/[0.06] hover:text-white"
                )}
              >
                {l}
                <span className="ml-1.5 opacity-60">
                  {PROVIDERS.filter((p) => p.lang === l).length}
                </span>
              </button>
            ))}
            <button
              onClick={() => setOpen((o) => !o)}
              className="ml-auto shrink-0 inline-flex items-center gap-1.5 rounded-full bg-white/[0.06] px-3 py-1 text-[11px] text-white/85 hover:bg-white/[0.10]"
            >
              <span className="font-medium">{provider.name}</span>
              {provider.hd && (
                <span className="rounded-md bg-mint-400/20 px-1.5 py-0.5 text-[9px] font-semibold text-mint-200">
                  HD
                </span>
              )}
              <ChevronDown
                className={cn("h-3 w-3 transition-transform", open && "rotate-180")}
              />
            </button>
          </div>

          {open && (
            <div className="max-h-60 overflow-y-auto rounded-2xl border border-white/[0.06] bg-black/40 p-1.5">
              {providersForLang.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    setProviderId(p.id);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-left text-sm transition",
                    p.id === provider.id
                      ? "bg-white/[0.08] text-white"
                      : "text-white/70 hover:bg-white/[0.05] hover:text-white"
                  )}
                >
                  <span className="font-medium">{p.name}</span>
                  {p.hd && (
                    <span className="rounded-md bg-mint-400/20 px-1.5 py-0.5 text-[9px] font-semibold text-mint-200">
                      HD
                    </span>
                  )}
                </button>
              ))}
              {providersForLang.length === 0 && (
                <div className="px-3 py-4 text-center text-xs text-white/40">
                  Aucun lecteur pour cette catégorie pour l'instant.
                </div>
              )}
            </div>
          )}
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
