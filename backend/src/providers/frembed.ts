import { newContext } from "../lib/browser.js";
import type { StreamProvider, StreamRequest, StreamResult } from "./types.js";

/**
 * Frembed - aggregateur francais (VF + VOSTFR).
 * Utilise IMDB ID (avec prefixe tt).
 *
 * Try plusieurs domaines: frembed.icu / frembed.li / frembed.cc
 */
const HOSTS = ["https://frembed.icu", "https://frembed.li", "https://frembed.cc"];

function buildEmbedUrl(req: StreamRequest, host: string): string | null {
  if (!req.imdbId) return null;
  if (req.type === "film") {
    return `${host}/api/film.php?id=${req.imdbId}`;
  }
  return `${host}/api/serie.php?id=${req.imdbId}&sa=${req.season ?? 1}&epi=${
    req.episode ?? 1
  }`;
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

const ignored = (u: string) => IGNORE.some((p) => p.test(u));
const urlIsM3u8 = (u: string) =>
  !ignored(u) && M3U8_URL_PATTERNS.some((p) => p.test(u));
const ctIsManifest = (ct: string) =>
  M3U8_CT.some((m) => ct.toLowerCase().includes(m));

async function tryHost(host: string, req: StreamRequest): Promise<StreamResult | null> {
  const embedUrl = buildEmbedUrl(req, host);
  if (!embedUrl) return null;

  console.log(`[frembed] → ${embedUrl}`);
  const ctx = await newContext();
  const page = await ctx.newPage();

  let m3u8: { url: string; headers: Record<string, string> } | null = null;
  const seen: string[] = [];

  ctx.on("request", (r) => {
    const u = r.url();
    seen.push(u);
    if (!m3u8 && urlIsM3u8(u)) {
      console.log(`[frembed] ✓ URL: ${u.slice(0, 140)}`);
      m3u8 = { url: u, headers: r.headers() as Record<string, string> };
    }
  });
  ctx.on("response", (resp) => {
    if (m3u8) return;
    const u = resp.url();
    if (ignored(u)) return;
    const ct = resp.headers()["content-type"] ?? "";
    if (ctIsManifest(ct)) {
      console.log(`[frembed] ✓ CT "${ct}": ${u.slice(0, 140)}`);
      m3u8 = {
        url: u,
        headers: resp.request().headers() as Record<string, string>,
      };
    }
  });

  try {
    await page.goto(embedUrl, {
      waitUntil: "domcontentloaded",
      timeout: 20000,
    });
    await page.waitForTimeout(2500);

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
          "video",
        ]) {
          try {
            await frame.locator(sel).first().click({ timeout: 1000, force: true });
          } catch {}
        }
      }
    };
    await tryPlay();

    const start = Date.now();
    let lastClick = start;
    while (!m3u8 && Date.now() - start < 22000) {
      await page.waitForTimeout(300);
      if (Date.now() - lastClick > 5000) {
        await tryPlay().catch(() => {});
        lastClick = Date.now();
      }
    }
  } catch (err) {
    console.error(`[frembed] ${host} error:`, (err as Error).message);
  } finally {
    await ctx.close();
  }

  if (!m3u8) return null;
  return {
    m3u8Url: m3u8.url,
    headers: {
      Referer: m3u8.headers["referer"] ?? `${host}/`,
      "User-Agent": m3u8.headers["user-agent"] ?? "",
    },
    providerId: "frembed",
    providerName: "VF — Frembed",
    expiresAt: Date.now() + 1000 * 60 * 60,
  };
}

export const frembedProvider: StreamProvider = {
  id: "frembed",
  name: "VF",
  lang: "VF",
  async extract(req): Promise<StreamResult | null> {
    if (!req.imdbId) {
      console.log("[frembed] manque imdbId");
      return null;
    }
    for (const host of HOSTS) {
      const result = await tryHost(host, req);
      if (result) return result;
    }
    console.log("[frembed] ✗ tous les hosts ont echoue");
    return null;
  },
};
