import { createCatalogApi } from '~/api/catalog'
import type { CatalogApi, Fetcher } from '~/api/catalog'

/** Accès au catalogue. Les écrans passent toujours par ici, jamais par `$fetch` directement. */
export function useCatalogApi(): CatalogApi {
  return createCatalogApi($fetch as unknown as Fetcher)
}
