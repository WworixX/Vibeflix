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

const M3U8_URL_PATTERNS = [
  /\.m3u8(\?|$)/i,
  /\/manifest/i,
  /\/master\.txt/i,
  /\/playlist\.m3u8/i,
];

const M3U8_CONTENT_TYPES = [
  "application/vnd.apple.mpegurl",
  "application/x-mpegurl",
  "application/dash+xml",
  "audio/mpegurl",
];

const IGNORE_URL_PATTERNS = [
  /googlevideo/,
  /doubleclick/,
  /google-analytics/,
  /googletagmanager/,
  /facebook\.com\/tr/,
  /\.(png|jpg|jpeg|svg|gif|webp|ico)(\?|$)/i,
  /\.(css|woff2?|ttf)(\?|$)/i,
];

function shouldIgnoreUrl(url: string): boolean {
  return IGNORE_URL_PATTERNS.some((p) => p.test(url));
}

function urlLooksLikeM3u8(url: string): boolean {
  if (shouldIgnoreUrl(url)) return false;
  return M3U8_URL_PATTERNS.some((p) => p.test(url));
}

function contentTypeIsManifest(ct: string): boolean {
  return M3U8_CONTENT_TYPES.some((m) => ct.toLowerCase().includes(m));
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

    // Detection 1: par URL pattern
    ctx.on("request", (r) => {
      const url = r.url();
      seen.push(url);
      if (!m3u8 && urlLooksLikeM3u8(url)) {
        console.log(`[vidsrc-cc] ✓ via URL: ${url.slice(0, 140)}`);
        m3u8 = { url, headers: r.headers() as Record<string, string> };
      }
    });

    // Detection 2: par Content-Type de la reponse (plus fiable)
    ctx.on("response", async (resp) => {
      if (m3u8) return;
      const url = resp.url();
      if (shouldIgnoreUrl(url)) return;
      const ct = resp.headers()["content-type"] ?? "";
      if (contentTypeIsManifest(ct)) {
        console.log(`[vidsrc-cc] ✓ via Content-Type "${ct}": ${url.slice(0, 140)}`);
        m3u8 = {
          url,
          headers: resp.request().headers() as Record<string, string>,
        };
      }
    });

    try {
      await page.goto(embedUrl, {
        waitUntil: "domcontentloaded",
        timeout: 30000,
        referer: "https://vidsrc.cc/",
      });

      await page.waitForTimeout(2000);

      // Click central pour declencher autoplay
      try {
        await page.mouse.click(640, 360);
      } catch {}

      // Click sur boutons play dans tous les frames
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

      // 35s d'attente, re-click toutes les 5s
      const start = Date.now();
      let lastClick = start;
      while (!m3u8 && Date.now() - start < 35000) {
        await page.waitForTimeout(300);
        if (Date.now() - lastClick > 5000) {
          await tryClickPlay().catch(() => {});
          lastClick = Date.now();
        }
      }

      if (!m3u8) {
        console.log(
          `[vidsrc-cc] ✗ no manifest found after 35s. ${seen.length} requests:`
        );
        seen.forEach((u, i) => console.log(`  [${i + 1}] ${u.slice(0, 160)}`));
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
