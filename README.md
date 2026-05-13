# VibeFlix

Plateforme de streaming films/séries — freemium (gratuit avec pubs, Premium sans pub).

> **Important :** lire [`CONTEXT.md`](./CONTEXT.md) pour le contexte produit complet, les conventions et la roadmap.

## Stack

- **Next.js 15** (App Router, RSC) + **TypeScript**
- **Tailwind CSS** 3 (config étendue avec design system VibeFlix)
- **Framer Motion** pour les animations
- **Zustand** + `persist` pour l'état client (auth mock, profils, watchlist, statut Premium)
- **Lucide React** pour les icônes
- Police : Inter (UI) + Instrument Serif (titres display)

## Installation

```bash
npm install
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

## Scripts

| Commande | Description |
|----------|-------------|
| `npm run dev` | Démarrage du serveur de dev |
| `npm run build` | Build de production |
| `npm run start` | Lance le build de production |
| `npm run lint` | Linting |

## Arborescence

```
.
├── CONTEXT.md                # Contexte produit + roadmap (à lire en premier)
├── app/
│   ├── layout.tsx           # Layout racine
│   ├── globals.css          # Tailwind + design tokens
│   ├── page.tsx             # Landing marketing
│   ├── login/page.tsx
│   ├── signup/page.tsx
│   ├── profiles/page.tsx    # Sélection de profil (Netflix-like)
│   ├── browse/page.tsx      # Catalogue principal
│   ├── watch/[id]/page.tsx  # Lecteur vidéo
│   ├── pricing/page.tsx
│   ├── my-list/page.tsx
│   └── not-found.tsx
├── components/
│   ├── LogoMark.tsx
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── AuthForm.tsx
│   ├── MovieCard.tsx
│   ├── MovieRow.tsx
│   ├── VideoPlayer.tsx       # Player + simulation de pub (15s, skip à 5s)
│   └── landing/
│       ├── Hero.tsx
│       ├── Features.tsx
│       ├── Showcase.tsx
│       ├── PricingTeaser.tsx
│       ├── Testimonials.tsx
│       ├── FAQ.tsx
│       └── CTA.tsx
└── lib/
    ├── mock-data.ts          # Catalogue mocké (12 titres, 6 catégories)
    ├── store.ts              # Zustand (auth/profil/watchlist/premium)
    └── utils.ts
```

## Logique freemium

- Par défaut, un utilisateur est **Free** → `VideoPlayer` affiche un overlay pub 15s avec skip après 5s.
- Bouton "Passer Premium" → bascule `isPremium = true` dans le store (mock, pas de paiement réel).
- Une fois Premium, plus de pub. Badge "Premium" visible dans la Navbar.
- Le store est persisté en `localStorage` sous la clé `vibeflix-store`.

## À faire (cf. `CONTEXT.md`)

- Brancher la source vidéo réelle (flux externe) dans `components/VideoPlayer.tsx`.
- Auth réelle (NextAuth / Clerk / Supabase).
- Backend pour persister profils et watchlist côté serveur.
- Paiement Stripe pour le Premium.
- Recommandations personnalisées.

## Notes

- Toutes les images posters/backdrops proviennent d'Unsplash via URL (autorisé dans `next.config.ts`).
- Aucune clé d'API n'est requise pour faire tourner la v1.
- Le projet est **prêt à `npm install && npm run dev`**.
