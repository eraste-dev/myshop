# 001 – Vente à la mesure

**Code** : `MES` · **Statut** : validée (décisions tranchées par délégation du propriétaire) · **Branche** : `feat/measure-pricing` (code initial dans `src/packages/shared/src/measure.ts`, spec rétroactive)
**Scénarios liés** : S4, S5, S6, S7, A3 ([scenarios.md](../../produit/scenarios.md)) · **Voir aussi** : « Modes de vente » dans [mvp.md](../../produit/mvp.md)

## Objectif
Permettre à une cliente d'acheter un pagne **par la longueur de son choix**, dans des limites configurées par la gérante, avec un prix calculé exactement et un stock en longueur qui ne peut pas être dépassé.

## Contexte
Une boutique choisit pour chaque produit entre la vente **à la pièce** (longueurs prédéfinies : 2, 4, 6, 12 yards) et la vente **à la mesure**. Cette spec ne couvre que la mesure : calcul du prix, validation d'une longueur, conversion yards et mètres. La vente à la pièce aura sa propre spec.

## Hors périmètre
- Panier, commande, réservation de stock (autres specs)
- Affichage des écrans (spec de la fiche produit)
- Vente à la pièce
- Remises, taxes, frais de livraison

## Paramètres d'un produit à la mesure
| Paramètre | Sens |
|---|---|
| `unit` | unité de la mesure : `yard` ou `meter` |
| `unitPrice` | prix d'une unité, en francs CFA, entier |
| `min` | longueur minimale commandable |
| `max` | longueur maximale commandable |
| `step` | pas de découpe (ex. 0,5) |
| `stock` | longueur disponible, dans l'unité du produit |

Tous sont configurables par la gérante pour chaque produit (A3).

## Règles métier
- **MES-R1** Les longueurs sont exprimées dans l'**unité du produit**. La conversion en mètres ou en yards ne sert qu'à l'affichage.
- **MES-R2** Le prix est `prix unitaire × longueur`, **arrondi au franc CFA entier le plus proche**.
- **MES-R3** Le calcul est exact à deux décimales près : aucune erreur de flottant (0,7 × 1000 = 700).
- **MES-R4** Une longueur est valide si elle est **≥ min**, **≤ max**, un **multiple du pas à partir du minimum**, et **≤ stock**.
- **MES-R5** Les bornes `min` et `max` sont **incluses**.
- **MES-R6** Une valeur non numérique, nulle ou négative est refusée.
- **MES-R7** Une seule erreur est renvoyée à la fois, dans l'ordre : valeur invalide, sous le minimum, au-dessus du maximum, hors du pas, au-dessus du stock.
- **MES-R8** Un yard vaut exactement **0,9144 mètre**. Les conversions sont arrondies au **centième**.
- **MES-R9** Un produit à la mesure est **disponible** si son stock est **supérieur ou égal à la longueur minimale**. Sinon il est traité comme en rupture.
- **MES-R10** Le pas est compté **à partir du minimum** : les longueurs valides sont `min`, `min + pas`, `min + 2 × pas`, etc.

## Critères d'acceptation

| Id | Étant donné | Quand | Alors |
|---|---|---|---|
| MES-1 | un produit à 8 000 F l'unité, min 1, max 6, pas 0,5, stock 20 | la cliente saisit 2,5 | la longueur est valide et le prix est 20 000 F |
| MES-2 | le même produit | la cliente saisit 1, puis 6 | les deux sont valides (bornes incluses) |
| MES-3 | le même produit | la cliente saisit 0,5 | refus `below_min`, minimum 1 |
| MES-4 | le même produit | la cliente saisit 6,5 | refus `above_max`, maximum 6 |
| MES-5 | le même produit | la cliente saisit 2,3 | refus `invalid_step`, pas 0,5 |
| MES-6 | un stock de 3 | la cliente saisit 4 | refus `exceeds_stock`, disponible 3 |
| MES-7 | n'importe quel produit à la mesure | la cliente saisit une valeur vide, nulle, négative ou non numérique | refus `not_a_number` |
| MES-8 | un prix unitaire de 3 333 F | la longueur est 1,5 | le prix est un entier : 5 000 F |
| MES-9 | un prix unitaire de 1 000 F et un pas de 0,1 | la longueur est 0,7 puis 2,3 | les prix sont 700 F et 2 300 F, sans écart de flottant |
| MES-10 | min 0,5 et pas 0,1 | la longueur est 0,7 puis 2,3 | les deux sont valides |
| MES-11 | une longueur en yards | on demande l'équivalent en mètres | 6 yards donnent 5,49 m |
| MES-12 | une longueur en mètres | on demande l'équivalent en yards | 5,49 m donnent 6 yards |
| MES-13 | un stock de 3 et un minimum de 4 | on teste la disponibilité | le produit est indisponible |
| MES-14 | un stock égal au minimum | on teste la disponibilité | le produit est disponible |
| MES-15 | une longueur à la fois sous le minimum et hors du pas | on la valide | seule l'erreur `below_min` est renvoyée (ordre de MES-R7) |
| MES-16 | un produit vendu au mètre, min 1, max 3, pas 0,5, prix 5 000 F | la cliente saisit 2,5 | la longueur est valide et le prix est 12 500 F |
| MES-17 | un minimum de 0,75 et un pas de 0,5 | la cliente saisit 1,25 puis 1,5 | 1,25 est valide, 1,5 est refusé (`invalid_step`) |

