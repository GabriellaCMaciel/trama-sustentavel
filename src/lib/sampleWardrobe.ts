import type { NewPiece } from '../types'
import { garmentBlob } from './garmentArt'
import type { GarmentKind } from './garmentArt'

/** Peças do guarda-roupa de exemplo (docs/exemplo.md). */
const SAMPLE: (Omit<NewPiece, 'photo' | 'sample'> & { kind: GarmentKind })[] = [
  { name: 'Camisa branca', category: 'top', color: '#f5f3ee', occasions: ['casual', 'work'], fit: 'fitted', kind: 'shirt' },
  { name: 'Camiseta cinza', category: 'top', color: '#8f8f8a', occasions: ['casual', 'sport'], fit: 'straight', kind: 'tshirt' },
  { name: 'Blusa vinho', category: 'top', color: '#7a1f3d', occasions: ['casual', 'party'], fit: 'waisted', kind: 'blouse' },
  { name: 'Regata preta', category: 'top', color: '#1b1b1b', occasions: ['casual', 'sport'], fit: 'fitted', kind: 'tank' },
  { name: 'Calça jeans', category: 'bottom', color: '#4f6f94', occasions: ['casual'], fit: 'straight', kind: 'pants' },
  { name: 'Calça pantalona preta', category: 'bottom', color: '#1b1b1b', occasions: ['work', 'party'], fit: 'wide', kind: 'wide-pants' },
  { name: 'Saia caramelo', category: 'bottom', color: '#b07a45', occasions: ['casual', 'work'], fit: 'a-line', kind: 'skirt' },
  { name: 'Short bege', category: 'bottom', color: '#d8c9a8', occasions: ['casual', 'sport'], fit: 'straight', kind: 'shorts' },
  { name: 'Vestido verde-oliva', category: 'one-piece', color: '#5d6b3a', occasions: ['casual', 'party'], fit: 'waisted', kind: 'dress' },
  { name: 'Tênis branco', category: 'shoes', color: '#f2f0ea', occasions: ['casual', 'sport'], kind: 'sneakers' },
  { name: 'Sapato preto', category: 'shoes', color: '#1b1b1b', occasions: ['casual', 'work', 'party'], kind: 'loafers' },
  { name: 'Sandália caramelo', category: 'shoes', color: '#a8743f', occasions: ['casual', 'party'], kind: 'sandals' },
  { name: 'Blazer marinho', category: 'outerwear', color: '#1f2a44', occasions: ['casual', 'work'], fit: 'straight', kind: 'blazer' },
  { name: 'Bolsa caramelo', category: 'accessory', color: '#a8743f', occasions: ['casual', 'work'], kind: 'bag' },
  { name: 'Lenço vermelho', category: 'accessory', color: '#c1121f', occasions: ['casual', 'party'], kind: 'scarf' },
]

export const SAMPLE_COUNT = SAMPLE.length

/** Peças de exemplo prontas para salvar, com a ilustração no lugar da foto. */
export function samplePieces(): NewPiece[] {
  return SAMPLE.map(({ kind, ...piece }) => ({ ...piece, photo: garmentBlob(kind, piece.color), sample: true }))
}
