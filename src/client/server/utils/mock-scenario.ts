import { parseScenario, scenarioEffect } from '@shop-pagne/mocks'
import type { H3Event } from 'h3'

/** Attend un délai, en millisecondes. */
const wait = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * Applique le scénario de démonstration demandé (`?scenario=error` ou `?scenario=slow`).
 * Tout le dossier `server/api` est une simulation : il disparaît quand le vrai backend arrive.
 *
 * @param event - Requête en cours.
 * @throws Une erreur 500 quand le scénario `error` est demandé.
 */
export async function applyMockScenario(event: H3Event): Promise<void> {
  const { delayMs, shouldFail } = scenarioEffect(parseScenario(getQuery(event).scenario))

  if (delayMs > 0) await wait(delayMs)
  if (shouldFail) throw createError({ statusCode: 500, statusMessage: 'Panne simulée' })
}
