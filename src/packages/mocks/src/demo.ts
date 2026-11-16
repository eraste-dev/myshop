import type { CatalogPage, CatalogQuery, Design } from '@shop-pagne/shared'
import { getDesign, listCatalog } from './catalog'
import { DEMO_DESIGNS, patternSpecFor } from './fixtures/designs'
import { patternSvg } from './pattern'

const PATTERN_FILE = /^([a-z0-9-]+)\.svg$/
const MIN_ZOOM = 1
const MAX_ZOOM = 4

/** Catalogue de démonstration filtré, trié et paginé. */
export function demoListCatalog(query: CatalogQuery): CatalogPage {
  return listCatalog(query, DEMO_DESIGNS)
}

export function demoGetDesign(id: string): Design | undefined {
  return getDesign(id, DEMO_DESIGNS)
}

/**
 * Image SVG d'un coloris de démonstration, à partir du nom de fichier demandé (`<coloris>.svg`).
 * Renvoie `undefined` pour un nom mal formé, un coloris inconnu ou un zoom hors de 1 à 4.
 */
export function demoPatternSvg(file: string, zoom: number = MIN_ZOOM): string | undefined {
  const match = PATTERN_FILE.exec(file)
  if (match === null || !(zoom >= MIN_ZOOM && zoom <= MAX_ZOOM)) {
    return undefined
  }

  const spec = patternSpecFor(match[1] as string)
  return spec === undefined ? undefined : patternSvg(spec.seed, { palette: spec.palette, kind: spec.kind, zoom })
}
