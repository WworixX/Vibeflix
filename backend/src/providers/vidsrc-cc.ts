import { newContext } from "../lib/browser.js";
import type { StreamProvider, StreamRequest, StreamResult } from "./types.js";

/**
 * Extracteur generique base sur l'interception reseau.
 *
 * Principe:
 *  1. On ouvre la page de l'embed dans un Chromium headless
 *  2. On intercepte toutes les requetes reseau
 *  3. On garde la premiere qui ressemble a un manifest HLS (.m3u8)
 *  4. On retourne l'URL + les headers necessaires
 *
 * Marche en theorie sur la plupart des aggregateurs. En pratique
 * certains sites detectent le headless et refusent -> il faudra ajouter
 * `playwright-extra` + plugin stealth en cas de besoin.
 */
function buildEmbedUrl(req: StreamRequest): string {
  if (req.type === "film") {
    return `https://vidsrc.cc/v2/embed/movie/${req.tmdbId}`;
  }
  return `https://vidsrc.cc/v2/embed/tv/${req.tmdbId}/${req.season ?? 1}/${req.episode ?? 1}`;
}

export const vidsrcCcProvider: StreamProvider = {
  id: "vidsrc-cc",
  name: "Lecteur 1",
  lang: "MULTI",
  async extract(req): Promise<StreamResult | null> {
    const embedUrl = buildEmbedUrl(req);
    const ctx = await newContext();
    const page = await ctx.newPage();

    let m3u8: { url: string; headers: Record<string, string> } | null = null;

    // On ecoute toutes les requetes sortantes
    page.on("request", (r) => {
      const url = r.url();
      if (
        !m3u8 &&
        (url.includes(".m3u8") || url.includes("/manifest")) &&
        !url.includes("googlevideo") // ignore les analytics
      ) {
        m3u8 = {
          url,
          headers: r.headers() as Record<string, string>,
        };
      }
    });

    try {
      await page.goto(embedUrl, {
        waitUntil: "domcontentloaded",
        timeout: 25000,
        referer: "https://vidsrc.cc/",
      });

      // Tentative d'auto-click sur le bouton play si present
      try {
        await page.locator("button, .play, .play-btn").first().click({ timeout: 3000 });
      } catch {
        /* pas de bouton play, le player auto-play probablement */
      }

      // On attend max 12s qu'un m3u8 soit intercepte
      const start = Date.now();
      while (!m3u8 && Date.now() - start < 12000) {
        await page.waitForTimeout(250);
      }
    } catch (err) {
      console.error("[vidsrc-cc] navigation error", err);
    } finally {
      await ctx.close();
    }

    if (!m3u8) return null;

    return {
      m3u8Url: m3u8.url,
      headers: {
        Referer: m3u8.headers["referer"] ?? "https://vidsrc.cc/",
        "User-Agent": m3u8.headers["user-agent"] ?? "",
      },
      providerId: this.id,
      providerName: this.name,
      expiresAt: Date.now() + 1000 * 60 * 60, // ~1h conservateur
    };
  },
};
