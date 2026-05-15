import express, { type Request, type Response } from "express";
import cors from "cors";
import { TTLCache } from "./lib/cache.js";
import { PROVIDERS, getProvider } from "./providers/index.js";
import type { StreamResult, StreamRequest } from "./providers/types.js";

const app = express();
const PORT = Number(process.env.PORT ?? 3001);

app.use(
  cors({
    origin: process.env.ALLOWED_ORIGIN ?? "*",
    credentials: false,
  })
);

// Cache 30 min sur les resultats d'extraction
const streamCache = new TTLCache<StreamResult>(1000 * 60 * 30);

app.get("/health", (_req, res) => {
  res.json({ ok: true, providers: PROVIDERS.map((p) => p.id) });
});

/**
 * GET /api/stream?tmdbId=693134&type=film[&season=1&episode=1]
 *
 * Retourne { m3u8Url, headers, providerId } ou 404.
 */
app.get("/api/stream", async (req: Request, res: Response) => {
  const tmdbId = Number(req.query.tmdbId);
  const type = req.query.type as "film" | "serie" | undefined;
  const season = req.query.season ? Number(req.query.season) : undefined;
  const episode = req.query.episode ? Number(req.query.episode) : undefined;
  const providerId = req.query.provider as string | undefined;
  const title = req.query.title as string | undefined;
  const year = req.query.year ? Number(req.query.year) : undefined;

  if (!tmdbId || !type) {
    return res.status(400).json({ error: "tmdbId et type requis" });
  }

  const cacheKey = `${tmdbId}-${type}-${season ?? 0}-${episode ?? 0}-${providerId ?? "auto"}`;
  const cached = streamCache.get(cacheKey);
  if (cached) {
    return res.json({ ...cached, cached: true });
  }

  const streamReq: StreamRequest = { tmdbId, type, season, episode, title, year };

  // Provider explicite OU tous dans l'ordre
  const candidates = providerId
    ? [getProvider(providerId)].filter(Boolean)
    : PROVIDERS;

  for (const p of candidates) {
    if (!p) continue;
    try {
      console.log(`[stream] trying ${p.id} for tmdbId=${tmdbId} type=${type}`);
      const result = await p.extract(streamReq);
      if (result) {
        streamCache.set(cacheKey, result);
        return res.json({ ...result, cached: false });
      }
    } catch (err) {
      console.error(`[stream] ${p.id} failed`, err);
    }
  }

  res.status(404).json({ error: "Aucune source disponible pour ce titre" });
});

/**
 * GET /api/manifest?url=https%3A%2F%2F...m3u8
 *
 * Proxy le manifeste HLS pour:
 *  - eviter les problemes CORS cote frontend
 *  - injecter les headers (Referer) necessaires
 *  - reecrire les URLs relatives des segments en absolues
 */
app.get("/api/manifest", async (req: Request, res: Response) => {
  const target = req.query.url as string | undefined;
  const referer = (req.query.referer as string | undefined) ?? "";
  if (!target) return res.status(400).send("url requis");

  try {
    const upstream = await fetch(target, {
      headers: {
        Referer: referer,
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
      },
    });

    if (!upstream.ok) {
      return res.status(upstream.status).send(`Upstream ${upstream.status}`);
    }

    const ct = upstream.headers.get("content-type") ?? "application/vnd.apple.mpegurl";
    res.setHeader("Content-Type", ct);
    res.setHeader("Cache-Control", "no-cache");

    const text = await upstream.text();
    const base = new URL(target);

    // Reecriture: chaque ligne non-comment qui n'est pas une URL absolue
    // devient une URL absolue basee sur le m3u8.
    const rewritten = text
      .split("\n")
      .map((line) => {
        if (!line.trim() || line.startsWith("#")) return line;
        if (line.startsWith("http://") || line.startsWith("https://")) return line;
        return new URL(line, base).toString();
      })
      .join("\n");

    res.send(rewritten);
  } catch (err) {
    console.error("[manifest] proxy error", err);
    res.status(500).send("Proxy error");
  }
});

app.listen(PORT, () => {
  console.log(`✓ VibeFlix backend running on http://localhost:${PORT}`);
  console.log(`  Providers: ${PROVIDERS.map((p) => p.id).join(", ")}`);
});
