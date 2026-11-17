import { describe, expect, it } from 'vitest'
import type { CatalogQuery, Colorway, Design } from '@shop-pagne/types'
import { parseCatalogQuery } from '@shop-pagne/shared'
import { getDesign, listCatalog } from './catalog'

function colorway(overrides: Partial<Colorway> & Pick<Colorway, 'id' | 'code' | 'colorName'>): Colorway {
  return {
    swatchImage: 'swatch',
    images: ['image'],
    saleMode: 'piece',
    pieces: [{ id: `${overrides.id}-6`, lengthYards: 6, price: 30000, stock: 5 }],
    measure: null,
    badges: [],
    ...overrides,
  }
}

function design(overrides: Partial<Design> & Pick<Design, 'id' | 'reference' | 'colorways'>): Design {
  return {
    name: overrides.id,
    range: 'Super Wax',
    fabric: 'Coton 100 %',
    description: '',
    careAdvice: '',
    attributes: { style: ['Floral'], finish: ['Aucune'] },
    ...overrides,
  }
}

const DESIGNS: readonly Design[] = [
  design({
    id: 'd1',
    reference: 'A100',
    range: 'Super Wax',
    attributes: { style: ['Floral'], finish: ['Dorée'] },
    colorways: [
      colorway({ id: 'd1-bleu', code: '001', colorName: 'Bleu', badges: ['new'] }),
      colorway({ id: 'd1-rouge', code: '002', colorName: 'Rouge' }),
    ],
  }),
  design({
    id: 'd2',
    reference: 'B200',
    range: 'Java',
    attributes: { style: ['Géométrique'], finish: ['Aucune'] },
    colorways: [
      colorway({
        id: 'd2-bleu',
        code: '001',
        colorName: 'Bleu',
        pieces: [
          { id: 'd2-bleu-2', lengthYards: 2, price: 10000, stock: 4 },
          { id: 'd2-bleu-6', lengthYards: 6, price: 25000, stock: 0 },
        ],
      }),
      colorway({
        id: 'd2-vert',
        code: '002',
        colorName: 'Vert',
        saleMode: 'measure',
        pieces: [],
        measure: { unit: 'yard', unitPrice: 5000, min: 1, max: 6, step: 0.5, stock: 20 },
      }),
    ],
  }),
  design({
    id: 'd3',
    reference: 'C300',
    range: 'Super Wax',
    attributes: { style: ['Floral', 'Nature'], finish: ['Aucune'] },
    colorways: [
      colorway({
        id: 'd3-bleu',
        code: '001',
        colorName: 'Bleu',
        pieces: [{ id: 'd3-bleu-6', lengthYards: 6, price: 40000, stock: 0 }],
      }),
      colorway({
        id: 'd3-rouge',
        code: '002',
        colorName: 'Rouge',
        saleMode: 'measure',
        pieces: [],
        measure: { unit: 'yard', unitPrice: 4000, min: 4, max: 6, step: 0.5, stock: 3 },
      }),
    ],
  }),
]

function query(raw: Record<string, string | string[]> = {}): CatalogQuery {
  const result = parseCatalogQuery(raw)
  if (!result.ok) throw new Error(JSON.stringify(result.issues))
  return result.value
}

const refs = (raw: Record<string, string | string[]>, designs = DESIGNS): string[] =>
  listCatalog(query(raw), designs).items.map((item) => item.reference)

