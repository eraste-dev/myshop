import { describe, expect, it } from 'vitest'
import type { ColorName, PhotoEntry, PhotoManifest } from '@shop-pagne/types'
import { buildDemoDesigns } from './designs'
import { SEEDS } from './seeds'

/** Fabrique une photo du manifeste, en ne précisant que ce qui compte pour le test. */
function photo(id: string, color: ColorName = 'Bleu'): PhotoEntry {
  return {
    id,
    sourceFile: `${id}.jpg`,
    sourceHash: `hash-${id}`,
    color,
    colorSource: 'auto',
    width: 800,
    height: 600,
    cardBytes: 50_000,
    zoomBytes: 150_000,
  }
}

/** Manifeste de `count` photos nommées p01, p02… avec une couleur qui tourne. */
function manifestOf(count: number): PhotoManifest {
  const colors: readonly ColorName[] = ['Bleu', 'Rouge', 'Vert', 'Jaune', 'Rose', 'Noir', 'Violet']
  return {
    version: 1,
    photos: Array.from({ length: count }, (_, i) => photo(`p${String(i + 1).padStart(2, '0')}`, colors[i % colors.length])),
  }
}

describe('buildDemoDesigns : sans photo', () => {
  it('[PHO-12] garde le catalogue de motifs générés quand le manifeste est vide', () => {
    const designs = buildDemoDesigns({ version: 1, photos: [] })

    expect(designs).toHaveLength(SEEDS.length)
    expect(designs.flatMap((d) => d.colorways)).toHaveLength(43)
    expect(designs[0]?.colorways[0]?.images[0]).toBe('/api/patterns/soleil-levant-001.svg')
  })
})

describe('buildDemoDesigns : avec des photos', () => {
  it('[PHO-11] regroupe 7 photos en trois dessins de 3, 3 et 1 coloris', () => {
    const designs = buildDemoDesigns(manifestOf(7))

    expect(designs.map((d) => d.colorways.length)).toEqual([3, 3, 1])
  })

  it('[PHO-11] regroupe 8 photos en 3, 3 et 2', () => {
    expect(buildDemoDesigns(manifestOf(8)).map((d) => d.colorways.length)).toEqual([3, 3, 2])
  })

  it('[PHO-11] fait un dessin d’une seule photo', () => {
    const designs = buildDemoDesigns(manifestOf(1))

    expect(designs).toHaveLength(1)
    expect(designs[0]?.colorways).toHaveLength(1)
  })

  it('[PHO-11] reprend dans l’ordre les noms, références, gammes et attributs des descriptions', () => {
    const designs = buildDemoDesigns(manifestOf(7))

    designs.forEach((design, index) => {
      const seed = SEEDS[index]
      expect(design).toMatchObject({
        id: seed?.id,
        reference: seed?.reference,
        name: seed?.name,
        range: seed?.range,
        attributes: { style: seed?.style, finish: [seed?.finish] },
      })
    })
  })

  it('[PHO-11] donne à chaque coloris la couleur de sa photo et un code à trois chiffres', () => {
    const designs = buildDemoDesigns(manifestOf(4))

    expect(designs[0]?.colorways.map((c) => [c.code, c.colorName])).toEqual([['001', 'Bleu'], ['002', 'Rouge'], ['003', 'Vert']])
    expect(designs[1]?.colorways.map((c) => [c.code, c.colorName])).toEqual([['001', 'Jaune']])
  })

  it('[PHO-13] sert les images du coloris par des adresses statiques', () => {
    const colorway = buildDemoDesigns(manifestOf(2))[0]?.colorways[0]

    expect(colorway?.images).toEqual(['/demo/pagnes/p01.webp', '/demo/pagnes/p01-zoom.webp'])
    expect(colorway?.swatchImage).toBe('/demo/pagnes/p01.webp')
  })

  it('[PHO-R8] ignore les photos en trop quand il n’y a plus de description de dessin', () => {
    const designs = buildDemoDesigns(manifestOf(SEEDS.length * 3 + 5))

    expect(designs).toHaveLength(SEEDS.length)
    expect(designs.flatMap((d) => d.colorways)).toHaveLength(SEEDS.length * 3)
  })

  it('[PHO-R8] garde les modes de vente, les prix et les stocks cohérents avec les descriptions', () => {
    const designs = buildDemoDesigns(manifestOf(SEEDS.length * 3))

    for (const color of designs.flatMap((d) => d.colorways)) {
      if (color.saleMode === 'measure') {
        expect(color.measure).not.toBeNull()
        expect(color.pieces).toEqual([])
      } else {
        expect(color.measure).toBeNull()
        expect(color.pieces.length).toBeGreaterThan(0)
        for (const piece of color.pieces) {
          expect(Number.isInteger(piece.price) && piece.price > 0).toBe(true)
          expect(Number.isInteger(piece.stock) && piece.stock >= 0).toBe(true)
        }
      }
    }
  })

  it('[PHO-R8] garde des identifiants uniques', () => {
    const designs = buildDemoDesigns(manifestOf(SEEDS.length * 3))
    const colorwayIds = designs.flatMap((d) => d.colorways.map((c) => c.id))

    expect(new Set(colorwayIds).size).toBe(colorwayIds.length)
    expect(new Set(designs.map((d) => d.id)).size).toBe(designs.length)
  })

  it('ne modifie pas le manifeste reçu', () => {
    const manifest = Object.freeze({ version: 1 as const, photos: Object.freeze(manifestOf(4).photos) })

    expect(() => buildDemoDesigns(manifest)).not.toThrow()
  })
})
