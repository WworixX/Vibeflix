# VibeFlix Backend

API Node.js + Playwright qui extrait les flux `.m3u8` derrière les players d'agrégateurs, pour qu'ils soient lus dans le player natif VibeFlix (zéro pub tierce).

## Architecture

```
Frontend (Next.js, vibeflix.app)
       │ GET /api/stream?tmdbId=693134&type=film
       ▼
Backend (ce dossier, Hetzner VPS)
       │ 1. Vérifie cache (30min TTL)
       │ 2. Sinon → Playwright headless visite l'embed
       │ 3. Intercepte la requête .m3u8 et ses headers
       │ 4. Renvoie { m3u8Url, headers }
       ▼
Frontend (hls.js dans <video>)
       │ Charge /api/manifest?url=... (proxy avec rewriting)
       │ Segments .ts → directement depuis le CDN d'origine
```

## Installation locale

```bash
cd backend
npm install
npx playwright install chromium
npm run dev
```

Le serveur écoute sur `http://localhost:3001`.

### Endpoints

- `GET /health` → liste des providers
- `GET /api/stream?tmdbId=...&type=film|serie[&season=1&episode=1][&provider=vidsrc-cc]` → extrait et renvoie l'URL m3u8
- `GET /api/manifest?url=...&referer=...` → proxy le manifeste avec rewriting des segments

### Test rapide

```bash
curl "http://localhost:3001/api/stream?tmdbId=693134&type=film"
```

## Variables d'environnement

| Var | Défaut | Description |
|-----|--------|-------------|
| `PORT` | `3001` | Port d'écoute |
| `ALLOWED_ORIGIN` | `*` | CORS origin (en prod : `https://vibeflix.app`) |

## Déploiement VPS (à venir)

Plan : Hetzner CX21 (4€/mois) + Docker + Caddy en reverse-proxy avec auto-HTTPS.
Documenté dans `DEPLOY.md` quand on y sera.

## Phase actuelle : B.1

- [x] Skeleton Express + Playwright
- [x] Cache mémoire 30min
- [x] Extractor générique d'interception réseau (provider `vidsrc-cc`)
- [x] Proxy manifest avec rewriting
- [ ] Frontend hls.js plug
- [ ] Tests bout-en-bout

## Phase B.2

- [ ] Sources VF (Kweflix-style) — nécessite info de ton pote
- [ ] Sources VOSTFR
- [ ] Stealth plugin si détection headless
- [ ] Persistence du cache (SQLite ou Redis)