describe('listCatalog : cartes', () => {
  it('[MOC-R1] produit une carte par coloris, avec la référence dessin.coloris', () => {
    expect(refs({ limit: '48' }).sort()).toEqual([
      'A100.001',
      'A100.002',
      'B200.001',
      'B200.002',
      'C300.001',
      'C300.002',
    ])
  })

  it('[MOC-R2] affiche « à partir de » quand plusieurs longueurs ont des prix différents', () => {
    const item = listCatalog(query(), DESIGNS).items.find((i) => i.reference === 'B200.001')

    expect(item).toMatchObject({ price: 10000, priceMode: 'from', unit: null })
  })

  it('[MOC-R2] affiche un prix fixe pour une seule longueur', () => {
    const item = listCatalog(query(), DESIGNS).items.find((i) => i.reference === 'A100.001')

    expect(item).toMatchObject({ price: 30000, priceMode: 'fixed', unit: null })
  })

  it('[MOC-R2] affiche le prix de l’unité pour la vente à la mesure', () => {
    const item = listCatalog(query(), DESIGNS).items.find((i) => i.reference === 'B200.002')

    expect(item).toMatchObject({ price: 5000, priceMode: 'per-unit', unit: 'yard' })
  })

  it('[MOC-R3] marque indisponible un coloris sans pièce en stock', () => {
    const item = listCatalog(query(), DESIGNS).items.find((i) => i.reference === 'C300.001')

    expect(item?.available).toBe(false)
  })

  it('[MOC-R3] marque indisponible un coloris à la mesure dont le stock est sous le minimum', () => {
    const item = listCatalog(query(), DESIGNS).items.find((i) => i.reference === 'C300.002')

    expect(item?.available).toBe(false)
  })

  it('[MOC-R3] marque disponible un coloris avec au moins une pièce en stock', () => {
    const item = listCatalog(query(), DESIGNS).items.find((i) => i.reference === 'B200.001')

    expect(item?.available).toBe(true)
  })
})

describe('listCatalog : filtres', () => {
  it('[MOC-5] sans filtre, renvoie tout avec le total', () => {
    const page = listCatalog(query(), DESIGNS)

    expect(page.total).toBe(6)
    expect(page.items).toHaveLength(6)
    expect(page.nextCursor).toBeNull()
  })

  it('[MOC-6] filtre par couleur', () => {
    expect(refs({ color: 'Bleu' }).sort()).toEqual(['A100.001', 'B200.001', 'C300.001'])
  })

  it('[MOC-7] additionne les valeurs d’un même attribut (OU)', () => {
    expect(refs({ color: 'Vert,Rouge' }).sort()).toEqual(['A100.002', 'B200.002', 'C300.002'])
  })

  it('[MOC-8] croise les attributs différents (ET)', () => {
    expect(refs({ color: 'Bleu', style: 'Floral' }).sort()).toEqual(['A100.001', 'C300.001'])
  })

  it('[MOC-8] filtre par gamme et par finition', () => {
    expect(refs({ range: 'Java' }).sort()).toEqual(['B200.001', 'B200.002'])
    expect(refs({ finish: 'Dorée' }).sort()).toEqual(['A100.001', 'A100.002'])
  })

  it('[MOC-9] filtre par longueur de pièce, sans compter les coloris à la mesure', () => {
    expect(refs({ length: '2' })).toEqual(['B200.001'])
    expect(refs({ length: '6' }).sort()).toEqual(['A100.001', 'A100.002', 'B200.001', 'C300.001'])
  })

  it('[MOC-10] filtre par prix, bornes incluses, le coloris à la mesure étant comparé au prix de l’unité', () => {
    expect(refs({ priceMin: '30000', priceMax: '30000' }).sort()).toEqual(['A100.001', 'A100.002'])
    expect(refs({ priceMax: '5000' }).sort()).toEqual(['B200.002', 'C300.002'])
  })

  it('[MOC-11] ne garde que les coloris disponibles', () => {
    expect(refs({ availableOnly: 'true' }).sort()).toEqual(['A100.001', 'A100.002', 'B200.001', 'B200.002'])
  })
})

describe('listCatalog : tri', () => {
  it('[MOC-12] par défaut, les nouveautés viennent d’abord puis l’ordre des références', () => {
    expect(refs({})).toEqual(['A100.001', 'A100.002', 'B200.001', 'B200.002', 'C300.001', 'C300.002'])
  })

  it('[MOC-12] trie par prix croissant puis par référence', () => {
    expect(refs({ sort: 'price-asc' })).toEqual([
      'C300.002',
      'B200.002',
      'B200.001',
      'A100.001',
      'A100.002',
      'C300.001',
    ])
  })

  it('[MOC-12] trie par prix décroissant puis par référence', () => {
    expect(refs({ sort: 'price-desc' })).toEqual([
      'C300.001',
      'A100.001',
      'A100.002',
      'B200.001',
      'B200.002',
      'C300.002',
    ])
  })
})

