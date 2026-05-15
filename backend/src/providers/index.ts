import type { StreamProvider } from "./types.js";
import { frembedProvider } from "./frembed.js";
import {
  vidlinkProvider,
  vidlinkVfProvider,
  vidlinkVostfrProvider,
} from "./vidlink.js";
import { demoProvider } from "./demo.js";

// Ordre = priorite.
// frembed: VF reel (aggregateur francais), prioritaire si imdbId dispo.
// vidlink-vf/vostfr: fallback (ignore probablement le param dub).
// vidlink (MULTI): defaut anglais.
// demo: garantie BBB.
export const PROVIDERS: StreamProvider[] = [
  frembedProvider,
  vidlinkVfProvider,
  vidlinkVostfrProvider,
  vidlinkProvider,
  demoProvider,
];

export function getProvider(id: string): StreamProvider | undefined {
  return PROVIDERS.find((p) => p.id === id);
}

export function providersForLang(lang?: string): StreamProvider[] {
  if (!lang) return PROVIDERS;
  const matching = PROVIDERS.filter((p) => p.lang === lang);
  const fallback = PROVIDERS.filter(
    (p) => p.lang === "MULTI" || p.id === "demo"
  );
  return [...matching, ...fallback];
}
