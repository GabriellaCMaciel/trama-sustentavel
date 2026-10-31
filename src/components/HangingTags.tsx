import { useRef } from 'react'
import type { PointerEvent } from 'react'

export interface SampleTag {
  name: string
  category: string
  /** Classe de cor do Tailwind para a "foto" da peça. */
  swatch: string
  /** Inclinação de repouso, em graus. */
  tilt: number
}

interface HangingTagsProps {
  tags: SampleTag[]
}

/** Comprimento do fio entre a arara e a etiqueta, em px (precisa bater com h-8.5 / pt-8.5). */
const STRING_LENGTH = 34

/** Proporção de cada oscilação em relação à anterior: o balanço perde força até parar. */
const DAMPING = [1, -0.62, 0.38, -0.22, 0.12, -0.05, 0]

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** Faz uma etiqueta balançar a partir do ponto preso na arara. */
function swing(element: HTMLElement, amplitude: number, delay = 0) {
  element.getAnimations().forEach((animation) => animation.cancel())
  const keyframes = DAMPING.map((factor) => ({ transform: `rotate(${(amplitude * factor).toFixed(2)}deg)` }))
  element.animate(keyframes, {
    duration: 1700,
    delay,
    easing: 'ease-in-out',
  })
}

export function HangingTags({ tags }: HangingTagsProps) {
  const itemRefs = useRef<(HTMLLIElement | null)[]>([])

  function handlePointerEnter(index: number, event: PointerEvent<HTMLLIElement>) {
    if (prefersReducedMotion()) return
    const element = event.currentTarget
    const box = element.getBoundingClientRect()

    // Para que lado o mouse empurrou: pelo movimento ou, sem movimento (toque), pelo lado em que entrou.
    const pushedRight = event.movementX !== 0 ? event.movementX > 0 : event.clientX < box.left + box.width / 2

    // Com o ponto de giro no alto, girar no sentido anti-horário leva a parte de baixo para a direita.
    const direction = pushedRight ? -1 : 1
    const strength = Math.min(14, Math.max(7, Math.abs(event.movementX) * 0.8))
    swing(element, direction * strength)

    // As vizinhas sentem o tranco pela arara: balançam menos e um pouco depois.
    itemRefs.current.forEach((neighbor, neighborIndex) => {
      const distance = Math.abs(neighborIndex - index)
      if (!neighbor || distance === 0) return
      swing(neighbor, (direction * strength * 0.3) / distance, 90 * distance)
    })
  }

  return (
    <ul
      className="grid grid-cols-3 gap-[clamp(22px,3vw,26px)] rounded-xs border-t-[3px] border-brick-red pt-8.5"
      aria-hidden="true"
    >
      {tags.map((tag, index) => (
        <li
          key={tag.name}
          ref={(element) => {
            itemRefs.current[index] = element
          }}
          className="relative flex flex-col"
          // O ponto de giro fica no alto do fio, onde ele prende na arara.
          style={{ rotate: `${tag.tilt}deg`, transformOrigin: `50% -${STRING_LENGTH}px` }}
          onPointerEnter={(event) => handlePointerEnter(index, event)}
        >
          <span className="absolute -top-8.5 left-1/2 h-8.5 w-[1.5px] bg-brick-red" />
          <div className={`aspect-[3/4] rounded-t-[10px] ring-1 ring-papaya-whip/15 ring-inset ${tag.swatch}`} />
          <div className="clip-tag relative grid gap-1.5 bg-papaya-whip px-3.5 pt-7 pb-4.5 text-deep-space-blue-200">
            <span className="absolute top-2.5 left-[calc(50%-4.5px)] size-2.25 rounded-full bg-deep-space-blue-200 ring-2 ring-brick-red" />
            <span className="font-display text-[clamp(0.8125rem,2.6vw,1rem)] leading-tight font-bold [overflow-wrap:anywhere] hyphens-auto">
              {tag.name}
            </span>
            <span className="text-[0.8125rem] text-deep-space-blue">{tag.category}</span>
          </div>
        </li>
      ))}
    </ul>
  )
}
