/**
 * Générateur de motifs de pagne en SVG, déterministe : même graine et même palette donnent
 * toujours la même image. Sert de photo de démonstration tant qu'on n'a pas de vraies photos.
 */

export const PATTERN_KINDS = ['burst', 'circles', 'leaves', 'diamonds', 'waves'] as const

export type PatternKind = (typeof PATTERN_KINDS)[number]

export interface PatternOptions {
  readonly palette: readonly string[]
  readonly kind?: PatternKind
  /** Recadrage au centre : 1 = image entière, 2 = moitié centrale, etc. */
  readonly zoom?: number
}

const SIZE = 600
const DATA_URI_PREFIX = 'data:image/svg+xml;charset=utf-8,'

type Random = () => number

function hashSeed(seed: string): number {
  let hash = 1779033703 ^ seed.length
  for (let i = 0; i < seed.length; i += 1) {
    hash = Math.imul(hash ^ seed.charCodeAt(i), 3432918353)
    hash = (hash << 13) | (hash >>> 19)
  }
  return Math.imul(hash ^ (hash >>> 16), 2246822507) >>> 0
}

/** Générateur pseudo-aléatoire mulberry32. */
function createRandom(seed: string): Random {
  let state = hashSeed(seed)
  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const n = (value: number): string => value.toFixed(1)

/** Entier tel quel, sinon une décimale. */
const coordinate = (value: number): string => (Number.isInteger(value) ? String(value) : n(value))

function color(palette: readonly string[], index: number): string {
  return palette[index % palette.length] as string
}

function burst(palette: readonly string[], random: Random): string {
  const centers = 9
  const spikes = 18
  const parts: string[] = []
  for (let i = 0; i < centers; i += 1) {
    const cx = ((i % 3) + 0.5) * (SIZE / 3) + (random() - 0.5) * 60
    const cy = (Math.floor(i / 3) + 0.5) * (SIZE / 3) + (random() - 0.5) * 60
    const outer = 70 + random() * 40
    const inner = outer * (0.3 + random() * 0.2)
    const points: string[] = []
    for (let s = 0; s < spikes * 2; s += 1) {
      const angle = (Math.PI * s) / spikes
      const radius = s % 2 === 0 ? outer : inner
      points.push(`${n(cx + Math.cos(angle) * radius)},${n(cy + Math.sin(angle) * radius)}`)
    }
    parts.push(`<polygon points="${points.join(' ')}" fill="${color(palette, i + 1)}"/>`)
    parts.push(`<circle cx="${n(cx)}" cy="${n(cy)}" r="${n(inner * 0.5)}" fill="${color(palette, i + 2)}"/>`)
  }
  return parts.join('')
}

function circles(palette: readonly string[], random: Random): string {
  const cells = 4
  const step = SIZE / cells
  const parts: string[] = []
  for (let row = 0; row < cells; row += 1) {
    for (let col = 0; col < cells; col += 1) {
      const cx = (col + 0.5) * step
      const cy = (row + 0.5) * step
      const rings = 3 + Math.floor(random() * 2)
      for (let r = rings; r >= 1; r -= 1) {
        parts.push(
          `<circle cx="${n(cx)}" cy="${n(cy)}" r="${n((step / 2 - 8) * (r / rings))}" fill="${color(palette, row + col + r)}"/>`,
        )
      }
    }
  }
  return parts.join('')
}

function leaves(palette: readonly string[], random: Random): string {
  const count = 34
  const parts: string[] = []
  for (let i = 0; i < count; i += 1) {
    const cx = random() * SIZE
    const cy = random() * SIZE
    const rx = 18 + random() * 22
    const ry = rx * (2 + random())
    const angle = Math.floor(random() * 360)
    parts.push(
      `<ellipse cx="${n(cx)}" cy="${n(cy)}" rx="${n(rx)}" ry="${n(ry)}" fill="${color(palette, i + 1)}" transform="rotate(${angle} ${n(cx)} ${n(cy)})"/>`,
    )
  }
  return parts.join('')
}

function diamonds(palette: readonly string[]): string {
  const cells = 5
  const step = SIZE / cells
  const parts: string[] = []
  for (let row = 0; row < cells; row += 1) {
    for (let col = 0; col < cells; col += 1) {
      const cx = (col + 0.5) * step
      const cy = (row + 0.5) * step
      const half = step / 2 - 4
      const diamond = (scale: number, fill: string): string =>
        `<polygon points="${n(cx)},${n(cy - half * scale)} ${n(cx + half * scale)},${n(cy)} ${n(cx)},${n(cy + half * scale)} ${n(cx - half * scale)},${n(cy)}" fill="${fill}"/>`
      parts.push(diamond(1, color(palette, row + col + 1)))
      parts.push(diamond(0.55, color(palette, row + col + 2)))
      parts.push(diamond(0.2, color(palette, row + col + 3)))
    }
  }
  return parts.join('')
}

function waves(palette: readonly string[], random: Random): string {
  const bands = 12
  const height = SIZE / bands
  const parts: string[] = []
  for (let b = 0; b < bands; b += 1) {
    const amplitude = 14 + random() * 16
    const baseY = b * height + height / 2
    const path = [`M0,${n(baseY)}`]
    for (let x = 0; x <= SIZE; x += 50) {
      const y = baseY + Math.sin((x / SIZE) * Math.PI * 4 + b) * amplitude
      path.push(`L${n(x)},${n(y)}`)
    }
    parts.push(
      `<path d="${path.join(' ')}" fill="none" stroke="${color(palette, b + 1)}" stroke-width="${n(height * 0.55)}"/>`,
    )
  }
  return parts.join('')
}

function pickKind(seed: string): PatternKind {
  return PATTERN_KINDS[hashSeed(`kind:${seed}`) % PATTERN_KINDS.length] as PatternKind
}

/** Motif de pagne au format SVG (600 × 600), déterministe pour une graine et une palette données. */
export function patternSvg(seed: string, options: PatternOptions): string {
  const { palette } = options
  if (palette.length === 0) {
    throw new Error('La palette du motif ne peut pas être vide.')
  }

  const zoom = options.zoom ?? 1
  if (!(zoom >= 1)) {
    throw new Error('Le zoom du motif doit valoir au moins 1.')
  }

  const view = SIZE / zoom
  const offset = (SIZE - view) / 2
  const kind = options.kind ?? pickKind(seed)
  const random = createRandom(`${seed}:${palette.join('')}:${kind}`)
  const shapes =
    kind === 'burst'
      ? burst(palette, random)
      : kind === 'circles'
        ? circles(palette, random)
        : kind === 'leaves'
          ? leaves(palette, random)
          : kind === 'diamonds'
            ? diamonds(palette)
            : waves(palette, random)

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${coordinate(offset)} ${coordinate(offset)} ${coordinate(view)} ${coordinate(view)}" preserveAspectRatio="xMidYMid slice">` +
    `<rect width="${SIZE}" height="${SIZE}" fill="${color(palette, 0)}"/>${shapes}</svg>`
  )
}

/** Même motif, sous forme d'adresse de données utilisable dans un attribut `src`. */
export function patternDataUri(seed: string, options: PatternOptions): string {
  return `${DATA_URI_PREFIX}${encodeURIComponent(patternSvg(seed, options))}`
}
