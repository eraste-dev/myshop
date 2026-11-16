import type { Shop } from '@shop-pagne/shared'

/** Boutique de démonstration. Pas de marque pour l'instant : nom et numéro sont fictifs. */
export const DEMO_SHOP: Shop = {
  id: 'shop-demo',
  slug: 'boutique-demo',
  name: 'Boutique de pagnes',
  tagline: 'Pagnes et wax, choisis avec soin',
  currency: 'XOF',
  whatsappNumber: '+2250700000000',
  theme: {
    accent: '#121212',
    accentContrast: '#ffffff',
  },
}
