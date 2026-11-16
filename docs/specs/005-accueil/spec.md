# 005 – Page d'accueil

**Code** : `HOM` · **Statut** : validée (délégation) · **Branche** : `feat/client-home`
**Scénarios liés** : S1 · **Voir aussi** : [design.md](../../design.md), [ecrans.md](../../ecrans.md), [003](../003-donnees-demo-et-api/spec.md), [004](../004-disposition-boutique/spec.md)

## Objectif
Remplacer l'accueil provisoire par une vraie page de vente : un bandeau de mise en avant, des raccourcis, les gammes, et une grille des pagnes à découvrir, alimentés par le catalogue.

## Hors périmètre
Catalogue complet, filtres et fiche produit (specs suivantes : leurs adresses sont prévues mais mènent à la page 404 d'ici là). Contenu éditorial rédigé (lookbooks, histoire de la marque). Vidéo.

## Contenu de la page, de haut en bas
1. **Bandeau** : deux panneaux côte à côte sur écran large (empilés sur mobile). Chacun a une grande image de pagne, un titre en serif et un lien souligné « DÉCOUVRIR ». Gauche : « Les nouveautés » → `/catalogue?sort=new`. Droite : « Tous les dessins » → `/catalogue`.
2. **Raccourcis** : *Nouveautés*, *Tous les dessins*, *Disponibles maintenant*.
3. **Gammes** : une tuile en portrait par gamme (ex. Super Wax, Java), avec une photo et le nombre de dessins. → `/catalogue?range=<gamme>`.
4. **À découvrir** : jusqu'à 8 cartes de pagnes, puis un lien « Voir tout le catalogue ».
5. L'en-tête et le pied de page viennent de la disposition (spec 004).

## Règles
- **HOM-R1** Tout vient d'**un seul appel** au catalogue (`limit=48`, tri par nouveautés). L'accueil ne fait pas d'autre requête.
- **HOM-R2** *À découvrir* : les coloris portant l'étiquette « nouveauté » d'abord, puis les autres coloris **disponibles**, puis le reste, dans l'ordre du catalogue ; 8 au plus.
- **HOM-R3** Image du panneau gauche : celle du premier coloris à découvrir. Image du panneau droit : celle du premier coloris **d'une autre gamme**, à défaut un autre coloris. Sans image, le panneau s'affiche quand même, sur fond neutre, avec son titre et son lien.
- **HOM-R4** Une tuile de gamme n'existe que s'il y a au moins un coloris de cette gamme ; son image est celle du premier coloris de la gamme ; l'ordre est alphabétique.
- **HOM-R5** **Carte produit** : photo carrée, étiquettes en français (deux au plus), gamme, référence complète, prix. Elle est entièrement cliquable et mène à `/produits/<dessin>?coloris=<coloris>`.
- **HOM-R6** **Formats de prix** (francs CFA, espaces insécables entre les milliers) : prix fixe « 38 000 F CFA » ; plusieurs longueurs « à partir de 10 000 F CFA » ; vente à la mesure « 5 000 F CFA / yard » (ou « / mètre »).
- **HOM-R7** Un coloris indisponible reste visible, marqué « Épuisé » : son prix est atténué.
- **HOM-R8** **Étiquettes** : `new` « Nouveauté », `classic` « Classique », `last-pieces` « Dernières pièces », `online-exclusive` « Exclusivité en ligne ».
- **HOM-R9** Les images ont une largeur et une hauteur déclarées (pas de saut de mise en page) ; elles sont chargées **à la demande**, sauf celles du bandeau, chargées en priorité. Le texte alternatif décrit le pagne : « Super Wax PGN2101.001, Bleu ».
- **HOM-R10** **Titres** : un seul `h1` (le nom de la boutique, masqué visuellement) et un `h2` par section.
- **HOM-R11** Le titre de la page est « <nom de la boutique> — <accroche> » et la description de la page reprend l'accroche.
- **HOM-R12** Les cartes sont en **2 colonnes sur mobile**, 3 sur tablette, 4 sur écran large.

## États
| État | Affichage |
|---|---|
| Chargement | La page est rendue côté serveur : le contenu arrive avec le HTML. |
| Erreur du catalogue | Le bandeau et les gammes sont remplacés par un message « Le catalogue est momentanément indisponible. » et un bouton « Réessayer » ; l'en-tête et le pied de page restent. |
| Catalogue vide | Message « Aucun pagne pour le moment. » |

## Critères d'acceptation
| Id | Étant donné | Quand | Alors |
|---|---|---|---|
| HOM-1 | un catalogue avec des nouveautés | on prépare l'accueil | « À découvrir » commence par les nouveautés, puis les disponibles, 8 au plus |
| HOM-2 | un catalogue de plusieurs gammes | on prépare le bandeau | le panneau droit montre une autre gamme que le gauche |
| HOM-3 | un catalogue sans image exploitable | on prépare le bandeau | les deux images sont absentes mais les panneaux restent affichables |
| HOM-4 | des gammes avec coloris | on prépare les tuiles | une tuile par gamme, image du premier coloris, nombre de dessins, ordre alphabétique |
| HOM-5 | un coloris à prix fixe, un à plusieurs longueurs, un à la mesure | on formate leurs prix | « 38 000 F CFA », « à partir de 10 000 F CFA », « 5 000 F CFA / yard » |
| HOM-6 | un coloris avec trois étiquettes | on affiche la carte | deux étiquettes en français |
| HOM-7 | un coloris indisponible | on affiche la carte | la mention « Épuisé » apparaît |
| HOM-8 | une carte | on lit son lien | `/produits/<dessin>?coloris=<coloris>`, valeurs encodées |
| HOM-9 | une carte | on lit son image | texte alternatif descriptif, dimensions déclarées, chargement à la demande |
| HOM-10 | un catalogue en échec | on affiche la page | message d'erreur et bouton « Réessayer » ; en-tête et pied de page présents |
| HOM-11 | un catalogue vide | on affiche la page | message « Aucun pagne pour le moment. » |
| HOM-12 | la page rendue | on lit ses titres | un seul `h1`, un `h2` par section |
| HOM-13 | la page rendue | on lit son `<title>` | « Boutique de pagnes — Pagnes et wax, choisis avec soin » |

## Adresses prévues
`/catalogue`, `/catalogue?sort=new`, `/catalogue?availableOnly=true`, `/catalogue?range=<gamme>`, `/produits/<dessin>?coloris=<coloris>`. Elles mènent à la page 404 jusqu'aux specs du catalogue et de la fiche produit.

## Décisions
- Pas de texte éditorial inventé : les titres du bandeau et des sections sont fixes et neutres.
- Un seul appel au catalogue : l'accueil reste léger et rapide en connexion moyenne.
- La carte produit est un composant partagé : le catalogue la réutilisera.

## Traçabilité
Voir `tasks.md`.
