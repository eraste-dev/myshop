import { describe, expect, it } from 'vitest'
import { patternDataUri, patternSvg } from './pattern'

const palette = ['#1d3f8a', '#f2c230', '#f5efe3'] as const

describe('motifs générés', () => {
  it('[MOC-3] donne le même motif pour la même graine', () => {
    expect(patternSvg('soleil-001', { palette })).toBe(patternSvg('soleil-001', { palette }))
  })

  it('[MOC-3] donne des motifs différents pour des graines différentes', () => {
    expect(patternSvg('soleil-001', { palette })).not.toBe(patternSvg('soleil-002', { palette }))
  })

  it('[MOC-3] donne des motifs différents selon la palette', () => {
    const other = ['#8a1d1d', '#f2c230', '#f5efe3'] as const

    expect(patternSvg('soleil-001', { palette })).not.toBe(patternSvg('soleil-001', { palette: other }))
  })

  it.each(['burst', 'circles', 'leaves', 'diamonds', 'waves'] as const)(
    '[MOC-4] produit une image SVG valide pour le style %s',
    (kind) => {
      const svg = patternSvg('graine', { palette, kind })

      expect(svg.startsWith('<svg')).toBe(true)
      expect(svg.endsWith('</svg>')).toBe(true)
      expect(svg).toContain('xmlns="http://www.w3.org/2000/svg"')
      expect(svg).toContain('viewBox="0 0 600 600"')
    },
  )

  it('[MOC-4] n’inclut aucun script ni contenu externe', () => {
    const svg = patternSvg('graine', { palette })

    expect(svg).not.toMatch(/<script|href=|xlink|javascript:|onload|onerror/i)
  })

  it('[MOC-4] produit une adresse de données utilisable comme source d’image', () => {
    const uri = patternDataUri('graine', { palette })

    expect(uri.startsWith('data:image/svg+xml;charset=utf-8,')).toBe(true)
    expect(decodeURIComponent(uri.slice('data:image/svg+xml;charset=utf-8,'.length))).toBe(
      patternSvg('graine', { palette }),
    )
  })

  it('[MOC-4] reste léger', () => {
    expect(patternSvg('graine', { palette }).length).toBeLessThan(20_000)
  })

  it('[MOC-4] recadre sur le centre quand on zoome, pour la vue détail', () => {
    const detail = patternSvg('graine', { palette, zoom: 2 })

    expect(detail).toContain('viewBox="150 150 300 300"')
    expect(patternSvg('graine', { palette, zoom: 2 })).toBe(detail)
  })

  it('[MOC-4] refuse un zoom inférieur à 1', () => {
    expect(() => patternSvg('graine', { palette, zoom: 0.5 })).toThrow()
  })

  it('[MOC-4] refuse une palette vide', () => {
    expect(() => patternSvg('graine', { palette: [] })).toThrow()
  })
})
