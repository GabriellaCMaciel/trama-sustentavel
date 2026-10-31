import { useEffect, useRef, useState } from 'react'
import type { PointerEvent } from 'react'
import { averageColor, lightness, rgbToHex } from '../lib/color'
import { FEATURES } from '../lib/contrast'
import type { FeatureKey } from '../lib/contrast'
import { buttonPrimary, buttonSecondary } from '../ui'

interface Point {
  /** Posição em fração da imagem (0 a 1), para desenhar o marcador. */
  x: number
  y: number
  hex: string
}

interface FacePointPickerProps {
  file: File
  onDone: (samples: Record<FeatureKey, string>) => void
  onCancel: () => void
}

/** Tamanho máximo da imagem usada para ler as cores. */
const MAX_SIZE = 1000

export function FacePointPicker({ file, onDone, onCancel }: FacePointPickerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<ImageData | null>(null)
  const [ready, setReady] = useState(false)
  const [loadError, setLoadError] = useState(false)
  const [points, setPoints] = useState<Partial<Record<FeatureKey, Point>>>({})
  const [active, setActive] = useState<FeatureKey>('skin')

  // Desenha a foto num canvas para poder ler as cores. A foto fica só na memória.
  useEffect(() => {
    let cancelled = false
    createImageBitmap(file, { imageOrientation: 'from-image' })
      .then((bitmap) => {
        if (cancelled || !canvasRef.current) {
          bitmap.close()
          return
        }
        const scale = Math.min(1, MAX_SIZE / Math.max(bitmap.width, bitmap.height))
        const canvas = canvasRef.current
        canvas.width = Math.round(bitmap.width * scale)
        canvas.height = Math.round(bitmap.height * scale)
        const context = canvas.getContext('2d', { willReadFrequently: true })
        if (!context) throw new Error('canvas')
        context.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
        bitmap.close()
        imageRef.current = context.getImageData(0, 0, canvas.width, canvas.height)
        setReady(true)
      })
      .catch(() => {
        if (!cancelled) setLoadError(true)
      })
    return () => {
      cancelled = true
      imageRef.current = null
    }
  }, [file])

  function handlePointerDown(event: PointerEvent<HTMLCanvasElement>) {
    const image = imageRef.current
    if (!image) return
    const rect = event.currentTarget.getBoundingClientRect()
    const fx = (event.clientX - rect.left) / rect.width
    const fy = (event.clientY - rect.top) / rect.height
    // A íris é pequena: no olho a área lida é menor.
    const base = Math.min(image.width, image.height)
    const radius = active === 'eyes' ? Math.max(1, Math.round(base / 300)) : Math.max(2, Math.round(base / 120))
    const hex = rgbToHex(averageColor(image, fx * image.width, fy * image.height, radius))

    const next = { ...points, [active]: { x: fx, y: fy, hex } }
    setPoints(next)
    const missing = FEATURES.find((feature) => !next[feature.key])
    if (missing) setActive(missing.key)
  }

  const activeFeature = FEATURES.find((feature) => feature.key === active)!
  const complete = FEATURES.every((feature) => points[feature.key])

  if (loadError) {
    return (
      <div className="grid gap-4">
        <p className="text-brick-red-800" role="alert">
          Não foi possível abrir essa foto. Tente com outra imagem (JPG ou PNG).
        </p>
        <button type="button" className={`${buttonSecondary} justify-self-start`} onClick={onCancel}>
          Escolher outra foto
        </button>
      </div>
    )
  }

  return (
    <div className="grid gap-6 min-[880px]:grid-cols-[1fr_320px] min-[880px]:items-start">
      <div className="relative justify-self-center">
        <canvas
          ref={canvasRef}
          className="block h-auto max-h-[75vh] w-auto max-w-full cursor-crosshair touch-manipulation rounded-xl"
          onPointerDown={handlePointerDown}
          aria-label={`Sua foto. ${activeFeature.hint}`}
          role="img"
        />
        {FEATURES.map((feature) => {
          const point = points[feature.key]
          if (!point) return null
          return (
            <span
              key={feature.key}
              className={`pointer-events-none absolute grid size-7 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-papaya-whip text-[0.6875rem] font-bold shadow-[0_0_0_2px_rgb(0_19_29/0.8)] ${
                lightness(point.hex) > 60 ? 'text-deep-space-blue-200' : 'text-papaya-whip'
              }`}
              style={{ left: `${point.x * 100}%`, top: `${point.y * 100}%`, backgroundColor: point.hex }}
              aria-hidden="true"
            >
              {feature.label[0]}
            </span>
          )
        })}
        {!ready && <p className="absolute inset-0 grid place-items-center text-steel-blue-700">Abrindo a foto…</p>}
      </div>

      <div className="grid gap-4">
        <p className="text-lg text-papaya-whip" aria-live="polite">
          {complete ? 'Pronto! Confira as cores ou toque de novo para corrigir.' : activeFeature.hint}
        </p>

        <ul className="grid gap-2">
          {FEATURES.map((feature) => {
            const point = points[feature.key]
            const isActive = feature.key === active
            return (
              <li key={feature.key}>
                <button
                  type="button"
                  className={`flex w-full cursor-pointer items-center gap-3 rounded-[10px] border px-3 py-2.5 text-left transition-colors ${
                    isActive
                      ? 'border-papaya-whip bg-deep-space-blue-300'
                      : 'border-steel-blue-300 hover:border-steel-blue-600'
                  }`}
                  aria-pressed={isActive}
                  onClick={() => setActive(feature.key)}
                >
                  <span
                    className="size-8 flex-none rounded-full border border-steel-blue-600"
                    style={{ backgroundColor: point?.hex ?? 'transparent' }}
                    aria-hidden="true"
                  />
                  <span className="grid">
                    <span className="font-semibold text-papaya-whip">{feature.label}</span>
                    <span className="text-sm text-steel-blue-700">
                      {point ? `Cor lida: ${point.hex.toUpperCase()}` : isActive ? 'Toque na foto' : 'Ainda não marcado'}
                    </span>
                  </span>
                </button>
              </li>
            )
          })}
        </ul>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            className={`${buttonPrimary} cursor-pointer`}
            disabled={!complete}
            onClick={() =>
              onDone({ skin: points.skin!.hex, hair: points.hair!.hex, eyes: points.eyes!.hex })
            }
          >
            Ver meu contraste
          </button>
          <button type="button" className={buttonSecondary} onClick={onCancel}>
            Trocar foto
          </button>
        </div>
      </div>
    </div>
  )
}
