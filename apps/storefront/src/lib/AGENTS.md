# AGENTS.md — `apps/storefront/src/lib`

Parent : [`../../AGENTS.md`](../../AGENTS.md).

## Rôle

Couche data / SDK entre l’UI (`modules/`) et le backend Medusa.

| Zone | Contenu |
|------|---------|
| `config.ts` | Instance SDK Medusa + choix `MEDUSA_BACKEND_URL` / `NEXT_PUBLIC_*` |
| `data/` | Fetchers serveur (produits, panier, régions, customer…) |
| `hooks/` | Hooks client |
| `context/` | Contextes React |
| `util/` | Helpers (env, locale header, …) |
| `search-client.ts` | Recherche (InstantSearch / `/store/search`) |
| `constants.tsx` | Constantes UI |

## SDK

```ts
process.env.MEDUSA_BACKEND_URL
  || process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL
  || "http://localhost:9000"
```

Toujours passer `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY`. Le wrapper `sdk.client.fetch` ajoute `x-medusa-locale` quand possible.

## Consignes

1. Nouveaux appels API store → préférer `lib/data` (ou hooks) plutôt que fetch ad hoc dans les composants UI.
2. Ne pas hardcoder l’URL backend dans les modules UI.
3. Côté serveur Docker, s’assurer que `MEDUSA_BACKEND_URL` pointe vers une adresse joignable depuis le conteneur.
