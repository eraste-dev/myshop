/** Fonctions d'affichage des cartes du catalogue : prix, étiquettes, adresses et textes alternatifs. */
import type { Badge, CatalogItem, Xof } from '@shop-pagne/types'

/** Espace insécable : un prix ne doit jamais être coupé en fin de ligne. */
const NBSP = ' '

/** Nombre maximal d'étiquettes affichées sur une carte. */
const MAX_VISIBLE_BADGES = 2

/** Libellé affiché à la cliente pour chaque étiquette commerciale (voir spec 005, HOM-R8). */
const BADGE_LABELS: Readonly<Record<Badge, string>> = {
  new: 'Nouveauté',
  classic: 'Classique',
  'last-pieces': 'Dernières pièces',
  'online-exclusive': 'Exclusivité en ligne',
}

/** Ordre d'importance des étiquettes : quand il y en a trop, les moins importantes sont masquées. */
const BADGE_PRIORITY: readonly Badge[] = ['new', 'last-pieces', 'online-exclusive', 'classic']

/**
 * Met en forme un montant en francs CFA : espaces insécables entre les milliers, puis l'unité.
 * Le franc CFA n'a pas de centimes : le montant est arrondi à l'entier. Voir spec 005, HOM-R6.
 *
 * @param amount - Montant en francs CFA.
 * @returns Par exemple `38 000 F CFA`, ou un tiret `—` si le montant est négatif ou n'est pas un nombre fini.
 */
export function formatXof(amount: Xof): string {
  if (!Number.isFinite(amount) || amount < 0) return '—'

  const grouped = String(Math.round(amount)).replace(/\B(?=(\d{3})+(?!\d))/g, NBSP)
  return `${grouped}${NBSP}F${NBSP}CFA`
}

/**
 * Prépare le prix affiché sur une carte, selon le mode de vente du coloris. Voir spec 005, HOM-R6.
 *
 * @param item - Carte du catalogue.
 * @returns `38 000 F CFA` (prix fixe), `à partir de 10 000 F CFA` (plusieurs longueurs)
 * ou `5 000 F CFA / yard` (vente à la mesure).
 */
export function itemPriceLabel(item: CatalogItem): string {
  const price = formatXof(item.price)

  if (item.priceMode === 'from') return `à partir de ${price}`
  if (item.priceMode === 'per-unit') return `${price} / ${item.unit === 'meter' ? 'mètre' : 'yard'}`
  return price
}

/**
 * Traduit une étiquette commerciale en français.
 *
 * @param badge - Étiquette à traduire.
 * @returns Le libellé à afficher.
 */
export function badgeLabel(badge: Badge): string {
  return BADGE_LABELS[badge]
}

/**
 * Choisit les étiquettes à afficher : deux au plus, par ordre d'importance. Voir spec 005, HOM-R5.
 *
 * @param badges - Étiquettes du coloris.
 * @returns Les étiquettes retenues, dans l'ordre d'importance. L'entrée n'est pas modifiée.
 */
export function visibleBadges(badges: readonly Badge[]): readonly Badge[] {
  return BADGE_PRIORITY.filter((badge) => badges.includes(badge)).slice(0, MAX_VISIBLE_BADGES)
}

/**
 * Construit l'adresse de la fiche produit d'un coloris. Voir spec 005, HOM-R5.
 *
 * @param item - Carte du catalogue.
 * @returns `/produits/<dessin>?coloris=<coloris>`, valeurs encodées.
 */
export function productHref(item: CatalogItem): string {
  return `/produits/${encodeURIComponent(item.designId)}?coloris=${encodeURIComponent(item.colorwayId)}`
}

/**
 * Construit l'adresse du catalogue filtré sur une gamme. Voir spec 005, HOM-R4.
 *
 * @param range - Nom de la gamme (ex. `Super Wax`).
 * @returns `/catalogue?range=<gamme>`, valeur encodée.
 */
export function rangeHref(range: string): string {
  return `/catalogue?range=${encodeURIComponent(range)}`
}

/**
 * Écrit le nombre de dessins d'une gamme, accordé au singulier (zéro compris) ou au pluriel.
 *
 * @param count - Nombre de dessins.
 * @returns Par exemple `1 dessin` ou `2 dessins`.
 */
export function designCountLabel(count: number): string {
  return `${count} ${count > 1 ? 'dessins' : 'dessin'}`
}

/**
 * Rédige le texte alternatif de la photo d'un coloris. Voir spec 005, HOM-R9.
 *
 * @param item - Carte du catalogue.
 * @returns Par exemple `Super Wax PGN2101.001, Bleu`.
 */
export function itemImageAlt(item: CatalogItem): string {
  return `${item.range} ${item.reference}, ${item.colorName}`
}
