export const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

export type StreamInfo = {
  m3u8Url: string;
  headers?: Record<string, string>;
  providerId: string;
  providerName: string;
  expiresAt?: number;
  cached?: boolean;
};

export type Lang = "VF" | "VOSTFR" | "MULTI";

export type StreamRequest = {
  tmdbId: number;
  type: "film" | "serie";
  season?: number;
  episode?: number;
  title?: string;
  year?: number;
  lang?: Lang;
};

export async function fetchStream(
  req: StreamRequest,
  signal?: AbortSignal
): Promise<StreamInfo> {
  const params = new URLSearchParams({
    tmdbId: String(req.tmdbId),
    type: req.type,
  });
  if (req.season) params.set("season", String(req.season));
  if (req.episode) params.set("episode", String(req.episode));
  if (req.title) params.set("title", req.title);
  if (req.year) params.set("year", String(req.year));
  if (req.lang) params.set("lang", req.lang);

  const res = await fetch(`${BACKEND_URL}/api/stream?${params.toString()}`, {
    signal,
  });
  if (!res.ok) {
    throw new Error(`Backend ${res.status}: ${await res.text()}`);
  }
  return res.json();
}

export function buildManifestUrl(stream: StreamInfo): string {
  const referer = stream.headers?.Referer ?? "";
  const params = new URLSearchParams({
    url: stream.m3u8Url,
    referer,
  });
  return `${BACKEND_URL}/api/manifest?${params.toString()}`;
}

export function isBackendConfigured(): boolean {
  return !!process.env.NEXT_PUBLIC_BACKEND_URL;
}
