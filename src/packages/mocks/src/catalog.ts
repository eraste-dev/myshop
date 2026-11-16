import { isMeasureAvailable } from '@shop-pagne/shared'
import type { CatalogItem, CatalogPage, CatalogQuery, Colorway, Design, Facet, FacetValue } from '@shop-pagne/shared'

/**
 * Simulation du catalogue : filtres, tri, facettes et pagination, en fonctions pures.
 * Le futur backend implémentera le même contrat ; voir docs/specs/003-donnees-demo-et-api.
 */

type FacetKey = 'range' | 'color' | 'style' | 'finish' | 'length'

interface Entry {
  readonly item: CatalogItem
  readonly values: Readonly<Record<FacetKey, readonly string[]>>
  readonly pieceLengths: readonly number[]
}

interface FacetDefinition {
  readonly key: FacetKey
  readonly label: string
  readonly kind: Facet['kind']
}

const FACETS: readonly FacetDefinition[] = [
  { key: 'range', label: 'Gamme', kind: 'multiple' },
  { key: 'color', label: 'Couleur', kind: 'color' },
  { key: 'style', label: 'Style de dessin', kind: 'multiple' },
  { key: 'finish', label: 'Finition', kind: 'multiple' },
  { key: 'length', label: 'Longueur de pièce', kind: 'multiple' },
]

const CURSOR_PREFIX = 'c'

function isAvailable(colorway: Colorway): boolean {
  if (colorway.saleMode === 'measure') {
    return colorway.measure !== null && isMeasureAvailable(colorway.measure)
  }
  return colorway.pieces.some((piece) => piece.stock > 0)
}

function priceOf(colorway: Colorway): Pick<CatalogItem, 'price' | 'priceMode' | 'unit'> {
  if (colorway.saleMode === 'measure' && colorway.measure !== null) {
    return { price: colorway.measure.unitPrice, priceMode: 'per-unit', unit: colorway.measure.unit }
  }

  const prices = colorway.pieces.map((piece) => piece.price)
  const lowest = Math.min(...prices)
  const isUniform = prices.every((price) => price === lowest)

  return { price: lowest, priceMode: isUniform ? 'fixed' : 'from', unit: null }
}

function toEntry(design: Design, colorway: Colorway): Entry {
  const pieceLengths = colorway.pieces.map((piece) => piece.lengthYards)

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
      length: pieceLengths.map(String),
    },
    pieceLengths,
  }
}

function toEntries(designs: readonly Design[]): readonly Entry[] {
  return designs.flatMap((design) => design.colorways.map((colorway) => toEntry(design, colorway)))
}

function selectedValues(query: CatalogQuery, key: FacetKey): readonly string[] {
  return key === 'length' ? query.length.map(String) : query[key]
}

function matchesFacet(entry: Entry, query: CatalogQuery, key: FacetKey): boolean {
  const selected = selectedValues(query, key)
  return selected.length === 0 || selected.some((value) => entry.values[key].includes(value))
}

function matchesPrice(entry: Entry, query: CatalogQuery): boolean {
  const { price } = entry.item
  return (query.priceMin === undefined || price >= query.priceMin) && (query.priceMax === undefined || price <= query.priceMax)
}

function matches(entry: Entry, query: CatalogQuery, ignoredFacet?: FacetKey): boolean {
  return (
    FACETS.every(({ key }) => key === ignoredFacet || matchesFacet(entry, query, key)) &&
    matchesPrice(entry, query) &&
    (!query.availableOnly || entry.item.available)
  )
}

function compareText(a: string, b: string): number {
  return a.localeCompare(b, 'fr')
}

function compareValues(key: FacetKey, a: string, b: string): number {
  return key === 'length' ? Number(a) - Number(b) : compareText(a, b)
}

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

function isNew(item: CatalogItem): boolean {
  return item.badges.includes('new')
}

function compareEntries(sort: CatalogQuery['sort']) {
  return (a: Entry, b: Entry): number => {
    const byReference = compareText(a.item.reference, b.item.reference)
    if (sort === 'price-asc') return a.item.price - b.item.price || byReference
    if (sort === 'price-desc') return b.item.price - a.item.price || byReference
    return Number(isNew(b.item)) - Number(isNew(a.item)) || byReference
  }
}

function readOffset(cursor: string | null): number {
  return cursor === null ? 0 : Number(cursor.slice(CURSOR_PREFIX.length))
}

/** Liste filtrée, triée et paginée du catalogue, avec les facettes. Ne modifie pas les données reçues. */
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

/** Fiche d'un dessin avec tous ses coloris, ou `undefined` si l'identifiant est inconnu. */
export function getDesign(id: string, designs: readonly Design[]): Design | undefined {
  return designs.find((design) => design.id === id)
}
