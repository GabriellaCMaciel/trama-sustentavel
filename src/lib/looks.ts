import type { Category, Fit, Occasion, Piece } from '../types'
import { OCCASIONS, fitLabel } from '../types'
import { SHAPES, fitGroupOf, fitIsRecommended } from './body'
import type { BodyShape } from './body'
import { isNeutral, lightness } from './color'
import { pairFitsLevel } from './contrast'
import type { ContrastLevel } from './contrast'

/** Regras da etapa "Looks e cápsula". Detalhes em docs/looks.md. */

export interface StyleProfile {
  contrastLevel: ContrastLevel | null
  shape: BodyShape | null
}

export type Reason = 'contrast' | 'fit' | 'colors'

export interface Look {
  id: string
  /** Peças obrigatórias, na ordem: cima, baixo (ou peça única) e calçado. */
  pieces: Piece[]
  occasions: Occasion[]
  reasons: Reason[]
  /** Quantas roupas do look têm modelagem que valoriza o formato. */
  fitCount: number
  score: number
  outerwear: Piece | null
  accessory: Piece | null
}

export const REASON_LABEL: Record<Reason, string> = {
  contrast: 'Combina com seu contraste',
  fit: 'Modelagem que valoriza seu formato',
  colors: 'Cores fáceis de combinar',
}

const ALL_OCCASIONS = OCCASIONS.map((occasion) => occasion.value)
const MAX_STRONG_COLORS = 2

function occasionsOf(piece: Piece): Occasion[] {
  return piece.occasions.length > 0 ? piece.occasions : ALL_OCCASIONS
}

function sharedOccasions(pieces: Piece[]): Occasion[] {
  return ALL_OCCASIONS.filter((occasion) => pieces.every((piece) => occasionsOf(piece).includes(occasion)))
}

function strongColors(pieces: Piece[]): number {
  return pieces.filter((piece) => !isNeutral(piece.color)).length
}

/** Par que define o contraste do look: cima com baixo, ou peça única com calçado. */
function contrastPair(pieces: Piece[]): [Piece, Piece] {
  return [pieces[0], pieces[1]]
}

/** Combinações de peças obrigatórias, sem filtrar nada. */
export function combinations(pieces: Piece[]): Piece[][] {
  const tops = pieces.filter((piece) => piece.category === 'top')
  const bottoms = pieces.filter((piece) => piece.category === 'bottom')
  const onePieces = pieces.filter((piece) => piece.category === 'one-piece')
  const shoes = pieces.filter((piece) => piece.category === 'shoes')

  const bases = [...tops.flatMap((top) => bottoms.map((bottom) => [top, bottom])), ...onePieces.map((piece) => [piece])]
  return bases.flatMap((base) => shoes.map((shoe) => [...base, shoe]))
}

/** Regras de look bom: cores harmônicas e, se houver, contraste da pessoa. */
export function isGoodLook(required: Piece[], profile: StyleProfile): boolean {
  if (sharedOccasions(required).length === 0) return false
  if (strongColors(required) > MAX_STRONG_COLORS) return false
  if (profile.contrastLevel) {
    const [first, second] = contrastPair(required)
    if (!pairFitsLevel(first.color, second.color, profile.contrastLevel)) return false
  }
  return true
}

/** Complemento (casaco ou acessório) que mantém as cores harmônicas e serve para alguma ocasião do look. */
function bestComplement(required: Piece[], candidates: Piece[], occasions: Occasion[]): Piece | null {
  const fitting = candidates.filter(
    (candidate) =>
      occasionsOf(candidate).some((occasion) => occasions.includes(occasion)) &&
      strongColors([...required, candidate]) <= MAX_STRONG_COLORS,
  )
  return fitting.find((candidate) => isNeutral(candidate.color)) ?? fitting[0] ?? null
}

