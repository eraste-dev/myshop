/** Traitement du dossier des photos d'origine : images produites et manifeste (voir spec 006). */
import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import type { PhotoEntry, PhotoManifest, PhotosConfig, PhotosRunResult, PhotoWarning } from '@shop-pagne/types'
import { assignPhotoIds } from './ids'
import { mergeManifest, serializeManifest } from './manifest'
import { colorOfPhoto, DEFAULT_PHOTO_OPTIONS, renderWebp } from './process'

/** Formats d'entrée acceptés (voir spec 006, PHO-R1). */
const ACCEPTED_FORMAT = /\.(jpe?g|png|webp)$/i

/** Fichier de consignes du dossier des originaux : jamais signalé. */
const INSTRUCTIONS_FILE = 'LISEZ-MOI.txt'

/** Forme d'un identifiant de photo valide : la seule qu'on accepte de transformer en nom de fichier à supprimer. */
const SAFE_ID = /^[a-z0-9-]+$/

/** Couleur retenue quand aucune couleur ne peut être déduite d'une photo. */
const FALLBACK_COLOR = 'Noir'

/** Empreinte SHA-256 d'un contenu, en hexadécimal. */
const sha256 = (content: Buffer): string => createHash('sha256').update(content).digest('hex')

/** Nom du fichier de la photo de carte d'un identifiant. */
const cardFile = (id: string): string => `${id}.webp`

/** Nom du fichier de la photo de détail d'un identifiant. */
const zoomFile = (id: string): string => `${id}-zoom.webp`

/** Lit le manifeste précédent ; un fichier absent, illisible ou de forme inattendue donne `null`. */
function readPreviousManifest(path: string): PhotoManifest | null {
  try {
    const parsed: unknown = JSON.parse(readFileSync(path, 'utf8'))
    const candidate = parsed as { version?: unknown; photos?: unknown }
    return candidate.version === 1 && Array.isArray(candidate.photos) ? (parsed as PhotoManifest) : null
  } catch {
    return null
  }
}

/** Liste les fichiers du dossier des originaux : ceux qu'on traite, et ceux qu'on signale. */
function listSource(sourceDir: string): { readonly accepted: readonly string[]; readonly warnings: readonly PhotoWarning[] } {
  const names = readdirSync(sourceDir)
    .filter((name) => !name.startsWith('.') && name !== INSTRUCTIONS_FILE)
    .filter((name) => statSync(join(sourceDir, name)).isFile())
    .sort((a, b) => a.localeCompare(b, 'fr'))

  return {
    accepted: names.filter((name) => ACCEPTED_FORMAT.test(name)),
    warnings: names
      .filter((name) => !ACCEPTED_FORMAT.test(name))
      .map((file) => ({ file, reason: 'Format non pris en charge (JPEG, PNG et WebP uniquement), fichier ignoré.' })),
  }
}

/** Indique si les deux fichiers produits d'une photo existent. */
const outputsExist = (outDir: string, id: string): boolean =>
  existsSync(join(outDir, cardFile(id))) && existsSync(join(outDir, zoomFile(id)))

/** Rédige l'avertissement d'une photo dont le poids dépasse le budget même à la qualité minimale. */
function budgetWarning(file: string, kind: string, bytes: number, maxBytes: number): PhotoWarning {
  const kb = (value: number): number => Math.round(value / 1000)
  return { file, reason: `Photo de ${kind} hors budget de poids (${kb(bytes)} Ko pour ${kb(maxBytes)} Ko), qualité minimale atteinte.` }
}

/**
 * Traite toutes les photos du dossier des originaux. Pour chacune : une photo de carte et une photo de détail
 * en WebP, la couleur dominante, et une entrée dans le manifeste. Une photo inchangée (même empreinte, fichiers
 * produits présents) n'est pas retraitée ; une photo disparue est retirée du manifeste et du dossier de sortie.
 * Le traitement ne lit que le dossier des originaux et n'écrit que dans le dossier de sortie et le manifeste.
 * Voir spec 006, PHO-R1 à PHO-R11.
 *
 * @param config - Dossiers, chemin du manifeste et réglages de compression.
 * @returns Le bilan : manifeste obtenu, photos traitées, inchangées, retirées, et avertissements.
 */
export async function processPhotos(config: PhotosConfig): Promise<PhotosRunResult> {
  const options = config.options ?? DEFAULT_PHOTO_OPTIONS
  const previous = readPreviousManifest(config.manifestPath)
  const { accepted, warnings: sourceWarnings } = listSource(config.sourceDir)
  const ids = assignPhotoIds(accepted)
  const warnings: PhotoWarning[] = [...sourceWarnings]
  const entries: PhotoEntry[] = []
  const processed: string[] = []
  const unchanged: string[] = []

  mkdirSync(config.outDir, { recursive: true })

  for (const [index, sourceFile] of accepted.entries()) {
    const id = ids[index] as string
    const content = readFileSync(join(config.sourceDir, sourceFile))
    const sourceHash = sha256(content)
    const known = previous?.photos.find((photo) => photo.id === id)

    if (known !== undefined && known.sourceHash === sourceHash && outputsExist(config.outDir, id)) {
      entries.push({ ...known, sourceFile })
      unchanged.push(id)
      continue
    }

    const card = await renderWebp(content, options.cardMaxSide, options.cardMaxBytes, options.minQuality)
    const zoom = await renderWebp(content, options.zoomMaxSide, options.zoomMaxBytes, options.minQuality)
    writeFileSync(join(config.outDir, cardFile(id)), card.data)
    writeFileSync(join(config.outDir, zoomFile(id)), zoom.data)

    const color = await colorOfPhoto(content)
    if (color === null) warnings.push({ file: sourceFile, reason: 'Couleur non déterminée (photo presque blanche) : Noir par défaut, à corriger dans le manifeste.' })
    if (!card.withinBudget) warnings.push(budgetWarning(sourceFile, 'carte', card.data.length, options.cardMaxBytes))
    if (!zoom.withinBudget) warnings.push(budgetWarning(sourceFile, 'détail', zoom.data.length, options.zoomMaxBytes))

    entries.push({
      id,
      sourceFile,
      sourceHash,
      color: color ?? FALLBACK_COLOR,
      colorSource: 'auto',
      width: card.width,
      height: card.height,
      cardBytes: card.data.length,
      zoomBytes: zoom.data.length,
    })
    processed.push(id)
  }

  const removed: string[] = []
  for (const stale of (previous?.photos ?? []).filter((photo) => !ids.includes(photo.id))) {
    if (!SAFE_ID.test(stale.id)) {
      warnings.push({ file: stale.id, reason: 'Identifiant suspect dans le manifeste : fichiers non supprimés.' })
      continue
    }
    rmSync(join(config.outDir, cardFile(stale.id)), { force: true })
    rmSync(join(config.outDir, zoomFile(stale.id)), { force: true })
    removed.push(stale.id)
  }

  const manifest = mergeManifest(previous, entries)
  mkdirSync(dirname(config.manifestPath), { recursive: true })
  writeFileSync(config.manifestPath, serializeManifest(manifest))

  return { manifest, processed, unchanged, removed, warnings }
}
