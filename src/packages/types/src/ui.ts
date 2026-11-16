/** Types de l'interface de la vitrine : navigation et éléments d'affichage. */

/** Un lien de navigation (menu ou pied de page). */
export interface NavLink {
  /** Texte du lien. */
  readonly label: string
  /** Adresse relative de destination. */
  readonly to: string
}

/** Affichage du compteur de panier dans l'en-tête. */
export interface CartCountDisplay {
  /** Texte de la pastille, ou `null` quand le panier est vide. */
  readonly badge: string | null
  /** Libellé accessible du lien vers le panier. */
  readonly label: string
}