export function buildLooks(pieces: Piece[], profile: StyleProfile): Look[] {
  const outerwear = pieces.filter((piece) => piece.category === 'outerwear')
  const accessories = pieces.filter((piece) => piece.category === 'accessory')

  return combinations(pieces)
    .filter((required) => isGoodLook(required, profile))
    .map((required) => {
      const occasions = sharedOccasions(required)
      const reasons: Reason[] = []
      let score = 0
      if (profile.contrastLevel) {
        reasons.push('contrast')
        score += 2
      }
      const fitCount = profile.shape
        ? required.filter((piece) => fitIsRecommended(profile.shape!, piece.category, piece.fit)).length
        : 0
      if (fitCount > 0) {
        reasons.push('fit')
        score += fitCount
      }
      if (strongColors(required) <= 1) {
        reasons.push('colors')
        score += 1
      }
      return {
        id: required.map((piece) => piece.id).join('+'),
        pieces: required,
        occasions,
        reasons,
        fitCount,
        score,
        outerwear: bestComplement(required, outerwear, occasions),
        accessory: bestComplement(required, accessories, occasions),
      }
    })
}

/**
 * Escolhe os `limit` primeiros looks variando as peças: cada vez que uma peça já apareceu,
 * os próximos looks com ela perdem meio ponto. Só ordena o que vai aparecer na tela.
 */
export function rankLooks(looks: Look[], limit = looks.length): Look[] {
  const remaining = [...looks]
  const used = new Map<string, number>()
  const ranked: Look[] = []
  while (remaining.length > 0 && ranked.length < limit) {
    let bestIndex = 0
    let bestValue = -Infinity
    remaining.forEach((look, index) => {
      const penalty = look.pieces.reduce((sum, piece) => sum + (used.get(piece.id) ?? 0) * 0.5, 0)
      const value = look.score - penalty
      if (value > bestValue) {
        bestValue = value
        bestIndex = index
      }
    })
    const [chosen] = remaining.splice(bestIndex, 1)
    chosen.pieces.forEach((piece) => used.set(piece.id, (used.get(piece.id) ?? 0) + 1))
    ranked.push(chosen)
  }
  return ranked
}

/** Quantos looks bons usam cada peça obrigatória. */
export function looksPerPiece(looks: Look[]): Map<string, number> {
  const counts = new Map<string, number>()
  looks.forEach((look) => look.pieces.forEach((piece) => counts.set(piece.id, (counts.get(piece.id) ?? 0) + 1)))
  return counts
}

/** Limite de peças por categoria na cápsula (proposta, a validar). */
export const CAPSULE_QUOTA: Partial<Record<Category, number>> = {
  top: 4,
  bottom: 3,
  'one-piece': 2,
  shoes: 2,
  outerwear: 1,
}

export interface Capsule {
  pieces: Piece[]
  looks: Look[]
}

export function buildCapsule(pieces: Piece[], looks: Look[], profile: StyleProfile): Capsule {
  const counts = looksPerPiece(looks)
  const outerwearUse = new Map<string, number>()
  looks.forEach((look) => {
    if (look.outerwear) outerwearUse.set(look.outerwear.id, (outerwearUse.get(look.outerwear.id) ?? 0) + 1)
  })
  const useOf = (piece: Piece) =>
    piece.category === 'outerwear' ? (outerwearUse.get(piece.id) ?? 0) : (counts.get(piece.id) ?? 0)

  const chosen = (Object.keys(CAPSULE_QUOTA) as Category[]).flatMap((category) =>
    pieces
      .filter((piece) => piece.category === category && useOf(piece) > 0)
      .sort((a, b) => useOf(b) - useOf(a))
      .slice(0, CAPSULE_QUOTA[category]),
  )
  return { pieces: chosen, looks: buildLooks(chosen, profile) }
}

/** Roupas e calçados que não entram em nenhum look bom. */
export function idlePieces(pieces: Piece[], looks: Look[]): Piece[] {
  const counts = looksPerPiece(looks)
  return pieces.filter(
    (piece) => ['top', 'bottom', 'one-piece', 'shoes'].includes(piece.category) && !counts.get(piece.id),
  )
}

