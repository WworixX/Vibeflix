"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  Play, Pause, Volume2, VolumeX, Maximize, X, Loader2, RefreshCw,
  ChevronDown, ChevronLeft, ChevronRight, ExternalLink, SkipForward,
} from "lucide-react";
import type { Title } from "@/lib/mock-data";
import { SAMPLE_VIDEO_URL } from "@/lib/mock-data";
import { PROVIDERS, LANG_ORDER, buildProviderUrl, type Lang } from "@/lib/providers";
import { cn } from "@/lib/utils";

// URL ouverte au clic sur "Continuer" dans l'ad-gate.
// A remplacer par un Direct Link Adsterra / PopAds via variable d'env :
//   NEXT_PUBLIC_AD_URL=https://your-network.com/direct?key=...
const AD_URL =
  process.env.NEXT_PUBLIC_AD_URL ||
  "https://example.com/vibeflix-ad-placeholder";

export function VideoPlayer({ title }: { title: Title }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const hasTmdb =
    !!title.tmdbId && (title.kind === "film" || title.kind === "serie");

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

      <div className="absolute left-5 top-5 z-50">
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

function ExternalPlayer({
  title,
  onFullscreen,
}: {
  title: Title;
  onFullscreen: () => void;
}) {
  // Langues présentes parmi les providers
  const langs = useMemo(() => {
    const present = new Set(PROVIDERS.map((p) => p.lang));
    return LANG_ORDER.filter((l) => present.has(l));
  }, []);

  const [lang, setLang] = useState<Lang>(langs[0] ?? "MULTI");
  const providersForLang = useMemo(
    () => PROVIDERS.filter((p) => p.lang === lang),
    [lang]
  );

  const [providerIdx, setProviderIdx] = useState(0);
  const provider = providersForLang[providerIdx] ?? providersForLang[0];

  const [triedIds, setTriedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);
  const [open, setOpen] = useState(false);

  const [season, setSeason] = useState<number>(title.defaultSeason ?? 1);
  const [episode, setEpisode] = useState<number>(title.defaultEpisode ?? 1);

  const [adClaimed, setAdClaimed] = useState(false);

  // Reset au changement de langue
  useEffect(() => {
    setProviderIdx(0);
    setTriedIds(new Set());
  }, [lang]);

  // Reset des sources tentées au changement d'épisode
  useEffect(() => {
    setTriedIds(new Set());
  }, [season, episode]);

  // Auto-fallback : si l'iframe ne fire pas onload en 5.5s, on tente la suivante
  useEffect(() => {
    if (!adClaimed || !provider) return;
    setLoading(true);
    setTriedIds((prev) => {
      const n = new Set(prev);
      n.add(provider.id);
      return n;
    });
    const t = setTimeout(() => {
      const nextIdx = providersForLang.findIndex(
        (p, i) => i > providerIdx && !triedIds.has(p.id)
      );
      if (nextIdx !== -1) setProviderIdx(nextIdx);
      else setLoading(false);
    }, 5500);
    return () => clearTimeout(t);
  }, [providerIdx, lang, reloadKey, adClaimed, season, episode]);

  const skipToNext = () => {
    const nextIdx = providerIdx + 1 < providersForLang.length ? providerIdx + 1 : 0;
    setProviderIdx(nextIdx);
  };

  const startAd = () => {
    const w = window.open(AD_URL, "_blank", "noopener,noreferrer");
    if (!w) {
      // Popup bloquée -> on débloque quand même pour ne pas casser l'UX
      setAdClaimed(true);
      return;
    }
    let wasHidden = false;
    const onVis = () => {
      if (document.visibilityState === "hidden") {
        wasHidden = true;
      } else if (wasHidden) {
        setTimeout(() => setAdClaimed(true), 300);
        document.removeEventListener("visibilitychange", onVis);
      }
    };
    document.addEventListener("visibilitychange", onVis);
  };

  const url = useMemo(() => {
    if (!provider || !title.tmdbId) return null;
    if (title.kind === "film") return provider.movie(title.tmdbId);
    if (title.kind === "serie") return provider.tv(title.tmdbId, season, episode);
    return null;
  }, [provider, title, season, episode]);

  if (!url || !provider) return null;
  const isSerie = title.kind === "serie";

  return (
    <>
      {adClaimed && (
        <>
          <iframe
            key={`${provider.id}-${reloadKey}-${season}-${episode}`}
            src={url}
            title={`${title.title} — Lecteur ${providerIdx + 1}`}
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
                  Chargement du Lecteur {providerIdx + 1}…
                </span>
              </div>
            </div>
          )}

          <div className="absolute right-5 top-5 z-30 flex items-center gap-2">
            <button
              onClick={skipToNext}
              className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-black/40 text-white backdrop-blur transition hover:bg-black/60"
              aria-label="Source suivante"
              title="Source suivante"
            >
              <SkipForward className="h-4 w-4" />
            </button>
            <button
              onClick={() => setReloadKey((k) => k + 1)}
              className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-black/40 text-white backdrop-blur transition hover:bg-black/60"
              aria-label="Recharger"
              title="Recharger"
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

          {/* Carte sélecteur (langue + dropdown lecteurs + S/E si série) */}
          <div className="absolute bottom-4 left-1/2 z-30 w-[min(94%,760px)] -translate-x-1/2">
            <div className="flex flex-col gap-2 rounded-3xl border border-white/10 bg-black/70 p-2 backdrop-blur-md">
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
                  className="ml-auto inline-flex shrink-0 items-center gap-1.5 rounded-full bg-white/[0.06] px-3 py-1 text-[11px] text-white/85 hover:bg-white/[0.10]"
                >
                  <span className="font-medium">Lecteur {providerIdx + 1}</span>
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

              {isSerie && (
                <div className="flex items-center justify-center gap-2 rounded-2xl bg-white/[0.03] py-1.5">
                  <SECounter
                    label="S"
                    value={season}
                    onChange={(v) => setSeason(Math.max(1, v))}
                  />
                  <span className="h-3 w-px bg-white/15" />
                  <SECounter
                    label="E"
                    value={episode}
                    onChange={(v) => setEpisode(Math.max(1, v))}
                  />
                </div>
              )}

              {open && (
                <div className="max-h-60 overflow-y-auto rounded-2xl border border-white/[0.06] bg-black/40 p-1.5">
                  {providersForLang.map((p, i) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setProviderIdx(i);
                        setOpen(false);
                      }}
                      className={cn(
                        "flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-left text-sm transition",
                        i === providerIdx
                          ? "bg-white/[0.08] text-white"
                          : "text-white/70 hover:bg-white/[0.05] hover:text-white"
                      )}
                    >
                      <span className="font-medium">Lecteur {i + 1}</span>
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
      )}

      {!adClaimed && <AdGate title={title} onStart={startAd} />}
    </>
  );
}

function SECounter({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center gap-1.5 px-2">
      <span className="text-[10px] uppercase tracking-[0.16em] text-white/45">
        {label}
      </span>
      <button
        onClick={() => onChange(value - 1)}
        className="grid h-6 w-6 place-items-center rounded-full text-white/60 transition hover:bg-white/10 hover:text-white"
        aria-label={`${label} précédent`}
      >
        <ChevronLeft className="h-3.5 w-3.5" />
      </button>
      <span className="min-w-[1.5rem] text-center text-sm font-medium tabular-nums">
        {value}
      </span>
      <button
        onClick={() => onChange(value + 1)}
        className="grid h-6 w-6 place-items-center rounded-full text-white/60 transition hover:bg-white/10 hover:text-white"
        aria-label={`${label} suivant`}
      >
        <ChevronRight className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

function AdGate({ title, onStart }: { title: Title; onStart: () => void }) {
  return (
    <div className="absolute inset-0 z-40 grid place-items-center overflow-hidden">
      <img
        src={title.backdrop}
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-30"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/85 to-black/55" />
      <div className="relative max-w-md px-6 text-center">
        <div className="text-[11px] uppercase tracking-[0.18em] text-mint-300">
          Une dernière étape
        </div>
        <h2 className="h-display mt-3 text-3xl md:text-4xl">
          Démarrer la lecture
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-white/65">
          Cliquez ci-dessous pour ouvrir une courte page sponsorisée dans un nouvel
          onglet. Revenez sur VibeFlix et <span className="text-white">{title.title}</span> démarrera automatiquement.
        </p>
        <button onClick={onStart} className="btn-primary mt-7">
          <ExternalLink className="h-4 w-4" />
          Continuer
        </button>
        <p className="mt-4 text-xs text-white/40">
          Ces sponsors nous permettent de garder VibeFlix gratuit.
        </p>
      </div>
    </div>
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
          <div
            className="absolute inset-y-0 left-0 bg-mint-gradient"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={togglePlay}
              className="grid h-11 w-11 place-items-center rounded-full bg-white text-char-950 transition hover:scale-[1.04]"
            >
              {playing ? (
                <Pause className="h-5 w-5 fill-current" />
              ) : (
                <Play className="h-5 w-5 fill-current" />
              )}
            </button>
            <button
              onClick={toggleMute}
              className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/15"
            >
              {muted ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
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
