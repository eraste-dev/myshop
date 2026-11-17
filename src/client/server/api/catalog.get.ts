import { demoCatalogResponse } from '@shop-pagne/mocks'

/** `GET /api/catalog` : liste filtrée, triée et paginée du catalogue de démonstration. */
export default defineEventHandler(async (event) => {
  await applyMockScenario(event)

  const response = demoCatalogResponse(toRawQuery(getQuery(event)))
  setResponseStatus(event, response.status)
  return response.body
})
