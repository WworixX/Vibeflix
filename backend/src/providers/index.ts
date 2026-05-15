import type { StreamProvider } from "./types.js";
import { embedSuProvider } from "./embed-su.js";
import { vidsrcCcProvider } from "./vidsrc-cc.js";
import { videasyProvider } from "./videasy.js";
import { demoProvider } from "./demo.js";

// Ordre = priorite.
// embed-su: Playwright + stealth, infra simple, player non-WASM.
// vidsrc-cc: Playwright + stealth, fallback.
// videasy: API directe (chiffree, peu utile mais on garde).
// demo: garantie BBB.
export const PROVIDERS: StreamProvider[] = [
  embedSuProvider,
  vidsrcCcProvider,
  videasyProvider,
  demoProvider,
];

export function getProvider(id: string): StreamProvider | undefined {
  return PROVIDERS.find((p) => p.id === id);
}
