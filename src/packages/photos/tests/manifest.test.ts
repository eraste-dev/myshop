import { describe, expect, it } from 'vitest'
import type { PhotoEntry, PhotoManifest } from '@shop-pagne/types'
import { mergeManifest, serializeManifest } from '../src/manifest'

/** Fabrique une entrée de manifeste, en ne précisant que ce qui compte pour le test. */
function entry(id: string, overrides: Partial<PhotoEntry> = {}): PhotoEntry {
  return {
    id,
    sourceFile: `${id}.jpg`,
    sourceHash: `hash-${id}`,
    color: 'Bleu',
    colorSource: 'auto',
    width: 800,
    height: 600,
    cardBytes: 50_000,
    zoomBytes: 120_000,
    ...overrides,
  }
}

const manifest = (...photos: PhotoEntry[]): PhotoManifest => ({ version: 1, photos })

describe('mergeManifest', () => {
  it('[PHO-9] conserve une couleur corrigée à la main', () => {
    const previous = manifest(entry('a', { color: 'Rouge', colorSource: 'manual' }))
    const merged = mergeManifest(previous, [entry('a', { color: 'Bleu', colorSource: 'auto' })])

    expect(merged.photos[0]).toMatchObject({ id: 'a', color: 'Rouge', colorSource: 'manual' })
  })

  it('[PHO-9] remplace une couleur déduite par la nouvelle déduction', () => {
    const previous = manifest(entry('a', { color: 'Rouge', colorSource: 'auto' }))
    const merged = mergeManifest(previous, [entry('a', { color: 'Vert', colorSource: 'auto' })])

    expect(merged.photos[0]).toMatchObject({ color: 'Vert', colorSource: 'auto' })
  })

  it('[PHO-9] ne reporte la correction manuelle que sur la photo concernée', () => {
    const previous = manifest(entry('a', { color: 'Rouge', colorSource: 'manual' }))
    const merged = mergeManifest(previous, [entry('a'), entry('b', { color: 'Vert' })])

    expect(merged.photos.map((p) => [p.id, p.color])).toEqual([['a', 'Rouge'], ['b', 'Vert']])
  })

  it('trie les photos par identifiant et fixe la version', () => {
    const merged = mergeManifest(null, [entry('c'), entry('a'), entry('b')])

    expect(merged.version).toBe(1)
    expect(merged.photos.map((p) => p.id)).toEqual(['a', 'b', 'c'])
  })

  it('retire les photos qui ne figurent plus dans le dossier', () => {
    const previous = manifest(entry('a'), entry('gone'))
    const merged = mergeManifest(previous, [entry('a')])

    expect(merged.photos.map((p) => p.id)).toEqual(['a'])
  })

  it('accepte l’absence de manifeste précédent', () => {
    expect(mergeManifest(null, [])).toEqual({ version: 1, photos: [] })
  })

  it('ne modifie pas ses entrées', () => {
    const previous = Object.freeze(manifest(entry('a', { color: 'Rouge', colorSource: 'manual' })))
    const fresh = Object.freeze([Object.freeze(entry('a'))])

    expect(() => mergeManifest(previous, fresh)).not.toThrow()
  })
})

describe('serializeManifest', () => {
  it('produit un JSON stable, indenté, qui se termine par un saut de ligne', () => {
    const text = serializeManifest(manifest(entry('a')))

    expect(text.endsWith('\n')).toBe(true)
    expect(text.startsWith('{\n  "version": 1,')).toBe(true)
    expect(JSON.parse(text)).toEqual(manifest(entry('a')))
    expect(serializeManifest(manifest(entry('a')))).toBe(text)
  })
})
