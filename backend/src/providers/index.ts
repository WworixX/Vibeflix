import type { StreamProvider } from "./types.js";
import {
  vidlinkProvider,
  vidlinkVfProvider,
  vidlinkVostfrProvider,
} from "./vidlink.js";
import { demoProvider } from "./demo.js";

// Ordre = priorite.
// vidlink: source principale fiable.
// demo: garantie BBB en dernier.
//
// Retires:
//   - autoembed, embed-su (NXDOMAIN)
//   - vidsrc-cc (videasy WASM bot detect + redirige YouTube)
//   - videasy (API chiffree)
//   - frembed (3 hosts tous morts/timeout 60s gaspilles)
export const PROVIDERS: StreamProvider[] = [
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
