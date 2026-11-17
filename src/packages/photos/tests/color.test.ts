import { describe, expect, it } from 'vitest'
import { dominantColorName, nearestColorName } from '../src/color'

/** Fabrique un tampon de pixels RVB à partir de couples (couleur, nombre de pixels). */
function pixels(...groups: ReadonlyArray<readonly [readonly [number, number, number], number]>): Uint8Array {
  return Uint8Array.from(groups.flatMap(([rgb, count]) => Array.from({ length: count }, () => [...rgb]).flat()))
}

describe('nearestColorName', () => {
  it.each([
    [[35, 90, 180], 'Bleu'],
    [[200, 40, 50], 'Rouge'],
    [[40, 140, 80], 'Vert'],
    [[235, 125, 40], 'Orange'],
    [[240, 210, 50], 'Jaune'],
    [[225, 100, 150], 'Rose'],
    [[20, 20, 20], 'Noir'],
    [[100, 60, 25], 'Marron'],
    [[120, 60, 160], 'Violet'],
  ] as const)('[PHO-8] reconnaît %j comme %s', (rgb, name) => {
    expect(nearestColorName(rgb)).toBe(name)
  })
})

describe('dominantColorName', () => {
  it('[PHO-7] ignore le fond blanc : une photo bleue sur fond blanc donne Bleu', () => {
    expect(dominantColorName(pixels([[30, 80, 170], 70], [[255, 255, 255], 30]))).toBe('Bleu')
  })

  it('[PHO-7] ignore aussi un fond presque blanc', () => {
    expect(dominantColorName(pixels([[200, 40, 50], 40], [[245, 242, 240], 60]))).toBe('Rouge')
  })

  it('[PHO-8] retient la couleur la plus fréquente parmi plusieurs', () => {
    expect(dominantColorName(pixels([[40, 140, 80], 50], [[240, 210, 50], 30], [[200, 40, 50], 20]))).toBe('Vert')
  })

  it('[PHO-8] reconnaît un tissu noir, les pixels sombres n’étant pas du fond', () => {
    expect(dominantColorName(pixels([[20, 20, 20], 80], [[240, 210, 50], 20]))).toBe('Noir')
  })

  it('[PHO-8] reconnaît le violet', () => {
    expect(dominantColorName(pixels([[120, 60, 160], 90]))).toBe('Violet')
  })

  it('[PHO-R6] renvoie null quand tous les pixels sont du fond blanc ou qu’il n’y a aucun pixel', () => {
    expect(dominantColorName(pixels([[255, 255, 255], 50]))).toBeNull()
    expect(dominantColorName(new Uint8Array(0))).toBeNull()
  })

  it('[PHO-R6] départage les égalités de façon stable', () => {
    const first = dominantColorName(pixels([[30, 80, 170], 10], [[200, 40, 50], 10]))

    expect(first).toBe(dominantColorName(pixels([[200, 40, 50], 10], [[30, 80, 170], 10])))
  })
})
