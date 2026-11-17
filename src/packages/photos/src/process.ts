/** Conversion d'une photo en WebP léger, sans métadonnées (voir spec 006, PHO-R2 à PHO-R4). */
import sharp from 'sharp'
import type { ColorName, PhotoOptions, RenderedWebp } from '@shop-pagne/types'
import { dominantColorName } from './color'

/** Réglages par défaut : photo de carte de 800 px (150 Ko), photo de détail de 1 600 px (400 Ko), qualité 50 au plus bas. */
export const DEFAULT_PHOTO_OPTIONS: PhotoOptions = {
  cardMaxSide: 800,
  zoomMaxSide: 1600,
  cardMaxBytes: 150_000,
  zoomMaxBytes: 400_000,
  minQuality: 50,
}

/** Qualité WebP essayée en premier. */
const START_QUALITY = 82

/** Écart de qualité entre deux essais successifs. */
const QUALITY_STEP = 6

/** Effort de compression de sharp : compromis entre vitesse et poids. */
const WEBP_EFFORT = 4

/** Côté de la miniature sur laquelle on déduit la couleur dominante, en pixels. */
const COLOR_SAMPLE_SIDE = 64

/**
 * Convertit une photo en WebP : applique l'orientation EXIF, réduit sans jamais agrandir, puis baisse la
 * qualité par paliers jusqu'à respecter le poids demandé. Aucune métadonnée (EXIF, position GPS, appareil)
 * n'est conservée. Voir spec 006, PHO-R2 à PHO-R4.
 *
 * @param source - Contenu du fichier d'origine (JPEG, PNG ou WebP).
 * @param maxSide - Plus grand côté de l'image obtenue, en pixels.
 * @param maxBytes - Poids maximal du fichier, en octets.
 * @param minQuality - Qualité plancher, en dessous de laquelle on ne descend pas.
 * @returns L'image obtenue ; `withinBudget` vaut `false` si le poids dépasse le budget à la qualité plancher.
 */
export async function renderWebp(
  source: Buffer,
  maxSide: number,
  maxBytes: number,
  minQuality: number,
): Promise<RenderedWebp> {
  let quality = START_QUALITY

  for (;;) {
    const { data, info } = await sharp(source)
      .rotate()
      .resize({ width: maxSide, height: maxSide, fit: 'inside', withoutEnlargement: true })
      .webp({ quality, effort: WEBP_EFFORT })
      .toBuffer({ resolveWithObject: true })

    const withinBudget = data.length <= maxBytes
    if (withinBudget || quality <= minQuality) {
      return { data, width: info.width, height: info.height, quality, withinBudget }
    }
    quality = Math.max(minQuality, quality - QUALITY_STEP)
  }
}

/**
 * Déduit la couleur dominante d'une photo à partir d'une petite miniature. Les transparences sont
 * remplacées par du blanc, qui ne compte pas dans le vote. Voir spec 006, PHO-R6.
 *
 * @param source - Contenu du fichier d'origine.
 * @returns La couleur dominante, ou `null` si la photo n'est que du fond blanc.
 */
export async function colorOfPhoto(source: Buffer): Promise<ColorName | null> {
  const pixels = await sharp(source)
    .rotate()
    .flatten({ background: '#ffffff' })
    .resize(COLOR_SAMPLE_SIDE, COLOR_SAMPLE_SIDE, { fit: 'cover' })
    .removeAlpha()
    .raw()
    .toBuffer()

  return dominantColorName(pixels)
}
