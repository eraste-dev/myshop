import type { CatalogPage, CatalogSort, Design } from '@shop-pagne/shared'
import { toApiError } from './errors'

export { ApiError, toApiError } from './errors'
export type { ApiErrorKind } from './errors'

/** Appel HTTP injectable : `$fetch` en production, une fausse fonction dans les tests. */
export type Fetcher = <T>(url: string, options?: { query?: Record<string, string> }) => Promise<T>

/** Filtres du catalogue tels que les manipule l'interface. */
export interface CatalogFilters {
  readonly range?: readonly string[]
  readonly color?: readonly string[]
  readonly style?: readonly string[]
  readonly finish?: readonly string[]
  readonly length?: readonly number[]
  readonly priceMin?: number
  readonly priceMax?: number
  readonly availableOnly?: boolean
  readonly sort?: CatalogSort
  readonly cursor?: string
  readonly limit?: number
}

/** La seule porte de la vitrine vers les données du catalogue. */
export interface CatalogApi {
  list(filters: CatalogFilters): Promise<CatalogPage>
  getDesign(id: string): Promise<Design>
}

const LIST_KEYS = ['range', 'color', 'style', 'finish', 'length'] as const
const VALUE_KEYS = ['priceMin', 'priceMax', 'sort', 'cursor', 'limit'] as const

/** Traduit les filtres en paramètres d'adresse ; n'envoie rien pour ce qui est vide ou inactif. */
export function toQueryParams(filters: CatalogFilters): Record<string, string> {
  const params: Record<string, string> = {}

  for (const key of LIST_KEYS) {
    const values = filters[key]
    if (values !== undefined && values.length > 0) params[key] = values.join(',')
  }
  for (const key of VALUE_KEYS) {
    const value = filters[key]
    if (value !== undefined) params[key] = String(value)
  }
  if (filters.availableOnly === true) params.availableOnly = 'true'

  return params
}

export function createCatalogApi(fetcher: Fetcher): CatalogApi {
  return {
    async list(filters) {
      try {
        return await fetcher<CatalogPage>('/api/catalog', { query: toQueryParams(filters) })
      } catch (error) {
        throw toApiError(error)
      }
    },
    async getDesign(id) {
      try {
        return await fetcher<Design>(`/api/designs/${encodeURIComponent(id)}`)
      } catch (error) {
        throw toApiError(error)
      }
    },
  }
}
