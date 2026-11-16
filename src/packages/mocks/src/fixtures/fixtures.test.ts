import { describe, expect, it } from 'vitest'
import { parseCatalogQuery } from '@shop-pagne/shared'
import type { Colorway } from '@shop-pagne/types'
import { listCatalog } from '../catalog'
import { DEMO_DESIGNS } from './designs'
import { DEMO_SHOP } from './shop'

const colorways: readonly Colorway[] = DEMO_DESIGNS.flatMap((design) => design.colorways)

const isPositiveInt = (value: number): boolean => Number.isInteger(value) && value > 0

describe('catalogue de démonstration', () => {
  it('[MOC-1] contient au moins 12 dessins et 30 coloris', () => {
    expect(DEMO_DESIGNS.length).toBeGreaterThanOrEqual(12)
    expect(colorways.length).toBeGreaterThanOrEqual(30)
  })

  it('[MOC-1] mélange vente à la pièce et vente à la mesure', () => {
    expect(colorways.some((c) => c.saleMode === 'piece')).toBe(true)
    expect(colorways.some((c) => c.saleMode === 'measure')).toBe(true)
  })

  it('[MOC-1] contient des ruptures, des stocks bas et des nouveautés', () => {
    const parsed = parseCatalogQuery({ limit: '48' })
    if (!parsed.ok) throw new Error('requête invalide')
    const items = listCatalog(parsed.value, DEMO_DESIGNS).items

    expect(items.some((item) => !item.available)).toBe(true)
    expect(items.some((item) => item.badges.includes('last-pieces'))).toBe(true)
    expect(items.some((item) => item.badges.includes('new'))).toBe(true)
  })

  it('[MOC-1] propose plusieurs longueurs de pièce et plusieurs couleurs', () => {
    const lengths = new Set(colorways.flatMap((c) => c.pieces.map((p) => p.lengthYards)))
    const colors = new Set(colorways.map((c) => c.colorName))

    expect(lengths.size).toBeGreaterThanOrEqual(3)
    expect(colors.size).toBeGreaterThanOrEqual(6)
  })
})

describe('validité des données de démonstration', () => {
  it('[MOC-R10] a des identifiants et des références uniques', () => {
    const designIds = DEMO_DESIGNS.map((d) => d.id)
    const references = DEMO_DESIGNS.map((d) => d.reference)
    const colorwayIds = colorways.map((c) => c.id)

    expect(new Set(designIds).size).toBe(designIds.length)
    expect(new Set(references).size).toBe(references.length)
    expect(new Set(colorwayIds).size).toBe(colorwayIds.length)
  })

  it('[MOC-R10] a des codes de coloris uniques dans chaque dessin', () => {
    for (const design of DEMO_DESIGNS) {
      const codes = design.colorways.map((c) => c.code)
      expect(new Set(codes).size, design.id).toBe(codes.length)
    }
  })

  it('[MOC-R10] a des textes renseignés pour chaque dessin', () => {
    for (const design of DEMO_DESIGNS) {
      expect(design.name.trim(), design.id).not.toBe('')
      expect(design.description.trim(), design.id).not.toBe('')
      expect(design.careAdvice.trim(), design.id).not.toBe('')
      expect(design.range.trim(), design.id).not.toBe('')
    }
  })

  it('[MOC-R10] a au moins une image et une pastille par coloris', () => {
    for (const colorway of colorways) {
      expect(colorway.images.length, colorway.id).toBeGreaterThanOrEqual(1)
      expect(colorway.swatchImage, colorway.id).not.toBe('')
    }
  })

  it('[MOC-R10] a des pièces cohérentes avec le mode de vente à la pièce', () => {
    for (const colorway of colorways.filter((c) => c.saleMode === 'piece')) {
      expect(colorway.measure, colorway.id).toBeNull()
      expect(colorway.pieces.length, colorway.id).toBeGreaterThan(0)

      for (const piece of colorway.pieces) {
        expect(isPositiveInt(piece.price), `${colorway.id} prix`).toBe(true)
        expect(Number.isInteger(piece.stock) && piece.stock >= 0, `${colorway.id} stock`).toBe(true)
        expect([2, 4, 6, 12]).toContain(piece.lengthYards)
      }

      const lengths = colorway.pieces.map((p) => p.lengthYards)
      expect(new Set(lengths).size, `${colorway.id} longueurs uniques`).toBe(lengths.length)
    }
  })

  it('[MOC-R10] a une configuration de mesure valide pour la vente à la mesure', () => {
    for (const colorway of colorways.filter((c) => c.saleMode === 'measure')) {
      const measure = colorway.measure
      expect(colorway.pieces, colorway.id).toEqual([])
      expect(measure, colorway.id).not.toBeNull()
      if (!measure) continue

      expect(isPositiveInt(measure.unitPrice), `${colorway.id} prix unitaire`).toBe(true)
      expect(measure.min, colorway.id).toBeGreaterThan(0)
      expect(measure.max, colorway.id).toBeGreaterThanOrEqual(measure.min)
      expect(measure.step, colorway.id).toBeGreaterThan(0)
      expect(measure.stock, colorway.id).toBeGreaterThanOrEqual(0)
    }
  })

  it('[MOC-R10] a une boutique de démonstration complète', () => {
    expect(DEMO_SHOP.currency).toBe('XOF')
    expect(DEMO_SHOP.slug).toMatch(/^[a-z0-9-]+$/)
    expect(DEMO_SHOP.name.trim()).not.toBe('')
    expect(DEMO_SHOP.whatsappNumber).toMatch(/^\+\d{8,15}$/)
  })

  it('[MOC-2] fournit des attributs de filtre pour chaque dessin', () => {
    for (const design of DEMO_DESIGNS) {
      expect(design.attributes.style?.length ?? 0, design.id).toBeGreaterThan(0)
      expect(design.attributes.finish?.length ?? 0, design.id).toBeGreaterThan(0)
    }
  })
})
