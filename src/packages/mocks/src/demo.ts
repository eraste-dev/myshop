/** Branchement des fonctions de simulation sur le catalogue de démonstration. */
import type { CatalogPage, CatalogQuery, Design } from '@shop-pagne/types'
import { getDesign, listCatalog } from './catalog'
import { DEMO_DESIGNS, patternSpecFor } from './fixtures/designs'
import { patternSvg } from './pattern'

/** Forme d'un nom de fichier d'image : un identifiant de coloris suivi de `.svg`. */
const PATTERN_FILE = /^([a-z0-9-]+)\.svg$/

/** Zoom minimal accepté pour une image (image entière). */
const MIN_ZOOM = 1

/** Zoom maximal accepté pour une image. */
const MAX_ZOOM = 4

/**
 * Liste le catalogue de démonstration, filtré, trié et paginé.
 *
 * @param query - Requête validée.
 * @returns La page demandée, avec les filtres et leurs compteurs.
 */
export function demoListCatalog(query: CatalogQuery): CatalogPage {
  return listCatalog(query, DEMO_DESIGNS)
}

/**
 * Cherche un dessin dans le catalogue de démonstration.
 *
 * @param id - Identifiant du dessin.
 * @returns Le dessin, ou `undefined` s'il est inconnu.
 */
export function demoGetDesign(id: string): Design | undefined {
  return getDesign(id, DEMO_DESIGNS)
}

/**
 * Produit l'image SVG d'un coloris de démonstration, à partir du nom de fichier demandé (`<coloris>.svg`).
 * Le nom est strictement validé, ce qui écarte tout détournement de chemin.
 *
 * @param file - Nom du fichier demandé.
 * @param zoom - Recadrage au centre, de 1 à 4.
 * @returns Le code SVG, ou `undefined` pour un nom mal formé, un coloris inconnu ou un zoom hors limites.
 */
export function demoPatternSvg(file: string, zoom: number = MIN_ZOOM): string | undefined {
  const match = PATTERN_FILE.exec(file)
  if (match === null || !(zoom >= MIN_ZOOM && zoom <= MAX_ZOOM)) {
    return undefined
  }

  const spec = patternSpecFor(match[1] as string)
  return spec === undefined ? undefined : patternSvg(spec.seed, { palette: spec.palette, kind: spec.kind, zoom })
}
