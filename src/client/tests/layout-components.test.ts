// @vitest-environment happy-dom
import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import MobileMenu from '../app/components/layout/MobileMenu.vue'
import ShopShell from '../app/components/layout/ShopShell.vue'
import SiteFooter from '../app/components/layout/SiteFooter.vue'
import SiteHeader from '../app/components/layout/SiteHeader.vue'
import { FOOTER_LINKS, NAV_ITEMS } from '../app/utils/navigation'

const NuxtLink = {
  props: { to: { type: String, required: true } },
  template: '<a :href="to"><slot /></a>',
}
const stubs = { NuxtLink }

afterEach(() => {
  document.body.innerHTML = ''
})

describe('SiteHeader', () => {
  const mountHeader = (props: Record<string, unknown> = {}) =>
    mount(SiteHeader, {
      props: { shopName: 'Maison Test', cartCount: 0, menuOpen: false, ...props },
      global: { stubs },
    })

  it('[LAY-3] affiche le nom de la boutique en lien vers l’accueil', () => {
    const home = mountHeader().find('a[href="/"]')

    expect(home.text()).toBe('Maison Test')
  })

  it('[LAY-4] libelle le bouton de menu et annonce son état', async () => {
    const closed = mountHeader()
    const button = closed.get('button[aria-controls="menu-principal"]')

    expect(button.attributes('aria-label')).toBe('Ouvrir le menu')
    expect(button.attributes('aria-expanded')).toBe('false')
    expect(mountHeader({ menuOpen: true }).get('button[aria-controls="menu-principal"]').attributes('aria-expanded')).toBe('true')

    await button.trigger('click')
    expect(closed.emitted('update:menuOpen')?.[0]).toEqual([true])
  })

  it.each([
    [0, null, 'Panier, vide'],
    [1, '1', 'Panier, 1 article'],
    [3, '3', 'Panier, 3 articles'],
    [120, '99+', 'Panier, 120 articles'],
  ])('[LAY-5] affiche un panier à %i article(s)', (count, badge, label) => {
    const cart = mountHeader({ cartCount: count }).get('a[href="/panier"]')

    expect(cart.attributes('aria-label')).toBe(label)
    expect(cart.find('[data-testid="cart-badge"]').exists()).toBe(badge !== null)
    if (badge !== null) expect(cart.get('[data-testid="cart-badge"]').text()).toBe(badge)
  })

  it('[LAY-9] envoie vers la recherche avec le texte nettoyé', async () => {
    const header = mountHeader()
    const form = header.get('form[role="search"]')

    await form.get('input').setValue('  wax bleu ')
    await form.trigger('submit')

    expect(header.emitted('search')?.[0]).toEqual(['/catalogue?q=wax%20bleu'])
  })

  it('[LAY-10] n’envoie rien pour une recherche vide', async () => {
    const header = mountHeader()
    const form = header.get('form[role="search"]')

    await form.get('input').setValue('   ')
    await form.trigger('submit')

    expect(header.emitted('search')).toBeUndefined()
  })

  it('[LAY-9] libelle le champ de recherche', () => {
    const input = mountHeader().get('form[role="search"] input')

    expect(input.attributes('aria-label')).toBe('Rechercher')
  })

  it('[LAY-9] libelle les icônes sans texte et masque les icônes décoratives', () => {
    const icons = mountHeader().findAll('svg')

    expect(icons.length).toBeGreaterThan(0)
    for (const icon of icons) expect(icon.attributes('aria-hidden')).toBe('true')
  })
})

describe('MobileMenu', () => {
  /** Monte le menu puis attend que le dialogue, téléporté dans `body`, soit rendu. */
  const mountMenu = async (open = true) => {
    const menu = mount(MobileMenu, {
      props: { open, items: NAV_ITEMS },
      global: { stubs },
      attachTo: document.body,
    })
    await flushPromises()
    return menu
  }

  it('[LAY-6] liste les cinq entrées avec les bonnes adresses', async () => {
    await mountMenu()
    const links = [...document.body.querySelectorAll('nav[aria-label="Menu principal"] a')]

    expect(links.map((a) => [a.textContent?.trim(), a.getAttribute('href')])).toEqual(
      NAV_ITEMS.map((item) => [item.label, item.to]),
    )
  })

  it('[LAY-6] expose le dialogue sous l’identifiant visé par le bouton de menu', async () => {
    await mountMenu()

    expect(document.getElementById('menu-principal')).not.toBeNull()
  })

  it('[LAY-6] contient un champ de recherche', async () => {
    await mountMenu()

    expect(document.body.querySelector('form[role="search"] input')).not.toBeNull()
  })

  it('[LAY-8] se ferme quand on choisit une entrée', async () => {
    const menu = await mountMenu()
    const link = document.body.querySelector('nav[aria-label="Menu principal"] a') as HTMLElement

    link.click()
    await menu.vm.$nextTick()

    expect(menu.emitted('update:open')?.at(-1)).toEqual([false])
  })

  it('[LAY-8] se ferme avec le bouton de fermeture, libellé en français', async () => {
    const menu = await mountMenu()
    const close = document.body.querySelector('button[aria-label="Fermer le menu"]') as HTMLElement

    expect(close).not.toBeNull()
    close.click()
    await menu.vm.$nextTick()

    expect(menu.emitted('update:open')?.at(-1)).toEqual([false])
  })

  it('[LAY-7] se ferme avec la touche Échap', async () => {
    const menu = await mountMenu()

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await menu.vm.$nextTick()

    expect(menu.emitted('update:open')?.at(-1)).toEqual([false])
  })

  it('[LAY-6] n’affiche rien tant qu’il est fermé', async () => {
    await mountMenu(false)

    expect(document.getElementById('menu-principal')).toBeNull()
  })
})

