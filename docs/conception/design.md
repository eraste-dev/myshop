# Références de design : vitrine (app client)

Source : vlisco.com (version française, Côte d'Ivoire, XOF), observée dans un navigateur en affichage mobile le 16/11/2026.
Captures dans [references/vlisco/](references/vlisco/) : **usage interne uniquement**, ne pas publier (images protégées).

## Ce que fait Vlisco, observé

### Langage visuel
- **Fond blanc cassé chaud**, texte presque noir (`rgb(18,18,18)`), **boutons noirs pleins** avec texte blanc. L'interface est sobre pour que les imprimés soient la seule couleur.
- **Deux polices** : un **serif d'affichage élégant** pour les titres (Lyon Display, 32 px, graisse normale, léger interlettrage) et une **sans-serif géométrique** pour tout le reste (Euclid Square, 16 px). Ces deux polices sont commerciales : on ne les copie pas, on choisit des équivalents libres.
- **Boutons** : majuscules, interlettrage large (~1,6 px), **angles droits**, aucun arrondi.
- **Étiquettes** (« NOUVEAUTÉ », « CLASSIQUE ») : petit rectangle blanc, texte en majuscules, posé en haut à gauche de la photo.
- **Beaucoup d'espace**, très peu d'ornements, photos plein cadre.

### Accueil
En-tête minimal (menu, recherche, logo centré, favoris, compte, panier), grand visuel de collection, blocs éditoriaux, tuiles de catégories, grilles de nouveautés, newsletter, pied de page. Une fenêtre de choix pays, langue et devise s'affiche à la première visite (Côte d'Ivoire et XOF présélectionnés).

### Catalogue (« Tous les dessins »)
- Grille de **2 colonnes sur mobile**, photo du tissu en gros plan, carrée
- Sous la photo : **gamme** (« Super-Wax ») puis **« à partir de »** en gris et **le prix en XOF**
- Bouton « Ajouter au panier » en icône, sur la photo
- Deux boutons sous le titre : **FILTRER** (noir) et **TRIER PAR** (contour)
- Bouton « Load More » en bas (pas de pagination)

### Filtres (panneau plein écran sur mobile)
Accordéons, avec le nombre de **dessins** par valeur. Boutons « Appliquer » et « Tout supprimer ».

| Filtre Vlisco | Valeurs vues |
|---|---|
| Type de produit | gammes (Grand Super-Wax, Super-Wax, Satin Royal, Sky Wax, Vibe, Radiance…) |
| **Longueur de pièce** | 2 yards, 4 yards, 6 yards, 12 yards, formats carrés (68 × 68 cm, 90 × 90 cm) |
| Couleur principale | argent, beige, blanc, bleu, jaune, marron, noir, or, orange, rose, rouge, vert… |
| Couleur secondaire | mêmes couleurs |
| **Style de dessin** | objet, géométrique, botanique, décoratif, ornemental, textures, nature, floral |
| Type de tissu | coton satin, coton premium, damassé, jacquard, popeline… |
| Embellissement | métallique, pailleté (glitter), perles, aucun |
| Offre | nouveauté, classique, exclusivité en ligne, collection capsule, -10 % |

### Fiche produit (mobile)
1. **Photo plein cadre** avec loupe de zoom, étiquette « NOUVEAUTÉ », indicateur de défilement des photos
2. **Barre « AJOUTER AU PANIER » noire collée en bas de l'écran**, toujours visible
3. Fil d'Ariane : Accueil › Gamme › Référence
4. **Bloc titre** : gamme en majuscules, référence du dessin (`VLS9598.007`), nom (« Blue Glitter Embellished »), prix
5. **Couleur** : vignettes des **autres coloris du même dessin**, la sélectionnée encadrée
6. **Matière** : valeur affichée à droite (Cotton Satin)
7. **Taille** : la **longueur de pièce** (6 yards) comme choix, avec un lien « **Voir en mètres** »
8. **Quantité** avec boutons moins et plus
9. Bouton « Ajouter au panier » principal et cœur favori
10. **Rassurance** : « 81 % livrés sous 5 jours ouvrés », « Livraison offerte dès 144.310 XOF », « 30 jours pour effectuer un retour »
11. **Accordéons** : Description, Conseils d'entretien, Méthodes d'envoi et de paiement
12. **« Sélectionné pour vous »** : carrousel de produits liés

