# 003 – Tâches et traçabilité

Statut de la spec : **implémentée**.

## Traçabilité
| Critère | Vérification |
|---|---|
| MOC-1 | `fixtures.test.ts` : 14 dessins, 43 coloris, pièces et mesures, ruptures, stocks bas, nouveautés |
| MOC-2, MOC-R10 | `fixtures.test.ts` : identifiants uniques, prix et stocks entiers, mesures valides, textes renseignés |
| MOC-3, MOC-4 | `pattern.test.ts` : déterminisme, SVG valide, sans script, léger, zoom |
| MOC-5 à MOC-14 | `catalog.test.ts` (pur) + vérification sur serveur réel (`verify-api`) |
| MOC-15 | `catalog.test.ts`, `api.test.ts` et serveur réel : 43 cartes sans doublon |
| MOC-16, MOC-R8 | `catalog-query.test.ts`, `api.test.ts` et serveur réel : 400 avec le champ `limit` |
| MOC-17, MOC-18 | `catalog.test.ts`, `api.test.ts` et serveur réel : 200 et 404 |
| MOC-19, MOC-20 | `scenario.test.ts` et serveur réel : 500 et 1 511 ms |
| MOC-21, MOC-R9 | `catalog.test.ts` : données gelées, aucune modification |
| Client d'API | `src/client/tests/api-catalog.test.ts` : paramètres, encodage, erreurs normalisées en français sans détail technique |

Tests : shared 35, mocks 73, client 20. Couverture des mocks : 100 % des instructions, 95 % des branches.

## Tâches
- [x] Contrat partagé : `CatalogQuery`, validation Zod, types de carte
- [x] Générateur de motifs SVG déterministe avec zoom
- [x] 14 dessins et 43 coloris de démonstration
- [x] Simulation du catalogue : filtres, facettes disjonctives, tris, curseur
- [x] Réponses 200, 400 et 404 en fonctions pures
- [x] Scénarios `error` et `slow`
- [x] Routes Nitro : `/api/catalog`, `/api/designs/:id`, `/api/patterns/:fichier`
- [x] Client d'API et composable `useCatalogApi`
- [x] Vérification de bout en bout sur le serveur de production (23 contrôles)

## À savoir
- Les routes `src/client/server/api/` sont une **simulation** : elles disparaissent quand le backend arrive.
- Les images sont servies par URL (`/api/patterns/<coloris>.svg`) et non intégrées en base64 : réponses de catalogue de 4 Ko au lieu de plusieurs centaines.
- Le script `verify-api.mjs` (contrôle de bout en bout) n'est pas dans le dépôt. À transformer en test Playwright quand les écrans existeront.
