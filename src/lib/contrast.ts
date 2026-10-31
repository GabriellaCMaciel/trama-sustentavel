import { lightness } from './color'

/** Regras da etapa "Meu contraste". Detalhes e fontes em docs/contraste.md. */

export type ContrastLevel = 'baixo' | 'medio' | 'alto'

export type FeatureKey = 'skin' | 'hair' | 'eyes'

export interface FeatureSample {
  hex: string
  /** Claridade L* (0 a 100). */
  lightness: number
}

export interface ContrastResult {
  skin: FeatureSample
  hair: FeatureSample
  eyes: FeatureSample
  /** Maior diferença de claridade entre os três pontos. */
  difference: number
  /** Nível calculado pela foto. */
  measuredLevel: ContrastLevel
  /** Nível em uso (pode ter sido ajustado pela pessoa). */
  level: ContrastLevel
  createdAt: number
}

export const FEATURES: { key: FeatureKey; label: string; hint: string }[] = [
  { key: 'skin', label: 'Pele', hint: 'Toque na bochecha, longe de sombra e de brilho.' },
  { key: 'hair', label: 'Cabelo', hint: 'Toque na cor mais comum do cabelo, sem reflexo de luz.' },
  { key: 'eyes', label: 'Olho', hint: 'Toque na parte colorida do olho (a íris).' },
]

/** Limites propostos, a validar com fotos reais (docs/contraste.md). */
export const LOW_LIMIT = 30
export const HIGH_LIMIT = 50

/** Faixa de diferença de claridade de cada nível: [mínimo, máximo). */
export const LEVEL_RANGE: Record<ContrastLevel, [number, number]> = {
  baixo: [0, LOW_LIMIT],
  medio: [LOW_LIMIT, HIGH_LIMIT],
  alto: [HIGH_LIMIT, 101],
}

export function levelFromDifference(difference: number): ContrastLevel {
  if (difference < LOW_LIMIT) return 'baixo'
  if (difference < HIGH_LIMIT) return 'medio'
  return 'alto'
}

export function buildResult(samples: Record<FeatureKey, string>): ContrastResult {
  const skin = { hex: samples.skin, lightness: lightness(samples.skin) }
  const hair = { hex: samples.hair, lightness: lightness(samples.hair) }
  const eyes = { hex: samples.eyes, lightness: lightness(samples.eyes) }
  const values = [skin.lightness, hair.lightness, eyes.lightness]
  const difference = Math.max(...values) - Math.min(...values)
  const measuredLevel = levelFromDifference(difference)
  return { skin, hair, eyes, difference, measuredLevel, level: measuredLevel, createdAt: Date.now() }
}

export const LEVEL_INFO: Record<ContrastLevel, { title: string; text: string }> = {
  baixo: {
    title: 'Contraste baixo',
    text: 'Seus traços têm claridade parecida. Combinações suaves, tom sobre tom ou com cores de claridade próxima costumam valorizar mais do que contrastes fortes, que podem "apagar" o rosto.',
  },
  medio: {
    title: 'Contraste médio',
    text: 'Existe diferença entre seus traços, mas não extrema. Combinações com uma cor média ao lado de uma clara ou de uma escura costumam funcionar bem.',
  },
  alto: {
    title: 'Contraste alto',
    text: 'Seus traços têm diferença grande de claridade. Combinações com claro e escuro bem marcados, como preto e branco, costumam acompanhar a força do seu rosto.',
  },
}

export const LEVEL_ORDER: ContrastLevel[] = ['baixo', 'medio', 'alto']

export interface ColorPair {
  first: { name: string; hex: string }
  second: { name: string; hex: string }
}

/** Exemplos de pares por nível. A diferença de claridade de cada par está dentro da faixa do nível. */
export const LEVEL_EXAMPLES: Record<ContrastLevel, ColorPair[]> = {
  baixo: [
    { first: { name: 'Areia', hex: '#d9c7a7' }, second: { name: 'Off-white', hex: '#f2ece0' } },
    { first: { name: 'Marinho', hex: '#1f2a44' }, second: { name: 'Preto', hex: '#141414' } },
    { first: { name: 'Cinza-claro', hex: '#bdbdbd' }, second: { name: 'Gelo', hex: '#e9e9e6' } },
  ],
  medio: [
    { first: { name: 'Caramelo', hex: '#b07a45' }, second: { name: 'Creme', hex: '#f1e6d2' } },
    { first: { name: 'Jeans médio', hex: '#5b7fa6' }, second: { name: 'Branco', hex: '#f5f5f0' } },
    { first: { name: 'Verde-oliva', hex: '#6b6b3a' }, second: { name: 'Bege', hex: '#d8c9a8' } },
  ],
  alto: [
    { first: { name: 'Preto', hex: '#141414' }, second: { name: 'Branco', hex: '#f5f5f0' } },
    { first: { name: 'Marinho', hex: '#1f2a44' }, second: { name: 'Off-white', hex: '#f2ece0' } },
    { first: { name: 'Vinho', hex: '#5a1f2b' }, second: { name: 'Creme', hex: '#f1e6d2' } },
  ],
}

/** Diferença de claridade entre duas cores. */
export function pairDifference(firstHex: string, secondHex: string): number {
  return Math.abs(lightness(firstHex) - lightness(secondHex))
}

export function pairFitsLevel(firstHex: string, secondHex: string, level: ContrastLevel): boolean {
  const [min, max] = LEVEL_RANGE[level]
  const difference = pairDifference(firstHex, secondHex)
  return difference >= min && difference < max
}
