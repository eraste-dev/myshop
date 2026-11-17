# 004 – Disposition de la boutique (en-tête, menu, pied de page)

**Code** : `LAY` · **Statut** : validée (délégation) · **Branche** : `feat/client-layout`
**Scénarios liés** : S14, S16 · **Voir aussi** : [design.md](../../conception/design.md), [ecrans.md](../../produit/ecrans.md), [002](../002-client-socle/spec.md), [003](../003-donnees-demo-et-api/spec.md)

## Objectif
Donner à toutes les pages de la vitrine une **enveloppe commune** : en-tête sobre avec menu, recherche et panier, pied de page avec liens utiles et contact WhatsApp, le tout **aux couleurs de la boutique** et accessible.

## Hors périmètre
Contenu de l'accueil. Page de résultats de la recherche (spec du catalogue). Panier réel (le compteur vaut 0 tant que la spec du panier n'existe pas). Pages légales (liens prévus, contenu dans une spec ultérieure). Favoris et compte client (hors MVP).

## Règles
- **LAY-R1** Les informations de la boutique (nom, accroche, numéro WhatsApp, thème) viennent de l'API `GET /api/shop`, jamais du code.
- **LAY-R2** Le thème de la boutique (`accent`, `accentContrast`) est appliqué par **variables CSS** sur l'enveloppe. Aucune couleur en dur dans les composants.
- **LAY-R3** **En-tête** (inspiré de Vlisco, voir design.md) : bouton de menu à gauche, **nom de la boutique centré** (lien vers l'accueil), panier à droite avec compteur. Un filet fin le sépare du contenu. Sur écran large, un champ de recherche s'affiche à côté du bouton de menu. L'en-tête reste collé en haut au défilement.
- **LAY-R4** **Menu** (tiroir à gauche) : champ de recherche, puis les entrées *Accueil*, *Catalogue*, *Nouveautés*, *À propos*, *Contact*. Il se ferme avec la touche Échap, par un clic à l'extérieur, par le bouton de fermeture, ou en choisissant une entrée. Le focus y est piégé tant qu'il est ouvert et revient au bouton à la fermeture.
- **LAY-R5** **Recherche** : un formulaire de recherche (`role="search"`) envoie vers `/catalogue?q=<texte>`. Le texte est nettoyé (espaces retirés aux extrémités). Un champ vide n'envoie rien.
- **LAY-R6** **Panier** : le lien mène à `/panier`. Le compteur n'apparaît que s'il est supérieur à zéro (plafonné à « 99+ »). L'étiquette accessible dit le nombre d'articles.
- **LAY-R7** **Pied de page** : nom et accroche de la boutique ; liens *Livraison et retours*, *Conditions générales de vente*, *À propos*, *Contact* ; lien **WhatsApp** ; mention du droit d'auteur avec l'année et le nom de la boutique.
- **LAY-R8** Le lien WhatsApp est `https://wa.me/<chiffres du numéro>?text=<message encodé>`. Seuls les chiffres du numéro sont gardés. Un numéro de moins de 8 chiffres ne produit **aucun lien** (le bouton n'est pas affiché).
- **LAY-R9** Accessibilité : repères `header`, `nav`, `main`, `footer` ; lien d'évitement toujours le premier élément focalisable ; boutons d'icônes avec libellé en français ; cibles tactiles d'au moins 44 px ; focus visible ; le bouton de menu porte `aria-expanded` et `aria-controls`.
- **LAY-R10** Les liens de navigation fonctionnent **sans JavaScript** (rendu serveur).
- **LAY-R11** Si l'API de la boutique échoue, l'enveloppe s'affiche quand même, avec le nom par défaut « Boutique de pagnes », sans bloquer la page.
- **LAY-R12** Le nom de la boutique est affiché en **police d'affichage** ; le reste en police de texte (jetons de [design](../../conception/design.md)).

## Critères d'acceptation
| Id | Étant donné | Quand | Alors |
|---|---|---|---|
| LAY-1 | l'API de la boutique | on appelle `GET /api/shop` | on obtient le nom, l'accroche, le numéro WhatsApp et le thème |
| LAY-2 | un thème de boutique | on calcule le style de l'enveloppe | `--color-accent` et `--color-accent-contrast` portent ses valeurs |
| LAY-3 | n'importe quelle page | on la rend | l'en-tête affiche le nom de la boutique en lien vers `/` |
| LAY-4 | l'en-tête | on le rend | le bouton de menu est libellé « Ouvrir le menu » avec `aria-expanded="false"` |
| LAY-5 | un compteur de panier à 0, puis à 3, puis à 120 | on rend l'en-tête | rien, puis « 3 », puis « 99+ » ; l'étiquette dit « Panier, 3 articles » (« 1 article » au singulier) |
| LAY-6 | le menu ouvert | on lit son contenu | les cinq entrées sont présentes, avec les bonnes adresses |
| LAY-7 | le menu ouvert | on appuie sur Échap | il se ferme |
| LAY-8 | le menu ouvert | on choisit une entrée | il se ferme |
| LAY-9 | un texte saisi dans la recherche | on valide | on obtient `/catalogue?q=<texte nettoyé et encodé>` |
| LAY-10 | un champ de recherche vide ou fait d'espaces | on valide | aucune navigation |
| LAY-11 | un numéro et un message | on construit le lien WhatsApp | `https://wa.me/<chiffres>?text=<message encodé>` |
| LAY-12 | un numéro de moins de 8 chiffres | on construit le lien | aucun lien ; le bouton WhatsApp du pied de page est absent |
| LAY-13 | le pied de page | on le rend | les quatre liens, le lien WhatsApp et le droit d'auteur avec l'année et le nom |
| LAY-14 | l'enveloppe | on la rend | les repères `header`, `nav`, `main`, `footer` existent et le lien d'évitement précède le reste |
| LAY-15 | l'API de la boutique en échec | on rend l'enveloppe | le nom par défaut s'affiche et la page reste utilisable |

## Navigation et adresses
| Entrée | Adresse |
|---|---|
| Accueil | `/` |
| Catalogue | `/catalogue` |
| Nouveautés | `/catalogue?sort=new` |
| À propos | `/pages/a-propos` |
| Contact | `/pages/contact` |
| Livraison et retours | `/pages/livraison-et-retours` |
| Conditions générales de vente | `/pages/cgv` |
| Panier | `/panier` |

Les pages `catalogue`, `panier` et `pages/*` seront créées par les specs suivantes ; d'ici là, ces liens mènent à la page 404.

## Décisions
- Les icônes sont de petits SVG maison (trait fin, `currentColor`), sans bibliothèque d'icônes.
- Le tiroir de menu utilise les primitives sans style de Reka UI (dialogue accessible, focus piégé), avec le style de la vitrine.
- Le compteur de panier vient d'un composable `useCartCount()` qui renvoie 0 jusqu'à la spec du panier.
- Pas de favoris ni de compte dans l'en-tête : hors MVP.

## Traçabilité
Voir `tasks.md`.
