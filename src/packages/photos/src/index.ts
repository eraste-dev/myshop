/**
 * Point d'entrée du paquet `@shop-pagne/photos` : traitement des photos de pagnes
 * (WebP léger, couleur dominante, manifeste). Les types sont dans `@shop-pagne/types`.
 */

export { dominantColorName, nearestColorName } from './color'
export { assignPhotoIds, photoIdFromFilename } from './ids'
export { mergeManifest, serializeManifest } from './manifest'
export { colorOfPhoto, DEFAULT_PHOTO_OPTIONS, renderWebp } from './process'
export { processPhotos } from './run'
