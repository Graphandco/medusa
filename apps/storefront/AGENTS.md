# AGENTS.md — `apps/storefront`

Parent : [`../../AGENTS.md`](../../AGENTS.md). Concepts Medusa : [`.agents/medusa/AGENTS.md`](../../.agents/medusa/AGENTS.md).

Package : `@dtc/storefront` — Next.js 15 (Turbopack), App Router, SDK `@medusajs/js-sdk`.

Sous-docs :

- [`src/lib/AGENTS.md`](src/lib/AGENTS.md) — SDK / data
- [`src/modules/AGENTS.md`](src/modules/AGENTS.md) — UI métier

## Docker

Compose **dans ce dossier** (séparé du back) :

| Fichier | Usage |
|---------|--------|
| `compose.yml` | Prod : `platform: linux/amd64`, image registry |
| `compose.override.yml` | Dev : `medusa-front-dev`, `platform: linux/arm64`, port 8000 |
| `Dockerfile` / `Dockerfile.dev` | Prod build vs `pnpm --filter @dtc/storefront dev` |

```bash
docker network create web-network   # une fois, si besoin
cd apps/storefront
docker compose up -d --build
```

### URLs backend (critique)

| Variable | Contexte | Valeur locale typique |
|----------|----------|------------------------|
| `NEXT_PUBLIC_MEDUSA_BACKEND_URL` | Navigateur | `http://localhost:9000` |
| `MEDUSA_BACKEND_URL` | Serveur Next **dans Docker** | `http://host.docker.internal:9000` |

Ne pas mettre `host.docker.internal` dans `NEXT_PUBLIC_*` (le navigateur ne le résout pas). Voir `src/lib/config.ts`.

Autres : `NEXT_PUBLIC_BASE_URL=http://localhost:8000`, `NEXT_PUBLIC_DEFAULT_REGION`, `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` (obligatoire).

### Volumes

Volumes **nommés** pour `node_modules` et `.next` (les anonymes ont bloqué la création de conteneurs). Bind-mount du monorepo : `../..:/server`.

## TypeScript (`tsconfig.json`)

- **Pas de `baseUrl`** (déprécié TS 6 → cassé en TS 7).
- Aliases via `paths` uniquement :

```json
"@lib/*": ["./src/lib/*"],
"@modules/*": ["./src/modules/*"],
"@pages/*": ["./src/pages/*"],
"styles/*": ["./src/styles/*"]
```

`import "styles/globals.css"` dépend du path `styles/*`.

## UI / produit (état actuel)

- UI majoritairement en **français**
- Menu latéral à **droite**
- Panier latéral + CTA **Commander**
- Toasts **sonner** (noir / blanc) dans le layout main
- Profil compte : champs d’édition branchés

Détails composants : [`src/modules/AGENTS.md`](src/modules/AGENTS.md).

## Commandes

```bash
cd apps/storefront
pnpm dev          # :8000
pnpm build
pnpm lint
```

Ou depuis la racine : `pnpm run storefront:dev`.

## Erreurs fréquentes

- Oublier `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY`
- Confondre URL navigateur / URL serveur Docker
- Relancer `baseUrl` dans tsconfig → warning rouge + dette TS 7
- Image `linux/amd64` sur Mac ARM → lenteur / warning Docker
