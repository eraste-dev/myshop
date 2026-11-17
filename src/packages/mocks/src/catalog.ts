/**
 * Simulation du catalogue : filtres, tri, facettes et pagination, en fonctions pures.
 * Le futur backend implémentera le même contrat ; voir docs/specs/003-donnees-demo-et-api.
 */
import { isMeasureAvailable } from '@shop-pagne/shared'
import type { CatalogItem, CatalogPage, CatalogQuery, Colorway, Design, Facet, FacetValue } from '@shop-pagne/types'

/** Clé d'un filtre à facettes ; identique au paramètre de requête correspondant. */
type FacetKey = 'range' | 'color' | 'style' | 'finish' | 'length'

/** Un coloris prêt à être filtré : sa carte, et les valeurs qu'il prend pour chaque filtre. */
interface Entry {
  /** Carte du catalogue correspondante. */
  readonly item: CatalogItem
  /** Valeurs du coloris pour chaque filtre, sous forme de texte. */
  readonly values: Readonly<Record<FacetKey, readonly string[]>>
}

/** Définition d'un filtre : sa clé, son libellé et sa présentation. */
interface FacetDefinition {
  /** Clé du filtre. */
  readonly key: FacetKey
  /** Libellé affiché à la cliente. */
  readonly label: string
  /** Présentation du filtre. */
  readonly kind: Facet['kind']
}

/** Filtres proposés, dans l'ordre d'affichage. */
const FACETS: readonly FacetDefinition[] = [
  { key: 'range', label: 'Gamme', kind: 'multiple' },
  { key: 'color', label: 'Couleur', kind: 'color' },
  { key: 'style', label: 'Style de dessin', kind: 'multiple' },
  { key: 'finish', label: 'Finition', kind: 'multiple' },
  { key: 'length', label: 'Longueur de pièce', kind: 'multiple' },
]

/** Préfixe d'un curseur de pagination : `c` suivi de la position de départ. */
const CURSOR_PREFIX = 'c'

/** Indique si un coloris peut être commandé : une pièce en stock, ou une mesure dont le stock couvre le minimum. */
function isAvailable(colorway: Colorway): boolean {
  if (colorway.saleMode === 'measure') {
    return colorway.measure !== null && isMeasureAvailable(colorway.measure)
  }
  return colorway.pieces.some((piece) => piece.stock > 0)
}

/** Calcule le prix affiché d'un coloris et la façon de l'afficher (voir spec 003, MOC-R2). */
function priceOf(colorway: Colorway): Pick<CatalogItem, 'price' | 'priceMode' | 'unit'> {
  if (colorway.saleMode === 'measure' && colorway.measure !== null) {
    return { price: colorway.measure.unitPrice, priceMode: 'per-unit', unit: colorway.measure.unit }
  }

  const prices = colorway.pieces.map((piece) => piece.price)
  const lowest = Math.min(...prices)
  const isUniform = prices.every((price) => price === lowest)

  return { price: lowest, priceMode: isUniform ? 'fixed' : 'from', unit: null }
}

/** Transforme un coloris en entrée filtrable. */
function toEntry(design: Design, colorway: Colorway): Entry {
  return {
    item: {
      designId: design.id,
      colorwayId: colorway.id,
      reference: `${design.reference}.${colorway.code}`,
      range: design.range,
      colorName: colorway.colorName,
      image: colorway.images[0] ?? colorway.swatchImage,
      ...priceOf(colorway),
      available: isAvailable(colorway),
      badges: colorway.badges,
    },
    values: {
      range: [design.range],
      color: [colorway.colorName],
      style: design.attributes.style ?? [],
      finish: design.attributes.finish ?? [],
      length: colorway.pieces.map((piece) => String(piece.lengthYards)),
    },
  }
}

/** Aplatit tous les coloris de tous les dessins en entrées filtrables. */
function toEntries(designs: readonly Design[]): readonly Entry[] {
  return designs.flatMap((design) => design.colorways.map((colorway) => toEntry(design, colorway)))
}

/** Valeurs retenues par la requête pour un filtre, sous forme de texte. */
function selectedValues(query: CatalogQuery, key: FacetKey): readonly string[] {
  return key === 'length' ? query.length.map(String) : query[key]
}

/** Vérifie une entrée contre un filtre : sans valeur retenue tout passe, sinon une seule suffit (OU). */
function matchesFacet(entry: Entry, query: CatalogQuery, key: FacetKey): boolean {
  const selected = selectedValues(query, key)
  return selected.length === 0 || selected.some((value) => entry.values[key].includes(value))
}

