# Attributs produit et filtres

> **Statut : proposition à valider avec la gérante.** Les valeurs sont des exemples de départ, elle connaît le vocabulaire réel de ses clientes.

## Principe
Les filtres de la vitrine sont **déduits des attributs des produits**, pas écrits en dur. Chaque boutique définit ses attributs, et le catalogue reste générique pour d'autres produits que les pagnes (voir [plateforme.md](plateforme.md)).

## Définition d'un attribut
Chaque attribut a :

| Propriété | Rôle |
|---|---|
| Nom | « Couleur », « Motif »… |
| Type | choix unique, choix multiple, couleur, nombre, texte |
| Valeurs | liste fermée gérée par la boutique (sauf nombre et texte) |
| Filtrable | apparaît dans les filtres du catalogue |
| Affiché sur la fiche | visible sur la page du produit |
| Obligatoire | requis à la création d'un produit |
| Ordre | position dans les filtres et sur la fiche |

Un **modèle d'attributs « pagne »** est fourni par défaut. La gérante peut le modifier.

## Ce que fait Vlisco (observé, voir [design.md](../conception/design.md))
Filtres : type de produit (gamme), **longueur de pièce**, couleur principale, **couleur secondaire**, style de dessin, type de tissu, embellissement, offre. Chaque valeur affiche son nombre de dessins. Vocabulaire du style de dessin : objet, géométrique, botanique, décoratif, ornemental, textures, nature, floral.

Ajouts à notre liste ci-dessous, déduits de cette observation :
- **Longueur de pièce** (2, 4, 6, 12 yards) : filtre et variante de produit
- **Couleur secondaire**
- **Offre** (nouveauté, classique, exclusivité, dernières pièces)

## Attributs proposés pour les pagnes

| Attribut | Type | Exemples de valeurs | Filtre |
|---|---|---|---|
| **Collection** | choix unique | nouveautés, classiques, éditions limitées | oui |
| **Type de tissu / gamme** | choix unique | wax, super wax, java, fancy, pagne tissé… | oui |
| **Couleur dominante** | couleur (multiple) | rouge, bleu, jaune, vert, multicolore… | oui |
| **Couleur secondaire** | couleur (multiple) | mêmes valeurs | oui |
| **Longueur de pièce** | choix unique (variante) | 2 yards, 4 yards, 6 yards, 12 yards | oui |
| **Motif / thème** | choix multiple | géométrique, floral, animalier, abstrait, symbolique | oui |
| **Marque / fabricant** | choix unique | à définir | oui |
| **Occasion** | choix multiple | cérémonie, mariage, quotidien, deuil, fête | oui |
| **Finition** | choix multiple | brillant, doré, pailleté | oui |
| **Composition** | texte | coton 100 % | non, fiche seulement |
| **Largeur** | nombre | en cm | non, fiche seulement |
| **Référence du motif** | texte | code ou nom du motif | recherche |
| **Entretien** | texte | conseils de lavage | non, fiche seulement |

Les filtres suivants viennent **du produit lui-même**, pas d'un attribut :

| Filtre | Source |
|---|---|
| **Prix** | tranche, dans la devise de la boutique |
| **Disponibilité** | en stock, dernières pièces, rupture |
| **Mode de vente** | à la pièce, à la mesure |
| **Nouveautés** | date d'ajout |

## Comportement des filtres
- **Filtres à facettes** : chaque valeur affiche le nombre de produits correspondants, et les valeurs sans résultat sont grisées.
- **Combinables** : plusieurs filtres à la fois. Au sein d'un même attribut à choix multiple, les valeurs s'additionnent (rouge **ou** bleu). Entre attributs, elles se croisent (rouge **et** géométrique).
- **Couleur** : pastilles visuelles, pas de liste de texte.
- **Filtres actifs visibles**, retirables un par un, avec « tout effacer ».
- **Filtres dans l'adresse** : un lien de recherche se partage sur WhatsApp et garde ses filtres.
- **Mobile d'abord** : un bouton « Filtrer » ouvre un panneau plein écran avec le nombre de résultats mis à jour en direct, et un bouton « Voir N pagnes ».
- **Ordre des filtres** : les plus utiles en premier (couleur, type de tissu, prix, disponibilité).

## Tri
Nouveautés, prix croissant, prix décroissant, dernières pièces, popularité.

## Recherche
Par nom et par **référence du motif**. La référence sert beaucoup quand une cliente en connaît déjà une.

## Back-office
- Gérer les attributs et leurs valeurs (ajouter, renommer, réordonner, masquer)
- Indiquer, par attribut, s'il est filtrable ou affiché sur la fiche
- Renseigner les attributs à la création d'un produit, avec valeurs à choix (pas de saisie libre qui crée des doublons)
- Voir combien de produits utilisent chaque valeur avant de la supprimer

## Questions pour la gérante
- [ ] Comment ses clientes cherchent-elles un pagne : par couleur, par motif, par marque, par occasion ?
- [ ] Quel vocabulaire emploient-elles pour les types de tissu ?
- [ ] Quelles marques ou fabricants vend-elle ?
- [ ] Les occasions ont-elles un vrai rôle dans l'achat ?
- [ ] Un produit peut-il avoir plusieurs couleurs dominantes ?
- [ ] Y a-t-il des filtres que ses clientes demandent et qui manquent ici ?

## Impact sur les écrans
- `client` : catalogue avec panneau de filtres, filtres actifs, tri
- `client-admin` : gestion des attributs et de leurs valeurs, saisie des attributs sur le produit
- Mocks : attributs et valeurs dans les données de démonstration, avec compteurs de facettes
