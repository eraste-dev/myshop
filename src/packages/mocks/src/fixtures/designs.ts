/** Construction des dessins de démonstration à partir de leurs descriptions compactes (voir `seeds.ts`). */
import type { Badge, Colorway, Design, DesignSeed, MeasureConfig, PatternSpec, PieceOption } from '@shop-pagne/types'
import { PALETTES, SEEDS } from './seeds'

/** Niveau de stock d'un coloris de démonstration : normal, bas ou en rupture. */
type StockLevel = 'ok' | 'low' | 'out'

/** Répartition déterministe des niveaux de stock, pour avoir des ruptures et des stocks bas dans la démonstration. */
const STOCK_LEVELS: readonly StockLevel[] = ['ok', 'ok', 'low', 'ok', 'out', 'ok', 'low', 'ok', 'ok', 'out']

/** Pas d'arrondi des prix de pièces, en francs. */
const PIECE_STEP_FRANCS = 500

/** Pas d'arrondi des prix unitaires à la mesure, en francs. */
const MEASURE_STEP_FRANCS = 100

/** Longueur minimale par défaut des produits à la mesure, en yards. */
const DEFAULT_MEASURE_MIN = 1

/** Longueur maximale des produits à la mesure, en yards. */
const DEFAULT_MEASURE_MAX = 6

/** Pas de découpe des produits à la mesure, en yards. */
const DEFAULT_MEASURE_STEP = 0.5

/** Arrondit une valeur au multiple le plus proche d'un pas. */
const roundTo = (value: number, step: number): number => Math.round(value / step) * step

/** Niveau de stock d'un coloris, déduit de la position du dessin et du coloris. */
function stockLevel(designIndex: number, colorIndex: number): StockLevel {
  return STOCK_LEVELS[(designIndex * 3 + colorIndex) % STOCK_LEVELS.length] as StockLevel
}

/** Nombre de pièces en stock d'une longueur donnée, selon le niveau de stock du coloris. */
function pieceStock(level: StockLevel, lengthYards: number): number {
  if (level === 'out') return 0
  if (level === 'low') return lengthYards <= 6 ? 2 : 0
  return lengthYards <= 6 ? 8 : 3
}

/** Prix d'une pièce : le prix de base pour 6 yards, au prorata pour les petites longueurs, avec une remise pour 12 yards. */
function piecePrice(base: number, lengthYards: number): number {
  if (lengthYards === 6) return base
  if (lengthYards === 12) return roundTo(base * 1.9, PIECE_STEP_FRANCS)
  return roundTo((base * lengthYards) / 6, PIECE_STEP_FRANCS)
}

/** Construit les pièces proposées pour un coloris vendu à la pièce. */
function buildPieces(seed: DesignSeed, colorway: string, level: StockLevel): readonly PieceOption[] {
  return (seed.lengths ?? [6]).map((lengthYards) => ({
    id: `${colorway}-${lengthYards}`,
    lengthYards,
    price: piecePrice(seed.base, lengthYards),
    stock: pieceStock(level, lengthYards),
  }))
}

/** Construit les paramètres de mesure d'un coloris vendu à la mesure. */
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

/** Étiquettes d'un coloris : nouveautés, classiques et exclusivité en quelques endroits, « dernières pièces » si le stock est bas. */
function buildBadges(designIndex: number, colorIndex: number, level: StockLevel): readonly Badge[] {
  const badges: Badge[] = []
  if (colorIndex === 0 && designIndex < 5) badges.push('new')
  if (colorIndex === 0 && designIndex >= 6 && designIndex < 9) badges.push('classic')
  if (colorIndex === 2 && designIndex === 3) badges.push('online-exclusive')
  if (level === 'low') badges.push('last-pieces')
  return badges
}

/** Adresse de l'image générée d'un coloris, avec un recadrage facultatif pour la vue détail. */
const imageUrl = (colorwayId: string, zoom?: number): string =>
  zoom === undefined ? `/api/patterns/${colorwayId}.svg` : `/api/patterns/${colorwayId}.svg?zoom=${zoom}`

/** Identifiant d'un coloris : celui du dessin suivi du code à trois chiffres. */
const colorwayId = (seed: DesignSeed, colorIndex: number): string =>
  `${seed.id}-${String(colorIndex + 1).padStart(3, '0')}`

/** Construit un coloris de démonstration. */
function buildColorway(seed: DesignSeed, designIndex: number, colorIndex: number): Colorway {
  const id = colorwayId(seed, colorIndex)
  const level = stockLevel(designIndex, colorIndex)
  const isMeasure = seed.sale === 'measure'

  return {
    id,
    code: String(colorIndex + 1).padStart(3, '0'),
    colorName: seed.colors[colorIndex] as DesignSeed['colors'][number],
    swatchImage: imageUrl(id),
    images: [imageUrl(id), imageUrl(id, 2)],
    saleMode: seed.sale,
    pieces: isMeasure ? [] : buildPieces(seed, id, level),
    measure: isMeasure ? buildMeasure(seed, level) : null,
    badges: buildBadges(designIndex, colorIndex, level),
  }
}

/** Rédige le texte de présentation d'un dessin à partir de ses caractéristiques. */
function describe(seed: DesignSeed): string {
  const styles = seed.style.map((s) => s.toLowerCase()).join(' et ')
  const finish = seed.finish === 'Aucune' ? 'sans finition particulière' : `avec une finition ${seed.finish.toLowerCase()}`
  return `Pagne ${seed.range} « ${seed.name} » aux motifs ${styles}. Coton ${finish}, couleurs franches et tenue durable.`
}

/** Construit un dessin de démonstration complet, avec tous ses coloris. */
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

/** Les dessins de démonstration : 14 dessins et 43 coloris, avec ruptures, stocks bas et nouveautés. */
export const DEMO_DESIGNS: readonly Design[] = SEEDS.map(buildDesign)

/** Description du motif de chaque coloris de démonstration, indexée par identifiant de coloris. */
const PATTERN_SPECS: ReadonlyMap<string, PatternSpec> = new Map(
  SEEDS.flatMap((seed) =>
    seed.colors.map((colorName, colorIndex): [string, PatternSpec] => {
      const id = colorwayId(seed, colorIndex)
      return [id, { seed: id, palette: PALETTES[colorName], kind: seed.kind }]
    }),
  ),
)

/**
 * Cherche la description du motif d'un coloris de démonstration.
 *
 * @param colorwayId - Identifiant du coloris.
 * @returns La description du motif, ou `undefined` si le coloris est inconnu.
 */
export function patternSpecFor(colorwayId: string): PatternSpec | undefined {
  return PATTERN_SPECS.get(colorwayId)
}
