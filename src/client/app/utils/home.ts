/** Préparation du contenu de la page d'accueil à partir d'une page du catalogue (voir spec 005). */
import type { CatalogItem, CatalogPage, HomeContent, RangeTile } from '@shop-pagne/types'

/** Nombre de cartes de la section « À découvrir ». */
const DISCOVER_COUNT = 8

/** Indique si une carte porte l'étiquette « nouveauté ». */
const isNew = (item: CatalogItem): boolean => item.badges.includes('new')

/**
 * Ordonne les cartes à découvrir : nouveautés d'abord, puis les autres cartes disponibles, puis le reste.
 * L'ordre du catalogue est conservé à l'intérieur de chaque groupe. Voir spec 005, HOM-R2.
 */
function discoverOrder(items: readonly CatalogItem[]): readonly CatalogItem[] {
  const others = items.filter((item) => !isNew(item))

  return [
    ...items.filter(isNew),
    ...others.filter((item) => item.available),
    ...others.filter((item) => !item.available),
  ]
}

/**
 * Choisit les deux images du bandeau : celle de la première carte à découvrir, puis celle de la première
 * carte d'une autre gamme, à défaut d'une autre carte. Voir spec 005, HOM-R3.
 */
function heroImages(discover: readonly CatalogItem[]): HomeContent['heroImages'] {
  const first = discover[0]
  if (first === undefined) return [null, null]

  const second = discover.find((item) => item.range !== first.range) ?? discover[1]
  return [first.image, second?.image ?? null]
}

/**
 * Construit une tuile par gamme présente dans la page, avec l'image de son premier coloris,
 * par ordre alphabétique. Voir spec 005, HOM-R4.
 */
function rangeTiles(page: CatalogPage): readonly RangeTile[] {
  const facet = page.facets.find((f) => f.key === 'range')
  if (facet === undefined) return []

  return facet.values
    .flatMap((value): RangeTile[] => {
      const first = page.items.find((item) => item.range === value.value)
      return first === undefined ? [] : [{ range: value.value, image: first.image, count: value.count }]
    })
    .sort((a, b) => a.range.localeCompare(b.range, 'fr'))
}

/**
 * Déduit de la page du catalogue tout ce que l'accueil affiche : cartes à découvrir, images du bandeau,
 * tuiles de gammes. Ne modifie pas la page reçue. Voir spec 005, HOM-R1 à HOM-R4.
 *
 * @param page - Page du catalogue, triée par nouveautés (jusqu'à 48 cartes).
 * @returns Le contenu de l'accueil.
 */
export function buildHomeContent(page: CatalogPage): HomeContent {
  const discover = discoverOrder(page.items).slice(0, DISCOVER_COUNT)

  return {
    discover,
    heroImages: heroImages(discover),
    rangeTiles: rangeTiles(page),
    isEmpty: page.items.length === 0,
  }
}
