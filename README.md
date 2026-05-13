# VibeFlix

Plateforme de streaming films, séries et live — pensée comme l'alternative éditoriale au streaming corporate. Mint sur charcoal, typo Fraunces, motion en "exhales".

> Le contexte produit complet, la direction artistique, et la roadmap sont dans [`CONTEXT.md`](./CONTEXT.md).

## Stack

- **Next.js 15** (App Router) + **TypeScript**
- **Tailwind CSS** v3 (design system étendu — palette `char/mint`, easing `exhale`)
- **Framer Motion** pour les transitions
- **Zustand** + persist (auth mock, profils, watchlist, statut Premium)
- **Lucide React** pour les icônes
- Polices : **Fraunces** (display) + **Geist** (UI)

## Installation

```bash
npm install
npm run dev
```

→ [http://localhost:3000](http://localhost:3000)

## Scripts

| Commande | Description |
|----------|-------------|
| `npm run dev` | Serveur de dev |
| `npm run build` | Build de production |
| `npm run start` | Lance le build |
| `npm run lint` | Linting |

## Arborescence

```
.
├── CONTEXT.md                # À lire en premier
├── app/
│   ├── layout.tsx
│   ├── globals.css           # Tokens + utilitaires custom
│   ├── page.tsx              # Landing éditoriale
│   ├── login/, signup/
│   ├── profiles/             # Sélection de profil
│   ├── browse/               # Catalogue + hero cinéma
│   ├── live/                 # Diffusions en direct
│   ├── watch/[id]/           # Lecteur + détails
│   ├── pricing/              # Toggle mensuel/annuel
│   ├── my-list/
│   └── not-found.tsx
├── components/
│   ├── Navbar, Footer, LogoMark, AtmosphereBg
│   ├── AuthForm
│   ├── MovieCard, MovieRow
│   ├── VideoPlayer           # MP4 réel + simulation de pub
│   └── landing/              # Hero, Features, Showcase, PricingTeaser, Testimonials, FAQ, CTA
└── lib/
    ├── mock-data.ts          # Titres TMDB + vidéo sample
    ├── store.ts              # Zustand
    └── utils.ts
```

## Logique freemium

- Free par défaut → `VideoPlayer` affiche un overlay pub 15s (skip à 5s).
- "Passer Premium" sur `/pricing` bascule `isPremium = true` dans le store.
- Une fois Premium, plus de pub. Badge visible dans la Navbar.
- Tarif : **1 €/mois** ou **5 €/an** (toggle sur `/pricing`).
- Persistance : `localStorage` clé `vibeflix-store-v2`.

## Sources de contenu

- **Images** : `image.tmdb.org` (autorisé dans `next.config.ts`).
- **Vidéo de démo** : Big Buck Bunny via `commondatastorage.googleapis.com`. À remplacer par le flux réel.
- **Avatars témoignages** : `images.unsplash.com`.

## Roadmap

Voir la section "À faire" de [`CONTEXT.md`](./CONTEXT.md) — brancher le flux vidéo réel, auth réelle, paiement Stripe, recherche globale, etc.
