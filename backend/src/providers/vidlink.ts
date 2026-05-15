import { newContext } from "../lib/browser.js";
import type { StreamProvider, StreamRequest, StreamResult } from "./types.js";

type Variant = "MULTI" | "VF" | "VOSTFR";

function buildEmbedUrl(req: StreamRequest, variant: Variant): string {
  const base =
    req.type === "film"
      ? `https://vidlink.pro/movie/${req.tmdbId}`
      : `https://vidlink.pro/tv/${req.tmdbId}/${req.season ?? 1}/${req.episode ?? 1}`;
  const params = new URLSearchParams({
    autoplay: "true",
    title: "false",
  });
  if (variant === "VF") {
    params.set("dub", "fr");
    params.set("preferredAudio", "fr");
  } else if (variant === "VOSTFR") {
    params.set("sub", "fr");
    params.set("preferredSub", "fr");
  }
  return `${base}?${params.toString()}`;
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

function makeProvider(
  id: string,
  name: string,
  lang: "MULTI" | "VF" | "VOSTFR"
): StreamProvider {
  return {
    id,
    name,
    lang,
    async extract(req): Promise<StreamResult | null> {
      const embedUrl = buildEmbedUrl(req, lang);
      console.log(`[${id}] → ${embedUrl}`);
      const ctx = await newContext();
      const page = await ctx.newPage();

      let m3u8: { url: string; headers: Record<string, string> } | null = null;
      const seen: string[] = [];

      ctx.on("request", (r) => {
        const u = r.url();
        seen.push(u);
        if (!m3u8 && urlIsM3u8(u)) {
          console.log(`[${id}] ✓ URL: ${u.slice(0, 140)}`);
          m3u8 = { url: u, headers: r.headers() as Record<string, string> };
        }
      });
      ctx.on("response", (resp) => {
        if (m3u8) return;
        const u = resp.url();
        if (ignored(u)) return;
        const ct = resp.headers()["content-type"] ?? "";
        if (ctIsManifest(ct)) {
          console.log(`[${id}] ✓ CT "${ct}": ${u.slice(0, 140)}`);
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
                await frame.locator(sel).first().click({ timeout: 1200, force: true });
              } catch {}
            }
          }
        };
        await tryPlay();

        const start = Date.now();
        let lastClick = start;
        while (!m3u8 && Date.now() - start < 25000) {
          await page.waitForTimeout(300);
          if (Date.now() - lastClick > 5000) {
            await tryPlay().catch(() => {});
            lastClick = Date.now();
          }
        }

        if (!m3u8) {
          console.log(`[${id}] ✗ no manifest. ${seen.length} requests.`);
        }
      } catch (err) {
        console.error(`[${id}] error`, err);
      } finally {
        await ctx.close();
      }

      if (!m3u8) return null;
      return {
        m3u8Url: m3u8.url,
        headers: {
          Referer: m3u8.headers["referer"] ?? "https://vidlink.pro/",
          "User-Agent": m3u8.headers["user-agent"] ?? "",
        },
        providerId: id,
        providerName: name,
        expiresAt: Date.now() + 1000 * 60 * 60,
      };
    },
  };
}

export const vidlinkProvider = makeProvider("vidlink", "Lecteur HD", "MULTI");
export const vidlinkVfProvider = makeProvider("vidlink-vf", "VF", "VF");
export const vidlinkVostfrProvider = makeProvider(
  "vidlink-vostfr",
  "VOSTFR",
  "VOSTFR"
);
