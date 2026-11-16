/**
 * Scénarios de démonstration : simulent une panne ou une réponse lente pour valider
 * les états d'erreur et de chargement des écrans. Réservés au mode démonstration.
 */

export type Scenario = 'normal' | 'error' | 'slow'

export const SLOW_DELAY_MS = 1500

export interface ScenarioEffect {
  readonly delayMs: number
  readonly shouldFail: boolean
}

function firstValue(raw: unknown): unknown {
  return Array.isArray(raw) ? raw[0] : raw
}

/** Lit le paramètre `scenario` ; toute valeur absente ou inconnue donne un fonctionnement normal. */
export function parseScenario(raw: unknown): Scenario {
  const value = firstValue(raw)
  return value === 'error' || value === 'slow' ? value : 'normal'
}

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
