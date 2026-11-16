// @vitest-environment happy-dom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import type { CatalogItem, RangeTile } from '@shop-pagne/types'
import ProductCard from '../app/components/catalog/ProductCard.vue'
import ErrorNotice from '../app/components/ui/ErrorNotice.vue'
import HomeHero from '../app/components/home/HomeHero.vue'
import HomeShortcuts from '../app/components/home/HomeShortcuts.vue'
import NewArrivals from '../app/components/home/NewArrivals.vue'
import RangeTiles from '../app/components/home/RangeTiles.vue'

const NuxtLink = {
  props: { to: { type: String, required: true } },
  template: '<a :href="to"><slot /></a>',
}
const global = { stubs: { NuxtLink } }

const NBSP = ' '

const item: CatalogItem = {
  designId: 'soleil-levant',
  colorwayId: 'soleil-levant-001',
  reference: 'PGN2101.001',
  range: 'Super Wax',
  colorName: 'Bleu',
  image: '/api/patterns/soleil-levant-001.svg',
  price: 38000,
  priceMode: 'fixed',
  unit: null,
  available: true,
  badges: [],
}

describe('ProductCard', () => {
  const mountCard = (overrides: Partial<CatalogItem> = {}) =>
    mount(ProductCard, { props: { item: { ...item, ...overrides } }, global })

  it('[HOM-8] mène à la fiche du coloris, valeurs encodées', () => {
    expect(mountCard().get('a').attributes('href')).toBe('/produits/soleil-levant?coloris=soleil-levant-001')
    expect(mountCard({ designId: 'a b' }).get('a').attributes('href')).toContain('/produits/a%20b')
  })

  it('[HOM-6] affiche la gamme, la référence et le prix', () => {
    const text = mountCard().text()

    expect(text).toContain('Super Wax')
    expect(text).toContain('PGN2101.001')
    expect(text).toContain(`38${NBSP}000${NBSP}F${NBSP}CFA`)
  })

  it('[HOM-5] adapte le prix au mode de vente', () => {
    expect(mountCard({ price: 10000, priceMode: 'from' }).text()).toContain('à partir de')
    expect(mountCard({ price: 5000, priceMode: 'per-unit', unit: 'yard' }).text()).toContain('/ yard')
  })

  it('[HOM-9] décrit la photo, déclare ses dimensions et la charge à la demande', () => {
    const image = mountCard().get('img')

    expect(image.attributes('alt')).toBe('Super Wax PGN2101.001, Bleu')
    expect(image.attributes('width')).toBe('600')
    expect(image.attributes('height')).toBe('600')
    expect(image.attributes('loading')).toBe('lazy')
    expect(image.attributes('src')).toBe('/api/patterns/soleil-levant-001.svg')
  })

  it('[HOM-6] affiche deux étiquettes au plus, en français', () => {
    const card = mountCard({ badges: ['classic', 'last-pieces', 'new'] })
    const labels = card.findAll('[data-testid="badge"]').map((badge) => badge.text())

    expect(labels).toEqual(['Nouveauté', 'Dernières pièces'])
  })

  it('[HOM-6] n’affiche aucune étiquette quand il n’y en a pas', () => {
    expect(mountCard().findAll('[data-testid="badge"]')).toHaveLength(0)
  })

  it('[HOM-7] marque « Épuisé » un coloris indisponible, et pas un coloris disponible', () => {
    expect(mountCard({ available: false }).text()).toContain('Épuisé')
    expect(mountCard({ available: true }).text()).not.toContain('Épuisé')
  })

  it('[HOM-7] atténue le prix d’un coloris indisponible', () => {
    const price = mountCard({ available: false }).get('[data-testid="price"]')

    expect(price.classes()).toContain('text-ink-subtle')
  })
})

