/**
 * Tests d'architecture : ils font respecter automatiquement deux conventions du projet
 * (voir docs/specs/000-conventions.md, section « Conventions de code »).
 *
 *  - ARCH-1 : tous les types et interfaces exportés vivent dans `@shop-pagne/types`.
 *  - ARCH-2 : tout ce qui est déclaré au niveau d'un module porte un commentaire JSDoc.
 *  - ARCH-3 : chaque propriété d'une interface du paquet de types est documentée.
 *  - ARCH-4 : le script de chaque composant Vue s'ouvre par un JSDoc.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { dirname, join, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const here = dirname(fileURLToPath(import.meta.url))
/** Racine du monorepo pnpm (le dossier `src`). */
const workspace = resolve(here, '../../..')
/** Dossier des types, seul endroit autorisé pour les types et interfaces exportés. */
const typesSource = resolve(workspace, 'packages/types/src')

/** Dossiers de code applicatif à contrôler. */
const SCANNED_ROOTS = [
  resolve(workspace, 'packages/shared/src'),
  resolve(workspace, 'packages/mocks/src'),
  resolve(workspace, 'client/app'),
  resolve(workspace, 'client/server'),
  typesSource,
]

/** Dossiers générés ou tiers, jamais contrôlés. */
const IGNORED_DIRECTORIES = new Set(['node_modules', '.nuxt', '.output', 'coverage', 'dist'])

/** Liste récursivement les fichiers d'un dossier dont le nom correspond à `extension`, hors tests. */
function listFiles(directory: string, extension: RegExp): string[] {
  return readdirSync(directory).flatMap((name) => {
    if (IGNORED_DIRECTORIES.has(name)) return []
    const full = join(directory, name)
    if (statSync(full).isDirectory()) return listFiles(full, extension)
    return extension.test(name) && !name.endsWith('.test.ts') ? [full] : []
  })
}

/** Fichiers TypeScript contrôlés (ARCH-1 à ARCH-3). */
const files = SCANNED_ROOTS.flatMap((root) => listFiles(root, /\.ts$/))

/** Composants Vue de la vitrine, contrôlés par ARCH-4. */
const components = listFiles(resolve(workspace, 'client/app'), /\.vue$/)

/** Chemin lisible d'un fichier, relatif au monorepo. */
const label = (file: string): string => relative(workspace, file).split(sep).join('/')

/** Indique si la dernière ligne non vide avant `index` clôt un commentaire JSDoc. */
function hasDocBefore(lines: readonly string[], index: number): boolean {
  const previous = lines[index - 1]?.trim() ?? ''
  return previous.endsWith('*/')
}

/** Déclarations de premier niveau à documenter : fonctions, classes, types, interfaces, constantes. */
const DECLARATION =
  /^(?:export\s+)?(?:default\s+)?(?:async\s+)?(?:function|class|interface|type|enum)\s+\w+|^export\s+default\s+|^(?:export\s+)?const\s+(?:[A-Z][A-Z0-9_]+\b|\w+\s*=\s*(?:async\s*)?\()/

/** Retourne les déclarations sans JSDoc d'un fichier, sous la forme `fichier:ligne  déclaration`. */
function undocumentedDeclarations(file: string): string[] {
  const lines = readFileSync(file, 'utf8').split(/\r?\n/)
  const found: string[] = []

  lines.forEach((line, index) => {
    if (DECLARATION.test(line) && !hasDocBefore(lines, index)) {
      found.push(`${label(file)}:${index + 1}  ${line.trim().slice(0, 70)}`)
    }
  })

  return found
}

describe('architecture du code', () => {
  it('[ARCH-1] garde les types et interfaces exportés dans @shop-pagne/types', () => {
    const exportedTypes = /^export\s+(?:interface|type)\s+\w+/
    const offenders = files
      .filter((file) => !file.startsWith(typesSource))
      .flatMap((file) =>
        readFileSync(file, 'utf8')
          .split(/\r?\n/)
          .flatMap((line, index) => (exportedTypes.test(line) ? [`${label(file)}:${index + 1}  ${line.trim()}`] : [])),
      )

    expect(offenders, `Types à déplacer dans src/packages/types :\n${offenders.join('\n')}`).toEqual([])
  })

  it('[ARCH-2] documente chaque déclaration de premier niveau avec un commentaire JSDoc', () => {
    const missing = files.flatMap(undocumentedDeclarations)

    expect(missing, `Déclarations sans JSDoc :\n${missing.join('\n')}`).toEqual([])
  })

  it('[ARCH-3] documente chaque propriété des interfaces du paquet de types', () => {
    const member = /^ {2}(?:readonly\s+)?[\w'"]+\??:|^ {2}\w+\(/
    const missing: string[] = []

    for (const file of files.filter((f) => f.startsWith(typesSource))) {
      const lines = readFileSync(file, 'utf8').split(/\r?\n/)
      let insideInterface = false

      lines.forEach((line, index) => {
        if (/^export\s+interface\s+/.test(line)) insideInterface = true
        else if (insideInterface && line === '}') insideInterface = false
        else if (insideInterface && member.test(line) && !hasDocBefore(lines, index)) {
          missing.push(`${label(file)}:${index + 1}  ${line.trim().slice(0, 70)}`)
        }
      })
    }

    expect(missing, `Propriétés sans JSDoc :\n${missing.join('\n')}`).toEqual([])
  })

  it('[ARCH-4] ouvre le script de chaque composant Vue par un commentaire JSDoc', () => {
    const missing = components.filter((file) => {
      const source = readFileSync(file, 'utf8')
      const script = /<script\b[^>]*>\s*/.exec(source)
      if (script === null) return false
      return !source.slice(script.index + script[0].length).startsWith('/**')
    })

    expect(
      missing.map(label),
      `Composants dont le script ne commence pas par un JSDoc :\n${missing.map(label).join('\n')}`,
    ).toEqual([])
  })

  it('[ARCH-1] n’a aucun code exécutable dans le paquet de types', () => {
    const runtime = files
      .filter((file) => file.startsWith(typesSource))
      .flatMap((file) =>
        readFileSync(file, 'utf8')
          .split(/\r?\n/)
          .flatMap((line, index) =>
            /^export\s+(?:const|let|var|function|class|enum)\s/.test(line) ? [`${label(file)}:${index + 1}  ${line.trim()}`] : [],
          ),
      )

    expect(runtime, `Code exécutable interdit dans le paquet de types :\n${runtime.join('\n')}`).toEqual([])
  })
})
