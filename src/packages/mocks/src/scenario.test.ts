import { describe, expect, it } from 'vitest'
import { SLOW_DELAY_MS, parseScenario, scenarioEffect } from './scenario'

describe('scénarios de démonstration', () => {
  it('[MOC-19] reconnaît le scénario d’erreur', () => {
    expect(parseScenario('error')).toBe('error')
    expect(scenarioEffect('error')).toEqual({ delayMs: 0, shouldFail: true })
  })

  it('[MOC-20] reconnaît le scénario de lenteur d’environ 1,5 s', () => {
    expect(parseScenario('slow')).toBe('slow')
    expect(SLOW_DELAY_MS).toBe(1500)
    expect(scenarioEffect('slow')).toEqual({ delayMs: SLOW_DELAY_MS, shouldFail: false })
  })

  it('traite l’absence de scénario ou une valeur inconnue comme un fonctionnement normal', () => {
    for (const raw of [undefined, null, '', 'normal', 'inconnu', 42, {}]) {
      expect(parseScenario(raw)).toBe('normal')
    }
    expect(scenarioEffect('normal')).toEqual({ delayMs: 0, shouldFail: false })
  })

  it('prend la première valeur quand le paramètre est répété', () => {
    expect(parseScenario(['slow', 'error'])).toBe('slow')
  })
})
