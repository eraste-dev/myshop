import { createCatalogApi } from '~/api/catalog'
import type { CatalogApi, Fetcher } from '@shop-pagne/types'

/**
 * Donne accès au catalogue. Les écrans passent toujours par ici, jamais par `$fetch` directement.
 *
 * @returns Le client du catalogue.
 */
export function useCatalogApi(): CatalogApi {
  return createCatalogApi($fetch as unknown as Fetcher)
}
