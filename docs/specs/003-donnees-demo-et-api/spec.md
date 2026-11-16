# 003 – Données de démonstration et API du catalogue

**Code** : `MOC` · **Statut** : validée (délégation) · **Branche** : `feat/demo-data-and-api`
**Scénarios liés** : S1, S2, S6 · **Voir aussi** : [frontend-mocks.md](../../frontend-mocks.md), [filtres.md](../../filtres.md), [001-mesure](../001-mesure/spec.md)

## Objectif
Fournir à la vitrine un **catalogue de démonstration crédible** et une **API HTTP simulée** (liste filtrée et triée, fiche d'un dessin), pour construire et valider les écrans sans backend. Le backend réel remplacera la simulation sans modifier les écrans.

## Hors périmètre
Panier, commande, paiement, paramètres de boutique, back-offices. Vraies photos (remplacées par des motifs générés).

## Décisions d'architecture
| Id | Décision | Raison |
|---|---|---|
| D1 | L'API simulée est servie par des **routes serveur Nitro** de l'application (`src/client/server/api/`), pas par MSW. | La vitrine est rendue côté serveur : MSW (navigateur) n'intercepterait pas les appels du rendu serveur. Les routes Nitro répondent aux deux. Quand le backend existera, on supprime ces routes et on configure un proxy : les écrans ne changent pas. |
| D2 | La **logique de la simulation** (filtres, tri, facettes) vit dans `@shop-pagne/mocks`, en fonctions pures testées. Les routes serveur ne font que valider l'entrée et appeler ces fonctions. | Réutilisable par `client-admin` et `client-platform`, testable sans serveur. |
| D3 | Le **contrat** (types et validation des paramètres de requête) vit dans `@shop-pagne/shared`. | Source unique pour les écrans, la simulation et le futur backend. |
| D4 | Les photos sont des **motifs SVG générés** de façon déterministe. | Pas de vraies photos pour la démonstration ; rendu stable d'un chargement à l'autre. |
| D5 | Un paramètre `scenario` (`error`, `slow`) simule les pannes et la lenteur, **en mode démonstration uniquement**. | Valider les états d'erreur et de chargement des écrans. |

## Règles métier
- **MOC-R1** Une **carte du catalogue** correspond à **un coloris** d'un dessin (comme chez Vlisco). Sa référence est `<référence du dessin>.<code du coloris>`.
- **MOC-R2** Prix affiché : coloris vendu **à la pièce** avec plusieurs longueurs de prix différents → mode `from` (prix de la plus petite longueur) ; une seule longueur → mode `fixed` ; coloris **à la mesure** → mode `per-unit` (prix de l'unité, avec son unité).
- **MOC-R3** Un coloris est **disponible** si au moins une pièce a du stock (pièce) ou si `isMeasureAvailable` (mesure, voir 001).
- **MOC-R4** Les filtres d'**attributs différents** se **croisent** (ET) ; au sein d'un même attribut, les valeurs **s'additionnent** (OU).
- **MOC-R5** Le **nombre** affiché pour une valeur d'un filtre est calculé **avec tous les autres filtres appliqués** et sans le filtre de cet attribut (facettes disjonctives). Une valeur à zéro reste listée.
- **MOC-R6** Tris : `new` (nouveautés d'abord, par défaut), `price-asc`, `price-desc`. Le tri est **stable** : à égalité, l'ordre des références décide.
- **MOC-R7** Pagination par **curseur** ; la page par défaut compte 12 cartes, maximum 48.
- **MOC-R8** Un identifiant de dessin inconnu renvoie **404**. Un paramètre invalide renvoie **400** avec la liste des champs fautifs.
- **MOC-R9** Les fonctions de la simulation sont **pures** et **ne modifient pas** les données de départ.
- **MOC-R10** Les données de démonstration respectent le contrat : identifiants uniques, prix entiers positifs, stocks entiers positifs ou nuls, configuration de mesure valide, au moins une image par coloris.

## Paramètres de requête du catalogue
`range`, `color`, `style`, `finish`, `length` (listes séparées par des virgules) · `priceMin`, `priceMax` (entiers) · `availableOnly` (booléen) · `sort` · `cursor` · `limit`.

## Critères d'acceptation

| Id | Étant donné | Quand | Alors |
|---|---|---|---|
| MOC-1 | le catalogue de démonstration | on le charge | il contient au moins 12 dessins et 30 coloris, avec des pièces et des mesures, des ruptures et des stocks bas |
| MOC-2 | les données de démonstration | on les valide | toutes les règles MOC-R10 sont respectées |
| MOC-3 | une même graine | on génère un motif deux fois | les deux motifs sont identiques ; deux graines différentes donnent deux motifs différents |
| MOC-4 | un motif généré | on le lit | c'est une image SVG valide, utilisable comme source d'image |
| MOC-5 | aucun filtre | on liste le catalogue | on obtient la première page triée par nouveautés, avec le total et un curseur s'il reste des cartes |
| MOC-6 | un filtre `color=Bleu` | on liste | seules les cartes de coloris bleus apparaissent |
| MOC-7 | `color=Bleu,Rouge` | on liste | les cartes bleues **ou** rouges apparaissent (OU) |
| MOC-8 | `color=Bleu&style=Floral` | on liste | seules les cartes bleues **et** florales apparaissent (ET) |
| MOC-9 | `length=6` | on liste | seuls les coloris proposant une pièce de 6 yards apparaissent |
| MOC-10 | `priceMin` et `priceMax` | on liste | seuls les prix compris (bornes incluses) apparaissent ; un coloris à la mesure est comparé au prix de l'unité |
| MOC-11 | `availableOnly=true` | on liste | aucune carte indisponible n'apparaît |
| MOC-12 | `sort=price-asc` puis `price-desc` | on liste | les prix sont ordonnés ; à égalité, l'ordre des références décide |
| MOC-13 | un filtre `color=Bleu` | on lit les facettes | le nombre de chaque **couleur** ignore le filtre couleur, celui des **autres attributs** en tient compte |
| MOC-14 | une valeur de facette sans résultat | on lit les facettes | elle est listée avec le nombre 0 |
| MOC-15 | `limit=5` | on pagine avec le curseur | on parcourt tout le catalogue sans doublon ni oubli |
| MOC-16 | `limit=100` | on liste | une erreur 400 signale que la limite maximale est 48 |
| MOC-17 | un identifiant de dessin existant | on demande la fiche | on obtient le dessin avec tous ses coloris |
| MOC-18 | un identifiant inconnu | on demande la fiche | on obtient une erreur 404 |
| MOC-19 | `scenario=error` | on appelle l'API | on obtient une erreur 500 |
| MOC-20 | `scenario=slow` | on appelle l'API | la réponse arrive après un délai d'environ 1,5 s |
| MOC-21 | n'importe quel appel | on compare les données avant et après | elles sont identiques (aucune modification) |

## Contrat d'API
```
GET /api/catalog?…     → CatalogPage { items, facets, total, nextCursor }
GET /api/designs/:id   → Design
```
Types dans `@shop-pagne/shared`. Les chemins sont **relatifs** : le futur backend se place derrière le même préfixe `/api`.

## Traçabilité
Voir `tasks.md`.
