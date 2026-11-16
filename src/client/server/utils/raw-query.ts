type RawQuery = Record<string, string | string[]>

/** Ne garde de la requête que les valeurs textuelles (ou listes de textes), à valider ensuite. */
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
