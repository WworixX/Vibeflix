# VibeFlix — Contexte du projet

## Vision
Plateforme de streaming films, séries et live, positionnée comme **l'alternative éditoriale et soignée** au streaming corporate. Public cible : 16–28 ans, sensibles au design, qui détectent un template générique en trois secondes. Le produit doit donner envie de s'inscrire **avant** d'avoir compris ce qu'il fait.

## Modèle économique
- **Free** : tout le catalogue, avec quelques pubs courtes (15s max, skippable à 5s).
- **Premium** : 1 €/mois ou 5 €/an. Plus de pub, 4K Dolby Vision + Atmos, 5 profils, 4 écrans simultanés, téléchargements illimités.

## Direction artistique
- **Palette** : mint/emerald sur charcoal profond. Pas de noir pur, pas de néon — un vert légèrement frais (`#3FCB89` → `#0F6E4D`) sur un fond `#0B1411`.
- **Typo** : Geist (UI + display, en font-semibold avec tracking serré pour les titres).
- **Coins** : doux partout (`rounded-2xl`, `rounded-3xl`, `rounded-[28px]`).
- **Gradients** : mesh atmosphériques façon Linear/Stripe, jamais agressifs.
- **Motion** : "exhales, not bounces". Easing `cubic-bezier(0.22, 0.61, 0.36, 1)`, durées longues (500–1000ms), pas de spring juvénile.
- **Espacement** : générosité éditoriale. Préférer six éléments respirants à trente entassés.
- **Grain** : léger overlay SVG noise pour profondeur cinéma.

## Stack
- **Next.js 15** (App Router, RSC) + **TypeScript**
- **Tailwind CSS** v3 (config étendue : palette `char/mint`, easing `exhale`, keyframes `drift/breathe`)
- **Framer Motion** pour les transitions
- **Zustand** + `persist` (`vibeflix-store-v2`) — auth mock, profils, watchlist, statut Premium
- **Lucide React** pour les icônes
- Polices via `next/font/google` (Fraunces axes `opsz` + `SOFT`, Geist)

## Routes
| Route | Description |
|-------|-------------|
| `/` | Landing éditoriale (Hero magazine, Features, Showcase, PricingTeaser, Testimonials, FAQ, CTA) |
| `/login`, `/signup` | Auth mockée |
| `/profiles` | Sélection de profil avec gradients colorés |
| `/browse` | Hero cinéma + carrousels par humeur et par genre |
| `/live` | Diffusions en direct |
| `/watch/[id]` | Lecteur MP4 réel + simulation de pub + détails |
| `/pricing` | Toggle mensuel/annuel, comparatif Free vs Premium |
| `/my-list` | Watchlist |

## Données
- Films/séries **réels** (TMDB) : Dune Part Two, Stranger Things, The Last of Us, Mercredi, Oppenheimer, Interstellar, House of the Dragon, Breaking Bad, The Bear, Everything Everywhere, Succession, The Batman, Spider-Verse, Barbie, Arcane, Anatomie d'une chute.
- Posters & backdrops servis via `image.tmdb.org`.
- Vidéo échantillon : Big Buck Bunny (Google CDN).

## À faire
- [ ] Brancher la source vidéo réelle sur `components/VideoPlayer.tsx` (remplacer `SAMPLE_VIDEO_URL`).
- [ ] Auth réelle (NextAuth / Clerk / Supabase).
- [ ] Backend pour persister profils, watchlist et progression.
- [ ] Paiement Stripe (1 €/mois et 5 €/an).
- [ ] Recherche globale (cmd+K) avec filtres genres/humeurs.
- [ ] Recommandations personnalisées par profil.
- [ ] CMS éditorial pour la curation par humeurs.
- [ ] Tests E2E (Playwright) sur les parcours clés.
- [ ] Sitemap dynamique + OG images générées par titre.

## Conventions
- Composants en PascalCase dans `components/`.
- Données mockées dans `lib/mock-data.ts`.
- État global dans `lib/store.ts`.
- Classes utilitaires custom dans `globals.css` (`btn-primary`, `chip`, `glass`, `h-display`).
- Pas de commentaires superflus.
- Toute UI textuelle en français.
