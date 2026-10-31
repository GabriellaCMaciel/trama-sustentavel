/** Funções de cor. A claridade usada no site é o L* do espaço CIELAB (0 = preto, 100 = branco). */

export interface Rgb {
  r: number
  g: number
  b: number
}

export function hexToRgb(hex: string): Rgb {
  const value = hex.replace('#', '')
  const full = value.length === 3 ? [...value].map((char) => char + char).join('') : value
  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  }
}

export function rgbToHex({ r, g, b }: Rgb): string {
  return `#${[r, g, b].map((channel) => Math.round(channel).toString(16).padStart(2, '0')).join('')}`
}

function toLinear(channel: number): number {
  const value = channel / 255
  return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
}

/** Claridade L* (0 a 100) de uma cor RGB. */
export function lightnessOfRgb({ r, g, b }: Rgb): number {
  const y = 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b)
  const f = y > 216 / 24389 ? Math.cbrt(y) : (24389 / 27) * y / 116 + 16 / 116
  return 116 * f - 16
}

export function lightness(hex: string): number {
  return lightnessOfRgb(hexToRgb(hex))
}

/** Croma C* do CIELAB: quanto a cor é intensa (0 = cinza). */
export function chroma(hex: string): number {
  const { r, g, b } = hexToRgb(hex)
  const [lr, lg, lb] = [toLinear(r), toLinear(g), toLinear(b)]
  const x = (0.4124 * lr + 0.3576 * lg + 0.1805 * lb) / 0.95047
  const y = 0.2126 * lr + 0.7152 * lg + 0.0722 * lb
  const z = (0.0193 * lr + 0.1192 * lg + 0.9505 * lb) / 1.08883
  const f = (t: number) => (t > 216 / 24389 ? Math.cbrt(t) : ((24389 / 27) * t + 16) / 116)
  const a = 500 * (f(x) - f(y))
  const bb = 200 * (f(y) - f(z))
  return Math.hypot(a, bb)
}

/** Limite de croma abaixo do qual a cor conta como neutra (docs/looks.md). */
export const NEUTRAL_CHROMA = 26

export function isNeutral(hex: string): boolean {
  return chroma(hex) < NEUTRAL_CHROMA
}

export type ValueLabel = 'clara' | 'média' | 'escura'

/** Classifica a claridade de uma peça pela cor principal. */
export function valueLabel(hex: string): ValueLabel {
  const value = lightness(hex)
  if (value >= 65) return 'clara'
  if (value >= 35) return 'média'
  return 'escura'
}

/**
 * Cor média de uma área quadrada ao redor de um ponto.
 * Usar uma área (e não um pixel) diminui o efeito de ruído e de pequenos reflexos.
 */
export function averageColor(image: ImageData, x: number, y: number, radius: number): Rgb {
  let r = 0
  let g = 0
  let b = 0
  let count = 0
  const left = Math.max(0, Math.round(x - radius))
  const right = Math.min(image.width - 1, Math.round(x + radius))
  const top = Math.max(0, Math.round(y - radius))
  const bottom = Math.min(image.height - 1, Math.round(y + radius))
  for (let row = top; row <= bottom; row++) {
    for (let column = left; column <= right; column++) {
      const index = (row * image.width + column) * 4
      r += image.data[index]
      g += image.data[index + 1]
      b += image.data[index + 2]
      count++
    }
  }
  return { r: r / count, g: g / count, b: b / count }
}
