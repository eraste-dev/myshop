/**
 * Donne le nombre d'articles du panier, affiché dans l'en-tête.
 *
 * Renvoie toujours 0 tant que le panier n'existe pas : la spec du panier remplacera cette valeur par le
 * vrai compteur sans changer l'en-tête (voir spec 004, LAY-R6).
 *
 * @returns Le nombre d'articles, en lecture seule.
 */
export function useCartCount(): Readonly<Ref<number>> {
  return readonly(ref(0))
}
