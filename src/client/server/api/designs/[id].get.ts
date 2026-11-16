import { demoDesignResponse } from '@shop-pagne/mocks'

export default defineEventHandler(async (event) => {
  await applyMockScenario(event)

  const response = demoDesignResponse(getRouterParam(event, 'id') ?? '')
  setResponseStatus(event, response.status)
  return response.body
})
