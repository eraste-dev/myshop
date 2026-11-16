import { describe, expect, it, vi } from 'vitest'
import type { Fetcher, Shop } from '@shop-pagne/types'
import { ApiError } from '../app/api/errors'
import { createShopApi } from '../app/api/shop'
import { DEFAULT_SHOP_NAME, resolveShopView } from '../app/utils/shop-view'

const shop: Shop = {
  id: 'shop-demo',
  slug: 'boutique-demo',
  name: 'Maison Test',
  tagline: 'Des pagnes choisis',
  currency: 'XOF',
  whatsappNumber: '+2250700000000',
  theme: { accent: '#112233', accentContrast: '#ffffff' },
}

describe('createShopApi', () => {
  it('[LAY-1] appelle /api/shop et renvoie la boutique', async () => {
    const fetcher = vi.fn().mockResolvedValue(shop) as unknown as Fetcher & ReturnType<typeof vi.fn>

    await expect(createShopApi(fetcher).getShop()).resolves.toBe(shop)
    expect(fetcher).toHaveBeenCalledWith('/api/shop')
  })

  it('[LAY-15] transforme une panne en erreur normalisée, sans détail technique', async () => {
    const api = createShopApi(() => Promise.reject({ status: 500, message: 'ECONNREFUSED 10.0.0.5' }))

    const error = await api.getShop().catch((e: unknown) => e)

    expect(error).toBeInstanceOf(ApiError)
    expect(error).toMatchObject({ kind: 'server', status: 500 })
    expect((error as ApiError).userMessage).not.toContain('ECONNREFUSED')
  })
})

describe('resolveShopView', () => {
  it('[LAY-3] reprend le nom, l’accroche et le numéro de la boutique', () => {
    expect(resolveShopView(shop)).toMatchObject({
      name: 'Maison Test',
      tagline: 'Des pagnes choisis',
      whatsapp: 'https://wa.me/2250700000000?text=Bonjour%2C%20j%E2%80%99ai%20une%20question%20sur%20vos%20pagnes.',
    })
  })

  it('[LAY-2] calcule le style du thème de la boutique', () => {
    expect(resolveShopView(shop).themeStyle).toEqual({
      '--color-accent': '#112233',
      '--color-accent-contrast': '#ffffff',
    })
  })

  it('[LAY-12] n’affiche pas de lien WhatsApp quand le numéro est invalide', () => {
    expect(resolveShopView({ ...shop, whatsappNumber: '+22' }).whatsapp).toBeNull()
  })

  it('[LAY-15] retombe sur le nom par défaut quand la boutique est absente', () => {
    for (const missing of [null, undefined]) {
      expect(resolveShopView(missing)).toEqual({
        name: DEFAULT_SHOP_NAME,
        tagline: '',
        whatsapp: null,
        themeStyle: {},
      })
    }
    expect(DEFAULT_SHOP_NAME).toBe('Boutique de pagnes')
  })

  it('[LAY-2] ne modifie pas la boutique reçue', () => {
    const frozen = Object.freeze({ ...shop, theme: Object.freeze({ ...shop.theme }) })

    expect(() => resolveShopView(frozen)).not.toThrow()
  })
})
