import { describe, expect, it } from 'vitest'
import { demoCatalogResponse, demoDesignResponse } from './api'

describe('demoCatalogResponse', () => {
  it('[MOC-5] répond 200 avec la première page', () => {
    const response = demoCatalogResponse({})

    expect(response.status).toBe(200)
    expect(response.status === 200 && response.body.items.length).toBe(12)
  })

  it('[MOC-6] applique les filtres de la requête', () => {
    const response = demoCatalogResponse({ color: 'Bleu', limit: '48' })

    expect(response.status === 200 && response.body.items.every((item) => item.colorName === 'Bleu')).toBe(true)
  })

  it('[MOC-16] répond 400 quand la limite dépasse le maximum, en nommant le champ', () => {
    const response = demoCatalogResponse({ limit: '100' })

    expect(response.status).toBe(400)
    expect(response.status === 400 && response.body.issues.map((issue) => issue.field)).toEqual(['limit'])
    expect(response.status === 400 && response.body.issues[0]?.message).toContain('48')
  })

  it('[MOC-R8] répond 400 avec tous les champs fautifs', () => {
    const response = demoCatalogResponse({ sort: 'x', length: 'z' })

    expect(response.status === 400 && response.body.issues.map((issue) => issue.field).sort()).toEqual(['length', 'sort'])
  })

  it('[MOC-15] ne répète aucune carte en suivant les curseurs', () => {
    const seen: string[] = []
    let cursor: string | null = null

    do {
      const response = demoCatalogResponse(cursor === null ? { limit: '10' } : { limit: '10', cursor })
      if (response.status !== 200) throw new Error('réponse inattendue')
      seen.push(...response.body.items.map((item) => item.reference))
      cursor = response.body.nextCursor
    } while (cursor !== null)

    expect(new Set(seen).size).toBe(seen.length)
    expect(seen.length).toBeGreaterThanOrEqual(30)
  })
})

describe('demoDesignResponse', () => {
  it('[MOC-17] répond 200 avec la fiche et tous les coloris', () => {
    const response = demoDesignResponse('soleil-levant')

    expect(response.status).toBe(200)
    expect(response.status === 200 && response.body.colorways.length).toBe(3)
  })

  it('[MOC-18] répond 404 pour un identifiant inconnu', () => {
    expect(demoDesignResponse('inconnu')).toEqual({ status: 404, body: { error: 'not_found' } })
  })
})