describe('SiteFooter', () => {
  const mountFooter = (props: Record<string, unknown> = {}) =>
    mount(SiteFooter, {
      props: {
        shopName: 'Maison Test',
        tagline: 'Des pagnes choisis',
        whatsapp: 'https://wa.me/2250700000000',
        year: 2026,
        links: FOOTER_LINKS,
        ...props,
      },
      global: { stubs },
    })

  it('[LAY-13] affiche les quatre liens du pied de page', () => {
    const links = mountFooter().findAll('nav[aria-label="Informations"] a')

    expect(links.map((a) => [a.text(), a.attributes('href')])).toEqual(FOOTER_LINKS.map((l) => [l.label, l.to]))
  })

  it('[LAY-13] affiche le nom, l’accroche et le droit d’auteur', () => {
    const footer = mountFooter()

    expect(footer.text()).toContain('Maison Test')
    expect(footer.text()).toContain('Des pagnes choisis')
    expect(footer.text()).toContain('© 2026 Maison Test')
  })

  it('[LAY-13] propose WhatsApp dans un nouvel onglet, sans fuite de la page d’origine', () => {
    const link = mountFooter().get('a[href^="https://wa.me/"]')

    expect(link.attributes('target')).toBe('_blank')
    expect(link.attributes('rel')).toBe('noopener noreferrer')
    expect(link.text()).toContain('WhatsApp')
  })

  it('[LAY-12] n’affiche pas WhatsApp sans lien', () => {
    expect(mountFooter({ whatsapp: null }).find('a[href^="https://wa.me/"]').exists()).toBe(false)
  })
})

describe('ShopShell', () => {
  const mountShell = (props: Record<string, unknown> = {}) =>
    mount(ShopShell, {
      props: {
        shopName: 'Maison Test',
        tagline: 'Des pagnes choisis',
        whatsapp: 'https://wa.me/2250700000000',
        themeStyle: { '--color-accent': '#112233' },
        cartCount: 0,
        year: 2026,
        ...props,
      },
      slots: { default: '<p>Contenu de la page</p>' },
      global: { stubs },
      attachTo: document.body,
    })

  it('[LAY-14] expose les repères header, nav, main et footer', () => {
    const shell = mountShell()

    expect(shell.find('header').exists()).toBe(true)
    expect(shell.find('nav').exists()).toBe(true)
    expect(shell.find('main#contenu').exists()).toBe(true)
    expect(shell.find('footer').exists()).toBe(true)
    expect(shell.get('main').text()).toContain('Contenu de la page')
  })

  it('[LAY-14] place le lien d’évitement avant tout autre lien', () => {
    const firstLink = mountShell().get('a')

    expect(firstLink.attributes('href')).toBe('#contenu')
    expect(firstLink.text()).toBe('Aller au contenu')
  })

  it('[LAY-2] applique le thème de la boutique en variables CSS', () => {
    const style = mountShell().element.getAttribute('style') ?? ''

    expect(style).toContain('--color-accent: #112233')
  })

  it('[LAY-15] s’affiche avec le nom par défaut et sans WhatsApp quand la boutique est inconnue', () => {
    const shell = mountShell({ shopName: 'Boutique de pagnes', tagline: '', whatsapp: null, themeStyle: {} })

    expect(shell.get('header a[href="/"]').text()).toBe('Boutique de pagnes')
    expect(shell.find('a[href^="https://wa.me/"]').exists()).toBe(false)
  })

  it('[LAY-4] ouvre le menu depuis le bouton de l’en-tête', async () => {
    const shell = mountShell()

    await shell.get('button[aria-controls="menu-principal"]').trigger('click')

    expect(document.getElementById('menu-principal')).not.toBeNull()
  })
})
