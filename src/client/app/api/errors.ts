export type ApiErrorKind = 'not_found' | 'invalid_query' | 'server' | 'network'

const MESSAGES: Readonly<Record<ApiErrorKind, string>> = {
  not_found: 'Ce produit n’existe pas ou n’est plus disponible.',
  invalid_query: 'La recherche contient des filtres invalides.',
  server: 'Un problème est survenu de notre côté. Réessayez dans un instant.',
  network: 'Connexion impossible. Vérifiez votre réseau et réessayez.',
}

/** Erreur d'API normalisée : un type, un statut HTTP éventuel et un message prêt à afficher. */
export class ApiError extends Error {
  readonly kind: ApiErrorKind
  readonly status: number | null
  /** Message en français destiné à la cliente, sans détail technique. */
  readonly userMessage: string

  constructor(kind: ApiErrorKind, status: number | null) {
    super(`API ${kind}${status === null ? '' : ` (${status})`}`)
    this.name = 'ApiError'
    this.kind = kind
    this.status = status
    this.userMessage = MESSAGES[kind]
  }
}

function readStatus(error: unknown): number | null {
  if (typeof error !== 'object' || error === null) return null

  const candidate = error as { status?: unknown; statusCode?: unknown; response?: { status?: unknown } }
  const status = candidate.status ?? candidate.statusCode ?? candidate.response?.status

  return typeof status === 'number' ? status : null
}

function kindFor(status: number | null): ApiErrorKind {
  if (status === null) return 'network'
  if (status === 404) return 'not_found'
  if (status === 400) return 'invalid_query'
  return 'server'
}

/** Convertit n'importe quelle erreur d'appel en `ApiError`, sans laisser fuiter de détail technique. */
export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error

  const status = readStatus(error)
  return new ApiError(kindFor(status), status)
}
