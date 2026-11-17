/**
 * Scénarios de démonstration : simulent une panne ou une réponse lente pour valider
 * les états d'erreur et de chargement des écrans. Réservés au mode démonstration.
 */
import type { Scenario, ScenarioEffect } from '@shop-pagne/types'

/** Délai de réponse simulé par le scénario `slow`, en millisecondes. */
export const SLOW_DELAY_MS = 1500

/** Prend la première valeur quand un paramètre de requête est répété. */
function firstValue(raw: unknown): unknown {
  return Array.isArray(raw) ? raw[0] : raw
}

/**
 * Lit le paramètre `scenario` d'une requête.
 *
 * @param raw - Valeur brute du paramètre.
 * @returns `error` ou `slow` si demandés ; `normal` pour toute valeur absente ou inconnue.
 */
export function parseScenario(raw: unknown): Scenario {
  const value = firstValue(raw)
  return value === 'error' || value === 'slow' ? value : 'normal'
}

/**
 * Traduit un scénario en effet sur la réponse.
 *
 * @param scenario - Scénario demandé.
 * @returns Le délai d'attente à appliquer et l'indication d'échec.
 */
export function scenarioEffect(scenario: Scenario): ScenarioEffect {
  switch (scenario) {
    case 'error':
      return { delayMs: 0, shouldFail: true }
    case 'slow':
      return { delayMs: SLOW_DELAY_MS, shouldFail: false }
    default:
      return { delayMs: 0, shouldFail: false }
  }
}