## Messages affichés à la cliente (français)
| Code | Message |
|---|---|
| `not_a_number` | « Saisissez une longueur valide. » |
| `below_min` | « La longueur minimale est de {min} {unité}. » |
| `above_max` | « La longueur maximale est de {max} {unité}. » |
| `invalid_step` | « La longueur doit être un multiple de {step} {unité}. » |
| `exceeds_stock` | « Seulement {available} {unité} disponibles. » |

Les messages sont du ressort de l'interface. Le module ne renvoie que le **code** et les valeurs utiles.

## Contrat
```ts
measurePrice(config, length): Xof                       // entier, F CFA
validateMeasure(config, length): { ok: true } | { ok: false, code, … }
yardsToMeters(yards): number                            // centièmes
metersToYards(meters): number                           // centièmes
```
Les fonctions sont **pures** : aucun état, aucune modification des entrées.

## Décisions
| Id | Question | Décision |
|---|---|---|
| D1 | Pas compté depuis le minimum ? | **Oui** (MES-R10) : c'est ce que la gérante configure. |
| D2 | Plusieurs lignes du même produit | Le stock est vérifié sur le **total** du panier. Ce sera une règle de la spec du panier, qui s'appuiera sur `validateMeasure`. |
| D3 | Saisie en mètres | **Non en v1** : saisie dans l'unité du produit, équivalent en mètres affiché. |
| D4 | Arrondi du prix | Au **franc entier le plus proche** (MES-R2), sans arrondi à 5 ou 25 F. |
| D5 | Stock inférieur au minimum | Produit **indisponible** (MES-R9), affiché en rupture. |

## Traçabilité
Tests dans `src/packages/shared/src/measure.test.ts`. Couverture de `measure.ts` : 100 %.

| Critère ou règle | Test |
|---|---|
| MES-1 | `[MES-1] multiplie le prix unitaire…`, `[MES-1] accepte une longueur valide` |
| MES-2 | `[MES-2] accepte les bornes minimale et maximale` |
| MES-3 | `[MES-3] refuse une longueur sous le minimum` |
| MES-4 | `[MES-4] refuse une longueur au-dessus du maximum` |
| MES-5 | `[MES-5] refuse une longueur hors du pas de découpe` |
| MES-6 | `[MES-6] refuse une longueur supérieure au stock disponible` |
| MES-7 | `[MES-7] refuse une valeur qui n’est pas un nombre positif` |
| MES-8 | `[MES-8] renvoie un entier de francs CFA` |
| MES-9 | `[MES-9] évite les erreurs de flottants…` |
| MES-10 | `[MES-10] traite le pas de 0,1 sans erreur de flottant` |
| MES-11 | `[MES-11] convertit les yards en mètres` |
| MES-12 | `[MES-12] convertit les mètres en yards` |
| MES-13 | `[MES-13] est indisponible quand le stock est sous le minimum`, `…stock est nul` |
| MES-14 | `[MES-14] est disponible quand le stock égale le minimum` |
| MES-15, MES-R7 | `[MES-15] ne renvoie que la première erreur…` |
| MES-16, MES-R1 | `[MES-16] calcule le prix d’un produit vendu au mètre` |
| MES-17, MES-R10 | `[MES-17] compte le pas à partir du minimum` |
| MES-R3 | `[MES-R3] ne modifie pas la configuration reçue` |
