import { randomBytes } from 'node:crypto'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import sharp from 'sharp'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import type { PhotoManifest } from '@shop-pagne/types'
import { renderWebp } from '../src/process'
import { processPhotos } from '../src/run'

let root = ''
let sourceDir = ''
let outDir = ''
let manifestPath = ''

beforeEach(() => {
  root = mkdtempSync(join(tmpdir(), 'photos-test-'))
  sourceDir = join(root, 'originaux')
  outDir = join(root, 'sortie')
  manifestPath = join(root, 'manifest.json')
  mkdirSync(sourceDir)
})

afterEach(() => {
  rmSync(root, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 })
})

/** Lance le traitement sur les dossiers temporaires du test. */
const run = (options?: Parameters<typeof processPhotos>[0]['options']) =>
  processPhotos({ sourceDir, outDir, manifestPath, options })

/** Image lisse mais texturée (du bruit agrandi), proche d'une vraie photo de tissu. */
const textured = (width: number, height: number) =>
  sharp(randomBytes(150 * 100 * 3), { raw: { width: 150, height: 100, channels: 3 } }).resize(width, height, {
    kernel: 'cubic',
  })

/** Image unie sur fond blanc avec un grand rectangle de couleur au centre. */
async function colored(rgb: [number, number, number], width = 400, height = 400): Promise<Buffer> {
  const inner = await sharp({ create: { width: width / 2, height: height / 2, channels: 3, background: { r: rgb[0], g: rgb[1], b: rgb[2] } } })
    .png()
    .toBuffer()

  return sharp({ create: { width, height, channels: 3, background: '#ffffff' } })
    .composite([{ input: inner, gravity: 'centre' }])
    .jpeg()
    .toBuffer()
}

const readManifest = (): PhotoManifest => JSON.parse(readFileSync(manifestPath, 'utf8')) as PhotoManifest

describe('renderWebp', () => {
  it('[PHO-2] réduit au plus grand côté demandé en gardant les proportions', async () => {
    const source = await textured(4000, 3000).jpeg().toBuffer()
    const card = await renderWebp(source, 800, 150_000, 50)

    expect([card.width, card.height]).toEqual([800, 600])
  })

  it('[PHO-3] n’agrandit jamais une petite image', async () => {
    const source = await textured(500, 400).jpeg().toBuffer()
    const card = await renderWebp(source, 800, 150_000, 50)

    expect([card.width, card.height]).toEqual([500, 400])
  })

  it('[PHO-R2] applique l’orientation EXIF avant de redimensionner', async () => {
    const source = await sharp({ create: { width: 400, height: 200, channels: 3, background: '#3355aa' } })
      .withMetadata({ orientation: 6 })
      .jpeg()
      .toBuffer()
    const rendered = await renderWebp(source, 800, 150_000, 50)

    expect([rendered.width, rendered.height]).toEqual([200, 400])
  })

  it('[PHO-R4] baisse la qualité jusqu’à respecter le poids demandé', async () => {
    const source = await textured(1600, 1200).jpeg({ quality: 95 }).toBuffer()
    const generous = await renderWebp(source, 1600, 5_000_000, 50)
    const tight = await renderWebp(source, 1600, Math.floor(generous.data.length / 2), 50)

    expect(tight.quality).toBeLessThan(generous.quality)
    expect(tight.data.length).toBeLessThan(generous.data.length)
  })

  it('[PHO-R4] ne descend pas sous la qualité plancher et le signale', async () => {
    const source = await sharp(randomBytes(1200 * 900 * 3), { raw: { width: 1200, height: 900, channels: 3 } }).jpeg().toBuffer()
    const rendered = await renderWebp(source, 1200, 10_000, 50)

    expect(rendered.quality).toBe(50)
    expect(rendered.withinBudget).toBe(false)
  })

  it('[PHO-4] ne conserve aucune métadonnée (position GPS, appareil)', async () => {
    const source = await textured(600, 400)
      .withExif({ IFD0: { Make: 'TelephoneSecret', Model: 'ModeleX' }, IFD3: { GPSLatitudeRef: 'N', GPSLongitudeRef: 'W' } })
      .jpeg()
      .toBuffer()
    const rendered = await renderWebp(source, 800, 150_000, 50)

    expect((await sharp(source).metadata()).exif).toBeDefined()
    expect((await sharp(rendered.data).metadata()).exif).toBeUndefined()
    const bytes = Buffer.from(rendered.data)
    expect(bytes.includes('TelephoneSecret')).toBe(false)
    expect(bytes.includes('ModeleX')).toBe(false)
  })
})

