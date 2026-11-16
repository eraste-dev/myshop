import type { MeasureConfig, MeasureValidation, Xof } from '@shop-pagne/types'

/** Les longueurs sont manipulées en centièmes d'unité (entiers) pour éviter les erreurs de flottants. */
const HUNDREDTHS = 100

/** Un yard vaut exactement 0,9144 mètre. */
const METERS_PER_YARD = 0.9144

/** Convertit une longueur en centièmes d'unité entiers, pour comparer sans erreur de flottant. */
function toHundredths(value: number): number {
  return Math.round(value * HUNDREDTHS)
}

/**
 * Calcule le prix d'une longueur vendue à la mesure : prix unitaire × longueur, arrondi au franc entier.
 * Voir spec 001, MES-R2 et MES-R3.
 *
 * @param config - Paramètres de mesure du produit.
 * @param length - Longueur demandée, dans l'unité du produit.
 * @returns Le prix en francs CFA, entier.
 */
export function measurePrice(config: MeasureConfig, length: number): Xof {
  return Math.round((config.unitPrice * toHundredths(length)) / HUNDREDTHS)
}

/**
 * Vérifie une longueur demandée contre les limites, le pas de découpe et le stock.
 * Une seule erreur est renvoyée, dans l'ordre : valeur invalide, sous le minimum, au-dessus du maximum,
 * hors du pas, au-dessus du stock. Le pas est compté à partir du minimum. Voir spec 001, MES-R4 à MES-R7 et MES-R10.
 *
 * @param config - Paramètres de mesure du produit.
 * @param length - Longueur demandée, dans l'unité du produit.
 * @returns `{ ok: true }` si la longueur est valide, sinon le code du refus et la valeur utile à l'affichage.
 */
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

/**
 * Indique si un produit à la mesure est commandable : son stock couvre au moins la longueur minimale.
 * Voir spec 001, MES-R9.
 *
 * @param config - Paramètres de mesure du produit.
 * @returns `true` si le produit est disponible.
 */
export function isMeasureAvailable(config: MeasureConfig): boolean {
  return config.stock > 0 && toHundredths(config.stock) >= toHundredths(config.min)
}

/**
 * Convertit des yards en mètres.
 *
 * @param yards - Longueur en yards.
 * @returns La longueur en mètres, arrondie au centième.
 */
export function yardsToMeters(yards: number): number {
  return Math.round(yards * METERS_PER_YARD * HUNDREDTHS) / HUNDREDTHS
}

/**
 * Convertit des mètres en yards.
 *
 * @param meters - Longueur en mètres.
 * @returns La longueur en yards, arrondie au centième.
 */
export function metersToYards(meters: number): number {
  return Math.round((meters / METERS_PER_YARD) * HUNDREDTHS) / HUNDREDTHS
}
