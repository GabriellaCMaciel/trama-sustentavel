import { useObjectUrl } from '../hooks/useObjectUrl'
import { routeHref } from '../hooks/useHashRoute'
import { lightness, valueLabel } from '../lib/color'
import {
  FEATURES,
  LEVEL_EXAMPLES,
  LEVEL_INFO,
  LEVEL_ORDER,
  pairDifference,
  pairFitsLevel,
} from '../lib/contrast'
import type { ContrastLevel, ContrastResult } from '../lib/contrast'
import type { Piece } from '../types'
import { buttonSecondary, sectionTitle } from '../ui'

interface ContrastResultViewProps {
  result: ContrastResult
  pieces: Piece[]
  onChangeLevel: (level: ContrastLevel) => void
  onRedo: () => void
  onDelete: () => void
}

const LEVEL_SHORT: Record<ContrastLevel, string> = { baixo: 'Baixo', medio: 'Médio', alto: 'Alto' }

const TOPS = new Set<Piece['category']>(['top', 'outerwear'])
const BOTTOMS = new Set<Piece['category']>(['bottom'])

export function ContrastResultView({ result, pieces, onChangeLevel, onRedo, onDelete }: ContrastResultViewProps) {
  const info = LEVEL_INFO[result.level]
  const adjusted = result.level !== result.measuredLevel

  return (
    <div className="grid gap-12">
      <section className="grid gap-6 rounded-2xl border border-steel-blue-300 bg-deep-space-blue p-6 min-[700px]:p-8">
        <div>
          <p className="text-sm font-medium text-steel-blue-700">
            {adjusted ? 'Nível escolhido por você' : 'Seu resultado'}
          </p>
          <h2 className="mt-1 text-[clamp(2rem,5vw,2.75rem)] font-extrabold text-papaya-whip">{info.title}</h2>
          <p className="mt-3 max-w-[60ch] text-lg text-steel-blue-800">{info.text}</p>
        </div>

        <LightnessScale result={result} />

        <fieldset className="grid gap-2">
          <legend className="mb-2 text-sm font-medium text-steel-blue-700">
            Não concorda? Escolha o nível que combina mais com você.
          </legend>
          <div className="flex flex-wrap gap-2">
            {LEVEL_ORDER.map((level) => (
              <label key={level}>
                <input
                  className="peer sr-only"
                  type="radio"
                  name="contrast-level"
                  checked={result.level === level}
                  onChange={() => onChangeLevel(level)}
                />
                <span className="inline-block cursor-pointer rounded-full border border-steel-blue-400 px-4 py-1.75 text-papaya-whip transition-colors hover:border-papaya-whip peer-checked:border-steel-blue peer-checked:bg-steel-blue peer-checked:text-deep-space-blue-200 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-3 peer-focus-visible:outline-papaya-whip-400">
                  {LEVEL_SHORT[level]}
                  {level === result.measuredLevel && ' (pela foto)'}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      </section>

      <section aria-labelledby="examples-title">
        <h2 id="examples-title" className={`${sectionTitle} mb-2`}>
          Combinações que costumam funcionar
        </h2>
        <p className="mb-6 max-w-[60ch] text-steel-blue-700">
          Pares de cores com a diferença de claridade do seu nível. Use como referência, não como regra.
        </p>
        <ul className="grid gap-4 min-[600px]:grid-cols-3">
          {LEVEL_EXAMPLES[result.level].map((pair) => (
            <li key={pair.first.name + pair.second.name} className="overflow-hidden rounded-xl border border-steel-blue-300">
              <div className="flex h-24">
                <span className="flex-1" style={{ backgroundColor: pair.first.hex }} />
                <span className="flex-1" style={{ backgroundColor: pair.second.hex }} />
              </div>
              <p className="px-4 py-3 text-papaya-whip">
                {pair.first.name} com {pair.second.name.toLowerCase()}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <WardrobeMatches pieces={pieces} level={result.level} />

      <div className="flex flex-wrap gap-3 border-t border-steel-blue-300 pt-8">
        <button type="button" className={buttonSecondary} onClick={onRedo}>
          Fazer de novo com outra foto
        </button>
        <button
          type="button"
          className="inline-flex h-12.5 cursor-pointer items-center px-2 font-semibold text-brick-red-800 underline underline-offset-4 hover:text-brick-red-900"
          onClick={() => {
            if (window.confirm('Apagar o resultado do seu contraste?')) onDelete()
          }}
        >
          Apagar meu resultado
        </button>
      </div>
    </div>
  )
}

/** Escala de 0 (preto) a 100 (branco) com a claridade da pele, do cabelo e do olho. */
function LightnessScale({ result }: { result: ContrastResult }) {
  // Do mais escuro para o mais claro; cada um numa altura, para os nomes nunca se sobreporem.
  const ordered = [...FEATURES].sort((a, b) => result[a.key].lightness - result[b.key].lightness)

  return (
    <figure className="grid gap-2">
      <div className="relative pt-[92px] pb-1">
        <div
          className="h-3 rounded-full"
          style={{ background: 'linear-gradient(90deg, #000, #fff)' }}
          aria-hidden="true"
        />
        {ordered.map((feature, rank) => {
          const sample = result[feature.key]
          const position = Math.min(100, Math.max(0, sample.lightness))
          return (
            <span
              key={feature.key}
              className="absolute flex flex-col items-center"
              style={{ left: `${position}%`, top: rank * 26, bottom: 6, translate: '-50% 0' }}
            >
              <span className="text-xs font-semibold whitespace-nowrap text-papaya-whip">{feature.label}</span>
              <span className="w-px flex-1 bg-steel-blue-600" aria-hidden="true" />
              <span
                className="size-5 flex-none rounded-full border-2 border-papaya-whip"
                style={{ backgroundColor: sample.hex }}
              />
            </span>
          )
        })}
      </div>
      <div className="flex justify-between text-sm text-steel-blue-700" aria-hidden="true">
        <span>Escuro</span>
        <span>Claro</span>
      </div>
      <figcaption className="text-steel-blue-800">
        Diferença entre o traço mais claro e o mais escuro:{' '}
        <strong className="text-papaya-whip">{Math.round(result.difference)}</strong> de 100
      </figcaption>
    </figure>
  )
}

function WardrobeMatches({ pieces, level }: { pieces: Piece[]; level: ContrastLevel }) {
  const tops = pieces.filter((piece) => TOPS.has(piece.category))
  const bottoms = pieces.filter((piece) => BOTTOMS.has(piece.category))
  const pairs = tops
    .flatMap((top) => bottoms.map((bottom) => ({ top, bottom })))
    .filter(({ top, bottom }) => pairFitsLevel(top.color, bottom.color, level))
    .slice(0, 6)

  let message: string | null = null
  if (pieces.length === 0) message = 'Cadastre suas peças para ver quais combinações do seu guarda-roupa combinam com o seu contraste.'
  else if (tops.length === 0) message = 'Cadastre peças de cima (ou casacos) para montar combinações.'
  else if (bottoms.length === 0) message = 'Cadastre peças de baixo para montar combinações.'
  else if (pairs.length === 0)
    message = 'Nenhuma combinação de peça de cima com peça de baixo do seu guarda-roupa está na faixa do seu nível por enquanto.'

  return (
    <section aria-labelledby="wardrobe-match-title">
      <h2 id="wardrobe-match-title" className={`${sectionTitle} mb-2`}>
        No seu guarda-roupa
      </h2>
      <p className="mb-6 max-w-[60ch] text-steel-blue-700">
        Combinações de peça de cima com peça de baixo, pela cor principal de cada uma, que ficam dentro do seu nível.
      </p>

      {message ? (
        <div className="grid justify-items-start gap-4 rounded-2xl border-[1.5px] border-dashed border-steel-blue-300 p-6">
          <p className="text-steel-blue-800">{message}</p>
          <a className={buttonSecondary} href={routeHref['guarda-roupa']}>
            Ir para o guarda-roupa
          </a>
        </div>
      ) : (
        <ul className="grid gap-4 min-[600px]:grid-cols-2 min-[960px]:grid-cols-3">
          {pairs.map(({ top, bottom }) => (
            <li
              key={top.id + bottom.id}
              className="grid gap-3 rounded-xl border border-steel-blue-300 bg-deep-space-blue p-4"
            >
              <div className="flex gap-2">
                <PieceThumb piece={top} />
                <PieceThumb piece={bottom} />
              </div>
              <p className="text-papaya-whip">
                {top.name} com {bottom.name.charAt(0).toLowerCase() + bottom.name.slice(1)}
              </p>
              <p className="text-sm text-steel-blue-700">
                Uma peça {valueLabel(top.color)} e uma {valueLabel(bottom.color)}, diferença de{' '}
                {Math.round(pairDifference(top.color, bottom.color))}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export function PieceThumb({ piece }: { piece: Piece }) {
  const url = useObjectUrl(piece.photo)
  return (
    <div className="relative aspect-square flex-1 overflow-hidden rounded-lg bg-deep-space-blue-300">
      {url && <img className="size-full object-cover" src={url} alt={`Foto de ${piece.name}`} />}
      <span
        className="absolute right-1.5 bottom-1.5 size-4 rounded-full border-2 border-papaya-whip"
        style={{ backgroundColor: piece.color }}
        title={`Claridade ${Math.round(lightness(piece.color))}`}
        aria-hidden="true"
      />
    </div>
  )
}
