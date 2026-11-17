/** Réponses de l'API simulée : statut et corps, en fonctions pures (voir spec 003). */
import { parseCatalogQuery } from '@shop-pagne/shared'
import type { ApiResult, CatalogPage, Design, Shop } from '@shop-pagne/types'
import { demoGetDesign, demoListCatalog } from './demo'
import { DEMO_SHOP } from './fixtures/shop'

/** Paramètres de requête tels que reçus : textes, listes de textes, ou absents. */
type RawQuery = Readonly<Record<string, string | readonly string[] | undefined>>

/**
 * Répond à `GET /api/shop`.
 *
 * @returns Toujours 200, avec la boutique de démonstration.
 */
export function demoShopResponse(): ApiResult<Shop> {
  return { status: 200, body: DEMO_SHOP }
}

/**
 * Répond à `GET /api/catalog` : valide la requête, puis liste le catalogue de démonstration.
 *
 * @param rawQuery - Paramètres de requête bruts.
 * @returns 200 avec la page demandée, ou 400 avec la liste des champs fautifs.
 */
export function demoCatalogResponse(rawQuery: RawQuery): ApiResult<CatalogPage> {
  const parsed = parseCatalogQuery(rawQuery)

  return parsed.ok
    ? { status: 200, body: demoListCatalog(parsed.value) }
    : { status: 400, body: { error: 'invalid_query', issues: parsed.issues } }
}

/**
 * Répond à `GET /api/designs/:id`.
 *
 * @param id - Identifiant du dessin demandé.
 * @returns 200 avec la fiche du dessin, ou 404 s'il n'existe pas.
 */
export function demoDesignResponse(id: string): ApiResult<Design> {
  const design = demoGetDesign(id)

  return design === undefined ? { status: 404, body: { error: 'not_found' } } : { status: 200, body: design }
}
