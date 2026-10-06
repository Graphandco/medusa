# AGENTS.md — `apps/storefront/src/modules`

Parent : [`../../AGENTS.md`](../../AGENTS.md).

Composants UI par domaine. Imports via alias `@modules/...`.

## Domaines

| Dossier | Rôle |
|---------|------|
| `layout/` | Nav, footer, side-menu (droite), cart-dropdown (panier latéral) |
| `home/` | Hero / landing |
| `products/` | Fiche produit, gallery, actions panier + toasts |
| `cart/` | Pages / logique panier |
| `checkout/` | Tunnel commande |
| `account/` | Compte, profil (édition champs), commandes |
| `order/` | Confirmation / détail commande |
| `categories/` `collections/` `store/` | Listing catalogue |
| `common/` | UI partagée (boutons, delete-button + toast, …) |
| `contact/` `shipping/` `skeletons/` | Contact, shipping, skeletons |

## Comportements déjà en place

- **Panier latéral** (`layout/components/cart-dropdown`) : lignes compactes, pas de largeurs fixes inutiles, CTA **Commander**
- **Menu** : ouverture à **droite** (`side-menu`) — Headless UI v2 : éviter `Disclosure.Panel` cassé ; rendu conditionnel
- **Toasts** : `sonner` dans `app/[countryCode]/(main)/layout.tsx` — style noir/blanc ; messages FR à l’ajout / suppression panier
- **Textes** : préférer le français pour labels UI (account, cart, checkout, order)
- **Profil** : formulaires d’édition sous `account/components/` — garder les champs visibles en mode edit

## Consignes

1. Logique data → `@lib/data` / hooks, pas de SDK dispersé dans chaque composant.
2. Nouveaux toasts : `import { toast } from "sonner"` + même ton FR.
3. Respecter Tailwind / tokens existants (`src/styles/globals.css`, `tailwind.config.js`) — pas de refonte visuelle non demandée.
4. Après changement structurel UI (menu, panier), vérifier mobile + desktop.
