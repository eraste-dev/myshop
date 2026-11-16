import { describe, expect, it, vi } from 'vitest'
import type { CatalogPage, Design, Fetcher } from '@shop-pagne/types'
import { ApiError, createCatalogApi, toApiError, toQueryParams } from '../app/api/catalog'

const emptyPage: CatalogPage = { items: [], facets: [], total: 0, nextCursor: null }

describe('toQueryParams', () => {
  it('[MOC-5] ne produit aucun paramètre sans filtre', () => {
    expect(toQueryParams({})).toEqual({})
  })

  it('[MOC-7] joint les listes par des virgules', () => {
    expect(toQueryParams({ color: ['Bleu', 'Rouge'], length: [2, 6] })).toEqual({
      color: 'Bleu,Rouge',
      length: '2,6',
    })
  })

  it('[MOC-6] ignore les listes vides et les valeurs absentes', () => {
    expect(toQueryParams({ color: [], style: undefined, priceMin: undefined })).toEqual({})
  })

  it('[MOC-10] convertit les prix et la limite en texte, en gardant le zéro', () => {
    expect(toQueryParams({ priceMin: 0, priceMax: 30000, limit: 24 })).toEqual({
      priceMin: '0',
      priceMax: '30000',
      limit: '24',
    })
  })

  it('[MOC-11] n’envoie availableOnly que lorsqu’il est actif', () => {
    expect(toQueryParams({ availableOnly: true })).toEqual({ availableOnly: 'true' })
    expect(toQueryParams({ availableOnly: false })).toEqual({})
  })

  it('[MOC-12] transmet le tri et le curseur', () => {
    expect(toQueryParams({ sort: 'price-asc', cursor: 'c12' })).toEqual({ sort: 'price-asc', cursor: 'c12' })
  })

  it('ne modifie pas les filtres reçus', () => {
    const filters = Object.freeze({ color: Object.freeze(['Bleu']) })

    expect(() => toQueryParams(filters)).not.toThrow()
  })
})

describe('createCatalogApi', () => {
  it('[MOC-5] appelle /api/catalog avec les paramètres et renvoie la page', async () => {
    const fetcher = vi.fn().mockResolvedValue(emptyPage) as unknown as Fetcher & ReturnType<typeof vi.fn>
    const api = createCatalogApi(fetcher)

    const page = await api.list({ color: ['Bleu'], sort: 'new' })

    expect(page).toBe(emptyPage)
    expect(fetcher).toHaveBeenCalledWith('/api/catalog', { query: { color: 'Bleu', sort: 'new' } })
  })

  it('[MOC-17] appelle /api/designs/:id en encodant l’identifiant', async () => {
    const design = { id: 'a b' } as Design
    const fetcher = vi.fn().mockResolvedValue(design) as unknown as Fetcher & ReturnType<typeof vi.fn>
    const api = createCatalogApi(fetcher)

    await expect(api.getDesign('a b')).resolves.toBe(design)
    expect(fetcher).toHaveBeenCalledWith('/api/designs/a%20b')
  })

  it('[MOC-18] transforme une réponse 404 en erreur « not_found » avec un message en français', async () => {
    const api = createCatalogApi(() => Promise.reject({ status: 404 }))

    const error = await api.getDesign('x').catch((e: unknown) => e)

    expect(error).toBeInstanceOf(ApiError)
    expect(error).toMatchObject({ kind: 'not_found', status: 404 })
    expect((error as ApiError).userMessage).toBe('Ce produit n’existe pas ou n’est plus disponible.')
  })

  it('[MOC-16] transforme une réponse 400 en erreur « invalid_query »', async () => {
    const api = createCatalogApi(() => Promise.reject({ response: { status: 400 } }))

    await expect(api.list({})).rejects.toMatchObject({ kind: 'invalid_query', status: 400 })
  })

  it('[MOC-19] transforme une réponse 500 en erreur « server »', async () => {
    const api = createCatalogApi(() => Promise.reject({ statusCode: 500 }))

    await expect(api.list({})).rejects.toMatchObject({ kind: 'server', status: 500 })
  })
})

describe('toApiError', () => {
  it('[MOC-19] traite une erreur sans statut comme un problème de réseau', () => {
    const error = toApiError(new Error('fetch failed'))

    expect(error).toMatchObject({ kind: 'network', status: null })
    expect(error.userMessage).toBe('Connexion impossible. Vérifiez votre réseau et réessayez.')
  })

  it('[MOC-19] ne laisse jamais fuiter le détail technique dans le message affiché', () => {
    const error = toApiError({ status: 500, message: 'ECONNREFUSED 10.0.0.5:5432', stack: 'secret' })

    expect(error.userMessage).not.toContain('ECONNREFUSED')
    expect(error.userMessage).not.toContain('10.0.0.5')
  })

  it('renvoie telle quelle une ApiError déjà construite', () => {
    const original = new ApiError('server', 500)

    expect(toApiError(original)).toBe(original)
  })

  it('traite une valeur quelconque comme un problème de réseau', () => {
    expect(toApiError('oups')).toMatchObject({ kind: 'network' })
    expect(toApiError(null)).toMatchObject({ kind: 'network' })
  })
})
