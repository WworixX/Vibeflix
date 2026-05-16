import { newContext } from "../lib/browser.js";
import type { StreamProvider, StreamRequest, StreamResult } from "./types.js";

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

export type IframeProviderDef = {
  id: string;
  name: string;
  lang: "VF" | "VOSTFR" | "VO" | "MULTI";
  hd?: boolean;
  refererHost?: string; // pour le Referer header retourne
  buildUrl: (req: StreamRequest) => string | null;
  timeoutMs?: number;
  navTimeoutMs?: number;
};

export function makeIframeProvider(def: IframeProviderDef): StreamProvider {
  const timeoutMs = def.timeoutMs ?? 25000;
  const navTimeoutMs = def.navTimeoutMs ?? 25000;
  const refererHost = def.refererHost ?? "";

  return {
    id: def.id,
    name: def.name,
    lang: def.lang,
    hd: def.hd,
    async extract(req): Promise<StreamResult | null> {
      const embedUrl = def.buildUrl(req);
      if (!embedUrl) {
        console.log(`[${def.id}] URL non constructible (manque imdbId/tmdbId?)`);
        return null;
      }
      console.log(`[${def.id}] → ${embedUrl}`);

      const ctx = await newContext();
      const page = await ctx.newPage();
      let m3u8: { url: string; headers: Record<string, string> } | null = null;
      const seen: string[] = [];

      ctx.on("request", (r) => {
        const u = r.url();
        seen.push(u);
        if (!m3u8 && urlIsM3u8(u)) {
          console.log(`[${def.id}] ✓ URL: ${u.slice(0, 140)}`);
          m3u8 = { url: u, headers: r.headers() as Record<string, string> };
        }
      });
      ctx.on("response", (resp) => {
        if (m3u8) return;
        const u = resp.url();
        if (ignored(u)) return;
        const ct = resp.headers()["content-type"] ?? "";
        if (ctIsManifest(ct)) {
          console.log(`[${def.id}] ✓ CT "${ct}": ${u.slice(0, 140)}`);
          m3u8 = {
            url: u,
            headers: resp.request().headers() as Record<string, string>,
          };
        }
      });

      try {
        await page.goto(embedUrl, {
          waitUntil: "domcontentloaded",
          timeout: navTimeoutMs,
        });
        await page.waitForTimeout(1500);

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
              ".play-btn",
              "video",
            ]) {
              try {
                await frame
                  .locator(sel)
                  .first()
                  .click({ timeout: 800, force: true });
              } catch {}
            }
          }
        };
        await tryPlay();

        const start = Date.now();
        let lastClick = start;
        while (!m3u8 && Date.now() - start < timeoutMs) {
          await page.waitForTimeout(300);
          if (Date.now() - lastClick > 4000) {
            await tryPlay().catch(() => {});
            lastClick = Date.now();
          }
        }
        if (!m3u8) {
          console.log(
            `[${def.id}] ✗ no manifest apres ${timeoutMs}ms. ${seen.length} requests`
          );
        }
      } catch (err) {
        console.error(`[${def.id}] error:`, (err as Error).message.slice(0, 200));
      } finally {
        await ctx.close();
      }

      if (!m3u8) return null;
      return {
        m3u8Url: m3u8.url,
        headers: {
          Referer:
            m3u8.headers["referer"] ?? (refererHost ? `${refererHost}/` : ""),
          "User-Agent": m3u8.headers["user-agent"] ?? "",
        },
        providerId: def.id,
        providerName: def.name,
        expiresAt: Date.now() + 1000 * 60 * 60,
      };
    },
  };
}
