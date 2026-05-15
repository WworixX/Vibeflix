import type { StreamProvider } from "./types.js";
import { demoProvider } from "./demo.js";
import { vidsrcCcProvider } from "./vidsrc-cc.js";

// Ordre = priorite d'essai. Premier qui repond gagne.
// Phase B.1: demo en premier pour valider le frontend.
// Une fois valide, on basculera l'ordre quand vidsrc.cc marchera fiablement.
export const PROVIDERS: StreamProvider[] = [demoProvider, vidsrcCcProvider];

export function getProvider(id: string): StreamProvider | undefined {
  return PROVIDERS.find((p) => p.id === id);
}
