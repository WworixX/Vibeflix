import type { StreamProvider, StreamResult } from "./types.js";

/**
 * Provider de demo qui retourne toujours un m3u8 valide.
 * Sert a valider que le pipeline frontend (hls.js + manifest proxy)
 * fonctionne, independamment du scraping.
 *
 * Stream: Big Buck Bunny en HLS multi-bitrate (Mux test streams, libre de droit).
 */
export const demoProvider: StreamProvider = {
  id: "demo",
  name: "Démo (BBB libre)",
  lang: "MULTI",
  async extract(): Promise<StreamResult | null> {
    return {
      m3u8Url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
      headers: {},
      providerId: this.id,
      providerName: this.name,
      expiresAt: Date.now() + 1000 * 60 * 60 * 24,
    };
  },
};
