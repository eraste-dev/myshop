# CLAUDE.md

Plateforme multi-boutiques de vente de pagnes, inspirée de Vlisco. Première boutique : celle de la mère du propriétaire du projet (Côte d'Ivoire). Ambition à terme : une plateforme type Chariow où chacun crée et gère sa boutique.

Échanges et documentation en **français**.

## État du projet
- Phase actuelle : **frontends d'abord, sur mocks**, pour valider les écrans (voir `docs/frontend-mocks.md`).
- **Backend : langage en suspens** (TypeScript + Hono, Go ou Python). Ne pas le choisir ni écrire de code backend sans accord.
- Stack front décidée : Nuxt + TypeScript + Tailwind, monorepo pnpm. PostgreSQL autohébergé prévu. Détails dans `docs/stack.md`.

## Structure
```
docs/                      spécifications, décisions, références (lire avant de coder)
infra/scripts/             scripts de lancement et de contrôle (appelés par le justfile)
justfile                   commandes du projet
src/
  client/                  vitrine (SSR, mobile d'abord)
  client-admin/            back-office de la boutique
  client-platform/         app générale de gestion des boutiques
  backend/                 API (vide)
  packages/
    design/                jetons de design (tokens.css)
    shared/                types et règles métier communes
    mocks/                 données et simulation d'API
```
**La racine du monorepo pnpm est `src/`** : `src/package.json`, `src/pnpm-workspace.yaml` et `src/pnpm-lock.yaml` y vivent. À la racine du dépôt restent `docs/`, `infra/`, `.gitignore` et ce fichier. **Demander avant de créer un fichier à un nouvel emplacement.** Chaque app est organisée par fonctionnalité (catalog, product, cart, checkout…).

## Commandes
Depuis la racine du dépôt, avec [just](https://just.systems) (les scripts sont dans `infra/scripts/`, en bash) :
```
just                  liste des commandes
just install          installe les dépendances
just client           vitrine sur http://localhost:51001
just dev all          lance toutes les applications qui existent
just build [app]      construction de production
just preview [app]    version de production (construit si besoin)
just test             tests de tous les paquets
just typecheck        contrôle de types
just check            tests + contrôle de types
just clean [--deps]   supprime les fichiers générés
```
Ports : `client` 51001, `client-admin` 51002, `client-platform` 51003, `backend` 51004 (plage 510xx, hors des ports usuels) (surchargeables : `CLIENT_PORT`, etc.). Les applications pas encore créées répondent par un message clair.
**Windows** : le justfile vise explicitement Git Bash (`C:/Program Files/Git/bin/bash.exe`), car `bash` seul désigne WSL dans PowerShell. Adapter `windows-shell` si Git est installé ailleurs.
**Règle just** : les arguments passent par `set positional-arguments` (`"$1"`, `"$@"`), jamais interpolés dans la ligne de commande (injection). Sans just : `cd src && pnpm test`, `pnpm typecheck`.

## Méthode : SDD + TDD
1. **Spec d'abord** : `docs/specs/<n>-<nom>/` (spec, plan, tâches). L'utilisateur la valide **avant** le code. Les scénarios de `docs/scenarios.md` (S*, A*, P*) servent de critères d'acceptation.
2. **Tests avant le code** : RED, puis GREEN, puis refactor. Nommer les tests avec l'identifiant du scénario.
3. Couverture ≥ 80 %. Parcours critiques en Playwright.
4. Revue du code après écriture ; revue sécurité pour paiement, authentification, saisies et isolation.

## Git
- Dépôt `eraste-dev/myshop`, branche `main` stable.
- Une branche courte par sujet : `feat/…`, `fix/…`, `docs/…`, `chore/…`, `test/…`, `refactor/…`. PR en squash.
- Commits conventionnels : `feat: …`, `fix: …`, `docs: …`, etc.
- **Ne jamais pousser ni créer de PR sans demande explicite.**

## Règles de code
- Immutabilité : ne pas modifier un objet en place, renvoyer une copie. Types `readonly` pour les modèles partagés.
- **Argent** : montants en XOF, **entiers**, jamais de flottants.
- **Mesures** : longueurs calculées en centièmes entiers (voir `src/packages/shared/src/measure.ts`).
- Types explicites sur les API publiques ; pas de `any` (utiliser `unknown` puis restreindre).
- Pas de `console.log` en production. Pas de secret dans le code : variables d'environnement.
- Fichiers < 800 lignes, fonctions < 50 lignes, imbrication ≤ 4 niveaux.
- Valider toute entrée externe (schémas Zod).

## Règles produit à ne pas casser
- **Multi-boutiques** : toute donnée métier appartient à une boutique ; une boutique ne voit jamais les données d'une autre.
- **Stock** vérifié au moment du paiement, pas seulement au panier ; aucune double vente.
- **Paiement** valide uniquement sur confirmation signée du prestataire, jamais sur le retour du navigateur.
- **Deux modes de vente** : à la pièce (longueurs prédéfinies) et à la mesure (min, max, pas, stock configurables).
- **Paramétrage à deux niveaux** : le global autorise, la boutique choisit parmi l'autorisé.
- La livraison se gère hors application en v1 (statuts « en cours » et « livrée » seulement).

## Design
- Références : `docs/design.md`. Captures dans `docs/references/` : **usage interne, ignorées par git, ne jamais publier**.
- **Aucune couleur ni police codée en dur** : tout passe par `src/packages/design/tokens.css` (thème par boutique).
- Sobre : fond blanc cassé, texte noir, boutons noirs en majuscules aux angles droits ; les imprimés portent la couleur.
- Mobile d'abord, léger, accessible (contrastes, clavier). Les polices de Vlisco sont sous licence : utiliser Newsreader et Jost.
- Le client d'API est la seule porte vers les données : les écrans n'appellent jamais les mocks directement.

## Documents
| Fichier | Sujet |
|---|---|
| `docs/mvp.md` | Périmètre du MVP, modes de vente, statuts |
| `docs/scenarios.md` | Scénarios client, gérante, administrateur |
| `docs/ecrans.md` | Écrans des trois applications |
| `docs/filtres.md` | Attributs produit et filtres |
| `docs/design.md` | Références Vlisco, décisions de design |
| `docs/stack.md` | Stack, architecture, risques |
| `docs/plateforme.md` | Vision multi-boutiques et phases |
| `docs/frontend-mocks.md` | Stratégie mocks |
| `docs/3d.md` | Visualiseur 3D (phase 2) |
| `docs/questions-ouvertes.md` | Décisions prises et à prendre |
