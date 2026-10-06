# AGENTS.md — Medusa.js (concepts)

Parent : [`../../AGENTS.md`](../../AGENTS.md).

Doc officielle : [docs.medusajs.com](https://docs.medusajs.com). Préférer le MCP Medusa ou les skills ci-dessous plutôt que d’inventer les APIs.

## Qu’est-ce que Medusa

Moteur e-commerce headless (Node). Le backend expose :

- **Store API** (`/store/*`) — vitrine, panier, checkout, clients
- **Admin API** (`/admin/*`) — back-office
- **Admin UI** — dashboard Vite embarqué (ici sur `/app`, HMR port 5173)

La logique métier vit dans des **modules** + **workflows**, pas dans des handlers HTTP ad hoc.

## Anatomie backend (`apps/backend/src/`)

| Dossier | Rôle |
|---------|------|
| `api/` | Routes file-based : `api/store/.../route.ts`, `api/admin/.../route.ts` exportent `GET`/`POST`/… |
| `modules/` | Modules custom : models, service, migrations |
| `workflows/` | Orchestration métier (steps composables) |
| `links/` | Liens entre modules (module links) |
| `subscribers/` | Réactions aux events |
| `jobs/` | Tâches planifiées |
| `admin/` | Widgets / routes / i18n du dashboard |
| `migration-scripts/` | Scripts de seed / migration data |

## Règles d’or

1. **Route = thin.** Résoudre un workflow et l’exécuter ; pas de SQL / logique métier dans le handler.
2. **Modèle modifié → migration.** `pnpm exec medusa db:generate <module>` puis `db:migrate`.
3. **Pas de client DB brut** dans le backend — passer par les services de modules / workflows.
4. **Lint Medusa = contrat framework.** Une erreur `@medusajs/*` signifie souvent une forme incorrecte (route, workflow, module), pas du style.

## Config

`apps/backend/medusa-config.ts` : `DATABASE_URL`, CORS (`STORE_CORS`, `ADMIN_CORS`, `AUTH_CORS`), secrets JWT/cookie, `redisUrl` optionnel (vide en local = pas de Redis).

## Storefront ↔ Backend

- Clé obligatoire côté store : `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` (sinon erreur publishable-key, pas un 401 clair).
- SDK JS : `@medusajs/js-sdk` (voir [`apps/storefront/src/lib/AGENTS.md`](../../apps/storefront/src/lib/AGENTS.md)).

## Skills & MCP

Charger **avant** d’écrire du code si disponibles :

- `building-with-medusa` — modules, routes, workflows, data models, links
- `building-admin-dashboard-customizations` — `apps/backend/src/admin`
- `building-storefronts` — `apps/storefront`
- `db-generate` / `db-migrate` / `new-user`

```bash
/plugin marketplace add medusajs/medusa-agent-skills
/plugin install medusa-dev@medusa
```

MCP docs :

```bash
claude mcp add --transport http medusa https://docs.medusajs.com/mcp
```

Si skills/MCP absents : le signaler à l’utilisateur — ça améliore nettement la fiabilité.
