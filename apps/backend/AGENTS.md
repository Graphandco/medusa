# AGENTS.md — `apps/backend`

Parent : [`../../AGENTS.md`](../../AGENTS.md). Concepts framework : [`.agents/medusa/AGENTS.md`](../../.agents/medusa/AGENTS.md).

Package : `@dtc/backend`. Entrée config : `medusa-config.ts`.

## Rôles

- API Store/Admin + Admin UI
- Postgres (service Docker `medusa-postgres`)
- Redis : **désactivé en local** (`REDIS_URL=""`) ; activé en prod via `REDIS_URL`

## Docker

Fichiers à la **racine** du monorepo :

| Fichier | Usage |
|---------|--------|
| `compose.yml` | Prod : image `medusa-back`, `platform: linux/amd64` |
| `compose.override.yml` | Dev : `medusa-back-dev`, `platform: linux/arm64` (Apple Silicon), Postgres |
| `Dockerfile` / `Dockerfile.dev` | Prod vs hot-reload |

```bash
# depuis la racine
docker network create web-network   # une fois
docker compose up -d --build        # back + postgres
```

Conteneurs : `medusa-back-dev` (:9000, :5173), `medusa-postgres` (:5432).

Volumes nommés pour `node_modules` (évite les volumes anonymes qui bloquent la création). Ne pas forcer `platform: linux/amd64` en local sur Mac ARM → warning « poor performance ».

Scripts : `start-dev.sh` (commande compose override).

## Env

- Racine `.env` (dev) / `.env.production` (prod) — **ne jamais afficher les secrets**
- Override compose injecte `DATABASE_URL=postgres://medusa:medusa@postgres:5432/medusa`, CORS storefront `http://localhost:8000`

## Commandes utiles

```bash
cd apps/backend
pnpm run lint
pnpm run test:unit
pnpm run test:integration:http
pnpm exec medusa db:generate <module>
pnpm exec medusa db:migrate
pnpm exec medusa user -e admin@test.com -p supersecret
```

Seed depuis la racine : `pnpm run backend:seed`.

## Conventions locales

- Routes sous `src/api/store|admin/<path>/route.ts`
- Logique dans `src/workflows/`
- Admin extensions sous `src/admin/`
- Admin Vite : host `0.0.0.0`, HMR port **5173** (voir `medusa-config.ts`)

## Erreurs fréquentes

- Éditer un model sans `db:generate` → changement silencieux en DB
- Tests d’intégration sans Postgres joignable
- Installer une dep à la racine au lieu de `cd apps/backend && pnpm add …`
