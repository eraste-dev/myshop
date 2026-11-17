/** Types de la validation d'une longueur vendue à la mesure (voir spec 001). */

/** Une longueur refusée, avec le code du motif et les valeurs utiles à l'affichage du message. */
export type MeasureError =
  | { readonly ok: false; readonly code: 'not_a_number' }
  | { readonly ok: false; readonly code: 'below_min'; readonly min: number }
  | { readonly ok: false; readonly code: 'above_max'; readonly max: number }
  | { readonly ok: false; readonly code: 'invalid_step'; readonly step: number }
  | { readonly ok: false; readonly code: 'exceeds_stock'; readonly available: number }

/** Résultat de la validation d'une longueur : acceptée, ou refusée pour une seule raison. */
export type MeasureValidation = { readonly ok: true } | MeasureError
