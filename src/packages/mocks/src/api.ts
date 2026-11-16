import { parseCatalogQuery } from '@shop-pagne/shared'
import type { CatalogPage, Design, QueryIssue } from '@shop-pagne/shared'
import { demoGetDesign, demoListCatalog } from './demo'

/** Réponse HTTP simulée : un statut et un corps, sans dépendre d'un serveur. */
export type ApiResult<T> =
  | { readonly status: 200; readonly body: T }
  | { readonly status: 400; readonly body: { readonly error: 'invalid_query'; readonly issues: readonly QueryIssue[] } }
  | { readonly status: 404; readonly body: { readonly error: 'not_found' } }

type RawQuery = Readonly<Record<string, string | readonly string[] | undefined>>

/** `GET /api/catalog` : valide la requête puis liste le catalogue de démonstration. */
export function demoCatalogResponse(rawQuery: RawQuery): ApiResult<CatalogPage> {
  const parsed = parseCatalogQuery(rawQuery)

  return parsed.ok
    ? { status: 200, body: demoListCatalog(parsed.value) }
    : { status: 400, body: { error: 'invalid_query', issues: parsed.issues } }
}

/** `GET /api/designs/:id` : fiche d'un dessin, ou 404 s'il n'existe pas. */
export function demoDesignResponse(id: string): ApiResult<Design> {
  const design = demoGetDesign(id)

  return design === undefined ? { status: 404, body: { error: 'not_found' } } : { status: 200, body: design }
}
