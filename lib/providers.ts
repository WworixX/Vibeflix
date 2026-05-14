import type { Title } from "./mock-data";

export type Lang = "VF" | "VOSTFR" | "VO" | "MULTI";

export type Provider = {
  id: string;
  name: string;
  lang: Lang;
  hd?: boolean;
  movie: (tmdbId: number) => string;
  tv: (tmdbId: number, season: number, episode: number) => string;
};

export const PROVIDERS: Provider[] = [
  // ── MULTI (catalogues globaux, sous-titres multi-langues) ──────────────
  {
    id: "vidsrc-cc",
    name: "VidSrc CC",
    lang: "MULTI",
    hd: true,
    movie: (id) => `https://vidsrc.cc/v2/embed/movie/${id}`,
    tv: (id, s, e) => `https://vidsrc.cc/v2/embed/tv/${id}/${s}/${e}`,
  },
  {
    id: "vidlink",
    name: "VidLink",
    lang: "MULTI",
    hd: true,
    movie: (id) =>
      `https://vidlink.pro/movie/${id}?primaryColor=22B97A&secondaryColor=3FCB89&iconColor=ECF6F1&autoplay=true&title=false`,
    tv: (id, s, e) =>
      `https://vidlink.pro/tv/${id}/${s}/${e}?primaryColor=22B97A&secondaryColor=3FCB89&iconColor=ECF6F1&autoplay=true&title=false`,
  },
  {
    id: "videasy",
    name: "Videasy",
    lang: "MULTI",
    hd: true,
    movie: (id) => `https://player.videasy.net/movie/${id}`,
    tv: (id, s, e) => `https://player.videasy.net/tv/${id}/${s}/${e}`,
  },
  {
    id: "vidsrc-pro",
    name: "VidSrc Pro",
    lang: "MULTI",
    movie: (id) => `https://vidsrc.pro/embed/movie/${id}`,
    tv: (id, s, e) => `https://vidsrc.pro/embed/tv/${id}/${s}/${e}`,
  },
  {
    id: "vidsrc-xyz",
    name: "VidSrc XYZ",
    lang: "MULTI",
    movie: (id) => `https://vidsrc.xyz/embed/movie?tmdb=${id}`,
    tv: (id, s, e) =>
      `https://vidsrc.xyz/embed/tv?tmdb=${id}&season=${s}&episode=${e}`,
  },
  {
    id: "moviesapi",
    name: "MoviesAPI",
    lang: "MULTI",
    movie: (id) => `https://moviesapi.club/movie/${id}`,
    tv: (id, s, e) => `https://moviesapi.club/tv/${id}-${s}-${e}`,
  },
  {
    id: "smashy",
    name: "Smashystream",
    lang: "MULTI",
    movie: (id) => `https://embed.smashystream.com/playere.php?tmdb=${id}`,
    tv: (id, s, e) =>
      `https://embed.smashystream.com/playere.php?tmdb=${id}&season=${s}&episode=${e}`,
  },
  {
    id: "multiembed",
    name: "MultiEmbed",
    lang: "MULTI",
    movie: (id) => `https://multiembed.mov/?video_id=${id}&tmdb=1`,
    tv: (id, s, e) => `https://multiembed.mov/?video_id=${id}&tmdb=1&s=${s}&e=${e}`,
  },
  {
    id: "rivestream",
    name: "RiveStream",
    lang: "MULTI",
    movie: (id) => `https://rivestream.live/embed?type=movie&id=${id}`,
    tv: (id, s, e) =>
      `https://rivestream.live/embed?type=tv&id=${id}&season=${s}&episode=${e}`,
  },
  {
    id: "embed-su",
    name: "Embed.su",
    lang: "MULTI",
    movie: (id) => `https://embed.su/embed/movie/${id}`,
    tv: (id, s, e) => `https://embed.su/embed/tv/${id}/${s}/${e}`,
  },
  {
    id: "autoembed",
    name: "AutoEmbed",
    lang: "MULTI",
    movie: (id) => `https://autoembed.cc/embed/movie/tmdb/${id}`,
    tv: (id, s, e) => `https://autoembed.cc/embed/tv/tmdb/${id}/${s}/${e}`,
  },
  {
    id: "vidsrc-to",
    name: "VidSrc TO",
    lang: "MULTI",
    movie: (id) => `https://vidsrc.to/embed/movie/${id}`,
    tv: (id, s, e) => `https://vidsrc.to/embed/tv/${id}/${s}/${e}`,
  },
  // ── VO (anglais d'origine, pas de sous-titres FR garantis) ─────────────
  {
    id: "2embed",
    name: "2Embed",
    lang: "VO",
    movie: (id) => `https://www.2embed.cc/embed/${id}`,
    tv: (id, s, e) => `https://www.2embed.cc/embedtv/${id}&s=${s}&e=${e}`,
  },
  // ── VOSTFR / VF : a remplir avec les URLs de Kweflix/Playmogo/etc. ─────
];

export const LANG_ORDER: Lang[] = ["VF", "VOSTFR", "VO", "MULTI"];

export function providersByLang(lang: Lang) {
  return PROVIDERS.filter((p) => p.lang === lang);
}

export function buildProviderUrl(p: Provider, t: Title): string | null {
  if (!t.tmdbId) return null;
  if (t.kind === "film") return p.movie(t.tmdbId);
  if (t.kind === "serie") {
    return p.tv(t.tmdbId, t.defaultSeason ?? 1, t.defaultEpisode ?? 1);
  }
  return null;
}
