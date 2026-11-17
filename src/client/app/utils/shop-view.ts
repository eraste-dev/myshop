import type { Shop, ShopView } from '@shop-pagne/types'
import { shopThemeStyle } from './theme'
import { whatsappLink } from './whatsapp'

/** Nom affiché quand les informations de la boutique ne sont pas disponibles. */
export const DEFAULT_SHOP_NAME = 'Boutique de pagnes'

/** Message préparé quand une cliente écrit à la boutique sur WhatsApp. */
const WHATSAPP_GREETING = 'Bonjour, j’ai une question sur vos pagnes.'

/**
 * Prépare l'affichage de la boutique pour l'enveloppe de la page.
 * Sans boutique (API en échec), retombe sur des valeurs par défaut pour que la page reste utilisable.
 * Voir spec 004, LAY-R11.
 *
 * @param shop - La boutique, ou `null` / `undefined` si elle n'a pas pu être chargée.
 * @returns La vue de la boutique, prête à afficher.
 */
export function resolveShopView(shop: Shop | null | undefined): ShopView {
  if (shop === null || shop === undefined) {
    return { name: DEFAULT_SHOP_NAME, tagline: '', whatsapp: null, themeStyle: {} }
  }

  return {
    name: shop.name,
    tagline: shop.tagline,
    whatsapp: whatsappLink(shop.whatsappNumber, WHATSAPP_GREETING),
    themeStyle: shopThemeStyle(shop.theme),
  }
}
