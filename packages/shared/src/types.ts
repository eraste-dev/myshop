/** Montant en francs CFA, entier (le XOF n'a pas de centimes). */
export type Xof = number

export type SaleMode = 'piece' | 'measure'
export type LengthUnit = 'yard' | 'meter'

/** Valeurs de thème d'une boutique, appliquées en variables CSS. */
export interface ShopTheme {
  readonly accent: string
  readonly accentContrast: string
}

export interface Shop {
  readonly id: string
  readonly slug: string
  readonly name: string
  readonly tagline: string
  readonly currency: 'XOF'
  readonly whatsappNumber: string
  readonly theme: ShopTheme
}

/** Longueur de pièce prédéfinie (2, 4, 6, 12 yards), vendue à prix fixe. */
export interface PieceOption {
  readonly id: string
  readonly lengthYards: number
  readonly price: Xof
  readonly stock: number
}

/** Paramètres de la vente à la mesure, configurables par produit. */
export interface MeasureConfig {
  readonly unit: LengthUnit
  readonly unitPrice: Xof
  readonly min: number
  readonly max: number
  readonly step: number
  /** Longueur disponible, dans l'unité de la mesure. */
  readonly stock: number
}

export type Badge = 'new' | 'classic' | 'last-pieces' | 'online-exclusive'

/** Un coloris d'un dessin : ses photos, son stock, son mode de vente. */
export interface Colorway {
  readonly id: string
  readonly colorName: string
  readonly swatchImage: string
  readonly images: readonly string[]
  readonly saleMode: SaleMode
  readonly pieces: readonly PieceOption[]
  readonly measure: MeasureConfig | null
  readonly badges: readonly Badge[]
}

/** Un dessin (motif) : regroupe plusieurs coloris et porte la référence. */
export interface Design {
  readonly id: string
  readonly reference: string
  readonly name: string
  readonly range: string
  readonly fabric: string
  readonly description: string
  readonly careAdvice: string
  readonly attributes: Readonly<Record<string, readonly string[]>>
  readonly colorways: readonly Colorway[]
}

/** Carte produit du catalogue : un coloris mis en avant d'un dessin. */
export interface CatalogItem {
  readonly designId: string
  readonly colorwayId: string
  readonly reference: string
  readonly range: string
  readonly image: string
  readonly priceFrom: Xof
  readonly isPriceFrom: boolean
  readonly badges: readonly Badge[]
}

export interface FacetValue {
  readonly value: string
  readonly count: number
}

export interface Facet {
  readonly key: string
  readonly label: string
  readonly kind: 'single' | 'multiple' | 'color'
  readonly values: readonly FacetValue[]
}

export interface CatalogPage {
  readonly items: readonly CatalogItem[]
  readonly facets: readonly Facet[]
  readonly total: number
  readonly nextCursor: string | null
}
