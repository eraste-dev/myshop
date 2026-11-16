/** Types du traitement des photos de pagnes et de leur manifeste (voir spec 006). */

import type { ColorName } from './mocks'

/** D'où vient la couleur d'une photo : déduite des pixels, ou corrigée à la main dans le manifeste. */
export type ColorSource = 'auto' | 'manual'

/** Une photo traitée, telle qu'enregistrée dans le manifeste. */
export interface PhotoEntry {
  /** Identifiant unique, dérivé du nom du fichier d'origine (minuscules, chiffres et tirets). */
  readonly id: string
  /** Nom du fichier d'origine dans le dossier des originaux. */
  readonly sourceFile: string
  /** Empreinte SHA-256 du fichier d'origine : une photo inchangée n'est pas retraitée. */
  readonly sourceHash: string
  /** Couleur dominante du tissu. */
  readonly color: ColorName
  /** Origine de la couleur ; une couleur `manual` n'est jamais écrasée par un nouveau traitement. */
  readonly colorSource: ColorSource
  /** Largeur de la photo de carte, en pixels. */
  readonly width: number
  /** Hauteur de la photo de carte, en pixels. */
  readonly height: number
  /** Poids de la photo de carte, en octets. */
  readonly cardBytes: number
  /** Poids de la photo de détail, en octets. */
  readonly zoomBytes: number
}

/** Manifeste des photos de démonstration, lu par le catalogue simulé. */
export interface PhotoManifest {
  /** Version du format du manifeste. */
  readonly version: 1
  /** Photos traitées, triées par identifiant. */
  readonly photos: readonly PhotoEntry[]
}

/** Réglages de la compression des photos. */
export interface PhotoOptions {
  /** Plus grand côté de la photo de carte, en pixels. */
  readonly cardMaxSide: number
  /** Plus grand côté de la photo de détail, en pixels. */
  readonly zoomMaxSide: number
  /** Poids maximal de la photo de carte, en octets. */
  readonly cardMaxBytes: number
  /** Poids maximal de la photo de détail, en octets. */
  readonly zoomMaxBytes: number
  /** Qualité WebP minimale, en dessous de laquelle on ne descend pas. */
  readonly minQuality: number
}

/** Résultat de la conversion d'une photo en WebP. */
export interface RenderedWebp {
  /** Contenu du fichier WebP, sans aucune métadonnée. */
  readonly data: Uint8Array
  /** Largeur obtenue, en pixels. */
  readonly width: number
  /** Hauteur obtenue, en pixels. */
  readonly height: number
  /** Qualité WebP finalement utilisée. */
  readonly quality: number
  /** `false` quand le poids dépasse le budget même à la qualité minimale. */
  readonly withinBudget: boolean
}

/** Emplacements et réglages d'un traitement du dossier des originaux. */
export interface PhotosConfig {
  /** Dossier des photos d'origine : seul dossier lu. */
  readonly sourceDir: string
  /** Dossier des photos produites : seul dossier écrit, avec le manifeste. */
  readonly outDir: string
  /** Chemin du fichier manifeste. */
  readonly manifestPath: string
  /** Réglages de compression ; les valeurs par défaut de la spec 006 si absents. */
  readonly options?: PhotoOptions
}

/** Un fichier ignoré ou une photo hors budget, avec la raison. */
export interface PhotoWarning {
  /** Nom du fichier concerné. */
  readonly file: string
  /** Explication en français. */
  readonly reason: string
}

/** Bilan d'un traitement du dossier des originaux. */
export interface PhotosRunResult {
  /** Manifeste obtenu à l'issue du traitement. */
  readonly manifest: PhotoManifest
  /** Identifiants des photos (re)traitées pendant ce passage. */
  readonly processed: readonly string[]
  /** Identifiants des photos inchangées, laissées telles quelles. */
  readonly unchanged: readonly string[]
  /** Identifiants des photos disparues du dossier, dont les fichiers produits ont été retirés. */
  readonly removed: readonly string[]
  /** Fichiers ignorés et photos hors budget. */
  readonly warnings: readonly PhotoWarning[]
}
