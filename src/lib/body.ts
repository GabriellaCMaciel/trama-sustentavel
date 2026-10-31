import type { Category, Fit } from '../types'

/** Regras da etapa "Meu corpo". Detalhes e fontes em docs/corpo.md. */

export type BodyShape = 'triangle' | 'inverted-triangle' | 'rectangle' | 'hourglass' | 'oval'

export interface Measurements {
  /** Tórax (busto ou peito), em cm. */
  chest: number
  waist: number
  hips: number
}

export interface BodyResult {
  measurements: Measurements | null
  /** Formato calculado pelas medidas (null quando a pessoa escolheu a silhueta). */
  measuredShape: BodyShape | null
  /** Formato em uso. */
  shape: BodyShape
  source: 'measurements' | 'silhouette'
  createdAt: number
}

export const MIN_MEASURE = 40
export const MAX_MEASURE = 250

const INCH = 2.54
/** Limites da FFIT convertidos de polegadas para cm. */
const HIP_CHEST_LIMIT = 3.6 * INCH // 9,1 cm
const CHEST_WAIST_LIMIT = 9 * INCH // 22,9 cm
const HIP_WAIST_LIMIT = 10 * INCH // 25,4 cm

export function classifyShape({ chest, waist, hips }: Measurements): BodyShape {
  if (waist >= chest && waist >= hips) return 'oval'
  if (hips - chest >= HIP_CHEST_LIMIT) return 'triangle'
  if (chest - hips >= HIP_CHEST_LIMIT) return 'inverted-triangle'
  if (chest - waist >= CHEST_WAIST_LIMIT || hips - waist >= HIP_WAIST_LIMIT) return 'hourglass'
  return 'rectangle'
}

export function isValidMeasure(value: number): boolean {
  return Number.isFinite(value) && value >= MIN_MEASURE && value <= MAX_MEASURE
}

export type FitGroup = 'top' | 'bottom' | 'one-piece'

export function fitGroupOf(category: Category): FitGroup | null {
  if (category === 'top' || category === 'outerwear') return 'top'
  if (category === 'bottom') return 'bottom'
  if (category === 'one-piece') return 'one-piece'
  return null
}

export const FIT_GROUP_LABEL: Record<FitGroup, string> = {
  top: 'Peças de cima',
  bottom: 'Peças de baixo',
  'one-piece': 'Peças únicas',
}

interface ShapeInfo {
  name: string
  description: string
  tips: string
  /** Meias-larguras do desenho da silhueta: ombros/tórax, cintura e quadril. */
  widths: [number, number, number]
  fits: Record<FitGroup, Fit[]>
}

export const SHAPE_ORDER: BodyShape[] = ['triangle', 'inverted-triangle', 'rectangle', 'hourglass', 'oval']

export const SHAPES: Record<BodyShape, ShapeInfo> = {
  triangle: {
    name: 'Triângulo',
    description: 'O quadril é mais largo que o tórax.',
    tips: 'Traga interesse para a parte de cima, com decote canoa ou detalhes nos ombros. Embaixo, peças evasê ou amplas acompanham o quadril.',
    widths: [30, 24, 42],
    fits: { top: ['fitted', 'waisted'], bottom: ['a-line', 'wide'], 'one-piece': ['a-line', 'waisted'] },
  },
  'inverted-triangle': {
    name: 'Triângulo invertido',
    description: 'O tórax é mais largo que o quadril.',
    tips: 'Traga interesse para a parte de baixo, com calças e saias evasê ou amplas e detalhes na barra. Em cima, peças simples ou transpassadas.',
    widths: [44, 30, 30],
    fits: { top: ['fitted', 'waisted'], bottom: ['wide', 'a-line'], 'one-piece': ['a-line', 'waisted'] },
  },
  rectangle: {
    name: 'Retângulo',
    description: 'Tórax, cintura e quadril têm medidas próximas.',
    tips: 'Crie cintura e volume se quiser: cintos, camisa por dentro, franzidos e pregas.',
    widths: [36, 33, 37],
    fits: { top: ['waisted'], bottom: ['a-line', 'wide'], 'one-piece': ['waisted'] },
  },
  hourglass: {
    name: 'Ampulheta',
    description: 'Tórax e quadril parecidos, com a cintura bem mais fina.',
    tips: 'Acompanhe o equilíbrio que já existe: peças transpassadas, cintura marcada e calças que seguem a curva do corpo.',
    widths: [38, 24, 39],
    fits: { top: ['fitted', 'waisted'], bottom: ['fitted', 'wide'], 'one-piece': ['waisted'] },
  },
  oval: {
    name: 'Oval',
    description: 'A cintura é igual ou maior que o tórax e o quadril.',
    tips: 'Alongue a silhueta: decote em V, linhas verticais, casacos e camisas mais longos e cintura império.',
    widths: [34, 40, 36],
    fits: { top: ['straight'], bottom: ['straight'], 'one-piece': ['straight'] },
  },
}

export function fitIsRecommended(shape: BodyShape, category: Category, fit: Fit | undefined): boolean {
  const group = fitGroupOf(category)
  if (!group || !fit) return false
  return SHAPES[shape].fits[group].includes(fit)
}
