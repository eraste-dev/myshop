import { demoDesignResponse } from '@shop-pagne/mocks'

/** `GET /api/designs/:id` : fiche d'un dessin de démonstration avec tous ses coloris. */
export default defineEventHandler(async (event) => {
  await applyMockScenario(event)

  const response = demoDesignResponse(getRouterParam(event, 'id') ?? '')
  setResponseStatus(event, response.status)
  return response.body
})
