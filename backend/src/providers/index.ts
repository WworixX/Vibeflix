import type { StreamProvider } from "./types.js";
import { videasyProvider } from "./videasy.js";
import { vidsrcCcProvider } from "./vidsrc-cc.js";
import { demoProvider } from "./demo.js";

// Ordre = priorite.
// videasy: HTTP direct, rapide.
// vidsrc-cc: Playwright, lent + bot-detection.
// demo: garantie absolue (BBB libre).
//
// FlixHQ retire: 522 Cloudflare, domaine HS.
export const PROVIDERS: StreamProvider[] = [
  videasyProvider,
  vidsrcCcProvider,
  demoProvider,
];

export function getProvider(id: string): StreamProvider | undefined {
  return PROVIDERS.find((p) => p.id === id);
}
