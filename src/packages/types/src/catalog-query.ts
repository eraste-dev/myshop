/** Types de la requête de liste du catalogue (voir spec 003). */

/** Ordre de tri du catalogue : nouveautés d'abord, prix croissant ou prix décroissant. */
export type CatalogSort = 'new' | 'price-asc' | 'price-desc'

/** Requête de liste du catalogue, après validation et application des valeurs par défaut. */
export interface CatalogQuery {
  /** Gammes retenues (OU entre les valeurs). Vide : pas de filtre. */
  readonly range: readonly string[]
  /** Couleurs retenues (OU entre les valeurs). Vide : pas de filtre. */
  readonly color: readonly string[]
  /** Styles de dessin retenus (OU entre les valeurs). Vide : pas de filtre. */
  readonly style: readonly string[]
  /** Finitions retenues (OU entre les valeurs). Vide : pas de filtre. */
  readonly finish: readonly string[]
  /** Longueurs de pièce retenues, en yards (OU entre les valeurs). Vide : pas de filtre. */
  readonly length: readonly number[]
  /** Prix minimal inclus, ou `undefined` sans borne. */
  readonly priceMin: number | undefined
  /** Prix maximal inclus, ou `undefined` sans borne. */
  readonly priceMax: number | undefined
  /** `true` pour ne garder que les coloris disponibles. */
  readonly availableOnly: boolean
  /** Ordre de tri. */
  readonly sort: CatalogSort
  /** Curseur de la page demandée, ou `null` pour la première page. */
  readonly cursor: string | null
  /** Nombre de cartes par page (1 à 48). */
  readonly limit: number
}

/** Un paramètre de requête refusé, avec le motif du refus. */
export interface QueryIssue {
  /** Nom du paramètre fautif (ex. `limit`). */
  readonly field: string
  /** Explication en français, affichable telle quelle. */
  readonly message: string
}

/** Résultat de la validation d'une requête : la requête normalisée, ou la liste de tous les champs fautifs. */
export type CatalogQueryResult =
  | { readonly ok: true; readonly value: CatalogQuery }
  | { readonly ok: false; readonly issues: readonly QueryIssue[] }

/**
 * Filtres du catalogue tels que les manipule l'interface : tous facultatifs,
 * avant leur traduction en paramètres de requête.
 */
export interface CatalogFilters {
  /** Gammes retenues. */
  readonly range?: readonly string[]
  /** Couleurs retenues. */
  readonly color?: readonly string[]
  /** Styles de dessin retenus. */
  readonly style?: readonly string[]
  /** Finitions retenues. */
  readonly finish?: readonly string[]
  /** Longueurs de pièce retenues, en yards. */
  readonly length?: readonly number[]
  /** Prix minimal inclus. */
  readonly priceMin?: number
  /** Prix maximal inclus. */
  readonly priceMax?: number
  /** Ne garder que les coloris disponibles. */
  readonly availableOnly?: boolean
  /** Ordre de tri. */
  readonly sort?: CatalogSort
  /** Curseur de la page demandée. */
  readonly cursor?: string
  /** Nombre de cartes par page. */
  readonly limit?: number
}
