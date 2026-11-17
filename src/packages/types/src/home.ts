/** Types de la page d'accueil de la vitrine (voir spec 005). */

import type { CatalogItem } from './catalog'

/** Tuile de gamme : une photo et le nombre de dessins de la gamme. */
export interface RangeTile {
  /** Nom de la gamme (ex. `Super Wax`), aussi utilisé comme filtre du catalogue. */
  readonly range: string
  /** Adresse de la photo du premier coloris de la gamme. */
  readonly image: string
  /** Nombre de coloris de la gamme dans le catalogue. */
  readonly count: number
}

/** Tout ce que l'accueil affiche, déduit d'une page du catalogue. */
export interface HomeContent {
  /** Coloris de la section « À découvrir » : nouveautés, puis disponibles, puis le reste (8 au plus). */
  readonly discover: readonly CatalogItem[]
  /** Images des deux panneaux du bandeau ; `null` quand aucune image n'est exploitable. */
  readonly heroImages: readonly [string | null, string | null]
  /** Tuiles de gammes, par ordre alphabétique. */
  readonly rangeTiles: readonly RangeTile[]
  /** `true` quand le catalogue ne contient aucun coloris. */
  readonly isEmpty: boolean
}
