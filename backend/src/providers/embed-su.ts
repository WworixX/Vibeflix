import { newContext } from "../lib/browser.js";
import type { StreamProvider, StreamRequest, StreamResult } from "./types.js";

function buildEmbedUrl(req: StreamRequest): string {
  if (req.type === "film") {
    return `https://embed.su/embed/movie/${req.tmdbId}`;
  }
  return `https://embed.su/embed/tv/${req.tmdbId}/${req.season ?? 1}/${req.episode ?? 1}`;
}

const M3U8_URL_PATTERNS = [/\.m3u8(\?|$)/i, /\/manifest/i, /\/master\.txt/i];
const M3U8_CT = [
  "application/vnd.apple.mpegurl",
  "application/x-mpegurl",
  "application/dash+xml",
];
const IGNORE = [
  /googlevideo/,
  /doubleclick/,
  /google-analytics/,
  /\.(png|jpg|jpeg|svg|gif|webp|ico|css|woff2?|ttf)(\?|$)/i,
];

function ignored(u: string) {
  return IGNORE.some((p) => p.test(u));
}
function urlIsM3u8(u: string) {
  return !ignored(u) && M3U8_URL_PATTERNS.some((p) => p.test(u));
}
function ctIsManifest(ct: string) {
  return M3U8_CT.some((m) => ct.toLowerCase().includes(m));
}

/**
 * embed.su - infra separee de vidsrc/videasy.
 * Avec stealth (cf browser.ts), bypass des bot detections classiques.
 */
export const embedSuProvider: StreamProvider = {
  id: "embed-su",
  name: "Lecteur 2",
  lang: "MULTI",
  async extract(req): Promise<StreamResult | null> {
    const embedUrl = buildEmbedUrl(req);
    console.log(`[embed-su] → ${embedUrl}`);
    const ctx = await newContext();
    const page = await ctx.newPage();

    let m3u8: { url: string; headers: Record<string, string> } | null = null;
    const seen: string[] = [];

    ctx.on("request", (r) => {
      const u = r.url();
      seen.push(u);
      if (!m3u8 && urlIsM3u8(u)) {
        console.log(`[embed-su] ✓ via URL: ${u.slice(0, 140)}`);
        m3u8 = { url: u, headers: r.headers() as Record<string, string> };
      }
    });
    ctx.on("response", (resp) => {
      if (m3u8) return;
      const u = resp.url();
      if (ignored(u)) return;
      const ct = resp.headers()["content-type"] ?? "";
      if (ctIsManifest(ct)) {
        console.log(`[embed-su] ✓ via CT "${ct}": ${u.slice(0, 140)}`);
        m3u8 = {
          url: u,
          headers: resp.request().headers() as Record<string, string>,
        };
      }
    });

    try {
      await page.goto(embedUrl, {
        waitUntil: "domcontentloaded",
        timeout: 30000,
      });
      await page.waitForTimeout(2000);

      const tryPlay = async () => {
        try {
          await page.mouse.click(640, 360);
        } catch {}
        for (const frame of page.frames()) {
          for (const sel of [
            "button[aria-label*='play' i]",
            ".vjs-big-play-button",
            ".plyr__control--overlaid",
            "button.play",
            "[data-play]",
            "video",
          ]) {
            try {
              await frame.locator(sel).first().click({ timeout: 1200, force: true });
            } catch {}
          }
        }
      };
      await tryPlay();

      const start = Date.now();
      let lastClick = start;
      while (!m3u8 && Date.now() - start < 30000) {
        await page.waitForTimeout(300);
        if (Date.now() - lastClick > 5000) {
          await tryPlay().catch(() => {});
          lastClick = Date.now();
        }
      }

      if (!m3u8) {
        console.log(`[embed-su] ✗ no manifest. ${seen.length} requests. Last 20:`);
        seen.slice(-20).forEach((u, i) =>
          console.log(`  [${i + 1}] ${u.slice(0, 160)}`)
        );
      }
    } catch (err) {
      console.error("[embed-su] error", err);
    } finally {
      await ctx.close();
    }

    if (!m3u8) return null;
    return {
      m3u8Url: m3u8.url,
      headers: {
        Referer: m3u8.headers["referer"] ?? "https://embed.su/",
        "User-Agent": m3u8.headers["user-agent"] ?? "",
      },
      providerId: this.id,
      providerName: this.name,
      expiresAt: Date.now() + 1000 * 60 * 60,
    };
  },
};
