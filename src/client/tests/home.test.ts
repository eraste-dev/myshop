import { describe, expect, it } from 'vitest'
import type { CatalogItem, CatalogPage, Facet } from '@shop-pagne/types'
import { buildHomeContent } from '../app/utils/home'

/** Fabrique une carte de catalogue, en ne précisant que ce qui compte pour le test. */
function item(reference: string, overrides: Partial<CatalogItem> = {}): CatalogItem {
  return {
    designId: reference.toLowerCase(),
    colorwayId: `${reference.toLowerCase()}-001`,
    reference,
    range: 'Java',
    colorName: 'Bleu',
    image: `/img/${reference}.svg`,
    price: 10000,
    priceMode: 'fixed',
    unit: null,
    available: true,
    badges: [],
    ...overrides,
  }
}

/** Filtre « gamme » tel que l'API le renvoie. */
const rangeFacet = (values: ReadonlyArray<[string, number]>): Facet => ({
  key: 'range',
  label: 'Gamme',
  kind: 'multiple',
  values: values.map(([value, count]) => ({ value, count })),
})

const page = (items: readonly CatalogItem[], facets: readonly Facet[] = []): CatalogPage => ({
  items,
  facets,
  total: items.length,
  nextCursor: null,
})

describe('buildHomeContent : À découvrir', () => {
  it('[HOM-1] met les nouveautés d’abord, puis les disponibles, puis le reste', () => {
    const content = buildHomeContent(
      page([
        item('S1', { available: false }),
        item('S2'),
        item('N1', { badges: ['new'] }),
        item('S3', { available: false }),
        item('N2', { badges: ['new'] }),
        item('S4'),
      ]),
    )

    expect(content.discover.map((i) => i.reference)).toEqual(['N1', 'N2', 'S2', 'S4', 'S1', 'S3'])
  })

  it('[HOM-1] garde huit cartes au plus', () => {
    const many = Array.from({ length: 20 }, (_, i) => item(`R${String(i).padStart(2, '0')}`))

    expect(buildHomeContent(page(many)).discover).toHaveLength(8)
  })

  it('[HOM-1] respecte l’ordre du catalogue à l’intérieur de chaque groupe', () => {
    const content = buildHomeContent(
      page([item('B', { badges: ['new'] }), item('A', { badges: ['new'] }), item('D'), item('C')]),
    )

    expect(content.discover.map((i) => i.reference)).toEqual(['B', 'A', 'D', 'C'])
  })
})

describe('buildHomeContent : bandeau', () => {
  it('[HOM-2] prend l’image de la première carte à découvrir pour le panneau gauche', () => {
    const content = buildHomeContent(page([item('S1'), item('N1', { badges: ['new'] })]))

    expect(content.heroImages[0]).toBe('/img/N1.svg')
  })

  it('[HOM-2] choisit pour le panneau droit une carte d’une autre gamme', () => {
    const content = buildHomeContent(
      page([item('N1', { badges: ['new'], range: 'Java' }), item('J2', { range: 'Java' }), item('W1', { range: 'Super Wax' })]),
    )

    expect(content.heroImages).toEqual(['/img/N1.svg', '/img/W1.svg'])
  })

  it('[HOM-2] se rabat sur une autre carte quand il n’y a qu’une gamme', () => {
    const content = buildHomeContent(page([item('N1', { badges: ['new'] }), item('J2')]))

    expect(content.heroImages).toEqual(['/img/N1.svg', '/img/J2.svg'])
  })

  it('[HOM-3] laisse les images absentes quand le catalogue est vide ou n’a qu’une carte', () => {
    expect(buildHomeContent(page([])).heroImages).toEqual([null, null])
    expect(buildHomeContent(page([item('A')])).heroImages).toEqual(['/img/A.svg', null])
  })
})

describe('buildHomeContent : gammes', () => {
  const items = [
    item('J1', { range: 'Java' }),
    item('W1', { range: 'Super Wax' }),
    item('J2', { range: 'Java' }),
    item('F1', { range: 'Fancy' }),
  ]

  it('[HOM-4] fait une tuile par gamme, par ordre alphabétique, avec l’image du premier coloris', () => {
    const content = buildHomeContent(page(items, [rangeFacet([['Super Wax', 1], ['Java', 2], ['Fancy', 1]])]))

    expect(content.rangeTiles).toEqual([
      { range: 'Fancy', image: '/img/F1.svg', count: 1 },
      { range: 'Java', image: '/img/J1.svg', count: 2 },
      { range: 'Super Wax', image: '/img/W1.svg', count: 1 },
    ])
  })

  it('[HOM-R4] ignore une gamme sans aucun coloris dans la page', () => {
    const content = buildHomeContent(page(items, [rangeFacet([['Java', 2], ['Wax Hollandais', 5]])]))

    expect(content.rangeTiles.map((t) => t.range)).toEqual(['Java'])
  })

  it('[HOM-4] ne fait aucune tuile sans filtre de gamme', () => {
    expect(buildHomeContent(page(items)).rangeTiles).toEqual([])
  })
})

describe('buildHomeContent : général', () => {
  it('[HOM-11] signale un catalogue vide', () => {
    expect(buildHomeContent(page([])).isEmpty).toBe(true)
    expect(buildHomeContent(page([item('A')])).isEmpty).toBe(false)
  })

  it('[HOM-R1] ne modifie pas la page reçue', () => {
    const frozen = Object.freeze(page(Object.freeze([item('A', { badges: ['new'] }), item('B')]) as readonly CatalogItem[]))

    expect(() => buildHomeContent(frozen)).not.toThrow()
  })
})
