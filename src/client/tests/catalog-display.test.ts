import { describe, expect, it } from 'vitest'
import type { CatalogItem } from '@shop-pagne/types'
import {
  badgeLabel,
  designCountLabel,
  formatXof,
  itemImageAlt,
  itemPriceLabel,
  productHref,
  rangeHref,
  visibleBadges,
} from '../app/utils/catalog-display'

/** Espace insécable : les prix ne doivent jamais être coupés en fin de ligne. */
const NBSP = ' '

const baseItem: CatalogItem = {
  designId: 'soleil-levant',
  colorwayId: 'soleil-levant-001',
  reference: 'PGN2101.001',
  range: 'Super Wax',
  colorName: 'Bleu',
  image: '/api/patterns/soleil-levant-001.svg',
  price: 38000,
  priceMode: 'fixed',
  unit: null,
  available: true,
  badges: [],
}

describe('formatXof', () => {
  it('[HOM-5] sépare les milliers par des espaces insécables et ajoute l’unité', () => {
    expect(formatXof(38000)).toBe(`38${NBSP}000${NBSP}F${NBSP}CFA`)
    expect(formatXof(1234567)).toBe(`1${NBSP}234${NBSP}567${NBSP}F${NBSP}CFA`)
  })

  it('[HOM-5] n’ajoute pas de séparateur sous mille et gère zéro', () => {
    expect(formatXof(500)).toBe(`500${NBSP}F${NBSP}CFA`)
    expect(formatXof(0)).toBe(`0${NBSP}F${NBSP}CFA`)
  })

  it('[HOM-5] arrondit à l’entier, le franc CFA n’ayant pas de centimes', () => {
    expect(formatXof(1999.6)).toBe(`2${NBSP}000${NBSP}F${NBSP}CFA`)
  })

  it('[HOM-5] affiche un tiret plutôt qu’un montant faux pour une valeur invalide', () => {
    expect(formatXof(Number.NaN)).toBe('—')
    expect(formatXof(-5)).toBe('—')
    expect(formatXof(Number.POSITIVE_INFINITY)).toBe('—')
  })
})

describe('itemPriceLabel', () => {
  it('[HOM-5] affiche le prix seul pour un prix fixe', () => {
    expect(itemPriceLabel(baseItem)).toBe(`38${NBSP}000${NBSP}F${NBSP}CFA`)
  })

  it('[HOM-5] ajoute « à partir de » quand plusieurs longueurs ont des prix différents', () => {
    expect(itemPriceLabel({ ...baseItem, price: 10000, priceMode: 'from' })).toBe(
      `à partir de 10${NBSP}000${NBSP}F${NBSP}CFA`,
    )
  })

  it('[HOM-5] précise l’unité pour la vente à la mesure', () => {
    expect(itemPriceLabel({ ...baseItem, price: 5000, priceMode: 'per-unit', unit: 'yard' })).toBe(
      `5${NBSP}000${NBSP}F${NBSP}CFA / yard`,
    )
    expect(itemPriceLabel({ ...baseItem, price: 5000, priceMode: 'per-unit', unit: 'meter' })).toBe(
      `5${NBSP}000${NBSP}F${NBSP}CFA / mètre`,
    )
  })
})

describe('badgeLabel et visibleBadges', () => {
  it('[HOM-R8] traduit chaque étiquette en français', () => {
    expect(badgeLabel('new')).toBe('Nouveauté')
    expect(badgeLabel('classic')).toBe('Classique')
    expect(badgeLabel('last-pieces')).toBe('Dernières pièces')
    expect(badgeLabel('online-exclusive')).toBe('Exclusivité en ligne')
  })

  it('[HOM-6] garde deux étiquettes au plus, par ordre d’importance', () => {
    expect(visibleBadges(['classic', 'last-pieces', 'new'])).toEqual(['new', 'last-pieces'])
    expect(visibleBadges(['online-exclusive', 'classic', 'last-pieces'])).toEqual(['last-pieces', 'online-exclusive'])
  })

  it('[HOM-6] renvoie moins de deux étiquettes quand il y en a moins, sans modifier l’entrée', () => {
    const badges = Object.freeze(['classic'] as const)

    expect(visibleBadges(badges)).toEqual(['classic'])
    expect(visibleBadges([])).toEqual([])
  })
})

describe('productHref et itemImageAlt', () => {
  it('[HOM-8] construit l’adresse de la fiche avec le coloris, valeurs encodées', () => {
    expect(productHref(baseItem)).toBe('/produits/soleil-levant?coloris=soleil-levant-001')
    expect(productHref({ ...baseItem, designId: 'a b', colorwayId: 'c&d' })).toBe('/produits/a%20b?coloris=c%26d')
  })

  it('[HOM-9] décrit le pagne dans le texte alternatif de l’image', () => {
    expect(itemImageAlt(baseItem)).toBe('Super Wax PGN2101.001, Bleu')
  })
})

describe('rangeHref et designCountLabel', () => {
  it('[HOM-4] mène au catalogue filtré par gamme, valeur encodée', () => {
    expect(rangeHref('Java')).toBe('/catalogue?range=Java')
    expect(rangeHref('Super Wax')).toBe('/catalogue?range=Super%20Wax')
    expect(rangeHref('A&B')).toBe('/catalogue?range=A%26B')
  })

  it('[HOM-4] accorde « dessin » au singulier et au pluriel', () => {
    expect(designCountLabel(1)).toBe('1 dessin')
    expect(designCountLabel(2)).toBe('2 dessins')
    expect(designCountLabel(0)).toBe('0 dessin')
  })
})
