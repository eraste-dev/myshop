/** Paramètres de requête gardés après filtrage : textes, ou listes de textes. */
type RawQuery = Record<string, string | string[]>

/**
 * Ne garde de la requête que les valeurs textuelles (ou listes de textes), à valider ensuite.
 *
 * @param query - Paramètres de requête tels que lus par le serveur.
 * @returns Une copie contenant uniquement les valeurs textuelles.
 */
export function toRawQuery(query: Record<string, unknown>): RawQuery {
  const raw: RawQuery = {}

  for (const [key, value] of Object.entries(query)) {
    if (typeof value === 'string') {
      raw[key] = value
    } else if (Array.isArray(value) && value.every((item) => typeof item === 'string')) {
      raw[key] = value as string[]
    }
  }

  return raw
}
