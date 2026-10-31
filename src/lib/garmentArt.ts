import { hexToRgb, lightness, rgbToHex } from './color'

/** Ilustrações simples de roupas, desenhadas em SVG na cor de cada peça (docs/exemplo.md). */

export type GarmentKind =
  | 'shirt'
  | 'tshirt'
  | 'blouse'
  | 'tank'
  | 'pants'
  | 'wide-pants'
  | 'skirt'
  | 'shorts'
  | 'dress'
  | 'blazer'
  | 'sneakers'
  | 'loafers'
  | 'sandals'
  | 'bag'
  | 'scarf'

function mix(hex: string, target: string, amount: number): string {
  const a = hexToRgb(hex)
  const b = hexToRgb(target)
  return rgbToHex({
    r: a.r + (b.r - a.r) * amount,
    g: a.g + (b.g - a.g) * amount,
    b: a.b + (b.b - a.b) * amount,
  })
}

interface Palette {
  fill: string
  line: string
  /** Tom um pouco diferente da peça, para faixas e detalhes. */
  detail: string
}

/** Desenho de cada tipo de peça. Área útil: x de 55 a 345, y de 85 a 430 (formato 4:5). */
const DRAW: Record<GarmentKind, (p: Palette) => string> = {
  tshirt: ({ fill }) => `
    <path d="M140 100 Q200 128 260 100 L330 140 L305 205 L272 190 L272 410 L128 410 L128 190 L95 205 L70 140 Z" fill="${fill}"/>
    <path d="M165 107 Q200 135 235 107" fill="none"/>
    <path d="M128 392 L272 392 M272 190 L272 160 M128 190 L128 160" fill="none" stroke-width="3"/>`,

  shirt: ({ fill, line }) => `
    <path d="M140 100 L200 120 L260 100 L320 125 L345 330 L310 335 L285 200 L275 410 L125 410 L115 200 L90 335 L55 330 L80 125 Z" fill="${fill}"/>
    <path d="M168 96 L200 142 L232 96 L222 88 L200 118 L178 88 Z" fill="${fill}"/>
    <path d="M200 142 L200 410 M60 312 L93 317 M340 312 L307 317" fill="none" stroke-width="3"/>
    ${[175, 225, 275, 325, 375].map((y) => `<circle cx="212" cy="${y}" r="5" fill="${line}" stroke="none"/>`).join('')}`,

  blouse: ({ fill, detail }) => `
    <path d="M150 105 Q200 140 250 105 L300 125 L318 185 L280 192 L268 240 L285 395 L115 395 L132 240 L120 192 L82 185 L100 125 Z" fill="${fill}"/>
    <path d="M132 240 L268 240 L266 264 L134 264 Z" fill="${detail}"/>
    <path d="M200 252 Q170 232 172 262 Q190 266 200 252 Q230 232 228 262 Q210 266 200 252 Z" fill="${detail}"/>
    <path d="M200 254 L182 300 M200 254 L218 300" fill="none" stroke-width="5"/>`,

  tank: ({ fill }) => `
    <path d="M150 95 L172 95 Q200 152 228 95 L250 95 Q252 162 280 186 L280 408 L120 408 L120 186 Q148 162 150 95 Z" fill="${fill}"/>
    <path d="M120 390 L280 390" fill="none" stroke-width="3"/>`,

  pants: ({ fill }) => `
    <path d="M135 92 L265 92 L276 418 L212 418 L200 178 L188 418 L124 418 Z" fill="${fill}"/>
    <path d="M136 118 L264 118 M200 118 L200 178 M150 118 Q158 150 136 156 M250 118 Q242 150 264 156" fill="none" stroke-width="3"/>`,

  'wide-pants': ({ fill }) => `
    <path d="M150 92 L250 92 L308 418 L212 418 L200 192 L188 418 L92 418 Z" fill="${fill}"/>
    <path d="M151 118 L249 118 M200 118 L200 192 M230 240 L262 410 M170 240 L138 410" fill="none" stroke-width="3"/>`,

  skirt: ({ fill, detail }) => `
    <path d="M150 128 L250 128 L250 154 L308 385 L92 385 L150 154 Z" fill="${fill}"/>
    <path d="M150 128 L250 128 L250 154 L150 154 Z" fill="${detail}"/>
    <path d="M178 154 L160 385 M222 154 L240 385 M200 154 L200 385" fill="none" stroke-width="3"/>`,

  shorts: ({ fill, detail }) => `
    <path d="M135 150 L265 150 L287 335 L210 335 L200 242 L190 335 L113 335 Z" fill="${fill}"/>
    <path d="M136 150 L264 150 L263 174 L137 174 Z" fill="${detail}"/>
    <path d="M200 174 L200 242 M116 318 L190 318 M210 318 L284 318" fill="none" stroke-width="3"/>`,

  dress: ({ fill, detail }) => `
    <path d="M165 85 L181 85 Q200 116 219 85 L235 85 L255 205 L246 226 L322 430 L78 430 L154 226 L145 205 Z" fill="${fill}"/>
    <path d="M150 210 L250 210 L246 230 L154 230 Z" fill="${detail}"/>
    <path d="M176 230 L140 428 M224 230 L260 428" fill="none" stroke-width="3"/>`,

  blazer: ({ fill, line }) => `
    <path d="M145 95 L200 115 L255 95 L320 120 L345 345 L310 350 L290 210 L285 418 L115 418 L110 210 L90 350 L55 345 L80 120 Z" fill="${fill}"/>
    <path d="M150 100 L200 228 L250 100 M200 228 L200 418 M168 150 L182 185 M232 150 L218 185 M125 330 L172 330 M228 330 L275 330" fill="none" stroke-width="3"/>
    <circle cx="200" cy="262" r="6" fill="${line}" stroke="none"/><circle cx="200" cy="304" r="6" fill="${line}" stroke="none"/>`,

  sneakers: ({ fill, line, detail }) => `
    <path d="M92 300 Q98 220 170 214 L214 214 Q236 252 282 263 L320 272 Q340 280 336 305 L92 305 Z" fill="${fill}"/>
    <path d="M86 305 L342 305 Q344 332 320 334 L100 334 Q84 332 86 305 Z" fill="${detail}"/>
    <path d="M176 230 L198 256 M194 224 L216 250 M212 220 L234 246" fill="none" stroke="${line}" stroke-width="4"/>`,

  loafers: ({ fill, detail }) => `
    <path d="M88 300 Q94 254 150 250 L252 252 Q322 258 336 292 Q340 306 330 310 L92 310 Z" fill="${fill}"/>
    <path d="M86 310 L340 310 L336 326 L90 326 Z" fill="${detail}"/>
    <path d="M168 256 Q202 280 238 256" fill="none" stroke-width="4"/>`,

  sandals: ({ fill, line, detail }) => `
    <path d="M88 320 Q98 298 140 298 L300 300 Q340 304 338 320 Q332 336 300 336 L120 336 Q90 336 88 320 Z" fill="${detail}"/>
    <path d="M150 300 Q200 220 258 302" fill="none" stroke="${line}" stroke-width="22"/>
    <path d="M150 300 Q200 220 258 302" fill="none" stroke="${fill}" stroke-width="15"/>
    <path d="M236 300 Q270 252 306 302" fill="none" stroke="${line}" stroke-width="18"/>
    <path d="M236 300 Q270 252 306 302" fill="none" stroke="${fill}" stroke-width="11"/>`,

  bag: ({ fill, line, detail }) => `
    <path d="M148 205 Q148 118 200 118 Q252 118 252 205" fill="none" stroke="${line}" stroke-width="20"/>
    <path d="M148 205 Q148 118 200 118 Q252 118 252 205" fill="none" stroke="${fill}" stroke-width="12"/>
    <path d="M110 200 L290 200 Q305 200 305 216 L295 380 Q293 396 278 396 L122 396 Q107 396 105 380 L95 216 Q95 200 110 200 Z" fill="${fill}"/>
    <path d="M98 248 L302 248" fill="none" stroke-width="3"/>
    <rect x="186" y="240" width="28" height="24" rx="4" fill="${detail}"/>`,

  scarf: ({ fill, detail }) => `
    <path d="M118 108 Q200 160 282 108 L268 172 Q200 210 132 172 Z" fill="${fill}"/>
    <path d="M182 182 L160 408 L204 412 L216 190 Z" fill="${fill}"/>
    <path d="M214 186 L246 402 L286 392 L238 178 Z" fill="${detail}"/>
    <path d="M164 408 L162 426 M176 410 L175 428 M190 411 L190 428 M250 402 L254 420 M264 399 L268 416 M278 395 L283 412" fill="none" stroke-width="3"/>`,
}

