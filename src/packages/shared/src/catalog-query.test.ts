import { describe, expect, it } from 'vitest'
import { DEFAULT_LIMIT, MAX_LIMIT, parseCatalogQuery } from './catalog-query'

describe('parseCatalogQuery', () => {
  it('[MOC-5] applique les valeurs par défaut quand aucun paramètre n’est fourni', () => {
    const result = parseCatalogQuery({})

    expect(result).toEqual({
      ok: true,
      value: {
        range: [],
        color: [],
        style: [],
        finish: [],
        length: [],
        priceMin: undefined,
        priceMax: undefined,
        availableOnly: false,
        sort: 'new',
        cursor: null,
        limit: DEFAULT_LIMIT,
      },
    })
  })

  it('[MOC-7] découpe les listes séparées par des virgules et retire les vides', () => {
    const result = parseCatalogQuery({ color: ' Bleu, Rouge ,,' })

    expect(result.ok && result.value.color).toEqual(['Bleu', 'Rouge'])
  })

  it('[MOC-7] accepte un paramètre répété (tableau)', () => {
    const result = parseCatalogQuery({ style: ['Floral', 'Géométrique'] })

    expect(result.ok && result.value.style).toEqual(['Floral', 'Géométrique'])
  })

  it('[MOC-9] lit les longueurs de pièce comme des nombres', () => {
    const result = parseCatalogQuery({ length: '6,12' })

    expect(result.ok && result.value.length).toEqual([6, 12])
  })

  it('[MOC-9] refuse une longueur qui n’est pas un nombre', () => {
    const result = parseCatalogQuery({ length: '6,abc' })

    expect(result.ok).toBe(false)
    expect(!result.ok && result.issues.map((issue) => issue.field)).toContain('length')
  })

  it('[MOC-10] lit les bornes de prix comme des entiers', () => {
    const result = parseCatalogQuery({ priceMin: '10000', priceMax: '30000' })

    expect(result.ok && [result.value.priceMin, result.value.priceMax]).toEqual([10000, 30000])
  })

  it('[MOC-10] refuse une borne minimale supérieure à la borne maximale', () => {
    const result = parseCatalogQuery({ priceMin: '30000', priceMax: '10000' })

    expect(result.ok).toBe(false)
    expect(!result.ok && result.issues.map((issue) => issue.field)).toContain('priceMin')
  })

  it('[MOC-10] refuse un prix décimal ou négatif', () => {
    expect(parseCatalogQuery({ priceMin: '1.5' }).ok).toBe(false)
    expect(parseCatalogQuery({ priceMax: '-5' }).ok).toBe(false)
  })

  it('[MOC-11] lit availableOnly', () => {
    expect(parseCatalogQuery({ availableOnly: 'true' })).toMatchObject({ ok: true, value: { availableOnly: true } })
    expect(parseCatalogQuery({ availableOnly: '1' })).toMatchObject({ ok: true, value: { availableOnly: true } })
    expect(parseCatalogQuery({ availableOnly: 'false' })).toMatchObject({ ok: true, value: { availableOnly: false } })
  })

  it('[MOC-12] accepte les trois tris et refuse les autres', () => {
    for (const sort of ['new', 'price-asc', 'price-desc']) {
      expect(parseCatalogQuery({ sort })).toMatchObject({ ok: true, value: { sort } })
    }
    expect(parseCatalogQuery({ sort: 'popularity' }).ok).toBe(false)
  })

  it('[MOC-16] refuse une limite supérieure au maximum et le dit', () => {
    const result = parseCatalogQuery({ limit: String(MAX_LIMIT + 1) })

    expect(result.ok).toBe(false)
    const issue = !result.ok ? result.issues.find((item) => item.field === 'limit') : undefined
    expect(issue?.message).toContain(String(MAX_LIMIT))
  })

  it('[MOC-16] refuse une limite nulle ou négative', () => {
    expect(parseCatalogQuery({ limit: '0' }).ok).toBe(false)
    expect(parseCatalogQuery({ limit: '-3' }).ok).toBe(false)
  })

  it('[MOC-15] conserve le curseur fourni', () => {
    expect(parseCatalogQuery({ cursor: 'c24' })).toMatchObject({ ok: true, value: { cursor: 'c24' } })
  })

  it('[MOC-15] refuse un curseur mal formé', () => {
    const result = parseCatalogQuery({ cursor: 'abc' })

    expect(!result.ok && result.issues.map((issue) => issue.field)).toContain('cursor')
  })

  it('[MOC-R8] signale tous les champs fautifs d’un coup', () => {
    const result = parseCatalogQuery({ sort: 'x', limit: '999', length: 'z' })

    expect(!result.ok && result.issues.map((issue) => issue.field).sort()).toEqual(['length', 'limit', 'sort'])
  })
})
