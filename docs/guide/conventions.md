# Conventions du projet

Ce document dit **comment on écrit** ici. Il complète [specs/000-conventions.md](../specs/000-conventions.md) (méthode SDD + TDD, JSDoc, types) sans la répéter. À lire avec [erreurs-a-eviter.md](erreurs-a-eviter.md) et [a-faire.md](a-faire.md).

## Langue
- Échanges, docs, specs, JSDoc, messages affichés au client : **français**.
- Code (identifiants, noms de fichiers, messages de commit) : **anglais**, commits conventionnels (`feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `test:`).
- Aucune ligne `Co-Authored-By` ni signature dans les commits ou les PR.

## Emplacements
| Quoi | Où |
|---|---|
| Spécifications, décisions | `docs/` (une spec = `docs/specs/NNN-nom/`) |
| Scripts de lancement | `infra/scripts/` (appelés par le `justfile`) |
| Code, `package.json`, lockfile | `src/` (racine du monorepo pnpm) |
| Types et interfaces exportés | `src/packages/types` uniquement |
| Règles métier communes | `src/packages/shared` |
| Jetons de design | `src/packages/design/tokens.css` |

Tout nouveau fichier à un **nouvel emplacement** : demander d'abord.

## Nommage
- Fichiers : `kebab-case` ; composants Vue : `PascalCase.vue`.
- Fonctions et variables : `camelCase` ; types : `PascalCase` ; constantes : `UPPER_SNAKE_CASE`.
- Booléens : `is`, `has`, `should`, `can`.
- Tests : `[CRITERE-ID] phrase décrivant le comportement`, ex. `[MES-3] refuse une longueur sous le minimum`.
- Branches : `feat/…`, `fix/…`, `docs/…`, `chore/…`, `test/…`, `refactor/…`, au nom de la spec.

## Code
- **Immutabilité** : renvoyer une copie, types `readonly` pour les modèles partagés.
- **Argent** : XOF, entiers. **Mesures** : centièmes entiers via `measure.ts`. Jamais de flottants.
- **Entrées externes** (requête, fichier, API) : validées par un schéma Zod, rejetées avec un message clair.
- **Erreurs** : gérées explicitement, message lisible côté client, détail côté serveur, jamais avalées.
- Pas de `any` (`unknown` puis restreindre), pas de `console.log`, pas de secret dans le code.
- Limites : fichier < 800 lignes, fonction < 50 lignes, imbrication ≤ 4, préférer les retours anticipés.
- Aucun nombre magique : constante nommée.

## Interface
- **Aucune couleur ni police en dur** : jetons de `tokens.css`. Tailwind : classes du thème (`tracking-display`, `tracking-label`…), pas de valeurs arbitraires `[...]`.
- Mobile d'abord, accessible : contrastes, clavier, focus visible, lien d'évitement, texte alternatif.
- Les écrans passent par le client d'API, jamais par les mocks directement.
- Texte par-dessus une image : prévoir un voile pour garantir le contraste.

## Sécurité
- Toute donnée métier appartient à une boutique ; aucune lecture croisée.
- Nom de fichier, identifiant ou chemin venant de l'extérieur : liste blanche stricte avant tout accès disque.
- Réponses servant du contenu actif (SVG) : `nosniff` + CSP restrictive.
- Couleurs et numéros venant des données : valider (hex valide, numéro WhatsApp valide) sinon masquer.
- Images : retirer les métadonnées (EXIF) avant publication.

## Scripts et outillage
- Scripts en bash, fins de ligne **LF** (`.gitattributes`).
- Arguments de `just` : `set positional-arguments` (`"$1"`, `"$@"`), jamais interpolés.
- Windows : `just` cible Git Bash explicitement (`bash` seul = WSL).
- Commandes pnpm lancées depuis `src/`.
