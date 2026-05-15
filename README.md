# VibeFlix

Plateforme streaming films/séries avec lecteur natif sans pub tierce.

Pipeline: backend Playwright scrape `.m3u8` derrière les players d'aggregateurs → frontend hls.js joue le flux dans `<video>` VibeFlix maison. Aucune iframe, aucune pub injectée par le provider.

> Contexte produit, archi détaillée et roadmap dans [`CONTEXT.md`](./CONTEXT.md).

## Stack

- **Frontend** (Vercel): Next.js 15 + TS + Tailwind v3 + Framer Motion + Zustand + hls.js
- **Backend** (local/VPS): Node.js + TS + Express + Playwright + stealth plugin
- Polices: **Bricolage Grotesque** (display) + **Geist** (UI)

## Installation locale

```bash
# Frontend
npm install
echo "NEXT_PUBLIC_BACKEND_URL=http://localhost:3001" > .env.local
npm run dev          # http://localhost:3000

# Backend (terminal séparé)
cd backend
npm install
npx playwright install chromium
npm run dev          # http://localhost:3001
```

## Scripts

| Commande | Description |
|---|---|
| `npm run dev` | Frontend Next.js |
| `npm run build` | Build prod frontend |
| `cd backend && npm run dev` | Backend Express + Playwright |
| `cd backend && HEADFUL=1 npm run dev` | Backend avec Chromium visible (debug) |

## Endpoints backend

- `GET /health` — liste providers actifs
- `GET /api/stream?tmdbId=N&type=film|serie[&season=N&episode=N&imdbId=tt...&lang=VF|VOSTFR|MULTI&title=...&year=N]` — extrait m3u8
- `GET /api/manifest?url=...&referer=...` — proxy manifest avec rewriting des segments

## Test rapide

```powershell
curl "http://localhost:3001/api/stream?tmdbId=693134&type=film&imdbId=tt15239678&lang=VF"
```

## Providers (état actuel)

| ID | Lang | Notes |
|---|---|---|
| frembed | VF | 3 hosts en cascade (.icu/.li/.cc), IMDB IDs |
| vidlink-vf | VF | Vidlink `?dub=fr` (param souvent ignoré) |
| vidlink-vostfr | VOSTFR | Vidlink `?sub=fr` |
| vidlink | MULTI | ✓ Confirmé fonctionnel |
| demo | MULTI | Big Buck Bunny libre, fallback garanti |

Voir CONTEXT.md pour explications, retirés, et providers à essayer.

## Pour aller plus loin

Roadmap complète dans [`CONTEXT.md`](./CONTEXT.md):
- Déploiement VPS Hetzner
- Branchement Adsterra/PopAds Direct Link
- Sources VF additionnelles (Kweflix-style)
- Cache persistant (SQLite/Redis)
- Auth + Stripe Premium
