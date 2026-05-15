import type { StreamProvider } from "./types.js";
import {
  vidlinkProvider,
  vidlinkVfProvider,
  vidlinkVostfrProvider,
} from "./vidlink.js";
import { demoProvider } from "./demo.js";

// Variantes vidlink par langue + demo fallback.
// Le client envoie lang -> backend filtre PROVIDERS.
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
  // Si lang specifie, filtre + ajoute MULTI/demo en fallback
  const matching = PROVIDERS.filter((p) => p.lang === lang);
  const fallback = PROVIDERS.filter(
    (p) => p.lang === "MULTI" || p.id === "demo"
  );
  return [...matching, ...fallback];
}
