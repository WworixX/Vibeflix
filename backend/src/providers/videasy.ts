import type { StreamProvider, StreamRequest, StreamResult } from "./types.js";

/**
 * Videasy API direct (pas de Puppeteer).
 *
 * Endpoint observe via DevTools sur vidsrc.cc:
 *   GET https://api.videasy.net/mb-flix/sources-with-title?...
 *
 * Si retourne du JSON avec sources -> pas besoin de browser headless.
 */
const VIDEASY_API = "https://api.videasy.net/mb-flix/sources-with-title";

const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
  Accept: "application/json, text/plain, */*",
  "Accept-Language": "fr-FR,fr;q=0.9,en;q=0.8",
  Origin: "https://player.videasy.net",
  Referer: "https://player.videasy.net/",
};

export const videasyProvider: StreamProvider = {
  id: "videasy",
  name: "Lecteur HD",
  lang: "MULTI",
  async extract(req: StreamRequest): Promise<StreamResult | null> {
    if (!req.title) {
      console.log("[videasy] manque title");
      return null;
    }

    const url = new URL(VIDEASY_API);
    url.searchParams.set("title", req.title);
    url.searchParams.set("mediaType", req.type === "film" ? "movie" : "tv");
    if (req.year) url.searchParams.set("year", String(req.year));
    url.searchParams.set("episodeId", String(req.episode ?? 1));
    url.searchParams.set("seasonId", String(req.season ?? 1));
    url.searchParams.set("tmdbId", String(req.tmdbId));

    console.log(`[videasy] GET ${url.toString().slice(0, 140)}`);

    try {
      const res = await fetch(url.toString(), { headers: HEADERS });
      console.log(`[videasy] status ${res.status}`);
      if (!res.ok) {
        const body = await res.text();
        console.log(`[videasy] body: ${body.slice(0, 200)}`);
        return null;
      }

      const data: any = await res.json();
      console.log(`[videasy] keys: ${Object.keys(data).join(", ")}`);

      // Forme presumee de la reponse - on cherche m3u8 partout
      const text = JSON.stringify(data);
      const m3u8Match = text.match(/(https?:\/\/[^"'\s]+\.m3u8[^"'\s]*)/);

      if (m3u8Match) {
        console.log(`[videasy] ✓ m3u8: ${m3u8Match[1].slice(0, 120)}`);
        return {
          m3u8Url: m3u8Match[1],
          headers: {
            Referer: "https://player.videasy.net/",
            "User-Agent": HEADERS["User-Agent"],
          },
          providerId: this.id,
          providerName: this.name,
          expiresAt: Date.now() + 1000 * 60 * 60,
        };
      }

      console.log(
        `[videasy] aucun m3u8 dans la reponse. Premiers 500 caracteres:`
      );
      console.log(text.slice(0, 500));
      return null;
    } catch (err) {
      console.error("[videasy] error", err);
      return null;
    }
  },
};
