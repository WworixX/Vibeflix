import type { StreamProvider } from "./types.js";
import { flixhqProvider } from "./flixhq.js";
import { vidsrcCcProvider } from "./vidsrc-cc.js";
import { demoProvider } from "./demo.js";

// Ordre = priorite. Premier qui renvoie un m3u8 gagne.
// flixhq en premier (rapide, pas de Puppeteer).
// vidsrc.cc en fallback (lent + bot-detection mais large catalogue).
// demo en dernier garantie absolue (BBB libre).
export const PROVIDERS: StreamProvider[] = [
  flixhqProvider,
  vidsrcCcProvider,
  demoProvider,
];

export function getProvider(id: string): StreamProvider | undefined {
  return PROVIDERS.find((p) => p.id === id);
}
