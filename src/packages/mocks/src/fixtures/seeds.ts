/** Données de départ des dessins de démonstration : palettes et descriptions compactes. */
import type { ColorName, DesignSeed } from '@shop-pagne/types'

/** Palettes de démonstration, par couleur : la première valeur sert de fond, les suivantes d'accents. */
export const PALETTES: Readonly<Record<ColorName, readonly string[]>> = {
  Bleu: ['#16367a', '#f0c33c', '#f4ede0', '#2f7fd1'],
  Rouge: ['#8c1c1c', '#f0c33c', '#f4ede0', '#e2572b'],
  Vert: ['#14583a', '#f0c33c', '#f4ede0', '#5fb36b'],
  Orange: ['#c4520e', '#142a5c', '#f4ede0', '#f0c33c'],
  Jaune: ['#e8b923', '#1a1a1a', '#f4ede0', '#b4491f'],
  Rose: ['#c23a6b', '#1d3f6e', '#f4ede0', '#f0a2bd'],
  Noir: ['#161616', '#d4a017', '#f4ede0', '#8a8a8a'],
  Marron: ['#5a3418', '#e0a458', '#f4ede0', '#a0522d'],
  Violet: ['#4a2377', '#f0c33c', '#f4ede0', '#b07cd8'],
}

/** Dessins de démonstration. Les gammes et les motifs sont des exemples, à valider avec la gérante. */
export const SEEDS: readonly DesignSeed[] = [
  { id: 'soleil-levant', reference: 'PGN2101', name: 'Soleil levant', range: 'Super Wax', kind: 'burst', style: ['Nature', 'Géométrique'], finish: 'Pailletée', sale: 'piece', base: 38000, colors: ['Bleu', 'Orange', 'Vert'], lengths: [6] },
  { id: 'calebasse', reference: 'PGN2102', name: 'Calebasse', range: 'Wax Hollandais', kind: 'circles', style: ['Objet', 'Décoratif'], finish: 'Aucune', sale: 'piece', base: 32000, colors: ['Rouge', 'Jaune', 'Noir'], lengths: [2, 4, 6] },
  { id: 'jardin-de-bassam', reference: 'PGN2103', name: 'Jardin de Bassam', range: 'Super Wax', kind: 'leaves', style: ['Floral', 'Nature'], finish: 'Dorée', sale: 'piece', base: 42000, colors: ['Vert', 'Rose', 'Bleu', 'Orange'], lengths: [6, 12] },
  { id: 'rythme-abidjan', reference: 'PGN2104', name: 'Rythme d’Abidjan', range: 'Java', kind: 'diamonds', style: ['Géométrique'], finish: 'Aucune', sale: 'measure', base: 30000, colors: ['Jaune', 'Rouge', 'Noir'] },
  { id: 'pluie-or', reference: 'PGN2105', name: 'Pluie d’or', range: 'Super Wax', kind: 'waves', style: ['Abstrait', 'Décoratif'], finish: 'Dorée', sale: 'piece', base: 45000, colors: ['Noir', 'Marron', 'Violet'], lengths: [6] },
  { id: 'eventail', reference: 'PGN2106', name: 'Éventail', range: 'Wax Hollandais', kind: 'burst', style: ['Décoratif', 'Floral'], finish: 'Aucune', sale: 'piece', base: 29000, colors: ['Rose', 'Bleu', 'Jaune'], lengths: [2, 4, 6] },
  { id: 'baobab', reference: 'PGN2107', name: 'Baobab', range: 'Java', kind: 'leaves', style: ['Nature'], finish: 'Aucune', sale: 'measure', base: 24000, colors: ['Marron', 'Vert', 'Orange'], min: 2 },
  { id: 'kente-moderne', reference: 'PGN2108', name: 'Kente moderne', range: 'Fancy', kind: 'diamonds', style: ['Géométrique', 'Décoratif'], finish: 'Pailletée', sale: 'piece', base: 36000, colors: ['Violet', 'Rouge', 'Bleu'], lengths: [6] },
  { id: 'ocean', reference: 'PGN2109', name: 'Océan', range: 'Super Wax', kind: 'waves', style: ['Nature', 'Abstrait'], finish: 'Aucune', sale: 'piece', base: 40000, colors: ['Bleu', 'Vert', 'Noir'], lengths: [4, 6, 12] },
  { id: 'savane', reference: 'PGN2110', name: 'Savane', range: 'Wax Hollandais', kind: 'circles', style: ['Nature', 'Objet'], finish: 'Aucune', sale: 'measure', base: 27000, colors: ['Orange', 'Jaune', 'Marron'] },
  { id: 'harmattan', reference: 'PGN2111', name: 'Harmattan', range: 'Java', kind: 'burst', style: ['Abstrait'], finish: 'Aucune', sale: 'piece', base: 26000, colors: ['Marron', 'Rose', 'Noir'], lengths: [2, 6] },
  { id: 'epi-de-mais', reference: 'PGN2112', name: 'Épi de maïs', range: 'Fancy', kind: 'leaves', style: ['Nature', 'Floral'], finish: 'Dorée', sale: 'piece', base: 34000, colors: ['Jaune', 'Vert', 'Rouge'], lengths: [6] },
  { id: 'cauris', reference: 'PGN2113', name: 'Cauris', range: 'Super Wax', kind: 'circles', style: ['Objet', 'Géométrique'], finish: 'Pailletée', sale: 'piece', base: 44000, colors: ['Noir', 'Bleu', 'Rose'], lengths: [6, 12] },
  { id: 'mosaique', reference: 'PGN2114', name: 'Mosaïque', range: 'Wax Hollandais', kind: 'diamonds', style: ['Géométrique', 'Décoratif'], finish: 'Aucune', sale: 'piece', base: 31000, colors: ['Orange', 'Violet', 'Vert'], lengths: [2, 4, 6] },
]
