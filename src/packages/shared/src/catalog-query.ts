import { z } from 'zod'

export const DEFAULT_LIMIT = 12
export const MAX_LIMIT = 48
export const CATALOG_SORTS = ['new', 'price-asc', 'price-desc'] as const

export type CatalogSort = (typeof CATALOG_SORTS)[number]

/** Requête de liste du catalogue, après validation et valeurs par défaut. */
export interface CatalogQuery {
  readonly range: readonly string[]
  readonly color: readonly string[]
  readonly style: readonly string[]
  readonly finish: readonly string[]
  readonly length: readonly number[]
  readonly priceMin: number | undefined
  readonly priceMax: number | undefined
  readonly availableOnly: boolean
  readonly sort: CatalogSort
  readonly cursor: string | null
  readonly limit: number
}

export interface QueryIssue {
  readonly field: string
  readonly message: string
}

export type CatalogQueryResult =
  | { readonly ok: true; readonly value: CatalogQuery }
  | { readonly ok: false; readonly issues: readonly QueryIssue[] }

type RawParam = string | readonly string[] | undefined

function toList(value: RawParam): string[] {
  const parts = value === undefined ? [] : typeof value === 'string' ? [value] : [...value]
  return parts
    .flatMap((part) => part.split(','))
    .map((item) => item.trim())
    .filter((item) => item.length > 0)
}

const textList = z
  .union([z.string(), z.array(z.string())])
  .optional()
  .transform((value) => toList(value))

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

const wholeAmount = z
  .string()
  .regex(/^\d+$/, 'Doit être un entier positif ou nul.')
  .transform(Number)
  .optional()

const booleanFlag = z
  .enum(['true', '1', 'false', '0'])
  .optional()
  .transform((value) => value === 'true' || value === '1')

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

/** Valide et normalise les paramètres bruts d'une requête de catalogue. Ne modifie pas l'entrée. */
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