export interface PurchaseSuggestion {
  name: string
  category: Category
  color: string
  fit?: Fit
  newLooks: number
}

const NEUTRAL_TONES = [
  { name: 'off-white', hex: '#f2ece0' },
  { name: 'cinza médio', hex: '#8a8a86' },
  { name: 'preta', hex: '#141414' },
]

export const MAX_SUGGESTIONS = 3

function suggestionName(category: Category, tone: string, fit: Fit | undefined): string {
  const fitText = fit ? ` ${fitLabel(fit).toLowerCase()}` : ''
  if (category === 'top') return `Blusa ou camiseta${fitText} ${tone}`
  if (category === 'bottom') return `Calça ou saia${fitText} ${tone}`
  return `Calçado ${tone === 'preta' ? 'preto' : tone}`
}

/** Quantos looks bons novos uma peça a mais criaria (só olha as combinações que a incluem). */
export function newLooksWith(pieces: Piece[], extra: Piece, profile: StyleProfile): number {
  const of = (category: Category) => pieces.filter((piece) => piece.category === category)
  let candidates: Piece[][] = []
  if (extra.category === 'top') {
    candidates = of('bottom').flatMap((bottom) => of('shoes').map((shoe) => [extra, bottom, shoe]))
  } else if (extra.category === 'bottom') {
    candidates = of('top').flatMap((top) => of('shoes').map((shoe) => [top, extra, shoe]))
  } else if (extra.category === 'one-piece') {
    candidates = of('shoes').map((shoe) => [extra, shoe])
  } else if (extra.category === 'shoes') {
    const bases = [
      ...of('top').flatMap((top) => of('bottom').map((bottom) => [top, bottom])),
      ...of('one-piece').map((piece) => [piece]),
    ]
    candidates = bases.map((base) => [...base, extra])
  }
  return candidates.filter((required) => isGoodLook(required, profile)).length
}

/** Diferença de claridade abaixo da qual duas peças neutras da mesma categoria contam como "a mesma cor". */
const SAME_TONE_LIMIT = 12

/** A pessoa já tem uma peça da mesma categoria, neutra e com claridade parecida? */
function alreadyHas(pieces: Piece[], category: Category, hex: string): boolean {
  return pieces.some(
    (piece) =>
      piece.category === category &&
      isNeutral(piece.color) &&
      Math.abs(lightness(piece.color) - lightness(hex)) < SAME_TONE_LIMIT,
  )
}

/** Até 3 sugestões, no máximo uma por categoria, das que mais criam looks novos. */
export function purchaseSuggestions(pieces: Piece[], profile: StyleProfile): PurchaseSuggestion[] {
  const categories: Category[] = ['top', 'bottom', 'shoes']

  const bestPerCategory = categories.flatMap((category) => {
    const group = fitGroupOf(category)
    const fit: Fit | undefined = group ? (profile.shape ? SHAPES[profile.shape].fits[group][0] : 'straight') : undefined
    // Não sugere uma cópia do que a pessoa já tem.
    const tones = NEUTRAL_TONES.filter((tone) => !alreadyHas(pieces, category, tone.hex))
    if (tones.length === 0) return []
    const options = tones.map((tone) => {
      const virtual: Piece = {
        id: `sugestao-${category}-${tone.hex}`,
        name: suggestionName(category, tone.name, fit),
        category,
        color: tone.hex,
        occasions: [],
        fit,
        photo: new Blob(),
        createdAt: 0,
      }
      return { name: virtual.name, category, color: tone.hex, fit, newLooks: newLooksWith(pieces, virtual, profile) }
    })
    // Em empate, fica o primeiro tom da lista (off-white, cinza médio, preto).
    return [options.reduce((best, option) => (option.newLooks > best.newLooks ? option : best))]
  })

  return bestPerCategory
    .filter((suggestion) => suggestion.newLooks > 0)
    .sort((a, b) => b.newLooks - a.newLooks)
    .slice(0, MAX_SUGGESTIONS)
}
