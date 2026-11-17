import { createShopApi } from '~/api/shop'
import { resolveShopView } from '~/utils/shop-view'
import type { Fetcher, ShopView } from '@shop-pagne/types'

/**
 * Donne les informations de la boutique, partagées par toutes les pages (chargées une seule fois par requête).
 * Si l'API échoue, l'enveloppe reste utilisable avec des valeurs par défaut : l'échec ne bloque jamais l'affichage.
 *
 * @returns La vue de la boutique, mise à jour quand les données arrivent.
 */
export async function useShop(): Promise<ComputedRef<ShopView>> {
  const { data } = await useAsyncData('shop', () => createShopApi($fetch as unknown as Fetcher).getShop(), {
    default: () => null,
  }).catch(() => ({ data: ref(null) }))

  return computed(() => resolveShopView(data.value))
}
