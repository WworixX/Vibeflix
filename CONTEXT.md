# VibeFlix — Contexte du projet

## Vision
VibeFlix est une plateforme de streaming films/séries au positionnement freemium :
- **Free** : accès complet au catalogue avec publicités intégrées au player.
- **Premium** : suppression totale des publicités + qualité supérieure (positionnement marketing).

Le produit doit dégager une sensation premium et cinématographique, dans la lignée de Netflix, Apple TV+ et MUBI, tout en assumant un côté "vibes" et découverte (curation par humeurs/ambiances).

## Cible
- Spectateurs 18–45 ans, habitués des plateformes de SVOD.
- Sensibles au design et à la qualité éditoriale.
- Mix entre utilisateurs gratuits (tolèrent les pubs) et payants (cherchent l'expérience pure).

## Objectif de conversion
1. Inscription gratuite (faible friction, accès rapide au catalogue).
2. Upsell vers Premium depuis :
   - L'overlay de pub dans le player ("Supprimer les pubs").
   - La page `/pricing`.
   - Des CTAs contextuels dans la navbar et après onboarding.

## Stack technique
- **Framework** : Next.js 15 (App Router, RSC) + TypeScript
- **Style** : Tailwind CSS v4 (config inline via `@theme`)
- **Animations** : Framer Motion
- **Icônes** : Lucide React
- **State client** : Zustand (profil sélectionné, watchlist, statut Premium) avec persistance `localStorage`
- **Auth** : UI mockée (aucun backend), simulation côté client

## Structure des routes
| Route | Description |
|-------|-------------|
| `/` | Landing marketing (hero, features, testimonials, pricing teaser, CTA) |
| `/login`, `/signup` | Pages d'authentification mockées |
| `/profiles` | Sélection de profil (style Netflix) |
| `/browse` | Catalogue principal avec carrousels par catégorie |
| `/watch/[id]` | Lecteur vidéo avec simulation de publicité skippable |
| `/pricing` | Comparatif Free vs Premium |
| `/my-list` | Watchlist de l'utilisateur |

## Données / contenus
- **v1** : données 100% mockées dans `lib/mock-data.ts` avec posters via Unsplash/placeholders.
- **À venir** : intégration d'un flux vidéo externe (à brancher plus tard sur `/watch/[id]`).

## Design system
- Palette : noir profond (#0A0A0B), accent magenta/violet (`#E11D74` → `#7C3AED`), texte off-white.
- Typo : Inter (UI) + une display serif optionnelle pour les titres marketing.
- Animations : entrées subtiles, hover states sur les cards, transitions de page douces.

## À faire / modifications futures
- [ ] Brancher la source vidéo réelle (flux externe) sur le composant `VideoPlayer`.
- [ ] Connecter une vraie auth (NextAuth / Clerk / Supabase) — actuellement mockée.
- [ ] Backend pour persister profils + watchlist côté serveur (actuellement `localStorage`).
- [ ] Intégrer un vrai système de paiement (Stripe) pour l'abonnement Premium.
- [ ] Recommandations personnalisées (algorithme ou API tierce).
- [ ] CMS pour gérer le catalogue (Sanity, Payload, ou base custom).
- [ ] SEO : métadonnées par film, sitemap dynamique, OG images générées.
- [ ] Tests E2E (Playwright) sur les parcours clés.

## Conventions
- Composants en PascalCase dans `components/`.
- Données mockées centralisées dans `lib/mock-data.ts`.
- État global dans `lib/store.ts` (Zustand).
- Pas de commentaires superflus dans le code (le code doit s'auto-documenter).