describe('listCatalog : facettes', () => {
  const facet = (raw: Record<string, string>, key: string) =>
    listCatalog(query(raw), DESIGNS).facets.find((f) => f.key === key)

  it('[MOC-13] le nombre d’une facette ignore son propre filtre', () => {
    const color = facet({ color: 'Bleu' }, 'color')

    expect(color?.values).toEqual([
      { value: 'Bleu', count: 3 },
      { value: 'Rouge', count: 2 },
      { value: 'Vert', count: 1 },
    ])
  })

  it('[MOC-13] le nombre d’une facette tient compte des filtres des autres attributs', () => {
    const color = facet({ style: 'Floral' }, 'color')

    expect(color?.values).toEqual([
      { value: 'Bleu', count: 2 },
      { value: 'Rouge', count: 2 },
      { value: 'Vert', count: 0 },
    ])
  })

  it('[MOC-14] liste une valeur sans résultat avec le nombre 0', () => {
    const style = facet({ color: 'Vert' }, 'style')

    expect(style?.values.find((v) => v.value === 'Floral')).toEqual({ value: 'Floral', count: 0 })
    expect(style?.values.find((v) => v.value === 'Géométrique')).toEqual({ value: 'Géométrique', count: 1 })
  })

  it('[MOC-13] expose les longueurs de pièce en facette', () => {
    const length = facet({}, 'length')

    expect(length?.values).toEqual([
      { value: '2', count: 1 },
      { value: '6', count: 4 },
    ])
  })
})

describe('listCatalog : pagination', () => {
  it('[MOC-15] parcourt tout sans doublon ni oubli', () => {
    const seen: string[] = []
    let cursor: string | null = null
    let guard = 0

    do {
      const params: Record<string, string> = { limit: '2' }
      if (cursor) params.cursor = cursor
      const page = listCatalog(query(params), DESIGNS)
      seen.push(...page.items.map((i) => i.reference))
      cursor = page.nextCursor
      guard += 1
    } while (cursor && guard < 10)

    expect(seen).toHaveLength(6)
    expect(new Set(seen).size).toBe(6)
  })

  it('[MOC-15] ne renvoie pas de curseur sur la dernière page', () => {
    expect(listCatalog(query({ limit: '6' }), DESIGNS).nextCursor).toBeNull()
  })

  it('[MOC-15] renvoie une page vide au-delà de la fin', () => {
    const page = listCatalog(query({ cursor: 'c99' }), DESIGNS)

    expect(page.items).toEqual([])
    expect(page.nextCursor).toBeNull()
  })
})

describe('getDesign', () => {
  it('[MOC-17] renvoie le dessin avec tous ses coloris', () => {
    expect(getDesign('d2', DESIGNS)?.colorways).toHaveLength(2)
  })

  it('[MOC-18] renvoie undefined pour un identifiant inconnu', () => {
    expect(getDesign('inconnu', DESIGNS)).toBeUndefined()
  })
})

describe('pureté', () => {
  function deepFreeze<T>(value: T): T {
    if (value && typeof value === 'object') {
      Object.values(value).forEach(deepFreeze)
      Object.freeze(value)
    }
    return value
  }

  it('[MOC-21] ne modifie jamais les données reçues', () => {
    const frozen = deepFreeze(structuredClone(DESIGNS)) as readonly Design[]

    expect(() => listCatalog(query({ color: 'Bleu', sort: 'price-asc' }), frozen)).not.toThrow()
    expect(() => getDesign('d1', frozen)).not.toThrow()
    expect(frozen).toEqual(DESIGNS)
  })
})
