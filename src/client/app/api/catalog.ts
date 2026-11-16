/** Client du catalogue : la seule porte de la vitrine vers les données du catalogue. */
import type { CatalogApi, CatalogFilters, CatalogPage, Design, Fetcher } from '@shop-pagne/types'
import { toApiError } from './errors'

export { ApiError, toApiError } from './errors'

/** Filtres dont la valeur est une liste, envoyée en paramètre séparé par des virgules. */
const LIST_KEYS = ['range', 'color', 'style', 'finish', 'length'] as const

/** Filtres dont la valeur est unique. */
const VALUE_KEYS = ['priceMin', 'priceMax', 'sort', 'cursor', 'limit'] as const

/**
 * Traduit les filtres de l'interface en paramètres d'adresse.
 * N'envoie rien pour ce qui est vide ou inactif ; ne modifie pas l'entrée.
 *
 * @param filters - Filtres, tri et pagination demandés.
 * @returns Les paramètres de requête, tous sous forme de texte.
 */
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

/**
 * Crée le client du catalogue.
 * Toute erreur d'appel est convertie en `ApiError`, avec un message en français sans détail technique.
 *
 * @param fetcher - Fonction d'appel HTTP (`$fetch` en production, une fausse fonction dans les tests).
 * @returns Le client du catalogue.
 */
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