describe('processPhotos : formats et fichiers', () => {
  it('[PHO-1] traite le JPEG, le PNG et le WebP, et signale les autres fichiers', async () => {
    writeFileSync(join(sourceDir, 'a.jpg'), await textured(600, 400).jpeg().toBuffer())
    writeFileSync(join(sourceDir, 'b.png'), await textured(600, 400).png().toBuffer())
    writeFileSync(join(sourceDir, 'c.webp'), await textured(600, 400).webp().toBuffer())
    writeFileSync(join(sourceDir, 'notes.txt'), 'bonjour')
    writeFileSync(join(sourceDir, 'd.gif'), await textured(100, 100).gif().toBuffer())

    const result = await run()

    expect([...result.processed].sort()).toEqual(['a', 'b', 'c'])
    expect(result.warnings.map((w) => w.file).sort()).toEqual(['d.gif', 'notes.txt'])
    expect(result.warnings.every((w) => w.reason.length > 0)).toBe(true)
  })

  it('[PHO-1] ne signale pas le fichier LISEZ-MOI.txt du dossier des originaux', async () => {
    writeFileSync(join(sourceDir, 'LISEZ-MOI.txt'), 'consignes')

    expect((await run()).warnings).toEqual([])
  })

  it('[PHO-R2] produit une photo de carte et une photo de détail par photo', async () => {
    writeFileSync(join(sourceDir, 'Tissu Bleu (2).JPG'), await textured(4000, 3000).jpeg().toBuffer())

    await run()

    expect(readdirSync(outDir).sort()).toEqual(['tissu-bleu-2-zoom.webp', 'tissu-bleu-2.webp'])
    // Lecture en mémoire : sous Windows, sharp garderait le fichier ouvert et bloquerait le nettoyage du test.
    const card = await sharp(readFileSync(join(outDir, 'tissu-bleu-2.webp'))).metadata()
    const zoom = await sharp(readFileSync(join(outDir, 'tissu-bleu-2-zoom.webp'))).metadata()
    expect([card.width, card.height]).toEqual([800, 600])
    expect([zoom.width, zoom.height]).toEqual([1600, 1200])
  })

  it('[PHO-5] respecte les budgets de poids de la carte et du détail', async () => {
    writeFileSync(join(sourceDir, 'detail.jpg'), await textured(4000, 3000).jpeg({ quality: 95 }).toBuffer())

    const result = await run()

    expect(statSync(join(outDir, 'detail.webp')).size).toBeLessThan(150_000)
    expect(statSync(join(outDir, 'detail-zoom.webp')).size).toBeLessThan(400_000)
    expect(result.warnings).toEqual([])
  })

  it('[PHO-R4] signale une photo qui dépasse le budget même à la qualité plancher', async () => {
    writeFileSync(
      join(sourceDir, 'bruit.jpg'),
      await sharp(randomBytes(1200 * 900 * 3), { raw: { width: 1200, height: 900, channels: 3 } }).jpeg().toBuffer(),
    )

    const result = await run()

    expect(result.warnings.some((w) => w.file === 'bruit.jpg' && w.reason.includes('budget'))).toBe(true)
    expect(existsSync(join(outDir, 'bruit.webp'))).toBe(true)
  })

  it('[PHO-R11] n’écrit que dans le dossier de sortie et le manifeste, même avec des noms piégés', async () => {
    writeFileSync(join(sourceDir, '..-..-evil.jpg'), await textured(300, 200).jpeg().toBuffer())
    writeFileSync(join(sourceDir, 'a b.jpg'), await textured(300, 200).jpeg().toBuffer())

    await run()

    expect(readdirSync(root).sort()).toEqual(['manifest.json', 'originaux', 'sortie'])
    expect(readdirSync(outDir).every((name) => /^[a-z0-9-]+(-zoom)?\.webp$/.test(name))).toBe(true)
  })

  it('traite un dossier vide et crée un manifeste vide', async () => {
    const result = await run()

    expect(result.processed).toEqual([])
    expect(readManifest()).toEqual({ version: 1, photos: [] })
  })
})

