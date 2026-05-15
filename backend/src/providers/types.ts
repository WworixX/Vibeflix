export type StreamRequest = {
  tmdbId: number;
  imdbId?: string;
  type: "film" | "serie";
  season?: number;
  episode?: number;
  title?: string;
  year?: number;
};

export type StreamResult = {
  m3u8Url: string;
  headers?: Record<string, string>;
  subtitles?: Array<{ lang: string; url: string }>;
  // Provider metadata
  providerId: string;
  providerName: string;
  expiresAt?: number;
};

export interface StreamProvider {
  id: string;
  name: string;
  lang: "VF" | "VOSTFR" | "VO" | "MULTI";
  extract(req: StreamRequest): Promise<StreamResult | null>;
}
