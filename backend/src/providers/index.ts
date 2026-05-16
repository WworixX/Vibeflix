import type { StreamProvider } from "./types.js";
import { ALL_PROVIDERS } from "./all.js";
import { demoProvider } from "./demo.js";

// Tous les providers iframes (par langue) + demo fallback BBB
export const PROVIDERS: StreamProvider[] = [...ALL_PROVIDERS, demoProvider];

export function getProvider(id: string): StreamProvider | undefined {
  return PROVIDERS.find((p) => p.id === id);
}

export function providersForLang(lang?: string): StreamProvider[] {
  if (!lang) return PROVIDERS;
  const matching = PROVIDERS.filter((p) => p.lang === lang);
  return [...matching, demoProvider];
}

// Liste publique pour /api/providers
export function listProviders() {
  return PROVIDERS.filter((p) => p.id !== "demo").map((p) => ({
    id: p.id,
    name: p.name,
    lang: p.lang,
    hd: (p as any).hd ?? false,
  }));
}
