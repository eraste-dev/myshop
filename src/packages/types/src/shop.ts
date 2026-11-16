/** Types de la boutique : identité, thème et vue prête à afficher. */

/** Valeurs de thème d'une boutique, appliquées en variables CSS sur l'enveloppe de la page. */
export interface ShopTheme {
  /** Couleur d'accent (boutons, liens mis en avant), au format hexadécimal. */
  readonly accent: string
  /** Couleur du texte posé sur l'accent, au format hexadécimal. */
  readonly accentContrast: string
}

/** Une boutique de la plateforme. */
export interface Shop {
  /** Identifiant unique de la boutique. */
  readonly id: string
  /** Identifiant lisible utilisé dans les adresses (minuscules, chiffres et tirets). */
  readonly slug: string
  /** Nom affiché dans l'en-tête et le pied de page. */
  readonly name: string
  /** Phrase d'accroche affichée dans le pied de page. */
  readonly tagline: string
  /** Devise de la boutique. Seul le franc CFA est géré pour l'instant. */
  readonly currency: 'XOF'
  /** Numéro WhatsApp de la boutique, au format international (ex. `+2250700000000`). */
  readonly whatsappNumber: string
  /** Thème visuel de la boutique. */
  readonly theme: ShopTheme
}

/** Ce dont l'enveloppe de la page a besoin, prêt à afficher. */
export interface ShopView {
  /** Nom de la boutique, ou le nom par défaut si la boutique est inconnue. */
  readonly name: string
  /** Accroche de la boutique, vide si inconnue. */
  readonly tagline: string
  /** Lien WhatsApp complet, ou `null` quand la boutique n'a pas de numéro valide. */
  readonly whatsapp: string | null
  /** Variables CSS du thème, déjà filtrées : seules les couleurs valides y figurent. */
  readonly themeStyle: Readonly<Record<string, string>>
}
