import { describe, expect, it } from 'vitest'
import { copyrightLine, FOOTER_LINKS, NAV_ITEMS, cartCountDisplay, searchLocation } from '../app/utils/navigation'
import { shopThemeStyle } from '../app/utils/theme'
import { whatsappLink } from '../app/utils/whatsapp'

describe('whatsappLink', () => {
  it('[LAY-11] construit le lien avec les seuls chiffres du numéro et le message encodé', () => {
    expect(whatsappLink('+225 07 00 00 00 00', 'Bonjour, je cherche un pagne')).toBe(
      'https://wa.me/2250700000000?text=Bonjour%2C%20je%20cherche%20un%20pagne',
    )
  })

  it('[LAY-11] fonctionne sans message', () => {
    expect(whatsappLink('+2250700000000')).toBe('https://wa.me/2250700000000')
  })

  it('[LAY-11] encode les caractères spéciaux du message', () => {
    expect(whatsappLink('+2250700000000', 'a&b=c #1?')).toBe('https://wa.me/2250700000000?text=a%26b%3Dc%20%231%3F')
  })

  it('[LAY-12] ne produit aucun lien pour un numéro de moins de 8 chiffres', () => {
    expect(whatsappLink('+22507')).toBeNull()
    expect(whatsappLink('')).toBeNull()
    expect(whatsappLink('abc')).toBeNull()
  })

  it('[LAY-12] ne produit aucun lien pour un numéro de plus de 15 chiffres', () => {
    expect(whatsappLink('1234567890123456')).toBeNull()
  })
})

describe('shopThemeStyle', () => {
  it('[LAY-2] expose l’accent et son contraste en variables CSS', () => {
    expect(shopThemeStyle({ accent: '#121212', accentContrast: '#ffffff' })).toEqual({
      '--color-accent': '#121212',
      '--color-accent-contrast': '#ffffff',
    })
  })

  it('[LAY-2] accepte les couleurs hexadécimales de 3, 6 et 8 chiffres', () => {
    expect(shopThemeStyle({ accent: '#fff', accentContrast: '#00000080' })).toEqual({
      '--color-accent': '#fff',
      '--color-accent-contrast': '#00000080',
    })
  })

  it('[LAY-2] ignore une valeur qui n’est pas une couleur hexadécimale (injection de style)', () => {
    const style = shopThemeStyle({
      accent: 'red; background: url(https://evil.example/x)',
      accentContrast: 'expression(alert(1))',
    })

    expect(style).toEqual({})
  })

  it('[LAY-2] garde la valeur valide quand l’autre est refusée', () => {
    expect(shopThemeStyle({ accent: '#121212', accentContrast: 'javascript:alert(1)' })).toEqual({
      '--color-accent': '#121212',
    })
  })
})

describe('searchLocation', () => {
  it('[LAY-9] mène au catalogue avec le texte nettoyé et encodé', () => {
    expect(searchLocation('  wax bleu  ')).toBe('/catalogue?q=wax%20bleu')
  })

  it('[LAY-9] encode les caractères spéciaux', () => {
    expect(searchLocation('a&b=c')).toBe('/catalogue?q=a%26b%3Dc')
  })

  it('[LAY-10] ne navigue pas pour un texte vide ou fait d’espaces', () => {
    expect(searchLocation('')).toBeNull()
    expect(searchLocation('   ')).toBeNull()
  })

  it('[LAY-9] limite la longueur du texte à 100 caractères', () => {
    const location = searchLocation('x'.repeat(300)) ?? ''

    expect(decodeURIComponent(location.slice('/catalogue?q='.length))).toHaveLength(100)
  })
})

describe('cartCountDisplay', () => {
  it('[LAY-5] n’affiche pas de pastille à zéro', () => {
    expect(cartCountDisplay(0)).toEqual({ badge: null, label: 'Panier, vide' })
  })

  it('[LAY-5] affiche le nombre et accorde le libellé au singulier et au pluriel', () => {
    expect(cartCountDisplay(1)).toEqual({ badge: '1', label: 'Panier, 1 article' })
    expect(cartCountDisplay(3)).toEqual({ badge: '3', label: 'Panier, 3 articles' })
  })

  it('[LAY-5] plafonne la pastille à « 99+ » mais garde le nombre exact dans le libellé', () => {
    expect(cartCountDisplay(120)).toEqual({ badge: '99+', label: 'Panier, 120 articles' })
  })

  it('[LAY-5] traite un nombre invalide ou négatif comme un panier vide', () => {
    expect(cartCountDisplay(-2).badge).toBeNull()
    expect(cartCountDisplay(Number.NaN).badge).toBeNull()
  })
})

describe('navigation', () => {
  it('[LAY-6] propose les cinq entrées du menu avec les bonnes adresses', () => {
    expect(NAV_ITEMS.map((item) => [item.label, item.to])).toEqual([
      ['Accueil', '/'],
      ['Catalogue', '/catalogue'],
      ['Nouveautés', '/catalogue?sort=new'],
      ['À propos', '/pages/a-propos'],
      ['Contact', '/pages/contact'],
    ])
  })

  it('[LAY-13] propose les quatre liens du pied de page', () => {
    expect(FOOTER_LINKS.map((item) => [item.label, item.to])).toEqual([
      ['Livraison et retours', '/pages/livraison-et-retours'],
      ['Conditions générales de vente', '/pages/cgv'],
      ['À propos', '/pages/a-propos'],
      ['Contact', '/pages/contact'],
    ])
  })

  it('n’a pas d’adresse en double dans le menu', () => {
    const targets = NAV_ITEMS.map((item) => item.to)

    expect(new Set(targets).size).toBe(targets.length)
  })

  it('[LAY-13] écrit le droit d’auteur avec l’année et le nom de la boutique', () => {
    expect(copyrightLine('Boutique de pagnes', 2026)).toBe('© 2026 Boutique de pagnes')
  })
})
