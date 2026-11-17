/** Détection de la couleur dominante d'une photo, ramenée aux couleurs du catalogue (voir spec 006, PHO-R6). */
import type { ColorName } from '@shop-pagne/types'

/** Couleur dans l'espace RVB : trois valeurs de 0 à 255. */
type Rgb = readonly [number, number, number]

/** Couleur dans l'espace CIE Lab : clarté, puis deux axes de teinte. */
type Lab = readonly [number, number, number]

/** Couleurs du catalogue, dans l'ordre qui départage les égalités. */
const COLOR_NAMES: readonly ColorName[] = ['Bleu', 'Rouge', 'Vert', 'Orange', 'Jaune', 'Rose', 'Noir', 'Marron', 'Violet']

/** Couleur représentative de chaque nom, vers laquelle on ramène chaque pixel. */
const COLOR_REFERENCES: Readonly<Record<ColorName, Rgb>> = {
  Bleu: [30, 80, 170],
  Rouge: [190, 30, 40],
  Vert: [30, 130, 70],
  Orange: [230, 120, 30],
  Jaune: [240, 200, 40],
  Rose: [230, 110, 160],
  Noir: [25, 25, 25],
  Marron: [110, 65, 30],
  Violet: [110, 50, 150],
}

/** Au-dessus de cette valeur sur les trois canaux, un pixel est du fond blanc et n'est pas compté. */
const BACKGROUND_THRESHOLD = 235

/** Blanc de référence D65, pour la conversion vers l'espace Lab. */
const WHITE_D65 = [0.95047, 1, 1.08883] as const

/** Passe un canal sRGB (0 à 255) en valeur linéaire (0 à 1). */
function linearize(channel: number): number {
  const value = channel / 255
  return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
}

/** Fonction de transformation de l'espace XYZ vers l'espace Lab. */
function labCurve(value: number): number {
  return value > 216 / 24389 ? Math.cbrt(value) : (24389 / 27 * value + 16) / 116
}

/** Convertit une couleur RVB en Lab, espace où la distance se rapproche de l'écart perçu par l'œil. */
function rgbToLab([r, g, b]: Rgb): Lab {
  const [lr, lg, lb] = [linearize(r), linearize(g), linearize(b)]
  const x = (0.4124564 * lr + 0.3575761 * lg + 0.1804375 * lb) / WHITE_D65[0]
  const y = (0.2126729 * lr + 0.7151522 * lg + 0.072175 * lb) / WHITE_D65[1]
  const z = (0.0193339 * lr + 0.119192 * lg + 0.9503041 * lb) / WHITE_D65[2]
  const [fx, fy, fz] = [labCurve(x), labCurve(y), labCurve(z)]

  return [116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)]
}

/** Références du catalogue déjà converties en Lab, pour ne pas les recalculer à chaque pixel. */
const LAB_REFERENCES: ReadonlyArray<readonly [ColorName, Lab]> = COLOR_NAMES.map((name) => [
  name,
  rgbToLab(COLOR_REFERENCES[name]),
])

/** Distance entre deux couleurs Lab (écart CIE76). */
function labDistance(a: Lab, b: Lab): number {
  return Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2])
}

/**
 * Trouve la couleur du catalogue la plus proche d'une couleur RVB, au sens de l'écart perçu (espace Lab).
 *
 * @param rgb - Couleur à nommer.
 * @returns Le nom de couleur du catalogue le plus proche ; en cas d'égalité, le premier dans l'ordre du catalogue.
 */
export function nearestColorName(rgb: Rgb): ColorName {
  const lab = rgbToLab(rgb)
  let best: ColorName = COLOR_NAMES[0] as ColorName
  let bestDistance = Number.POSITIVE_INFINITY

  for (const [name, reference] of LAB_REFERENCES) {
    const distance = labDistance(lab, reference)
    if (distance < bestDistance) {
      best = name
      bestDistance = distance
    }
  }

  return best
}

/**
 * Déduit la couleur dominante d'une photo à partir de ses pixels : chaque pixel vote pour la couleur du
 * catalogue la plus proche, et la plus votée l'emporte. Les pixels de fond blanc ne votent pas ; les pixels
 * sombres, eux, comptent, un tissu noir étant une couleur comme une autre.
 *
 * @param pixels - Pixels à plat, trois valeurs (rouge, vert, bleu) par pixel, sans canal alpha.
 * @returns La couleur dominante, ou `null` s'il n'y a aucun pixel ou seulement du fond blanc.
 */
export function dominantColorName(pixels: Uint8Array): ColorName | null {
  const votes = new Map<ColorName, number>()

  for (let i = 0; i + 2 < pixels.length; i += 3) {
    const rgb: Rgb = [pixels[i] as number, pixels[i + 1] as number, pixels[i + 2] as number]
    if (rgb.every((channel) => channel >= BACKGROUND_THRESHOLD)) continue

    const name = nearestColorName(rgb)
    votes.set(name, (votes.get(name) ?? 0) + 1)
  }

  let winner: ColorName | null = null
  let winnerVotes = 0
  for (const name of COLOR_NAMES) {
    const count = votes.get(name) ?? 0
    if (count > winnerVotes) {
      winner = name
      winnerVotes = count
    }
  }

  return winner
}
