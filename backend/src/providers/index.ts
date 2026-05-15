import type { StreamProvider } from "./types.js";
import { vidlinkProvider } from "./vidlink.js";
import { autoembedProvider } from "./autoembed.js";
import { embedSuProvider } from "./embed-su.js";
import { vidsrcCcProvider } from "./vidsrc-cc.js";
import { videasyProvider } from "./videasy.js";
import { demoProvider } from "./demo.js";

// Ordre = priorite.
// vidlink: confirme accessible chez user en iframe, candidat #1.
// autoembed/embed-su: NXDOMAIN actuel chez user.
// vidsrc-cc: bot detection videasy redirige vers YouTube.
// videasy API: chiffree.
// demo: garantie BBB.
export const PROVIDERS: StreamProvider[] = [
  vidlinkProvider,
  autoembedProvider,
  embedSuProvider,
  vidsrcCcProvider,
  videasyProvider,
  demoProvider,
];

export function getProvider(id: string): StreamProvider | undefined {
  return PROVIDERS.find((p) => p.id === id);
}
