import { demoCatalogResponse } from '@shop-pagne/mocks'

export default defineEventHandler(async (event) => {
  await applyMockScenario(event)

  const response = demoCatalogResponse(toRawQuery(getQuery(event)))
  setResponseStatus(event, response.status)
  return response.body
})