/** Vérifie le prix d'une entrée contre les bornes de la requête, bornes incluses. */
function matchesPrice(entry: Entry, query: CatalogQuery): boolean {
  const { price } = entry.item
  return (query.priceMin === undefined || price >= query.priceMin) && (query.priceMax === undefined || price <= query.priceMax)
}

/**
 * Vérifie une entrée contre tous les filtres (ET entre filtres), le prix et la disponibilité.
 *
 * @param ignoredFacet - Filtre à ne pas appliquer, pour calculer les compteurs de ce filtre.
 */
function matches(entry: Entry, query: CatalogQuery, ignoredFacet?: FacetKey): boolean {
  return (
    FACETS.every(({ key }) => key === ignoredFacet || matchesFacet(entry, query, key)) &&
    matchesPrice(entry, query) &&
    (!query.availableOnly || entry.item.available)
  )
}

/** Compare deux textes selon l'ordre alphabétique français. */
function compareText(a: string, b: string): number {
  return a.localeCompare(b, 'fr')
}

/** Compare deux valeurs d'un filtre : numériquement pour les longueurs, alphabétiquement sinon. */
function compareValues(key: FacetKey, a: string, b: string): number {
  return key === 'length' ? Number(a) - Number(b) : compareText(a, b)
}

/**
 * Construit un filtre avec toutes ses valeurs possibles et leurs compteurs.
 * Le compteur d'une valeur tient compte de tous les autres filtres mais pas du filtre lui-même
 * (facettes disjonctives, voir spec 003, MOC-R5) ; une valeur sans résultat reste listée avec 0.
 */
function buildFacet(definition: FacetDefinition, entries: readonly Entry[], query: CatalogQuery): Facet {
  const { key } = definition
  const allValues = [...new Set(entries.flatMap((entry) => entry.values[key]))].sort((a, b) => compareValues(key, a, b))
  const candidates = entries.filter((entry) => matches(entry, query, key))

  const values: FacetValue[] = allValues.map((value) => ({
    value,
    count: candidates.filter((entry) => entry.values[key].includes(value)).length,
  }))

  return { key, label: definition.label, kind: definition.kind, values }
}

/** Indique si une carte porte l'étiquette « nouveauté ». */
function isNew(item: CatalogItem): boolean {
  return item.badges.includes('new')
}

/** Fabrique la fonction de comparaison du tri demandé ; à égalité, l'ordre des références décide. */
function compareEntries(sort: CatalogQuery['sort']) {
  return (a: Entry, b: Entry): number => {
    const byReference = compareText(a.item.reference, b.item.reference)
    if (sort === 'price-asc') return a.item.price - b.item.price || byReference
    if (sort === 'price-desc') return b.item.price - a.item.price || byReference
    return Number(isNew(b.item)) - Number(isNew(a.item)) || byReference
  }
}

/** Position de départ d'une page, lue dans son curseur (0 pour la première page). */
function readOffset(cursor: string | null): number {
  return cursor === null ? 0 : Number(cursor.slice(CURSOR_PREFIX.length))
}

/**
 * Liste une page filtrée, triée et paginée du catalogue, avec les filtres et leurs compteurs.
 * Ne modifie pas les données reçues. Voir spec 003, MOC-R1 à MOC-R7 et MOC-R9.
 *
 * @param query - Requête validée (voir `parseCatalogQuery`).
 * @param designs - Dessins à lister.
 * @returns La page demandée.
 */
export function listCatalog(query: CatalogQuery, designs: readonly Design[]): CatalogPage {
  const entries = toEntries(designs)
  const sorted = entries.filter((entry) => matches(entry, query)).sort(compareEntries(query.sort))

  const offset = readOffset(query.cursor)
  const end = offset + query.limit

  return {
    items: sorted.slice(offset, end).map((entry) => entry.item),
    facets: FACETS.map((definition) => buildFacet(definition, entries, query)),
    total: sorted.length,
    nextCursor: end < sorted.length ? `${CURSOR_PREFIX}${end}` : null,
  }
}

/**
 * Cherche la fiche d'un dessin.
 *
 * @param id - Identifiant du dessin.
 * @param designs - Dessins parmi lesquels chercher.
 * @returns Le dessin avec tous ses coloris, ou `undefined` si l'identifiant est inconnu.
 */
export function getDesign(id: string, designs: readonly Design[]): Design | undefined {
  return designs.find((design) => design.id === id)
}
