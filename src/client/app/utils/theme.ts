import type { ShopTheme } from '@shop-pagne/types'

/** Couleur hexadécimale à 3, 4, 6 ou 8 chiffres (avec ou sans transparence). */
const HEX_COLOR = /^#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/

/**
 * Calcule les variables CSS du thème d'une boutique, à poser sur l'enveloppe de la page.
 * Les valeurs viennent de la configuration de la boutique : seules les couleurs hexadécimales
 * sont acceptées, tout le reste est ignoré pour éviter une injection de style. Voir spec 004, LAY-R2.
 *
 * @param theme - Thème de la boutique.
 * @returns Les variables CSS valides ; les valeurs refusées sont simplement omises.
 */
export function shopThemeStyle(theme: ShopTheme): Record<string, string> {
  const style: Record<string, string> = {}

  if (HEX_COLOR.test(theme.accent)) style['--color-accent'] = theme.accent
  if (HEX_COLOR.test(theme.accentContrast)) style['--color-accent-contrast'] = theme.accentContrast

  return style
}
