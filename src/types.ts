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

/** Modelagem (caimento) da peça. Só para roupas; detalhes em docs/corpo.md. */
export const FITS = [
  { value: 'fitted', label: 'Ajustada', hint: 'Acompanha o corpo' },
  { value: 'straight', label: 'Reta', hint: 'Cai reto, sem marcar nem abrir' },
  { value: 'wide', label: 'Ampla', hint: 'Folgada, com volume' },
  { value: 'a-line', label: 'Evasê', hint: 'Mais justa em cima e abrindo embaixo' },
  { value: 'waisted', label: 'Cintura marcada', hint: 'Transpassada, com cinto ou recorte' },
] as const

export type Category = (typeof CATEGORIES)[number]['value']
export type Occasion = (typeof OCCASIONS)[number]['value']
export type Fit = (typeof FITS)[number]['value']

/** Categorias que são roupa e, portanto, têm modelagem. */
export const CLOTHING_CATEGORIES: ReadonlySet<Category> = new Set(['top', 'bottom', 'one-piece', 'outerwear'])

export interface Piece {
  id: string
  name: string
  category: Category
  /** Cor principal em hexadecimal, por exemplo "#1a1a1a". */
  color: string
  occasions: Occasion[]
  /** Modelagem, opcional. Peças antigas não têm. */
  fit?: Fit
  /** Peça do guarda-roupa de exemplo (docs/exemplo.md). */
  sample?: boolean
  /** Foto já reduzida, guardada só neste navegador. */
  photo: Blob
  createdAt: number
}

export type NewPiece = Omit<Piece, 'id' | 'createdAt'>

export function categoryLabel(value: Category): string {
  return CATEGORIES.find((category) => category.value === value)?.label ?? value
}

export function fitLabel(value: Fit): string {
  return FITS.find((fit) => fit.value === value)?.label ?? value
}

export function occasionLabel(value: Occasion): string {
  return OCCASIONS.find((occasion) => occasion.value === value)?.label ?? value
}
