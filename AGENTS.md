# AGENTS.md — orchestrateur

Medusa DTC Starter — monorepo Turborepo (`pnpm@10.11.1`, Node 20+/22+) avec backend Medusa (`@dtc/backend`) et storefront Next.js (`@dtc/storefront`).

**Lire le `AGENTS.md` le plus proche du dossier touché.** Ce fichier n’est que l’index.

## Carte des AGENTS.md

| Fichier | Quand le lire |
|---------|----------------|
| [`.agents/medusa/AGENTS.md`](.agents/medusa/AGENTS.md) | Concepts Medusa.js (modules, workflows, API, admin) — **avant** d’écrire du code framework |
| [`apps/backend/AGENTS.md`](apps/backend/AGENTS.md) | Config backend, Docker back/Postgres, seeds, tests |
| [`apps/storefront/AGENTS.md`](apps/storefront/AGENTS.md) | Storefront Next, Docker front, env URLs, tsconfig |
| [`apps/storefront/src/lib/AGENTS.md`](apps/storefront/src/lib/AGENTS.md) | SDK Medusa, data layer, hooks |
| [`apps/storefront/src/modules/AGENTS.md`](apps/storefront/src/modules/AGENTS.md) | UI (panier, compte, layout, toasts FR) |

Skills / MCP Medusa : voir [`.agents/medusa/AGENTS.md`](.agents/medusa/AGENTS.md#skills--mcp).

## Structure

```text
.
├── .agents/medusa/          # Concepts Medusa.js
├── apps/
│   ├── backend/             # API + admin (@dtc/backend) — port 9000 / admin Vite 5173
│   └── storefront/          # Next.js (@dtc/storefront) — port 8000
├── compose.yml              # Prod back (image amd64)
├── compose.override.yml     # Dev back + Postgres (arm64 local)
├── eslint.config.ts
└── turbo.json
```

`apps/storefront` est optionnel sur un starter neuf ; **ici il est installé**. Vérifier qu’il existe avant toute commande storefront.

## Package manager

Toujours **pnpm** (champ `packageManager` + `pnpm-lock.yaml`). Ne jamais créer un second lockfile.

```bash
node -p "require('./package.json').packageManager ?? 'unset'"
```

## Commandes (racine)

```bash
pnpm run dev                 # tous les apps
pnpm run backend:dev         # http://localhost:9000 — admin /app
pnpm run storefront:dev      # http://localhost:8000
pnpm run build
pnpm run lint
pnpm run test                # backend only via turbo
pnpm run backend:seed
```

### Docker (dev local — privilégié)

Réseau externe requis : `docker network create web-network` (une fois).

```bash
# Backend + Postgres
docker compose up -d --build

# Storefront (compose séparé)
cd apps/storefront && docker compose up -d --build
```

Détails plateforme / volumes / URLs : [`apps/backend/AGENTS.md`](apps/backend/AGENTS.md) et [`apps/storefront/AGENTS.md`](apps/storefront/AGENTS.md).

## Style (workspace)

- Backend : respecter `@medusajs/eslint-plugin` recommended — ne jamais désactiver une règle `@medusajs/*`.
- Pas de points-virgules, doubles quotes, indent 2 espaces.
- Fichiers kebab-case ; types/classes PascalCase ; DB snake_case.
- Pas d’emojis dans le code / commits.

## Off-limits

- `apps/backend/.medusa/`, `.next/`, `dist/`, `out/`, `.turbo/`
- Lockfile : ne pas éditer à la main
- `.env` / `.env.local` : ne jamais committer ni afficher de secrets — documenter dans `.env.template`
- Migrations existantes : en ajouter une nouvelle, ne pas réécrire
- Pas de commandes DB destructives sans confirmation explicite
