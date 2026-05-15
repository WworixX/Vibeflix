import { newContext } from "../lib/browser.js";
import type { StreamProvider, StreamRequest, StreamResult } from "./types.js";

function buildEmbedUrl(req: StreamRequest): string {
  if (req.type === "film") {
    return `https://vidsrc.cc/v2/embed/movie/${req.tmdbId}`;
  }
  return `https://vidsrc.cc/v2/embed/tv/${req.tmdbId}/${req.season ?? 1}/${
    req.episode ?? 1
  }`;
}

const M3U8_PATTERNS = [/\.m3u8(\?|$)/i, /\/manifest/i, /\/master\.txt/i];
const IGNORE_PATTERNS = [
  /googlevideo/,
  /doubleclick/,
  /google-analytics/,
  /googletagmanager/,
  /facebook\.com\/tr/,
  /\.png(\?|$)/i,
  /\.jpg(\?|$)/i,
  /\.svg(\?|$)/i,
  /\.css(\?|$)/i,
  /\.woff/i,
];

function looksLikeM3u8(url: string): boolean {
  if (IGNORE_PATTERNS.some((p) => p.test(url))) return false;
  return M3U8_PATTERNS.some((p) => p.test(url));
}

export const vidsrcCcProvider: StreamProvider = {
  id: "vidsrc-cc",
  name: "Lecteur 1",
  lang: "MULTI",
  async extract(req): Promise<StreamResult | null> {
    const embedUrl = buildEmbedUrl(req);
    console.log(`[vidsrc-cc] → ${embedUrl}`);
    const ctx = await newContext();
    const page = await ctx.newPage();

    let m3u8: { url: string; headers: Record<string, string> } | null = null;
    const seen: string[] = [];

    // IMPORTANT: on ecoute au niveau du CONTEXTE pour capter les
    // requetes faites depuis les iframes imbriques (vidsrc.cc charge
    // le vrai player dans un sous-iframe).
    ctx.on("request", (r) => {
      const url = r.url();
      seen.push(url);
      if (!m3u8 && looksLikeM3u8(url)) {
        console.log(`[vidsrc-cc] ✓ m3u8 found: ${url.slice(0, 120)}`);
        m3u8 = {
          url,
          headers: r.headers() as Record<string, string>,
        };
      }
    });

    try {
      await page.goto(embedUrl, {
        waitUntil: "domcontentloaded",
        timeout: 30000,
        referer: "https://vidsrc.cc/",
      });

      // Donne le temps au DOM de se construire et au JS de demarrer
      await page.waitForTimeout(2000);

      // Strategie 1: clique au centre du player pour declencher l'autoplay
      try {
        await page.mouse.click(640, 360);
      } catch {}

      // Strategie 2: cherche tout bouton "play" dans la page principale ET tous les iframes
      const tryClickPlay = async () => {
        for (const frame of page.frames()) {
          for (const sel of [
            "button[aria-label*='play' i]",
            "button.play",
            ".play-btn",
            ".vjs-big-play-button",
            "[data-play]",
            "video",
          ]) {
            try {
              await frame
                .locator(sel)
                .first()
                .click({ timeout: 1500, force: true });
              return true;
            } catch {}
          }
        }
        return false;
      };
      await tryClickPlay();

      // Attente m3u8: 25s max
      const start = Date.now();
      while (!m3u8 && Date.now() - start < 25000) {
        await page.waitForTimeout(300);
        // re-clique periodiquement au cas ou
        if ((Date.now() - start) % 5000 < 350) {
          await tryClickPlay().catch(() => {});
        }
      }

      if (!m3u8) {
        console.log(
          `[vidsrc-cc] ✗ no m3u8 found after 25s. ${seen.length} requests observed. Last 15:`
        );
        seen.slice(-15).forEach((u) => console.log(`    ${u.slice(0, 140)}`));
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
      expiresAt: Date.now() + 1000 * 60 * 60,
    };
  },
};
