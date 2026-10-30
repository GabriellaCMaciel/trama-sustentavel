export const CATEGORIES = [
  { value: 'top', label: 'Parte de cima' },
  { value: 'bottom', label: 'Parte de baixo' },
  { value: 'one-piece', label: 'Peça única' },
  { value: 'outerwear', label: 'Casaco' },
  { value: 'shoes', label: 'Calçado' },
  { value: 'accessory', label: 'Acessório' },
] as const

export const OCCASIONS = [
  { value: 'casual', label: 'Dia a dia' },
  { value: 'work', label: 'Trabalho' },
  { value: 'party', label: 'Festa' },
  { value: 'sport', label: 'Esporte' },
] as const

export type Category = (typeof CATEGORIES)[number]['value']
export type Occasion = (typeof OCCASIONS)[number]['value']

export interface Piece {
  id: string
  name: string
  category: Category
  /** Cor principal em hexadecimal, por exemplo "#1a1a1a". */
  color: string
  occasions: Occasion[]
  /** Foto já reduzida, guardada só neste navegador. */
  photo: Blob
  createdAt: number
}

export type NewPiece = Omit<Piece, 'id' | 'createdAt'>

export function categoryLabel(value: Category): string {
  return CATEGORIES.find((category) => category.value === value)?.label ?? value
}

export function occasionLabel(value: Occasion): string {
  return OCCASIONS.find((occasion) => occasion.value === value)?.label ?? value
}
