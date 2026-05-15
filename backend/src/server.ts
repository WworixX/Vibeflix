import express, { type Request, type Response } from "express";
import cors from "cors";
import { TTLCache } from "./lib/cache.js";
import { PROVIDERS, getProvider, providersForLang } from "./providers/index.js";
import type { StreamResult, StreamRequest } from "./providers/types.js";

const app = express();
const PORT = Number(process.env.PORT ?? 3001);

app.use(
  cors({
    origin: process.env.ALLOWED_ORIGIN ?? "*",
    credentials: false,
  })
);

const streamCache = new TTLCache<StreamResult>(1000 * 60 * 30);

app.get("/health", (_req, res) => {
  res.json({ ok: true, providers: PROVIDERS.map((p) => ({ id: p.id, lang: p.lang })) });
});

app.get("/api/stream", async (req: Request, res: Response) => {
  const tmdbId = Number(req.query.tmdbId);
  const imdbId = req.query.imdbId as string | undefined;
  const type = req.query.type as "film" | "serie" | undefined;
  const season = req.query.season ? Number(req.query.season) : undefined;
  const episode = req.query.episode ? Number(req.query.episode) : undefined;
  const providerId = req.query.provider as string | undefined;
  const title = req.query.title as string | undefined;
  const year = req.query.year ? Number(req.query.year) : undefined;
  const lang = req.query.lang as string | undefined;

  if (!tmdbId || !type) {
    return res.status(400).json({ error: "tmdbId et type requis" });
  }

  const cacheKey = `${tmdbId}-${type}-${season ?? 0}-${episode ?? 0}-${providerId ?? lang ?? "auto"}`;
  const cached = streamCache.get(cacheKey);
  if (cached) {
    return res.json({ ...cached, cached: true });
  }

  const streamReq: StreamRequest = { tmdbId, imdbId, type, season, episode, title, year };

  // Provider explicite OU filtre par lang OU tous
  const candidates = providerId
    ? [getProvider(providerId)].filter(Boolean)
    : providersForLang(lang);

  for (const p of candidates) {
    if (!p) continue;
    try {
      console.log(`[stream] trying ${p.id} for tmdbId=${tmdbId} type=${type} lang=${lang ?? "auto"}`);
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
  console.log(`  Providers: ${PROVIDERS.map((p) => `${p.id}(${p.lang})`).join(", ")}`);
});
