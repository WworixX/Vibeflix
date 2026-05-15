# VibeFlix — Contexte du projet

## Vision
Plateforme streaming films, séries, live. Public 16-28 ans sensibles design. Modèle économique: pub maison au pre-roll (ad-gate clic obligatoire), aucune pub tierce dans le lecteur (scraping m3u8 direct).

## Stack

**Frontend** (Vercel)
- Next.js 15 App Router + TS
- Tailwind v3 (palette mint/charcoal)
- Framer Motion (motion easing exhale)
- Zustand (auth/profils/watchlist persistés)
- Bricolage Grotesque (display) + Geist (UI)
- hls.js (lecteur natif via flux scrapé)

**Backend** (local actuellement, VPS Hetzner à venir)
- Node.js + TypeScript + Express
- Playwright + playwright-extra + stealth plugin
- TTLCache mémoire (30min)

## Pipeline lecture

```
1. /watch/[id] -> Ad-gate VibeFlix (clic forcé)
2. Clic Continuer -> ouvre pub (NEXT_PUBLIC_AD_URL) nouvel onglet
                  -> en parallèle: GET /api/stream
3. Backend: Playwright headless visite player aggregateur
            -> intercepte requête .m3u8 réseau
            -> cache 30min
            -> renvoie { m3u8Url, headers }
4. Frontend reçoit m3u8 -> hls.js charge via /api/manifest (proxy)
5. Segments .ts: direct depuis CDN (pas proxiés -> VPS bande passante OK)
6. <video> VibeFlix joue. Zero iframe. Zero pub tierce.
```

## Providers backend

| Provider | Lang | Status |
|---|---|---|
| `frembed` | VF | Hosts: .icu/.li/.cc en cascade, IMDB IDs |
| `vidlink-vf` | VF | Vidlink avec `?dub=fr` (param ignoré souvent) |
| `vidlink-vostfr` | VOSTFR | Vidlink avec `?sub=fr` |
| `vidlink` | MULTI | Confirmé fonctionnel, anglais |
| `demo` | MULTI | Big Buck Bunny libre, garantie absolue |

Retirés (échouent ou domaines morts):
- autoembed, embed.su (NXDOMAIN)
- vidsrc.cc (videasy WASM bot-detect → redirige YouTube)
- videasy API (réponse chiffrée hex)
- flixhq via Consumet (522 Cloudflare)

## Routes

| Route | Description |
|---|---|
| `/` | Landing (Hero rotatif 5 titres, tendances, catalogue) |
| `/login`, `/signup` | Auth mockée |
| `/profiles` | Sélection profil |
| `/browse` | Catalogue par humeurs + live |
| `/live` | Diffusions live |
| `/watch/[id]` | Lecteur avec ad-gate + tabs lang + S/E selector + audio track switcher |
| `/pricing` | Free vs Premium (1€/mois ou 5€/an) |
| `/my-list` | Watchlist |

## Données mockées
16 titres TMDB réels avec posters/backdrops `image.tmdb.org` + IMDB IDs:
Dune Part Two, Stranger Things, The Last of Us, Mercredi, Oppenheimer, Interstellar, House of the Dragon, Breaking Bad, The Bear, Everything Everywhere, Succession, The Batman, Spider-Verse, Barbie, Arcane, Anatomie d'une chute.
2 lives mockés (sport + jazz).

## Variables d'env

| Var | Default | Description |
|---|---|---|
| `NEXT_PUBLIC_BACKEND_URL` | `http://localhost:3001` | URL du backend |
| `NEXT_PUBLIC_AD_URL` | placeholder | URL pub pre-roll (Adsterra/PopAds) |
| `PORT` (backend) | `3001` | Port Express |
| `ALLOWED_ORIGIN` (backend) | `*` | CORS |
| `HEADFUL` (backend) | `0` | `1` = Chromium visible (debug) |

## Sélecteur audio dans le lecteur

hls.js détecte les `audioTracks` du manifest. Si plusieurs pistes:
- Auto-select FR si `preferredLang === "VF"` et piste FR détectée
- Sinon expose dropdown `<select>` dans le lecteur

Si une seule piste (cas vidlink anglais classique), pas de selector affiché.

## Limitations actuelles connues

1. **VF réel limité** : vidlink ignore `?dub=fr`. Frembed peut être down. Pour VF garanti il faut soit l'aggregateur du pote (Kweflix-style → URLs à intégrer), soit une lib opensource (consumet/CloudStream) avec extractor FR maintenu.

2. **Anti-bot videasy/WASM** : stealth ne suffit pas pour vidsrc.cc. Décrypter le blob videasy = trop fragile (change toutes les semaines).

3. **DNS bloqués chez certains FAI FR** : embed.su, autoembed.cc renvoient NXDOMAIN. User doit installer Cloudflare WARP ou DNS 1.1.1.1 manuel.

4. **Backend local uniquement** : pas encore déployé sur VPS. Tout marche en localhost.

5. **Pub placeholder** : `NEXT_PUBLIC_AD_URL` pointe sur example.com. À brancher sur réseau pub réel (Adsterra recommandé, ils acceptent les sites de streaming).

## Roadmap

- [ ] Déploiement VPS Hetzner CX21 + Caddy + HTTPS
- [ ] Branchement vrai réseau pub (Adsterra Direct Link)
- [ ] URLs Kweflix/Playmogo (besoin des URLs du pote du user)
- [ ] Persistence cache: SQLite ou Redis (au lieu de mémoire)
- [ ] Sauvegarde progression (continue à regarder) avec backend sessions
- [ ] Watchlist côté serveur (actuellement localStorage seulement)
- [ ] Auth réelle (NextAuth + Supabase)
- [ ] Stripe pour Premium 1€/mois
- [ ] Vraie recherche globale (cmd+K) avec filtres
