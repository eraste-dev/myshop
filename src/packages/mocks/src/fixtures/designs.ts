import type { Badge, Colorway, Design, MeasureConfig, PieceOption } from '@shop-pagne/shared'
import type { PatternKind } from '../pattern'
import { PALETTES, SEEDS } from './seeds'
import type { DesignSeed } from './seeds'

type StockLevel = 'ok' | 'low' | 'out'

/** Répartition déterministe des niveaux de stock, pour avoir des ruptures et des stocks bas. */
const STOCK_LEVELS: readonly StockLevel[] = ['ok', 'ok', 'low', 'ok', 'out', 'ok', 'low', 'ok', 'ok', 'out']

const PIECE_STEP_FRANCS = 500
const MEASURE_STEP_FRANCS = 100
const DEFAULT_MEASURE_MIN = 1
const DEFAULT_MEASURE_MAX = 6
const DEFAULT_MEASURE_STEP = 0.5

/** Description d'un motif à générer pour un coloris (palette, style, graine). */
export interface PatternSpec {
  readonly seed: string
  readonly palette: readonly string[]
  readonly kind: PatternKind
}

const roundTo = (value: number, step: number): number => Math.round(value / step) * step

function stockLevel(designIndex: number, colorIndex: number): StockLevel {
  return STOCK_LEVELS[(designIndex * 3 + colorIndex) % STOCK_LEVELS.length] as StockLevel
}

function pieceStock(level: StockLevel, lengthYards: number): number {
  if (level === 'out') return 0
  if (level === 'low') return lengthYards <= 6 ? 2 : 0
  return lengthYards <= 6 ? 8 : 3
}

function piecePrice(base: number, lengthYards: number): number {
  if (lengthYards === 6) return base
  if (lengthYards === 12) return roundTo(base * 1.9, PIECE_STEP_FRANCS)
  return roundTo((base * lengthYards) / 6, PIECE_STEP_FRANCS)
}

function buildPieces(seed: DesignSeed, colorway: string, level: StockLevel): readonly PieceOption[] {
  return (seed.lengths ?? [6]).map((lengthYards) => ({
    id: `${colorway}-${lengthYards}`,
    lengthYards,
    price: piecePrice(seed.base, lengthYards),
    stock: pieceStock(level, lengthYards),
  }))
}

function buildMeasure(seed: DesignSeed, level: StockLevel): MeasureConfig {
  const stock = level === 'out' ? 0 : level === 'low' ? 1.5 : 18

  return {
    unit: 'yard',
    unitPrice: roundTo(seed.base / 6, MEASURE_STEP_FRANCS),
    min: seed.min ?? DEFAULT_MEASURE_MIN,
    max: DEFAULT_MEASURE_MAX,
    step: DEFAULT_MEASURE_STEP,
    stock,
  }
}

function buildBadges(designIndex: number, colorIndex: number, level: StockLevel): readonly Badge[] {
  const badges: Badge[] = []
  if (colorIndex === 0 && designIndex < 5) badges.push('new')
  if (colorIndex === 0 && designIndex >= 6 && designIndex < 9) badges.push('classic')
  if (colorIndex === 2 && designIndex === 3) badges.push('online-exclusive')
  if (level === 'low') badges.push('last-pieces')
  return badges
}

const imageUrl = (colorwayId: string, zoom?: number): string =>
  zoom === undefined ? `/api/patterns/${colorwayId}.svg` : `/api/patterns/${colorwayId}.svg?zoom=${zoom}`

function buildColorway(seed: DesignSeed, designIndex: number, colorIndex: number): Colorway {
  const colorName = seed.colors[colorIndex] as DesignSeed['colors'][number]
  const code = String(colorIndex + 1).padStart(3, '0')
  const id = `${seed.id}-${code}`
  const level = stockLevel(designIndex, colorIndex)
  const isMeasure = seed.sale === 'measure'

  return {
    id,
    code,
    colorName,
    swatchImage: imageUrl(id),
    images: [imageUrl(id), imageUrl(id, 2)],
    saleMode: seed.sale,
    pieces: isMeasure ? [] : buildPieces(seed, id, level),
    measure: isMeasure ? buildMeasure(seed, level) : null,
    badges: buildBadges(designIndex, colorIndex, level),
  }
}

function describe(seed: DesignSeed): string {
  const styles = seed.style.map((s) => s.toLowerCase()).join(' et ')
  return `Pagne ${seed.range} « ${seed.name} » aux motifs ${styles}. Coton ${seed.finish === 'Aucune' ? 'sans finition particulière' : `avec une finition ${seed.finish.toLowerCase()}`}, couleurs franches et tenue durable.`
}

function buildDesign(seed: DesignSeed, designIndex: number): Design {
  return {
    id: seed.id,
    reference: seed.reference,
    name: seed.name,
    range: seed.range,
    fabric: 'Coton 100 %',
    description: describe(seed),
    careAdvice: 'Lavage à la main ou en machine à 30 °C, couleurs séparées. Repassage à l’envers.',
    attributes: { style: seed.style, finish: [seed.finish] },
    colorways: seed.colors.map((_, colorIndex) => buildColorway(seed, designIndex, colorIndex)),
  }
}

export const DEMO_DESIGNS: readonly Design[] = SEEDS.map(buildDesign)

const PATTERN_SPECS: ReadonlyMap<string, PatternSpec> = new Map(
  SEEDS.flatMap((seed) =>
    seed.colors.map((colorName, colorIndex): [string, PatternSpec] => {
      const id = `${seed.id}-${String(colorIndex + 1).padStart(3, '0')}`
      return [id, { seed: id, palette: PALETTES[colorName], kind: seed.kind }]
    }),
  ),
)

/** Description du motif d'un coloris de démonstration, ou `undefined` s'il est inconnu. */
export function patternSpecFor(colorwayId: string): PatternSpec | undefined {
  return PATTERN_SPECS.get(colorwayId)
}
