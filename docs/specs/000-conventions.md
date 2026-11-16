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
- Les scénarios génériques de [scenarios.md](../scenarios.md) ne sont pas recopiés : la spec les **référence** par leur identifiant (S4, A3…) et ajoute seulement ce qu'ils ne disent pas.

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
