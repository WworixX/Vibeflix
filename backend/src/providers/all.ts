import { makeIframeProvider } from "./factory.js";
import type { StreamProvider } from "./types.js";

// Helper: ratio params
const tv = (t: string, base: string, sep: "/" | "-" | "?") => {
  if (sep === "/") return `${base}/{tmdb}/{s}/{e}`;
  return base;
};

/**
 * Liste complete des providers calques sur le site de reference.
 * 4 categories: VF / VOSTFR / VO / MULTI.
 *
 * Note: domaines morts/bloques chez FAI FR seront skip automatiquement
 * (ERR_NAME_NOT_RESOLVED -> retourne null vite).
 */
export const ALL_PROVIDERS: StreamProvider[] = [
  // ─── VF ──────────────────────────────────────────────────────────
  makeIframeProvider({
    id: "kweflix",
    name: "Lecteur Kweflix · Uqload",
    lang: "VF",
    hd: true,
    refererHost: "https://kweflix.guru",
    buildUrl: (req) => {
      // URL pattern a verifier - placeholder en attendant pote
      if (!req.tmdbId) return null;
      if (req.type === "film")
        return `https://kweflix.guru/watch/movie/${req.tmdbId}`;
      return `https://kweflix.guru/watch/tv/${req.tmdbId}?type=tv&season=${
        req.season ?? 1
      }&episode=${req.episode ?? 1}`;
    },
  }),
  makeIframeProvider({
    id: "playmogo",
    name: "Playmogo",
    lang: "VF",
    refererHost: "https://playmogo.com",
    buildUrl: (req) => {
      if (!req.tmdbId) return null;
      if (req.type === "film")
        return `https://playmogo.com/movie/${req.tmdbId}`;
      return `https://playmogo.com/tv/${req.tmdbId}/${req.season ?? 1}/${
        req.episode ?? 1
      }`;
    },
  }),
  makeIframeProvider({
    id: "richardqb",
    name: "Richardquestionbuilding",
    lang: "VF",
    refererHost: "https://richardquestionbuilding.cc",
    buildUrl: (req) => {
      if (!req.tmdbId) return null;
      if (req.type === "film")
        return `https://richardquestionbuilding.cc/movie/${req.tmdbId}`;
      return `https://richardquestionbuilding.cc/tv/${req.tmdbId}/${
        req.season ?? 1
      }/${req.episode ?? 1}`;
    },
  }),

  // ─── VOSTFR ──────────────────────────────────────────────────────
  makeIframeProvider({
    id: "vidsrc-to",
    name: "VidSrc.to",
    lang: "VOSTFR",
    refererHost: "https://vidsrc.to",
    buildUrl: (req) => {
      if (!req.tmdbId) return null;
      if (req.type === "film")
        return `https://vidsrc.to/embed/movie/${req.tmdbId}`;
      return `https://vidsrc.to/embed/tv/${req.tmdbId}/${req.season ?? 1}/${
        req.episode ?? 1
      }`;
    },
  }),
  makeIframeProvider({
    id: "vidsrc-me",
    name: "VidSrc.me",
    lang: "VOSTFR",
    refererHost: "https://vidsrc.me",
    buildUrl: (req) => {
      if (!req.tmdbId) return null;
      if (req.type === "film") return `https://vidsrc.me/embed/${req.tmdbId}`;
      return `https://vidsrc.me/embed/${req.tmdbId}/${req.season ?? 1}-${
        req.episode ?? 1
      }`;
    },
  }),
  makeIframeProvider({
    id: "moviesapi",
    name: "MoviesAPI",
    lang: "VOSTFR",
    refererHost: "https://moviesapi.club",
    buildUrl: (req) => {
      if (!req.tmdbId) return null;
      if (req.type === "film")
        return `https://moviesapi.club/movie/${req.tmdbId}`;
      return `https://moviesapi.club/tv/${req.tmdbId}-${req.season ?? 1}-${
        req.episode ?? 1
      }`;
    },
  }),
  makeIframeProvider({
    id: "smashy",
    name: "Smashystream",
    lang: "VOSTFR",
    refererHost: "https://embed.smashystream.com",
    buildUrl: (req) => {
      if (!req.tmdbId) return null;
      if (req.type === "film")
        return `https://embed.smashystream.com/playere.php?tmdb=${req.tmdbId}`;
      return `https://embed.smashystream.com/playere.php?tmdb=${req.tmdbId}&season=${
        req.season ?? 1
      }&episode=${req.episode ?? 1}`;
    },
  }),
  makeIframeProvider({
    id: "rivestream",
    name: "RiveStream",
    lang: "VOSTFR",
    refererHost: "https://rivestream.live",
    buildUrl: (req) => {
      if (!req.tmdbId) return null;
      if (req.type === "film")
        return `https://rivestream.live/embed?type=movie&id=${req.tmdbId}`;
      return `https://rivestream.live/embed?type=tv&id=${req.tmdbId}&season=${
        req.season ?? 1
      }&episode=${req.episode ?? 1}`;
    },
  }),

  // ─── VO ──────────────────────────────────────────────────────────
  makeIframeProvider({
    id: "twoembed",
    name: "2Embed",
    lang: "VO",
    refererHost: "https://www.2embed.cc",
    buildUrl: (req) => {
      if (!req.tmdbId) return null;
      if (req.type === "film")
        return `https://www.2embed.cc/embed/${req.tmdbId}`;
      return `https://www.2embed.cc/embedtv/${req.tmdbId}&s=${
        req.season ?? 1
      }&e=${req.episode ?? 1}`;
    },
  }),
  makeIframeProvider({
    id: "vidsrc-cc",
    name: "VidSrc.cc",
    lang: "VO",
    refererHost: "https://vidsrc.cc",
    buildUrl: (req) => {
      if (!req.tmdbId) return null;
      if (req.type === "film")
        return `https://vidsrc.cc/v2/embed/movie/${req.tmdbId}`;
      return `https://vidsrc.cc/v2/embed/tv/${req.tmdbId}/${req.season ?? 1}/${
        req.episode ?? 1
      }`;
    },
  }),

  // ─── MULTI ───────────────────────────────────────────────────────
  makeIframeProvider({
    id: "vidsrc-pro",
    name: "VidSrc Pro",
    lang: "MULTI",
    refererHost: "https://vidsrc.pro",
    buildUrl: (req) => {
      if (!req.tmdbId) return null;
      if (req.type === "film")
        return `https://vidsrc.pro/embed/movie/${req.tmdbId}`;
      return `https://vidsrc.pro/embed/tv/${req.tmdbId}/${req.season ?? 1}/${
        req.episode ?? 1
      }`;
    },
  }),
  makeIframeProvider({
    id: "vidsrc-xyz",
    name: "VidSrc.xyz",
    lang: "MULTI",
    refererHost: "https://vidsrc.xyz",
    buildUrl: (req) => {
      if (!req.tmdbId) return null;
      if (req.type === "film")
        return `https://vidsrc.xyz/embed/movie?tmdb=${req.tmdbId}`;
      return `https://vidsrc.xyz/embed/tv?tmdb=${req.tmdbId}&season=${
        req.season ?? 1
      }&episode=${req.episode ?? 1}`;
    },
  }),
  makeIframeProvider({
    id: "embed-su",
    name: "EmbedSu",
    lang: "MULTI",
    refererHost: "https://embed.su",
    buildUrl: (req) => {
      if (!req.tmdbId) return null;
      if (req.type === "film")
        return `https://embed.su/embed/movie/${req.tmdbId}`;
      return `https://embed.su/embed/tv/${req.tmdbId}/${req.season ?? 1}/${
        req.episode ?? 1
      }`;
    },
  }),
  makeIframeProvider({
    id: "autoembed",
    name: "AutoEmbed",
    lang: "MULTI",
    refererHost: "https://autoembed.cc",
    buildUrl: (req) => {
      if (!req.tmdbId) return null;
      if (req.type === "film")
        return `https://autoembed.cc/embed/movie/tmdb/${req.tmdbId}`;
      return `https://autoembed.cc/embed/tv/tmdb/${req.tmdbId}/${
        req.season ?? 1
      }/${req.episode ?? 1}`;
    },
  }),
  makeIframeProvider({
    id: "videasy",
    name: "Videasy",
    lang: "MULTI",
    hd: true,
    refererHost: "https://player.videasy.net",
    buildUrl: (req) => {
      if (!req.tmdbId) return null;
      if (req.type === "film")
        return `https://player.videasy.net/movie/${req.tmdbId}`;
      return `https://player.videasy.net/tv/${req.tmdbId}/${req.season ?? 1}/${
        req.episode ?? 1
      }`;
    },
  }),
  makeIframeProvider({
    id: "multiembed",
    name: "MultiEmbed",
    lang: "MULTI",
    refererHost: "https://multiembed.mov",
    buildUrl: (req) => {
      if (!req.tmdbId) return null;
      if (req.type === "film")
        return `https://multiembed.mov/?video_id=${req.tmdbId}&tmdb=1`;
      return `https://multiembed.mov/?video_id=${req.tmdbId}&tmdb=1&s=${
        req.season ?? 1
      }&e=${req.episode ?? 1}`;
    },
  }),
  makeIframeProvider({
    id: "embedapi",
    name: "EmbedAPI",
    lang: "MULTI",
    refererHost: "https://embedapi.com",
    buildUrl: (req) => {
      if (!req.tmdbId) return null;
      if (req.type === "film")
        return `https://embedapi.com/embed/movie/${req.tmdbId}`;
      return `https://embedapi.com/embed/tv/${req.tmdbId}/${req.season ?? 1}/${
        req.episode ?? 1
      }`;
    },
  }),
  makeIframeProvider({
    id: "embedmaster",
    name: "EmbedMaster",
    lang: "MULTI",
    refererHost: "https://embedmaster.cc",
    buildUrl: (req) => {
      if (!req.tmdbId) return null;
      if (req.type === "film")
        return `https://embedmaster.cc/embed/movie/${req.tmdbId}`;
      return `https://embedmaster.cc/embed/tv/${req.tmdbId}/${req.season ?? 1}/${
        req.episode ?? 1
      }`;
    },
  }),
];
