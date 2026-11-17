# 000 – Conventions des specs (SDD + TDD)

> Statut : **brouillon, à valider**

## Principe
Aucune fonctionnalité n'est codée sans **spec validée**. La spec décrit le comportement attendu. Les tests en découlent, le code ne fait que les satisfaire.

```
Spec validée  →  Tests (RED)  →  Code (GREEN)  →  Refactor  →  Revue  →  PR
```

## Organisation
```
docs/specs/
  000-conventions.md        ce fichier
  001-mesure/
    spec.md                 obligatoire
    plan.md                 si la fonctionnalité touche plusieurs fichiers ou paquets
    tasks.md                liste ordonnée, une tâche = un commit
  002-…/
```
- Numérotation à trois chiffres, dans l'ordre de création, jamais réutilisée.
- Nom court, en minuscules, séparé par des tirets.
- **Une spec = une branche** : `feat/<nom>` (ou `fix/<nom>`). Le nom de la branche reprend celui de la spec.
- Les scénarios génériques de [scenarios.md](../produit/scenarios.md) ne sont pas recopiés : la spec les **référence** par leur identifiant (S4, A3…) et ajoute seulement ce qu'ils ne disent pas.

## Cycle de vie d'une spec
| Statut | Signification |
|---|---|
| **Brouillon** | Rédigée par l'assistant, en relecture |
| **Validée** | Approuvée par le propriétaire du projet : le code peut commencer |
| **Implémentée** | Tous les critères ont un test qui passe |
| **Remplacée** | Une spec plus récente la remplace (lien indiqué) |

Après validation, toute modification de comportement passe par la spec **d'abord** (commit `docs:`), puis par les tests, puis par le code.

## Modèle de spec (`spec.md`)
```
# NNN – Titre
Statut · Branche · Scénarios liés

## Objectif            une à trois phrases
## Contexte            pourquoi, lien avec le MVP
## Hors périmètre      ce qu'on ne fait pas ici
## Règles métier       numérotées <CODE>-R1, <CODE>-R2 …
## Critères d'acceptation   numérotés <CODE>-1, <CODE>-2 … (Étant donné / Quand / Alors)
## Cas d'erreur et messages
## Données et types    contrat d'entrée et de sortie
## Décisions et questions ouvertes
## Traçabilité         tableau critère → test
```
Chaque spec a un **code court** (ex. `MES` pour la mesure) utilisé dans les numéros de règles et de critères.

## Règles de rédaction
- Un critère est **vérifiable** : une personne ou un test peut dire s'il est satisfait.
- Les cas limites sont explicites (bornes, valeurs vides, stock insuffisant).
- Les messages affichés au client sont donnés **en français**, mot pour mot.
- Les points flous vont dans « Décisions et questions ouvertes » et **bloquent la validation** tant qu'ils ne sont pas tranchés.

## Tests
- Écrits **avant** le code et vus en échec (RED) avant l'implémentation.
- Le nom d'un test commence par l'identifiant du critère : `[MES-3] refuse une longueur sous le minimum`.
- Un critère a au moins un test. Un test sans critère signale une spec incomplète.
- Types de tests : unitaires (Vitest), parcours critiques (Playwright), isolation entre boutiques dès qu'il y a un backend.
- Couverture minimale : 80 %.

## Définition de « terminé »
- [ ] Spec validée, statut mis à jour
- [ ] Chaque critère couvert par un test qui passe (tableau de traçabilité à jour)
- [ ] Couverture ≥ 80 %, contrôle de types propre
- [ ] Code relu (qualité), plus revue sécurité si la spec touche paiement, authentification, saisies ou isolation
- [ ] Documentation concernée mise à jour
- [ ] Commits conventionnels, PR en squash

## Rôles
- **Propriétaire du projet** : valide les specs et arbitre les questions ouvertes.
- **Assistant** : rédige les specs, écrit les tests puis le code, signale les risques et les contradictions avec l'existant.
- Aucune PR et aucun push sans demande explicite du propriétaire.

## Conventions de code

Ces règles sont **vérifiées automatiquement** par `src/packages/types/tests/architecture.test.ts` (critères ARCH-1 à ARCH-4). Un test qui échoue bloque le « terminé ».

### Types et interfaces : un seul paquet
- Tous les types et interfaces **exportés** vivent dans `@shop-pagne/types` (`src/packages/types/src`), classés par domaine : `catalog`, `catalog-query`, `shop`, `measure`, `api`, `mocks`, `ui`.
- Le paquet ne contient **aucun code exécutable** (ni `const`, ni `function`, ni `class`, ni `enum`).
- Les autres paquets importent leurs types avec `import type { … } from '@shop-pagne/types'` et n'en exportent aucun.
- Un type utilisé par un seul module, et qui n'en sort jamais, peut rester **local et non exporté** (ex. `RawQuery`, `Entry`). Il est documenté comme le reste.
- Quand un type se déduit d'une constante (ex. les valeurs de tri), le type littéral vit dans le paquet de types et la constante est déclarée `as const satisfies readonly Type[]` : le compilateur signale toute dérive.

### JSDoc : tout ce qui est déclaré est documenté
Chaque déclaration de premier niveau porte un commentaire `/** … */` **placé juste au-dessus**, sans ligne vide entre les deux : fonction, classe, type, interface, constante, et fonction fléchée nommée. Cela vaut aussi pour ce qui n'est pas exporté, et pour le `export default` des routes serveur.

Forme commune, en français :
```ts
/**
 * Phrase de résumé à l'indicatif : ce que fait l'élément, pas comment.
 * Détails utiles : règle métier, cas limite, unité. Renvoi à la spec : « Voir spec 001, MES-R2. »
 *
 * @param nom - Rôle du paramètre, avec son unité si pertinent.
 * @returns Ce qui est renvoyé, y compris les cas particuliers (`null`, `undefined`).
 * @throws Quand et pourquoi.
 */
```
- Une phrase suffit pour une constante ou un petit utilitaire ; pas de `@param` redondant quand le nom dit tout.
- `@param`, `@returns` et `@throws` sont obligatoires pour toute fonction **exportée** qui a des paramètres ou une valeur de retour non évidente.
- **Chaque propriété d'une interface** du paquet de types a sa ligne de documentation (ARCH-3).
- Les composants Vue ouvrent leur bloc `<script setup>` par un JSDoc qui décrit le composant, ses propriétés et ses événements (ARCH-4).
- On ne commente pas ce que le code dit déjà ; on explique le **pourquoi** et les **règles**.

### Critères
| Id | Vérification |
|---|---|
| ARCH-1 | Aucun `export interface` ni `export type` hors de `@shop-pagne/types` ; aucun code exécutable dans ce paquet |
| ARCH-2 | Chaque déclaration de premier niveau (fonctions, classes, types, constantes) est précédée d'un JSDoc |
| ARCH-3 | Chaque propriété d'une interface du paquet de types est documentée |
| ARCH-4 | Chaque composant Vue ouvre son script par un JSDoc |
