import type { CartCountDisplay, NavLink } from '@shop-pagne/types'

/** Entrées du menu principal. Les pages `catalogue` et `pages/*` sont créées par des specs ultérieures. */
export const NAV_ITEMS: readonly NavLink[] = [
  { label: 'Accueil', to: '/' },
  { label: 'Catalogue', to: '/catalogue' },
  { label: 'Nouveautés', to: '/catalogue?sort=new' },
  { label: 'À propos', to: '/pages/a-propos' },
  { label: 'Contact', to: '/pages/contact' },
]

/** Liens du pied de page : informations pratiques et contact. */
export const FOOTER_LINKS: readonly NavLink[] = [
  { label: 'Livraison et retours', to: '/pages/livraison-et-retours' },
  { label: 'Conditions générales de vente', to: '/pages/cgv' },
  { label: 'À propos', to: '/pages/a-propos' },
  { label: 'Contact', to: '/pages/contact' },
]

/** Longueur maximale du texte d'une recherche, pour éviter des adresses démesurées. */
const SEARCH_MAX_LENGTH = 100

/** Nombre d'articles au-delà duquel la pastille du panier affiche « 99+ ». */
const BADGE_MAX = 99

/**
 * Construit l'adresse de recherche pour un texte saisi.
 * Le texte est nettoyé (espaces retirés aux extrémités), tronqué à 100 caractères et encodé. Voir spec 004, LAY-R5.
 *
 * @param term - Texte saisi par la cliente.
 * @returns L'adresse `/catalogue?q=…`, ou `null` si le texte est vide.
 */
export function searchLocation(term: string): string | null {
  const cleaned = term.trim().slice(0, SEARCH_MAX_LENGTH)
  return cleaned === '' ? null : `/catalogue?q=${encodeURIComponent(cleaned)}`
}

/**
 * Calcule l'affichage du compteur de panier. Voir spec 004, LAY-R6.
 *
 * @param count - Nombre d'articles. Une valeur invalide ou négative est traitée comme un panier vide.
 * @returns La pastille (absente à zéro, plafonnée à « 99+ ») et le libellé accessible, accordé au singulier ou au pluriel.
 */
export function cartCountDisplay(count: number): CartCountDisplay {
  const items = Number.isFinite(count) && count > 0 ? Math.floor(count) : 0

  if (items === 0) return { badge: null, label: 'Panier, vide' }

  return {
    badge: items > BADGE_MAX ? `${BADGE_MAX}+` : String(items),
    label: `Panier, ${items} ${items === 1 ? 'article' : 'articles'}`,
  }
}

/**
 * Écrit la mention de droit d'auteur du pied de page.
 *
 * @param shopName - Nom de la boutique.
 * @param year - Année à afficher.
 * @returns Par exemple `© 2026 Boutique de pagnes`.
 */
export function copyrightLine(shopName: string, year: number): string {
  return `© ${year} ${shopName}`
}
