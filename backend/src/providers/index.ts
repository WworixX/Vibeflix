import type { StreamProvider } from "./types.js";
import { vidsrcCcProvider } from "./vidsrc-cc.js";

// Ordre = priorite d'essai. Phase B.1: un seul provider pour valider l'archi.
// Phase B.2: ajouter les providers VF/VOSTFR ici.
export const PROVIDERS: StreamProvider[] = [vidsrcCcProvider];

export function getProvider(id: string): StreamProvider | undefined {
  return PROVIDERS.find((p) => p.id === id);
}
