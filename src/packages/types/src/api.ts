/** Types des échanges avec l'API : réponses, erreurs et accès aux données. */

import type { CatalogFilters } from './catalog-query'
import type { CatalogPage, Design } from './catalog'
import type { QueryIssue } from './catalog-query'
import type { Shop } from './shop'

/** Réponse HTTP simulée par les mocks : un statut et un corps, sans dépendre d'un serveur. */
export type ApiResult<T> =
  | { readonly status: 200; readonly body: T }
  | { readonly status: 400; readonly body: { readonly error: 'invalid_query'; readonly issues: readonly QueryIssue[] } }
  | { readonly status: 404; readonly body: { readonly error: 'not_found' } }

/** Catégorie d'une erreur d'appel à l'API, après normalisation. */
export type ApiErrorKind = 'not_found' | 'invalid_query' | 'server' | 'network'

/** Appel HTTP injectable : `$fetch` en production, une fausse fonction dans les tests. */
export type Fetcher = <T>(url: string, options?: { query?: Record<string, string> }) => Promise<T>

/** La seule porte de la vitrine vers les données du catalogue. */
export interface CatalogApi {
  /**
   * Liste une page du catalogue.
   * @param filters - Filtres, tri et pagination demandés.
   */
  list(filters: CatalogFilters): Promise<CatalogPage>

  /**
   * Charge la fiche d'un dessin avec tous ses coloris.
   * @param id - Identifiant du dessin.
   */
  getDesign(id: string): Promise<Design>
}

/** Accès aux informations de la boutique courante. */
export interface ShopApi {
  /** Charge la boutique courante. */
  getShop(): Promise<Shop>
}
