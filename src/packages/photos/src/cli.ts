/**
 * Ligne de commande `just photos` : traite les photos de pagnes déposées dans `docs/references/pagnes`.
 *
 * Les emplacements sont fixes et ne se règlent pas par des arguments : le traitement ne lit qu'un dossier et
 * n'écrit que dans un autre, quoi qu'on lui passe (voir spec 006, PHO-R11).
 */
import { existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { processPhotos } from './run'

/** Racine du dépôt, déduite de l'emplacement de ce fichier (`src/packages/photos/src`). */
const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../../../..')

/** Dossier des photos d'origine, ignoré par git. */
const SOURCE_DIR = resolve(REPO_ROOT, 'docs/references/pagnes')

/** Dossier public où sont déposées les photos redimensionnées. */
const OUT_DIR = resolve(REPO_ROOT, 'src/client/public/demo/pagnes')

/** Manifeste lu par le catalogue de démonstration. */
const MANIFEST_PATH = resolve(REPO_ROOT, 'src/packages/mocks/src/fixtures/photos.json')

/** Affiche un message d'erreur et termine avec un code d'échec. */
function fail(message: string): never {
  process.stderr.write(`Erreur : ${message}\n`)
  process.exit(1)
}

/** Point d'entrée : refuse les arguments, traite le dossier, puis affiche le bilan en français. */
async function main(): Promise<void> {
  if (process.argv.length > 2) {
    fail('aucun argument n’est accepté. Les emplacements sont fixes (voir docs/specs/006-photos-demo).')
  }
  if (!existsSync(SOURCE_DIR)) {
    fail(`le dossier des photos est introuvable : ${SOURCE_DIR}`)
  }

  const result = await processPhotos({ sourceDir: SOURCE_DIR, outDir: OUT_DIR, manifestPath: MANIFEST_PATH })

  process.stdout.write(
    `Photos : ${result.manifest.photos.length} au total, ${result.processed.length} traitée(s), ` +
      `${result.unchanged.length} inchangée(s), ${result.removed.length} retirée(s).\n`,
  )
  for (const photo of result.manifest.photos.filter((p) => result.processed.includes(p.id))) {
    process.stdout.write(
      `  ${photo.id} : ${photo.color}, ${photo.width}×${photo.height}, ` +
        `carte ${Math.round(photo.cardBytes / 1000)} Ko, détail ${Math.round(photo.zoomBytes / 1000)} Ko\n`,
    )
  }
  for (const warning of result.warnings) {
    process.stdout.write(`  Attention, ${warning.file} : ${warning.reason}\n`)
  }
  if (result.manifest.photos.length === 0) {
    process.stdout.write('Aucune photo : le catalogue garde ses motifs générés. Déposez vos photos dans docs/references/pagnes.\n')
  }
}

main().catch((error: unknown) => fail(error instanceof Error ? error.message : 'erreur inattendue.'))
