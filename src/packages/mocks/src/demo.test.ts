import { describe, expect, it } from 'vitest'
import { parseCatalogQuery } from '@shop-pagne/shared'
import { DEMO_DESIGNS } from './fixtures/designs'
import { demoGetDesign, demoListCatalog, demoPatternSvg } from './demo'

describe('catalogue de démonstration branché', () => {
  it('[MOC-5] liste la première page du catalogue de démonstration', () => {
    const parsed = parseCatalogQuery({})
    if (!parsed.ok) throw new Error('requête invalide')
    const page = demoListCatalog(parsed.value)

    expect(page.items).toHaveLength(12)
    expect(page.total).toBeGreaterThanOrEqual(30)
    expect(page.nextCursor).toBe('c12')
  })

  it('[MOC-17] renvoie la fiche d’un dessin de démonstration', () => {
    expect(demoGetDesign('soleil-levant')?.colorways.length).toBeGreaterThan(0)
  })

  it('[MOC-18] ne trouve pas un dessin inconnu', () => {
    expect(demoGetDesign('inconnu')).toBeUndefined()
  })
})

describe('images de démonstration', () => {
  const colorwayId = DEMO_DESIGNS[0]?.colorways[0]?.id ?? ''

  it('[MOC-4] produit le motif d’un coloris à partir du nom de fichier', () => {
    const svg = demoPatternSvg(`${colorwayId}.svg`)

    expect(svg?.startsWith('<svg')).toBe(true)
  })

  it('[MOC-4] produit une vue zoomée du même motif', () => {
    expect(demoPatternSvg(`${colorwayId}.svg`, 2)).not.toBe(demoPatternSvg(`${colorwayId}.svg`))
  })

  it('[MOC-4] ne connaît pas un coloris inexistant', () => {
    expect(demoPatternSvg('inconnu.svg')).toBeUndefined()
  })

  it('[MOC-4] refuse les noms de fichier détournés ou sans extension .svg', () => {
    for (const file of ['../etc/passwd.svg', `${colorwayId}`, `${colorwayId}.png`, `..%2F${colorwayId}.svg`, '']) {
      expect(demoPatternSvg(file), file).toBeUndefined()
    }
  })

  it('[MOC-4] ignore un zoom invalide', () => {
    expect(demoPatternSvg(`${colorwayId}.svg`, 0)).toBeUndefined()
    expect(demoPatternSvg(`${colorwayId}.svg`, Number.NaN)).toBeUndefined()
    expect(demoPatternSvg(`${colorwayId}.svg`, 99)).toBeUndefined()
  })
})
