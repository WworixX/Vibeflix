import type { StreamProvider } from "./types.js";
import { autoembedProvider } from "./autoembed.js";
import { embedSuProvider } from "./embed-su.js";
import { vidsrcCcProvider } from "./vidsrc-cc.js";
import { videasyProvider } from "./videasy.js";
import { demoProvider } from "./demo.js";

// Ordre = priorite.
// autoembed: simple, peu de protections, candidat #1.
// embed-su: infra separee.
// vidsrc-cc: ralenti par videasy + bot detection.
// videasy: API chiffree (peu utile).
// demo: garantie BBB.
export const PROVIDERS: StreamProvider[] = [
  autoembedProvider,
  embedSuProvider,
  vidsrcCcProvider,
  videasyProvider,
  demoProvider,
];

export function getProvider(id: string): StreamProvider | undefined {
  return PROVIDERS.find((p) => p.id === id);
}
