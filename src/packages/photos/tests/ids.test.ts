import { describe, expect, it } from 'vitest'
import { assignPhotoIds, photoIdFromFilename } from '../src/ids'

describe('photoIdFromFilename', () => {
  it('[PHO-6] met en minuscules, retire l’extension et remplace les séparateurs par des tirets', () => {
    expect(photoIdFromFilename('Tissu Bleu (2).JPG')).toBe('tissu-bleu-2')
  })

  it('[PHO-6] retire les accents', () => {
    expect(photoIdFromFilename('pagne été.png')).toBe('pagne-ete')
    expect(photoIdFromFilename('Cœur de Bassam.webp')).toBe('coeur-de-bassam')
  })

  it('[PHO-6] ne garde que des minuscules, des chiffres et des tirets', () => {
    expect(photoIdFromFilename('a_b  c--d!!e.jpeg')).toBe('a-b-c-d-e')
    expect(photoIdFromFilename('../../etc/passwd.jpg')).toMatch(/^[a-z0-9-]+$/)
  })

  it('[PHO-R11] n’admet jamais de séparateur de chemin dans l’identifiant', () => {
    for (const name of ['../x.jpg', 'a/b.jpg', 'a\\b.jpg', '..\\..\\c.png']) {
      expect(photoIdFromFilename(name)).not.toMatch(/[./\\]/)
    }
  })

  it('[PHO-6] donne un identifiant par défaut quand le nom ne contient aucun caractère exploitable', () => {
    expect(photoIdFromFilename('???.jpg')).toBe('photo')
    expect(photoIdFromFilename('.jpg')).toBe('photo')
  })

  it('[PHO-6] ne retire que la dernière extension', () => {
    expect(photoIdFromFilename('pagne.v2.final.jpg')).toBe('pagne-v2-final')
  })
})

describe('assignPhotoIds', () => {
  it('[PHO-6] garde des identifiants uniques en ajoutant -2, -3 aux doublons, dans l’ordre reçu', () => {
    expect(assignPhotoIds(['A.jpg', 'a.jpeg', 'a.png'])).toEqual(['a', 'a-2', 'a-3'])
  })

  it('[PHO-6] ne confond pas un suffixe ajouté avec un identifiant existant', () => {
    expect(assignPhotoIds(['a.jpg', 'a.png', 'a-2.jpg'])).toEqual(['a', 'a-2', 'a-2-2'])
  })

  it('[PHO-6] renvoie un identifiant par fichier, dans le même ordre', () => {
    expect(assignPhotoIds(['Tissu Bleu (2).JPG', 'pagne été.png'])).toEqual(['tissu-bleu-2', 'pagne-ete'])
    expect(assignPhotoIds([])).toEqual([])
  })
})
