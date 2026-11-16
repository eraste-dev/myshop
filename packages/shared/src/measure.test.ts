import { describe, expect, it } from 'vitest'
import { measurePrice, validateMeasure, yardsToMeters, metersToYards } from './measure'
import type { MeasureConfig } from './types'

const config: MeasureConfig = {
  unit: 'yard',
  unitPrice: 8000,
  min: 1,
  max: 6,
  step: 0.5,
  stock: 20,
}

describe('measurePrice', () => {
  it('multiplie le prix unitaire par la longueur', () => {
    expect(measurePrice(config, 2.5)).toBe(20000)
  })

  it('renvoie un entier de francs CFA', () => {
    const odd: MeasureConfig = { ...config, unitPrice: 3333 }
    expect(Number.isInteger(measurePrice(odd, 1.5))).toBe(true)
    expect(measurePrice(odd, 1.5)).toBe(5000)
  })

  it('évite les erreurs de flottants sur les longueurs décimales', () => {
    const cfg: MeasureConfig = { ...config, unitPrice: 1000, step: 0.1 }
    expect(measurePrice(cfg, 0.7)).toBe(700)
    expect(measurePrice(cfg, 2.3)).toBe(2300)
  })
})

describe('validateMeasure', () => {
  it('accepte une longueur valide', () => {
    expect(validateMeasure(config, 2.5)).toEqual({ ok: true })
  })

  it('accepte les bornes minimale et maximale', () => {
    expect(validateMeasure(config, 1)).toEqual({ ok: true })
    expect(validateMeasure(config, 6)).toEqual({ ok: true })
  })

  it('refuse une longueur sous le minimum', () => {
    expect(validateMeasure(config, 0.5)).toEqual({ ok: false, code: 'below_min', min: 1 })
  })

  it('refuse une longueur au-dessus du maximum', () => {
    expect(validateMeasure(config, 6.5)).toEqual({ ok: false, code: 'above_max', max: 6 })
  })

  it('refuse une longueur hors du pas de découpe', () => {
    expect(validateMeasure(config, 2.3)).toEqual({ ok: false, code: 'invalid_step', step: 0.5 })
  })

  it('refuse une longueur supérieure au stock disponible', () => {
    const low: MeasureConfig = { ...config, stock: 3 }
    expect(validateMeasure(low, 4)).toEqual({ ok: false, code: 'exceeds_stock', available: 3 })
  })

  it('refuse une valeur qui n’est pas un nombre positif', () => {
    expect(validateMeasure(config, Number.NaN)).toEqual({ ok: false, code: 'not_a_number' })
    expect(validateMeasure(config, 0)).toEqual({ ok: false, code: 'not_a_number' })
    expect(validateMeasure(config, -1)).toEqual({ ok: false, code: 'not_a_number' })
  })

  it('traite le pas de 0,1 sans erreur de flottant', () => {
    const cfg: MeasureConfig = { ...config, min: 0.5, step: 0.1 }
    expect(validateMeasure(cfg, 0.7)).toEqual({ ok: true })
    expect(validateMeasure(cfg, 2.3)).toEqual({ ok: true })
  })
})

describe('conversion yards et mètres', () => {
  it('convertit les yards en mètres', () => {
    expect(yardsToMeters(6)).toBe(5.49)
  })

  it('convertit les mètres en yards', () => {
    expect(metersToYards(5.49)).toBe(6)
  })
})