### Version bureau (1440 px, captures `*-bureau*.png`)
- **En-tête** : menu burger à gauche, recherche toujours visible (avec recherche par image), **logo centré**, à droite pays-langue-devise, favoris, compte, panier. Fin filet gris sous l'en-tête.
- **Accueil** : **deux visuels plein écran côte à côte** (50 % chacun), titre blanc en serif sur l'image, lien souligné « DÉCOUVRIR ». Une image de tissu, une image de mannequin.
- **Catalogue** : en-tête de page en **deux moitiés** : titre serif géant à gauche sur fond blanc cassé, grande photo de tissu à droite.
- **Fiche produit** : **photo grande à gauche** (≈ 50 % de la largeur, pleine hauteur), **colonne d'infos centrée à droite** avec beaucoup d'air ; fil d'Ariane en haut ; **miniatures verticales** des photos au bord droit ; le bouton « Ajouter au panier » reste à la largeur de la colonne, avec le cœur à côté.
- Les vignettes de coloris sont de petits rectangles de tissu ; celle choisie a un fin cadre noir.

## Ce que ça nous apprend sur notre modèle
- **Un dessin a plusieurs coloris** et une **référence** ; chaque coloris est une variante avec ses propres photos et son propre stock. Il faut une entité « dessin » qui regroupe les coloris, comme l'affiche la rangée de vignettes.
- **La longueur de pièce est un attribut de variante** (2, 4, 6 ou 12 yards), pas une quantité libre. Notre mode « à la pièce » doit donc supporter **plusieurs longueurs de pièce prédéfinies**. Notre mode « à la mesure » reste un plus propre à la boutique, que Vlisco n'offre pas.
- Une **bascule yards / mètres** est utile pour les clientes.
- La **référence du dessin** est centrale : elle doit être recherchable et visible.

## Ce qu'on reprend
- Palette sobre : blanc cassé, noir, et les imprimés comme seule couleur
- Duo **serif élégant pour les titres + sans-serif géométrique** pour l'interface
- Boutons noirs, majuscules, angles droits ; étiquettes rectangulaires sur les photos
- Grille de 2 colonnes sur mobile, photos de tissu en gros plan
- Panneau de filtres plein écran avec accordéons, compteurs, « Appliquer » et « Tout supprimer »
- Fiche produit : photo plein cadre, **barre d'achat collée en bas**, vignettes de coloris, longueur de pièce, accordéons, produits liés
- Bloc de rassurance (livraison, retours)
- « Load More » plutôt qu'une pagination, bon pour le mobile

## Ce qu'on adapte ou écarte
- **Polices** : Lyon Display et Euclid Square sont sous licence. Équivalents libres à choisir (un serif d'affichage élégant et une sans-serif géométrique, par exemple parmi Google Fonts), avec **tout passant par les jetons** pour qu'une boutique change de style.
- **Navigation allégée** : un petit catalogue n'a pas besoin des 20 liens de Vlisco.
- **Vocabulaire en français** : les valeurs « Object », « Geometrical »… sont restées en anglais chez Vlisco. On les met en français.
- **Pas de fenêtre pays, langue et devise** au lancement : une boutique, une devise.
- **« À partir de »** : à garder seulement quand le prix dépend vraiment de la longueur choisie.
- **Pas de vidéo lourde**, parce que le mobile d'abord et les connexions moyennes l'imposent.
- **Thème par boutique** : couleurs, polices et logo viennent des jetons, pas d'une identité figée.

## Reste à définir
- [ ] Choix précis des deux polices libres
- [ ] Valeur exacte du fond blanc cassé et du noir (à mesurer sur la maquette, pas relevée ici)
- [ ] Version bureau (ici, seule la version mobile a été observée)
- [ ] Parcours panier et commande (non vus)
- [ ] Références Chariow pour les deux back-offices (à fournir)
