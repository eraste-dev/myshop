/** Normalisation des erreurs d'appel à l'API : un type, un statut et un message prêt à afficher. */
import type { ApiErrorKind } from '@shop-pagne/types'

/** Message en français affiché à la cliente pour chaque catégorie d'erreur, sans détail technique. */
const MESSAGES: Readonly<Record<ApiErrorKind, string>> = {
  not_found: 'Ce produit n’existe pas ou n’est plus disponible.',
  invalid_query: 'La recherche contient des filtres invalides.',
  server: 'Un problème est survenu de notre côté. Réessayez dans un instant.',
  network: 'Connexion impossible. Vérifiez votre réseau et réessayez.',
}

/**
 * Erreur d'API normalisée.
 *
 * Porte la catégorie de l'erreur, le statut HTTP éventuel et un message destiné à la cliente.
 * Le message technique d'origine n'est jamais conservé.
 */
export class ApiError extends Error {
  /** Catégorie de l'erreur. */
  readonly kind: ApiErrorKind

  /** Statut HTTP reçu, ou `null` quand l'appel n'a pas abouti (réseau). */
  readonly status: number | null

  /** Message en français destiné à la cliente, sans détail technique. */
  readonly userMessage: string

  /**
   * @param kind - Catégorie de l'erreur.
   * @param status - Statut HTTP reçu, ou `null`.
   */
  constructor(kind: ApiErrorKind, status: number | null) {
    super(`API ${kind}${status === null ? '' : ` (${status})`}`)
    this.name = 'ApiError'
    this.kind = kind
    this.status = status
    this.userMessage = MESSAGES[kind]
  }
}

/** Lit le statut HTTP d'une erreur d'appel, quelle que soit la bibliothèque qui l'a produite. */
function readStatus(error: unknown): number | null {
  if (typeof error !== 'object' || error === null) return null

  const candidate = error as { status?: unknown; statusCode?: unknown; response?: { status?: unknown } }
  const status = candidate.status ?? candidate.statusCode ?? candidate.response?.status

  return typeof status === 'number' ? status : null
}

/** Associe un statut HTTP à une catégorie d'erreur ; l'absence de statut signale un problème de réseau. */
function kindFor(status: number | null): ApiErrorKind {
  if (status === null) return 'network'
  if (status === 404) return 'not_found'
  if (status === 400) return 'invalid_query'
  return 'server'
}

/**
 * Convertit n'importe quelle erreur d'appel en `ApiError`, sans laisser fuiter de détail technique.
 *
 * @param error - Erreur attrapée, de n'importe quel type.
 * @returns L'erreur telle quelle si c'est déjà une `ApiError`, sinon une `ApiError` correspondante.
 */
export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error

  const status = readStatus(error)
  return new ApiError(kindFor(status), status)
}
