/** Client des informations de la boutique courante. */
import type { Fetcher, Shop, ShopApi } from '@shop-pagne/types'
import { toApiError } from './errors'

/**
 * Crée le client de la boutique.
 * Toute erreur d'appel est convertie en `ApiError`, avec un message en français sans détail technique.
 *
 * @param fetcher - Fonction d'appel HTTP.
 * @returns Le client de la boutique.
 */
export function createShopApi(fetcher: Fetcher): ShopApi {
  return {
    async getShop() {
      try {
        return await fetcher<Shop>('/api/shop')
      } catch (error) {
        throw toApiError(error)
      }
    },
  }
}
