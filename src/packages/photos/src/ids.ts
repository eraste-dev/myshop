/** Identifiants des photos, dérivés de leurs noms de fichier (voir spec 006, PHO-R5 et PHO-R11). */

/** Identifiant donné à une photo dont le nom ne contient aucun caractère exploitable. */
const DEFAULT_ID = 'photo'

/**
 * Dérive un identifiant du nom d'un fichier : minuscules, accents retirés, extension retirée,
 * tout ce qui n'est pas une lettre ou un chiffre remplacé par un tiret.
 * L'identifiant ne contient jamais de séparateur de chemin, il ne peut donc pas servir à sortir d'un dossier.
 *
 * @param filename - Nom du fichier d'origine, avec son extension.
 * @returns Un identifiant de lettres minuscules, chiffres et tirets ; `photo` si rien n'est exploitable.
 */
export function photoIdFromFilename(filename: string): string {
  const slug = filename
    .replace(/\.[^./\\]+$/, '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/œ/g, 'oe')
    .replace(/æ/g, 'ae')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  return slug === '' ? DEFAULT_ID : slug
}

/**
 * Attribue un identifiant unique à chaque fichier, dans l'ordre reçu : un doublon reçoit le suffixe
 * `-2`, `-3`, etc. Un suffixe ajouté n'entre jamais en collision avec un identifiant déjà pris.
 *
 * @param filenames - Noms de fichiers, dans un ordre stable (par exemple alphabétique).
 * @returns Un identifiant par fichier, dans le même ordre.
 */
export function assignPhotoIds(filenames: readonly string[]): readonly string[] {
  const taken = new Set<string>()

  return filenames.map((filename) => {
    const base = photoIdFromFilename(filename)
    let candidate = base
    for (let suffix = 2; taken.has(candidate); suffix += 1) {
      candidate = `${base}-${suffix}`
    }
    taken.add(candidate)
    return candidate
  })
}
