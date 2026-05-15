"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  Play, Pause, Volume2, VolumeX, Maximize, X, Loader2,
  ChevronLeft, ChevronRight, ExternalLink, AlertCircle,
} from "lucide-react";
import type { Title } from "@/lib/mock-data";
import { SAMPLE_VIDEO_URL } from "@/lib/mock-data";
import { fetchStream, buildManifestUrl, type StreamInfo, type Lang } from "@/lib/backend";
import { cn } from "@/lib/utils";

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
        <BackendPlayer title={title} onFullscreen={enterFs} />
      ) : (
        <NativeSamplePlayer title={title} />
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

/* ─────────────────────────────────────────────────────────────────────── */
/*  Lecteur principal: ad-gate → fetch backend → hls.js dans <video>      */
/* ─────────────────────────────────────────────────────────────────────── */

function BackendPlayer({
  title,
  onFullscreen,
}: {
  title: Title;
  onFullscreen: () => void;
}) {
  const [season, setSeason] = useState<number>(title.defaultSeason ?? 1);
  const [episode, setEpisode] = useState<number>(title.defaultEpisode ?? 1);
  const [lang, setLang] = useState<Lang>("VF");
  const [adClaimed, setAdClaimed] = useState(false);
  const [stream, setStream] = useState<StreamInfo | null>(null);
  const [status, setStatus] = useState<
    "idle" | "extracting" | "ready" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const abortRef = useRef<AbortController | null>(null);

  // Lance l'extraction backend
  const startExtraction = async () => {
    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;
    setStatus("extracting");
    setStream(null);
    setErrorMsg("");
    try {
      const info = await fetchStream(
        {
          tmdbId: title.tmdbId!,
          type: title.kind === "film" ? "film" : "serie",
          season,
          episode,
          title: title.title,
          year: title.year,
          lang,
        },
        ac.signal
      );
      if (ac.signal.aborted) return;
      setStream(info);
      setStatus("ready");
    } catch (err: any) {
      if (ac.signal.aborted) return;
      console.error("[stream] extraction failed", err);
      setErrorMsg(err?.message ?? "Erreur inconnue");
      setStatus("error");
    }
  };

  // Re-extraction si saison/épisode/langue change (uniquement si ad déjà passé)
  useEffect(() => {
    if (!adClaimed) return;
    startExtraction();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [season, episode, adClaimed, lang]);

  const startAd = () => {
    const w = window.open(AD_URL, "_blank", "noopener,noreferrer");
    // On lance l'extraction en parallèle pour gagner du temps
    startExtraction();
    if (!w) {
      setAdClaimed(true);
      return;
    }
    let wasHidden = false;
    const onVis = () => {
      if (document.visibilityState === "hidden") wasHidden = true;
      else if (wasHidden) {
        setTimeout(() => setAdClaimed(true), 300);
        document.removeEventListener("visibilitychange", onVis);
      }
    };
    document.addEventListener("visibilitychange", onVis);
  };

  const isSerie = title.kind === "serie";

  return (
    <>
      {!adClaimed && <AdGate title={title} onStart={startAd} />}

      {adClaimed && status === "extracting" && (
        <ExtractionOverlay title={title} />
      )}

      {adClaimed && status === "error" && (
        <ErrorOverlay message={errorMsg} onRetry={startExtraction} />
      )}

      {adClaimed && status === "ready" && stream && (
        <HlsVideo
          stream={stream}
          poster={title.backdrop}
          onFullscreen={onFullscreen}
        />
      )}

      {adClaimed && (status === "ready" || status === "extracting") && (
        <div className="absolute bottom-4 left-1/2 z-30 -translate-x-1/2">
          <div className="flex flex-col gap-2 rounded-3xl border border-white/10 bg-black/70 p-2 backdrop-blur-md">
            <div className="flex items-center gap-1">
              {(["VF", "VOSTFR", "MULTI"] as Lang[]).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={cn(
                    "rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] transition",
                    l === lang
                      ? "bg-mint-gradient text-char-950"
                      : "text-white/55 hover:bg-white/[0.06] hover:text-white"
                  )}
                >
                  {l}
                </button>
              ))}
            </div>
            {isSerie && (
              <div className="flex items-center justify-center gap-2 rounded-2xl bg-white/[0.03] py-1">
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
          </div>
        </div>
      )}
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────────── */
/*  HLS Video : <video> natif + hls.js + contrôles maison                 */
/* ─────────────────────────────────────────────────────────────────────── */

function HlsVideo({
  stream,
  poster,
  onFullscreen,
}: {
  stream: StreamInfo;
  poster: string;
  onFullscreen: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffering, setBuffering] = useState(true);

  // Attache hls.js
  useEffect(() => {
    let hls: any = null;
    let cancelled = false;
    const video = videoRef.current;
    if (!video) return;

    const manifestUrl = buildManifestUrl(stream);

    (async () => {
      // Safari natif
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = manifestUrl;
      } else {
        const Hls = (await import("hls.js")).default;
        if (cancelled || !Hls.isSupported()) return;
        hls = new Hls({ enableWorker: true, lowLatencyMode: false });
        hls.loadSource(manifestUrl);
        hls.attachMedia(video);
      }
      video.play().then(() => setPlaying(true)).catch(() => {});
    })();

    return () => {
      cancelled = true;
      if (hls) hls.destroy();
      if (video) {
        video.pause();
        video.removeAttribute("src");
        video.load();
      }
    };
  }, [stream]);

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
        poster={poster}
        playsInline
        onTimeUpdate={onTime}
        onLoadedMetadata={onTime}
        onWaiting={() => setBuffering(true)}
        onPlaying={() => setBuffering(false)}
        onCanPlay={() => setBuffering(false)}
        className="absolute inset-0 h-full w-full bg-black"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/40" />

      {buffering && (
        <div className="pointer-events-none absolute inset-0 z-10 grid place-items-center">
          <Loader2 className="h-8 w-8 animate-spin text-white/70" />
        </div>
      )}

      <div className="absolute right-5 top-5 z-30 flex items-center gap-2">
        <button
          onClick={onFullscreen}
          className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-black/40 text-white backdrop-blur transition hover:bg-black/60"
          aria-label="Plein écran"
        >
          <Maximize className="h-4 w-4" />
        </button>
      </div>

      <div className="absolute inset-x-0 bottom-16 z-20 px-5 md:px-7">
        <div
          onClick={seek}
          className="relative h-1 w-full cursor-pointer overflow-hidden rounded-full bg-white/15"
        >
          <div
            className="absolute inset-y-0 left-0 bg-mint-gradient"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="mt-3 flex items-center gap-3">
          <button
            onClick={togglePlay}
            className="grid h-11 w-11 place-items-center rounded-full bg-white text-char-950 transition hover:scale-[1.04]"
            aria-label={playing ? "Pause" : "Lecture"}
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
            aria-label="Son"
          >
            {muted ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </button>
          <span className="text-xs text-white/70 tabular-nums">
            {fmt((progress / 100) * duration)} / {fmt(duration)}
          </span>
          <span className="ml-auto text-[10px] uppercase tracking-[0.16em] text-mint-300">
            {stream.providerName} · Sans pub
          </span>
        </div>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────────── */
/*  Overlays                                                              */
/* ─────────────────────────────────────────────────────────────────────── */

function AdGate({
  title,
  onStart,
}: {
  title: Title;
  onStart: () => void;
}) {
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
          Cliquez ci-dessous pour ouvrir une courte page sponsorisée dans un
          nouvel onglet. Revenez sur VibeFlix et{" "}
          <span className="text-white">{title.title}</span> démarrera
          automatiquement.
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

function ExtractionOverlay({ title }: { title: Title }) {
  return (
    <div className="absolute inset-0 z-30 grid place-items-center overflow-hidden">
      <img
        src={title.backdrop}
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-20"
      />
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="relative flex flex-col items-center gap-4 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-mint-300" />
        <div className="text-sm text-white/85">Préparation du flux…</div>
        <div className="max-w-xs text-xs text-white/45">
          On va chercher la meilleure source pour {title.title}. Quelques
          secondes.
        </div>
      </div>
    </div>
  );
}

function ErrorOverlay({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="absolute inset-0 z-30 grid place-items-center bg-black/80">
      <div className="max-w-md px-6 text-center">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full border border-rose-400/20 bg-rose-500/10 text-rose-300">
          <AlertCircle className="h-5 w-5" />
        </div>
        <h3 className="h-display mt-5 text-2xl">Source indisponible</h3>
        <p className="mt-3 text-sm text-white/55">
          Le backend n'a pas pu extraire de flux pour ce titre. Soit aucune
          source ne marche actuellement, soit le backend n'est pas démarré.
        </p>
        <p className="mt-2 text-[10px] text-white/30 font-mono">{message}</p>
        <button onClick={onRetry} className="btn-ghost mt-6">
          Réessayer
        </button>
      </div>
    </div>
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

/* ─────────────────────────────────────────────────────────────────────── */
/*  Lecteur natif fallback (pour les contenus live sans tmdbId)           */
/* ─────────────────────────────────────────────────────────────────────── */

function NativeSamplePlayer({ title }: { title: Title }) {
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
          className="relative h-1 w-full cursor-pointer overflow-hidden rounded-full bg-white/15"
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
