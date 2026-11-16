import { readdirSync, readFileSync, statSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const here = dirname(fileURLToPath(import.meta.url))
const appDir = resolve(here, '../app')
const tokensPath = resolve(here, '../../packages/design/tokens.css')

function listFiles(dir: string): readonly string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name)
    return statSync(full).isDirectory() ? listFiles(full) : [full]
  })
}

const SOURCE_EXTENSIONS = ['.vue', '.ts', '.css']
const HARDCODED_COLOR = /#[0-9a-fA-F]{3,8}\b|\brgba?\(|\bhsla?\(/

describe('socle de la vitrine', () => {
  it('[CLI-4] ne contient aucune couleur écrite en dur dans app/', () => {
    const offenders = listFiles(appDir)
      .filter((file) => SOURCE_EXTENSIONS.some((ext) => file.endsWith(ext)))
      .filter((file) => HARDCODED_COLOR.test(readFileSync(file, 'utf8')))

    expect(offenders).toEqual([])
  })

  it('[CLI-7] définit les jetons de base dans tokens.css', () => {
    const tokens = readFileSync(tokensPath, 'utf8')
    const required = [
      '--color-surface',
      '--color-ink',
      '--color-line',
      '--color-accent',
      '--font-display',
      '--font-sans',
    ]

    for (const name of required) {
      expect(tokens, `jeton manquant : ${name}`).toContain(`${name}:`)
    }
  })

  it('[CLI-R3] charge les polices depuis des paquets locaux, pas depuis un service tiers', () => {
    const css = readFileSync(join(appDir, 'assets/css/main.css'), 'utf8')

    expect(css).toContain('@fontsource-variable/newsreader')
    expect(css).toContain('@fontsource-variable/jost')
    expect(css).not.toMatch(/fonts\.googleapis\.com|fonts\.gstatic\.com/)
  })

  it('[CLI-6] déclare la langue française et un lien d’évitement', () => {
    const config = readFileSync(resolve(here, '../nuxt.config.ts'), 'utf8')
    const layout = readFileSync(join(appDir, 'layouts/default.vue'), 'utf8')

    expect(config).toMatch(/lang:\s*'fr'/)
    expect(layout).toContain('href="#contenu"')
    expect(layout).toContain('id="contenu"')
  })
})
