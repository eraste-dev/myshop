/**
 * Types du catalogue : produits, coloris, modes de vente et listes filtrées.
 * Voir docs/produit/mvp.md (« Modes de vente ») et docs/produit/filtres.md.
 */

/** Montant en francs CFA (XOF), toujours un entier : le XOF n'a pas de centimes. */
export type Xof = number

/** Façon de vendre un coloris : `piece` (longueurs prédéfinies) ou `measure` (longueur choisie par la cliente). */
export type SaleMode = 'piece' | 'measure'

/** Unité dans laquelle une longueur est exprimée. */
export type LengthUnit = 'yard' | 'meter'

/** Longueur de pièce prédéfinie (2, 4, 6 ou 12 yards), vendue à prix fixe. */
export interface PieceOption {
  /** Identifiant unique de la pièce, de la forme `<coloris>-<longueur>`. */
  readonly id: string
  /** Longueur de la pièce, en yards. */
  readonly lengthYards: number
  /** Prix de la pièce entière. */
  readonly price: Xof
  /** Nombre de pièces en stock ; 0 signifie rupture. */
  readonly stock: number
}

/** Paramètres de la vente à la mesure, configurables par produit (voir spec 001). */
export interface MeasureConfig {
  /** Unité de la mesure : le prix, les limites et le stock sont exprimés dans cette unité. */
  readonly unit: LengthUnit
  /** Prix d'une unité de longueur. */
  readonly unitPrice: Xof
  /** Longueur minimale commandable (incluse). */
  readonly min: number
  /** Longueur maximale commandable (incluse). */
  readonly max: number
  /** Pas de découpe, compté à partir du minimum (ex. 0,5). */
  readonly step: number
  /** Longueur disponible en stock. */
  readonly stock: number
}

/** Étiquette commerciale affichée sur une carte produit. */
export type Badge = 'new' | 'classic' | 'last-pieces' | 'online-exclusive'

/** Un coloris d'un dessin : ses photos, son stock et son mode de vente. */
export interface Colorway {
  /** Identifiant unique du coloris, de la forme `<dessin>-<code>`. */
  readonly id: string
  /** Code court du coloris, ajouté à la référence du dessin (ex. `007`). */
  readonly code: string
  /** Nom de la couleur dominante, tel qu'affiché et filtré (ex. `Bleu`). */
  readonly colorName: string
  /** Adresse de l'image servant de pastille dans le sélecteur de coloris. */
  readonly swatchImage: string
  /** Adresses des photos, la première étant la photo principale. Au moins une. */
  readonly images: readonly string[]
  /** Mode de vente de ce coloris. */
  readonly saleMode: SaleMode
  /** Longueurs de pièce proposées ; vide en vente à la mesure. */
  readonly pieces: readonly PieceOption[]
  /** Paramètres de mesure ; `null` en vente à la pièce. */
  readonly measure: MeasureConfig | null
  /** Étiquettes commerciales du coloris. */
  readonly badges: readonly Badge[]
}

/** Un dessin (motif) : regroupe plusieurs coloris et porte la référence. */
export interface Design {
  /** Identifiant unique du dessin, utilisé dans les adresses. */
  readonly id: string
  /** Référence du dessin (ex. `PGN2101`). La référence d'un coloris lui ajoute son code. */
  readonly reference: string
  /** Nom du dessin. */
  readonly name: string
  /** Gamme ou type de tissu (ex. `Super Wax`). */
  readonly range: string
  /** Matière (ex. `Coton 100 %`). */
  readonly fabric: string
  /** Texte de présentation affiché sur la fiche produit. */
  readonly description: string
  /** Conseils d'entretien affichés sur la fiche produit. */
  readonly careAdvice: string
  /** Valeurs des attributs de filtre, par nom d'attribut (ex. `style`, `finish`). */
  readonly attributes: Readonly<Record<string, readonly string[]>>
  /** Coloris du dessin. */
  readonly colorways: readonly Colorway[]
}

/**
 * Façon d'afficher le prix d'une carte :
 * `fixed` prix unique, `from` « à partir de » (plusieurs longueurs de prix différents),
 * `per-unit` prix de l'unité de longueur (vente à la mesure).
 */
export type PriceMode = 'fixed' | 'from' | 'per-unit'

/** Carte produit du catalogue : un coloris d'un dessin. */
export interface CatalogItem {
  /** Identifiant du dessin auquel appartient le coloris. */
  readonly designId: string
  /** Identifiant du coloris. */
  readonly colorwayId: string
  /** Référence complète, de la forme `<référence du dessin>.<code du coloris>`. */
  readonly reference: string
  /** Gamme du dessin. */
  readonly range: string
  /** Nom de la couleur du coloris. */
  readonly colorName: string
  /** Adresse de la photo principale. */
  readonly image: string
  /** Prix à afficher : prix de la pièce, prix de la plus petite pièce, ou prix de l'unité selon `priceMode`. */
  readonly price: Xof
  /** Façon d'afficher le prix. */
  readonly priceMode: PriceMode
  /** Unité du prix quand `priceMode` vaut `per-unit`, sinon `null`. */
  readonly unit: LengthUnit | null
  /** `true` si le coloris peut être commandé (stock suffisant). */
  readonly available: boolean
  /** Étiquettes commerciales du coloris. */
  readonly badges: readonly Badge[]
}

/** Une valeur d'un filtre, avec le nombre de cartes qu'elle donnerait. */
export interface FacetValue {
  /** Valeur du filtre, telle qu'envoyée dans la requête. */
  readonly value: string
  /** Nombre de cartes correspondantes, les autres filtres étant appliqués. Peut valoir 0. */
  readonly count: number
}

/** Un filtre du catalogue (ex. la couleur), avec toutes ses valeurs. */
export interface Facet {
  /** Clé du filtre, identique au paramètre de requête (ex. `color`). */
  readonly key: string
  /** Libellé affiché à la cliente. */
  readonly label: string
  /** Présentation : choix unique, choix multiple, ou pastilles de couleur. */
  readonly kind: 'single' | 'multiple' | 'color'
  /** Valeurs possibles, y compris celles dont le nombre est 0. */
  readonly values: readonly FacetValue[]
}

/** Une page de résultats du catalogue. */
export interface CatalogPage {
  /** Cartes de la page, dans l'ordre de tri demandé. */
  readonly items: readonly CatalogItem[]
  /** Filtres disponibles, avec leurs compteurs. */
  readonly facets: readonly Facet[]
  /** Nombre total de cartes correspondant aux filtres, toutes pages confondues. */
  readonly total: number
  /** Curseur de la page suivante, ou `null` sur la dernière page. */
  readonly nextCursor: string | null
}
