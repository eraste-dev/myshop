# Ce qu'il faut faire

Listes de contrôle à suivre. Les erreurs correspondantes sont dans [erreurs-a-eviter.md](erreurs-a-eviter.md), les règles dans [conventions.md](conventions.md).

## Avant de commencer une tâche
- [ ] Lire `CLAUDE.md`, [erreurs-a-eviter.md](erreurs-a-eviter.md) et la spec concernée.
- [ ] Une spec validée existe ? Sinon la rédiger et la faire valider.
- [ ] Chercher l'existant (code, paquets, bibliothèque éprouvée) avant d'écrire du neuf.
- [ ] Nouvel emplacement de fichier ? Demander.
- [ ] Point ambigu ou meilleure approche possible ? Le signaler avant d'implémenter.
- [ ] Branche courte dédiée, nommée comme la spec.

## Pendant
- [ ] Test écrit et vu en échec (RED), puis code minimal (GREEN), puis refactor.
- [ ] Test nommé `[CODE-n] …`, un critère = au moins un test.
- [ ] Types dans `@shop-pagne/types`, JSDoc français partout.
- [ ] Jetons de design uniquement, mobile d'abord, accessibilité.
- [ ] Entrées externes validées (Zod), erreurs traitées avec message clair.
- [ ] Argent et mesures en entiers.

## Avant de dire « terminé »
- [ ] `just check` (tests + types) passe ; couverture ≥ 80 %.
- [ ] Interface vérifiée dans un vrai navigateur (mobile et bureau).
- [ ] Revue du code ; revue sécurité si paiement, authentification, saisies, isolation, fichiers.
- [ ] Tableau de traçabilité et statut de la spec à jour.
- [ ] Docs concernées mises à jour (`docs/README.md`, `CLAUDE.md` si une règle change).
- [ ] Nouvelle erreur rencontrée ? Ajoutée à [erreurs-a-eviter.md](erreurs-a-eviter.md).

## Avant de commiter
- [ ] Message conventionnel, sans `Co-Authored-By`.
- [ ] Aucun secret, `console.log`, fichier généré ni capture de `docs/references/`.
- [ ] Pas de push ni de PR sans demande explicite.
