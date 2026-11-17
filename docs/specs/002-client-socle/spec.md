# 002 – Socle de la vitrine (`src/client`)

**Code** : `CLI` · **Statut** : validée (délégation) · **Branche** : `feat/client-scaffold`
**Voir aussi** : [stack.md](../../conception/stack.md), [design.md](../../conception/design.md)

## Objectif
Disposer d'une application Nuxt `src/client` qui démarre, se construit, applique les jetons de design partagés et sert une page d'accueil vide, sur laquelle les écrans viendront s'ajouter.

## Hors périmètre
En-tête, pied de page, pages produit (specs suivantes). Client d'API et mocks. Rendu définitif de l'accueil.

## Règles
- **CLI-R1** Nuxt (Vue) en **TypeScript strict**, rendu serveur activé (SSR) pour le SEO et le partage.
- **CLI-R2** Styles avec **Tailwind CSS**. Couleurs, polices et interlettrages viennent **uniquement** de `@shop-pagne/design/tokens.css`.
- **CLI-R3** Polices **auto-hébergées** (Newsreader pour les titres, Jost pour le texte) : aucune requête vers un service de polices tiers.
- **CLI-R4** Le code partagé s'importe par `@shop-pagne/shared` et `@shop-pagne/design` (paquets du monorepo).
- **CLI-R5** Mobile d'abord : la mise en page de base se lit correctement dès 320 px de large.
- **CLI-R6** Accessibilité de base : langue `fr`, lien d'évitement vers le contenu, focus visible, respect de `prefers-reduced-motion`.
- **CLI-R7** Organisation par fonctionnalité sous `app/` (voir CLAUDE.md) : `components/{layout,catalog,product,cart,checkout,ui}`, `composables`, `api`, `layouts`, `pages`, `utils`.

## Critères d'acceptation
| Id | Étant donné | Quand | Alors |
|---|---|---|---|
| CLI-1 | l'application installée | on lance `pnpm dev:client` et on ouvre `/` | la page répond 200 avec le titre de la boutique |
| CLI-2 | l'application installée | on lance `pnpm build:client` | la construction réussit sans erreur |
| CLI-3 | l'application installée | on lance le contrôle de types | aucune erreur |
| CLI-4 | le code de `src/client/app` | on cherche des couleurs écrites en dur (hexadécimal, `rgb(`, `hsl(`) | il n'y en a aucune hors du fichier de jetons |
| CLI-5 | la page rendue | on inspecte ses requêtes de polices | toutes sont servies par l'application elle-même |
| CLI-6 | la page rendue | on lit son HTML | `<html lang="fr">`, une balise viewport, un titre, un lien d'évitement vers `#contenu` |
| CLI-7 | les jetons | on lit `tokens.css` | `--color-surface`, `--color-ink`, `--color-line`, `--color-accent`, `--font-display`, `--font-sans` sont définis |

## Décisions
- Titre par défaut du MVP : « Boutique de pagnes » (remplacé par le nom de la boutique quand le client d'API existera).
- Pas de bibliothèque de composants pour la vitrine : composants maison sur Tailwind, primitives Reka UI ajoutées au besoin (voir [stack.md](../../conception/stack.md)).

## Traçabilité
Voir `tasks.md`, mis à jour au fil de l'implémentation.
