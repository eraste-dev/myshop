/** Fusion et écriture du manifeste des photos (voir spec 006, PHO-R6 et PHO-R7). */
import type { PhotoEntry, PhotoManifest } from '@shop-pagne/types'

/**
 * Fusionne les photos qui viennent d'être traitées avec le manifeste précédent.
 * Une couleur corrigée à la main (`manual`) est conservée ; tout le reste vient du nouveau traitement.
 * Les photos qui ne sont plus dans le dossier disparaissent du manifeste. Ne modifie pas ses entrées.
 *
 * @param previous - Manifeste précédent, ou `null` s'il n'y en a pas.
 * @param fresh - Photos présentes dans le dossier, avec leur couleur déduite.
 * @returns Le nouveau manifeste, trié par identifiant.
 */
export function mergeManifest(previous: PhotoManifest | null, fresh: readonly PhotoEntry[]): PhotoManifest {
  const manual = new Map(
    (previous?.photos ?? []).filter((photo) => photo.colorSource === 'manual').map((photo) => [photo.id, photo]),
  )

  const photos = fresh
    .map((photo): PhotoEntry => {
      const kept = manual.get(photo.id)
      return kept === undefined ? { ...photo } : { ...photo, color: kept.color, colorSource: 'manual' }
    })
    .sort((a, b) => a.id.localeCompare(b.id))

  return { version: 1, photos }
}

/**
 * Écrit un manifeste en JSON stable : indenté de deux espaces, terminé par un saut de ligne,
 * pour que ses modifications restent lisibles dans l'historique git.
 *
 * @param manifest - Manifeste à écrire.
 * @returns Le texte JSON.
 */
export function serializeManifest(manifest: PhotoManifest): string {
  return `${JSON.stringify(manifest, null, 2)}\n`
}
