import type { MeasureConfig, Xof } from './types'

/** Longueurs manipulées en centièmes d'unité (entiers) pour éviter les erreurs de flottants. */
const HUNDREDTHS = 100

/** Un yard vaut exactement 0,9144 mètre. */
const METERS_PER_YARD = 0.9144

export type MeasureError =
  | { readonly ok: false; readonly code: 'not_a_number' }
  | { readonly ok: false; readonly code: 'below_min'; readonly min: number }
  | { readonly ok: false; readonly code: 'above_max'; readonly max: number }
  | { readonly ok: false; readonly code: 'invalid_step'; readonly step: number }
  | { readonly ok: false; readonly code: 'exceeds_stock'; readonly available: number }

export type MeasureValidation = { readonly ok: true } | MeasureError

function toHundredths(value: number): number {
  return Math.round(value * HUNDREDTHS)
}

/** Prix d'une longueur donnée, arrondi au franc CFA entier. */
export function measurePrice(config: MeasureConfig, length: number): Xof {
  return Math.round((config.unitPrice * toHundredths(length)) / HUNDREDTHS)
}

/** Vérifie une longueur demandée contre les limites, le pas de découpe et le stock. */
export function validateMeasure(config: MeasureConfig, length: number): MeasureValidation {
  if (!Number.isFinite(length) || length <= 0) {
    return { ok: false, code: 'not_a_number' }
  }

  const lengthH = toHundredths(length)
  const minH = toHundredths(config.min)
  const maxH = toHundredths(config.max)
  const stepH = toHundredths(config.step)

  if (lengthH < minH) {
    return { ok: false, code: 'below_min', min: config.min }
  }
  if (lengthH > maxH) {
    return { ok: false, code: 'above_max', max: config.max }
  }
  if (stepH > 0 && (lengthH - minH) % stepH !== 0) {
    return { ok: false, code: 'invalid_step', step: config.step }
  }
  if (lengthH > toHundredths(config.stock)) {
    return { ok: false, code: 'exceeds_stock', available: config.stock }
  }

  return { ok: true }
}

export function yardsToMeters(yards: number): number {
  return Math.round(yards * METERS_PER_YARD * HUNDREDTHS) / HUNDREDTHS
}

export function metersToYards(meters: number): number {
  return Math.round((meters / METERS_PER_YARD) * HUNDREDTHS) / HUNDREDTHS
}
