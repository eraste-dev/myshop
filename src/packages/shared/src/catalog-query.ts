import { z } from 'zod'
import type { CatalogQueryResult, CatalogSort } from '@shop-pagne/types'

/** Nombre de cartes par page quand la requête n'en précise pas. */
export const DEFAULT_LIMIT = 12

/** Nombre maximal de cartes par page. */
export const MAX_LIMIT = 48

/** Ordres de tri acceptés. Doit rester aligné sur le type `CatalogSort`. */
export const CATALOG_SORTS = ['new', 'price-asc', 'price-desc'] as const satisfies readonly CatalogSort[]

/** Valeur brute d'un paramètre de requête : texte, texte répété, ou absent. */
type RawParam = string | readonly string[] | undefined

/** Découpe un paramètre en liste : sépare sur les virgules, retire les espaces et les éléments vides. */
function toList(value: RawParam): string[] {
  const parts = value === undefined ? [] : typeof value === 'string' ? [value] : [...value]
  return parts
    .flatMap((part) => part.split(','))
    .map((item) => item.trim())
    .filter((item) => item.length > 0)
}

/** Paramètre listant des textes (ex. `color=Bleu,Rouge`). */
const textList = z
  .union([z.string(), z.array(z.string())])
  .optional()
  .transform((value) => toList(value))

/** Paramètre listant des nombres strictement positifs (ex. `length=2,6`). */
const positiveNumberList = z
  .union([z.string(), z.array(z.string())])
  .optional()
  .transform((value, ctx) => {
    const numbers = toList(value).map(Number)
    if (numbers.some((n) => !Number.isFinite(n) || n <= 0)) {
      ctx.addIssue({ code: 'custom', message: 'Doit être une liste de nombres positifs.' })
      return z.NEVER
    }
    return numbers
  })

/** Paramètre contenant un montant entier positif ou nul, facultatif. */
const wholeAmount = z
  .string()
  .regex(/^\d+$/, 'Doit être un entier positif ou nul.')
  .transform(Number)
  .optional()

/** Paramètre booléen : `true` ou `1` activent, `false` ou `0` désactivent, l'absence vaut `false`. */
const booleanFlag = z
  .enum(['true', '1', 'false', '0'])
  .optional()
  .transform((value) => value === 'true' || value === '1')

/** Schéma complet de la requête de catalogue, avec valeurs par défaut et règles croisées. */
const schema = z
  .object({
    range: textList,
    color: textList,
    style: textList,
    finish: textList,
    length: positiveNumberList,
    priceMin: wholeAmount,
    priceMax: wholeAmount,
    availableOnly: booleanFlag,
    sort: z.enum(CATALOG_SORTS).optional().default('new'),
    cursor: z
      .string()
      .regex(/^c\d+$/, 'Curseur invalide.')
      .optional()
      .transform((value) => value ?? null),
    limit: z
      .string()
      .regex(/^\d+$/, 'Doit être un entier positif.')
      .transform(Number)
      .pipe(
        z
          .number()
          .int()
          .min(1, 'Doit valoir au moins 1.')
          .max(MAX_LIMIT, `La limite maximale est ${MAX_LIMIT}.`),
      )
      .optional()
      .transform((value) => value ?? DEFAULT_LIMIT),
  })
  .superRefine((query, ctx) => {
    if (query.priceMin !== undefined && query.priceMax !== undefined && query.priceMin > query.priceMax) {
      ctx.addIssue({
        code: 'custom',
        path: ['priceMin'],
        message: 'Le prix minimal ne peut pas dépasser le prix maximal.',
      })
    }
  })

/**
 * Valide et normalise les paramètres bruts d'une requête de catalogue.
 * Signale tous les champs fautifs d'un coup, ignore les paramètres inconnus et ne modifie pas l'entrée.
 * Voir spec 003, MOC-R7 et MOC-R8.
 *
 * @param raw - Paramètres de requête tels que reçus (textes, ou listes de textes).
 * @returns La requête normalisée, ou la liste des champs refusés avec leur motif.
 */
export function parseCatalogQuery(raw: Readonly<Record<string, RawParam>>): CatalogQueryResult {
  const parsed = schema.safeParse(raw)

  if (parsed.success) {
    const { priceMin, priceMax } = parsed.data
    return { ok: true, value: { ...parsed.data, priceMin, priceMax } }
  }

  return {
    ok: false,
    issues: parsed.error.issues.map((issue) => ({
      field: String(issue.path[0] ?? 'query'),
      message: issue.message,
    })),
  }
}