describe('HomeHero', () => {
  it('[HOM-R3] affiche deux panneaux avec leur titre et leur lien', () => {
    const hero = mount(HomeHero, { props: { images: ['/a.svg', '/b.svg'] }, global })
    const links = hero.findAll('a').map((a) => [a.attributes('aria-label'), a.attributes('href')])

    expect(hero.text()).toContain('Les nouveautés')
    expect(hero.text()).toContain('Tous les dessins')
    expect(hero.text()).toContain('Découvrir')
    expect(links).toEqual([
      ['Les nouveautés, découvrir', '/catalogue?sort=new'],
      ['Tous les dessins, découvrir', '/catalogue'],
    ])
  })

  it('[HOM-R9] charge les images du bandeau en priorité et les marque décoratives', () => {
    const images = mount(HomeHero, { props: { images: ['/a.svg', '/b.svg'] }, global }).findAll('img')

    expect(images).toHaveLength(2)
    for (const image of images) {
      expect(image.attributes('alt')).toBe('')
      expect(image.attributes('fetchpriority')).toBe('high')
      expect(image.attributes('loading')).toBe('eager')
    }
  })

  it('[HOM-3] reste utilisable sans image', () => {
    const hero = mount(HomeHero, { props: { images: [null, null] }, global })

    expect(hero.findAll('img')).toHaveLength(0)
    expect(hero.findAll('a')).toHaveLength(2)
  })

  it('[HOM-3] n’affiche que l’image disponible', () => {
    const hero = mount(HomeHero, { props: { images: ['/a.svg', null] }, global })

    expect(hero.findAll('img')).toHaveLength(1)
  })
})

describe('HomeShortcuts', () => {
  it('[HOM-R3] propose trois raccourcis vers le catalogue', () => {
    const links = mount(HomeShortcuts, { global }).findAll('a').map((a) => [a.text(), a.attributes('href')])

    expect(links).toEqual([
      ['Nouveautés', '/catalogue?sort=new'],
      ['Tous les dessins', '/catalogue'],
      ['Disponibles maintenant', '/catalogue?availableOnly=true'],
    ])
  })

  it('[HOM-R3] se présente comme une navigation libellée', () => {
    expect(mount(HomeShortcuts, { global }).get('nav').attributes('aria-label')).toBe('Raccourcis')
  })
})

describe('RangeTiles', () => {
  const tiles: readonly RangeTile[] = [
    { range: 'Java', image: '/j.svg', count: 2 },
    { range: 'Super Wax', image: '/w.svg', count: 1 },
  ]

  it('[HOM-4] fait un lien par gamme vers le catalogue filtré, valeur encodée', () => {
    const links = mount(RangeTiles, { props: { tiles }, global }).findAll('a').map((a) => a.attributes('href'))

    expect(links).toEqual(['/catalogue?range=Java', '/catalogue?range=Super%20Wax'])
  })

  it('[HOM-4] affiche le nom et le nombre de dessins, accordé au singulier et au pluriel', () => {
    const text = mount(RangeTiles, { props: { tiles }, global }).text()

    expect(text).toContain('Java')
    expect(text).toContain('2 dessins')
    expect(text).toContain('1 dessin')
    expect(text).not.toContain('1 dessins')
  })

  it('[HOM-R9] charge les photos à la demande avec un texte alternatif vide (le nom est déjà écrit)', () => {
    const image = mount(RangeTiles, { props: { tiles }, global }).get('img')

    expect(image.attributes('loading')).toBe('lazy')
    expect(image.attributes('alt')).toBe('')
  })

  it('[HOM-4] n’affiche rien sans tuile', () => {
    expect(mount(RangeTiles, { props: { tiles: [] }, global }).html()).toBe('<!--v-if-->')
  })
})

describe('NewArrivals', () => {
  it('[HOM-R5] affiche un titre de section, une carte par coloris et un lien vers tout le catalogue', () => {
    const section = mount(NewArrivals, { props: { items: [item, { ...item, colorwayId: 'x-002' }] }, global })

    expect(section.get('h2').text()).toBe('À découvrir')
    expect(section.findAll('[data-testid="product-card"]')).toHaveLength(2)
    expect(section.find('a[href="/catalogue"]').text()).toBe('Voir tout le catalogue')
  })
})

describe('ErrorNotice', () => {
  it('[HOM-10] annonce le message comme une alerte et propose de réessayer', async () => {
    const notice = mount(ErrorNotice, { props: { message: 'Le catalogue est momentanément indisponible.' } })

    expect(notice.get('[role="alert"]').text()).toContain('Le catalogue est momentanément indisponible.')

    await notice.get('button').trigger('click')
    expect(notice.get('button').text()).toBe('Réessayer')
    expect(notice.emitted('retry')).toHaveLength(1)
  })
})