describe('processPhotos : couleur et manifeste', () => {
  it('[PHO-7] déduit Bleu d’une photo bleue sur fond blanc', async () => {
    writeFileSync(join(sourceDir, 'bleu.jpg'), await colored([30, 80, 170]))

    await run()

    expect(readManifest().photos[0]).toMatchObject({ id: 'bleu', color: 'Bleu', colorSource: 'auto' })
  })

  it('[PHO-8] déduit la couleur de chaque photo', async () => {
    const colors: ReadonlyArray<readonly [string, [number, number, number], string]> = [
      ['rouge', [200, 40, 50], 'Rouge'],
      ['vert', [40, 140, 80], 'Vert'],
      ['jaune', [240, 210, 50], 'Jaune'],
      ['noir', [20, 20, 20], 'Noir'],
      ['violet', [120, 60, 160], 'Violet'],
    ]
    for (const [name, rgb] of colors) writeFileSync(join(sourceDir, `${name}.jpg`), await colored(rgb))

    await run()

    const byId = Object.fromEntries(readManifest().photos.map((p) => [p.id, p.color]))
    expect(byId).toEqual({ jaune: 'Jaune', noir: 'Noir', rouge: 'Rouge', vert: 'Vert', violet: 'Violet' })
  })

  it('[PHO-9] conserve une couleur corrigée à la main quand la photo est retraitée', async () => {
    writeFileSync(join(sourceDir, 'a.jpg'), await colored([30, 80, 170]))
    await run()

    const manifest = readManifest()
    writeFileSync(
      manifestPath,
      JSON.stringify({ ...manifest, photos: manifest.photos.map((p) => ({ ...p, color: 'Rouge', colorSource: 'manual' })) }),
    )
    writeFileSync(join(sourceDir, 'a.jpg'), await colored([30, 80, 170], 420, 420))

    const result = await run()

    expect(result.processed).toEqual(['a'])
    expect(readManifest().photos[0]).toMatchObject({ color: 'Rouge', colorSource: 'manual' })
  })

  it('[PHO-10] ne retraite pas une photo inchangée', async () => {
    writeFileSync(join(sourceDir, 'a.jpg'), await colored([30, 80, 170]))
    await run()
    const before = statSync(join(outDir, 'a.webp')).mtimeMs

    const second = await run()

    expect(second.processed).toEqual([])
    expect(second.unchanged).toEqual(['a'])
    expect(statSync(join(outDir, 'a.webp')).mtimeMs).toBe(before)
  })

  it('[PHO-10] retraite une photo dont les fichiers produits ont disparu', async () => {
    writeFileSync(join(sourceDir, 'a.jpg'), await colored([30, 80, 170]))
    await run()
    rmSync(join(outDir, 'a-zoom.webp'))

    expect((await run()).processed).toEqual(['a'])
    expect(existsSync(join(outDir, 'a-zoom.webp'))).toBe(true)
  })

  it('retire du manifeste et du dossier de sortie une photo supprimée des originaux', async () => {
    writeFileSync(join(sourceDir, 'a.jpg'), await colored([30, 80, 170]))
    writeFileSync(join(sourceDir, 'b.jpg'), await colored([200, 40, 50]))
    await run()
    rmSync(join(sourceDir, 'b.jpg'))

    const result = await run()

    expect(result.removed).toEqual(['b'])
    expect(readManifest().photos.map((p) => p.id)).toEqual(['a'])
    expect(readdirSync(outDir).sort()).toEqual(['a-zoom.webp', 'a.webp'])
  })

  it('[PHO-R11] ignore un identifiant suspect du manifeste au moment du nettoyage', async () => {
    writeFileSync(join(root, 'precieux.txt'), 'à ne jamais supprimer')
    writeFileSync(
      manifestPath,
      JSON.stringify({
        version: 1,
        photos: [{ id: '../precieux', sourceFile: 'x.jpg', sourceHash: 'h', color: 'Bleu', colorSource: 'auto', width: 1, height: 1, cardBytes: 1, zoomBytes: 1 }],
      }),
    )

    await run()

    expect(existsSync(join(root, 'precieux.txt'))).toBe(true)
  })

  it('repart d’un manifeste vide quand le précédent est illisible', async () => {
    writeFileSync(manifestPath, '{ pas du json')
    writeFileSync(join(sourceDir, 'a.jpg'), await colored([30, 80, 170]))

    const result = await run()

    expect(result.processed).toEqual(['a'])
    expect(readManifest().photos).toHaveLength(1)
  })

  it('renseigne dimensions, poids et empreinte de chaque photo', async () => {
    writeFileSync(join(sourceDir, 'a.jpg'), await textured(1000, 500).jpeg().toBuffer())

    await run()

    const entry = readManifest().photos[0]
    expect(entry).toMatchObject({ id: 'a', sourceFile: 'a.jpg', width: 800, height: 400 })
    expect(entry?.cardBytes).toBe(statSync(join(outDir, 'a.webp')).size)
    expect(entry?.zoomBytes).toBe(statSync(join(outDir, 'a-zoom.webp')).size)
    expect(entry?.sourceHash).toMatch(/^[a-f0-9]{64}$/)
  })
})
