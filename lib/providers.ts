import type { Title } from "./mock-data";

export type Provider = {
  id: string;
  name: string;
  movie: (tmdbId: number) => string;
  tv: (tmdbId: number, season: number, episode: number) => string;
};

export const PROVIDERS: Provider[] = [
  {
    id: "vidsrc-cc",
    name: "VidSrc CC",
    movie: (id) => `https://vidsrc.cc/v2/embed/movie/${id}`,
    tv: (id, s, e) => `https://vidsrc.cc/v2/embed/tv/${id}/${s}/${e}`,
  },
  {
    id: "vidlink",
    name: "VidLink",
    movie: (id) => `https://vidlink.pro/movie/${id}`,
    tv: (id, s, e) => `https://vidlink.pro/tv/${id}/${s}/${e}`,
  },
  {
    id: "vidsrc-xyz",
    name: "VidSrc XYZ",
    movie: (id) => `https://vidsrc.xyz/embed/movie?tmdb=${id}`,
    tv: (id, s, e) =>
      `https://vidsrc.xyz/embed/tv?tmdb=${id}&season=${s}&episode=${e}`,
  },
  {
    id: "moviesapi",
    name: "MoviesAPI",
    movie: (id) => `https://moviesapi.club/movie/${id}`,
    tv: (id, s, e) => `https://moviesapi.club/tv/${id}-${s}-${e}`,
  },
  {
    id: "embed-su",
    name: "Embed.su",
    movie: (id) => `https://embed.su/embed/movie/${id}`,
    tv: (id, s, e) => `https://embed.su/embed/tv/${id}/${s}/${e}`,
  },
  {
    id: "autoembed",
    name: "AutoEmbed",
    movie: (id) => `https://autoembed.cc/embed/movie/tmdb/${id}`,
    tv: (id, s, e) => `https://autoembed.cc/embed/tv/tmdb/${id}/${s}/${e}`,
  },
  {
    id: "vidsrc-to",
    name: "VidSrc TO",
    movie: (id) => `https://vidsrc.to/embed/movie/${id}`,
    tv: (id, s, e) => `https://vidsrc.to/embed/tv/${id}/${s}/${e}`,
  },
];

export function buildProviderUrl(p: Provider, t: Title): string | null {
  if (!t.tmdbId) return null;
  if (t.kind === "film") return p.movie(t.tmdbId);
  if (t.kind === "serie") {
    return p.tv(t.tmdbId, t.defaultSeason ?? 1, t.defaultEpisode ?? 1);
  }
  return null;
}
