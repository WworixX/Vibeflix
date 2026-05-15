import { MOVIES } from "@consumet/extensions";
import type { StreamProvider, StreamRequest, StreamResult } from "./types.js";

const flixhq = new MOVIES.FlixHQ();

/**
 * Match FlixHQ via Consumet:
 *  1. search par titre
 *  2. filtre par type (film/serie) + annee
 *  3. fetchMediaInfo pour les episodes
 *  4. fetchEpisodeSources pour le m3u8
 *
 * Pas de Puppeteer. Endpoints HTTP. Rapide.
 */
export const flixhqProvider: StreamProvider = {
  id: "flixhq",
  name: "Lecteur HQ",
  lang: "MULTI",
  async extract(req: StreamRequest): Promise<StreamResult | null> {
    if (!req.title) {
      console.log("[flixhq] manque title dans la requete");
      return null;
    }

    try {
      console.log(`[flixhq] search "${req.title}"`);
      const search = await flixhq.search(req.title);
      if (!search.results.length) {
        console.log("[flixhq] aucun resultat");
        return null;
      }

      // Filtre par type + annee si dispo
      const wantedType =
        req.type === "film" ? "Movie" : "TV Series";
      const candidates = search.results.filter((r: any) => {
        if (r.type !== wantedType) return false;
        if (req.year && r.releaseDate) {
          const y = parseInt(String(r.releaseDate), 10);
          if (!isNaN(y) && Math.abs(y - req.year) > 1) return false;
        }
        return true;
      });

      const pick = candidates[0] ?? search.results[0];
      console.log(`[flixhq] match: ${pick.title} (${pick.id})`);

      const info: any = await flixhq.fetchMediaInfo(pick.id);
      if (!info.episodes?.length) {
        console.log("[flixhq] pas d'episodes dans l'info");
        return null;
      }

      let episodeId: string;
      if (req.type === "film") {
        episodeId = info.episodes[0].id;
      } else {
        const s = req.season ?? 1;
        const e = req.episode ?? 1;
        const ep = info.episodes.find(
          (ep: any) => ep.season === s && ep.number === e
        );
        if (!ep) {
          console.log(`[flixhq] S${s}E${e} introuvable`);
          return null;
        }
        episodeId = ep.id;
      }

      console.log(`[flixhq] fetchEpisodeSources episodeId=${episodeId}`);
      const sources: any = await flixhq.fetchEpisodeSources(episodeId, pick.id);

      if (!sources.sources?.length) {
        console.log("[flixhq] pas de sources renvoyees");
        return null;
      }

      // Prend le m3u8 de plus haute qualite
      const hls =
        sources.sources.find((s: any) =>
          s.url?.includes(".m3u8")
        ) ?? sources.sources[0];

      console.log(`[flixhq] ✓ ${hls.url.slice(0, 120)}`);

      return {
        m3u8Url: hls.url,
        headers: sources.headers ?? {},
        providerId: this.id,
        providerName: this.name,
        expiresAt: Date.now() + 1000 * 60 * 60,
      };
    } catch (err) {
      console.error("[flixhq] error", err);
      return null;
    }
  },
};