/** SVG completo de uma peça, em 400 x 500 (4:5). */
export function garmentSvg(kind: GarmentKind, color: string): string {
  const value = lightness(color)
  // Fundo claro para peças escuras e azul-acinzentado para peças claras, para a peça sempre aparecer.
  const background = value > 70 ? '#c3cfda' : '#efe9df'
  const line = value < 25 ? mix(color, '#ffffff', 0.4) : mix(color, '#000000', 0.38)
  const detail = value < 25 ? mix(color, '#ffffff', 0.18) : mix(color, '#000000', 0.15)
  const shapes = DRAW[kind]({ fill: color, line, detail })
  // Calçados são desenhados de lado e ficam pequenos: aumenta 30% e centraliza no quadro.
  const isShoe = kind === 'sneakers' || kind === 'loafers' || kind === 'sandals'
  const transform = isShoe ? ' transform="translate(-60 -110) scale(1.3)"' : ''
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500" width="400" height="500">
  <rect width="400" height="500" fill="${background}"/>
  <ellipse cx="200" cy="455" rx="130" ry="10" fill="#000" opacity="0.08"/>
  <g stroke="${line}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"${transform}>${shapes}</g>
</svg>`
}

export function garmentBlob(kind: GarmentKind, color: string): Blob {
  return new Blob([garmentSvg(kind, color)], { type: 'image/svg+xml' })
}
