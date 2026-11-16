import { describe, expect, it } from 'vitest'
import {
  isMeasureAvailable,
  measurePrice,
  metersToYards,
  validateMeasure,
  yardsToMeters,
} from './measure'
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
  it('[MES-1] multiplie le prix unitaire par la longueur', () => {
    expect(measurePrice(config, 2.5)).toBe(20000)
  })

  it('[MES-8] renvoie un entier de francs CFA', () => {
    const odd: MeasureConfig = { ...config, unitPrice: 3333 }
    expect(Number.isInteger(measurePrice(odd, 1.5))).toBe(true)
    expect(measurePrice(odd, 1.5)).toBe(5000)
  })

  it('[MES-9] évite les erreurs de flottants sur les longueurs décimales', () => {
    const cfg: MeasureConfig = { ...config, unitPrice: 1000, step: 0.1 }
    expect(measurePrice(cfg, 0.7)).toBe(700)
    expect(measurePrice(cfg, 2.3)).toBe(2300)
  })

  it('[MES-16] calcule le prix d’un produit vendu au mètre', () => {
    const meters: MeasureConfig = { unit: 'meter', unitPrice: 5000, min: 1, max: 3, step: 0.5, stock: 10 }
    expect(validateMeasure(meters, 2.5)).toEqual({ ok: true })
    expect(measurePrice(meters, 2.5)).toBe(12500)
  })
})

describe('validateMeasure', () => {
  it('[MES-1] accepte une longueur valide', () => {
    expect(validateMeasure(config, 2.5)).toEqual({ ok: true })
  })

  it('[MES-2] accepte les bornes minimale et maximale', () => {
    expect(validateMeasure(config, 1)).toEqual({ ok: true })
    expect(validateMeasure(config, 6)).toEqual({ ok: true })
  })

  it('[MES-3] refuse une longueur sous le minimum', () => {
    expect(validateMeasure(config, 0.5)).toEqual({ ok: false, code: 'below_min', min: 1 })
  })

  it('[MES-4] refuse une longueur au-dessus du maximum', () => {
    expect(validateMeasure(config, 6.5)).toEqual({ ok: false, code: 'above_max', max: 6 })
  })

  it('[MES-5] refuse une longueur hors du pas de découpe', () => {
    expect(validateMeasure(config, 2.3)).toEqual({ ok: false, code: 'invalid_step', step: 0.5 })
  })

  it('[MES-6] refuse une longueur supérieure au stock disponible', () => {
    const low: MeasureConfig = { ...config, stock: 3 }
    expect(validateMeasure(low, 4)).toEqual({ ok: false, code: 'exceeds_stock', available: 3 })
  })

  it('[MES-7] refuse une valeur qui n’est pas un nombre positif', () => {
    expect(validateMeasure(config, Number.NaN)).toEqual({ ok: false, code: 'not_a_number' })
    expect(validateMeasure(config, Number.POSITIVE_INFINITY)).toEqual({ ok: false, code: 'not_a_number' })
    expect(validateMeasure(config, 0)).toEqual({ ok: false, code: 'not_a_number' })
    expect(validateMeasure(config, -1)).toEqual({ ok: false, code: 'not_a_number' })
  })

  it('[MES-10] traite le pas de 0,1 sans erreur de flottant', () => {
    const cfg: MeasureConfig = { ...config, min: 0.5, step: 0.1 }
    expect(validateMeasure(cfg, 0.7)).toEqual({ ok: true })
    expect(validateMeasure(cfg, 2.3)).toEqual({ ok: true })
  })

  it('[MES-15] ne renvoie que la première erreur, dans l’ordre prévu', () => {
    const cfg: MeasureConfig = { ...config, min: 1, step: 0.5 }
    expect(validateMeasure(cfg, 0.3)).toEqual({ ok: false, code: 'below_min', min: 1 })
  })

  it('[MES-17] compte le pas à partir du minimum', () => {
    const cfg: MeasureConfig = { ...config, min: 0.75, step: 0.5 }
    expect(validateMeasure(cfg, 1.25)).toEqual({ ok: true })
    expect(validateMeasure(cfg, 1.5)).toEqual({ ok: false, code: 'invalid_step', step: 0.5 })
  })

  it('[MES-R3] ne modifie pas la configuration reçue', () => {
    const frozen: MeasureConfig = Object.freeze({ ...config })
    expect(() => validateMeasure(frozen, 2)).not.toThrow()
    expect(() => measurePrice(frozen, 2)).not.toThrow()
  })
})

describe('isMeasureAvailable', () => {
  it('[MES-13] est indisponible quand le stock est sous le minimum', () => {
    expect(isMeasureAvailable({ ...config, min: 4, stock: 3 })).toBe(false)
  })

  it('[MES-14] est disponible quand le stock égale le minimum', () => {
    expect(isMeasureAvailable({ ...config, min: 4, stock: 4 })).toBe(true)
  })

  it('[MES-13] est indisponible quand le stock est nul', () => {
    expect(isMeasureAvailable({ ...config, stock: 0 })).toBe(false)
  })
})

describe('conversion yards et mètres', () => {
  it('[MES-11] convertit les yards en mètres', () => {
    expect(yardsToMeters(6)).toBe(5.49)
  })

  it('[MES-12] convertit les mètres en yards', () => {
    expect(metersToYards(5.49)).toBe(6)
  })
})
