import { demoShopResponse } from '@shop-pagne/mocks'

/** `GET /api/shop` : informations de la boutique de démonstration. */
export default defineEventHandler(async (event) => {
  await applyMockScenario(event)

  const response = demoShopResponse()
  setResponseStatus(event, response.status)
  return response.body
})
