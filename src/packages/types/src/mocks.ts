/** Types propres à la simulation : motifs générés, scénarios de démonstration et données de départ. */

/** Famille de motif générée pour les photos de démonstration. */
export type PatternKind = 'burst' | 'circles' | 'leaves' | 'diamonds' | 'waves'

/** Réglages de génération d'un motif. */
export interface PatternOptions {
  /** Couleurs du motif : la première sert de fond, les suivantes d'accents. Au moins une. */
  readonly palette: readonly string[]
  /** Famille de motif ; déduite de la graine si absente. */
  readonly kind?: PatternKind
  /** Recadrage au centre : 1 = image entière, 2 = moitié centrale, etc. Au moins 1. */
  readonly zoom?: number
}

/** Description du motif à générer pour un coloris de démonstration. */
export interface PatternSpec {
  /** Graine du générateur : même graine, même motif. */
  readonly seed: string
  /** Couleurs du motif. */
  readonly palette: readonly string[]
  /** Famille de motif. */
  readonly kind: PatternKind
}

/** Comportement simulé de l'API : normal, en panne (`error`) ou lent (`slow`). */
export type Scenario = 'normal' | 'error' | 'slow'

/** Ce qu'un scénario impose à une réponse. */
export interface ScenarioEffect {
  /** Attente avant de répondre, en millisecondes. */
  readonly delayMs: number
  /** `true` si la réponse doit être une erreur serveur. */
  readonly shouldFail: boolean
}

/** Couleurs dominantes disponibles dans les données de démonstration. */
export type ColorName = 'Bleu' | 'Rouge' | 'Vert' | 'Orange' | 'Jaune' | 'Rose' | 'Noir' | 'Marron' | 'Violet'

/** Description compacte d'un dessin de démonstration, à partir de laquelle on génère ses coloris. */
export interface DesignSeed {
  /** Identifiant du dessin. */
  readonly id: string
  /** Référence du dessin. */
  readonly reference: string
  /** Nom du dessin. */
  readonly name: string
  /** Gamme du dessin. */
  readonly range: string
  /** Famille de motif de ses photos générées. */
  readonly kind: PatternKind
  /** Styles de dessin (attribut de filtre). */
  readonly style: readonly string[]
  /** Finition (attribut de filtre), ou `Aucune`. */
  readonly finish: string
  /** Mode de vente de tous les coloris du dessin. */
  readonly sale: 'piece' | 'measure'
  /** Prix de la pièce de 6 yards, ou de 6 yards au prorata en vente à la mesure. */
  readonly base: number
  /** Couleurs des coloris, dans l'ordre de leurs codes. */
  readonly colors: readonly ColorName[]
  /** Longueurs de pièce proposées, en yards (vente à la pièce). */
  readonly lengths?: readonly number[]
  /** Longueur minimale en yards (vente à la mesure). */
  readonly min?: number
}
