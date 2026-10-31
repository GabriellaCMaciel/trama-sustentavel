import { useState } from 'react'
import type { FormEvent } from 'react'
import { useBody } from '../hooks/useBody'
import { routeHref } from '../hooks/useHashRoute'
import { usePieces } from '../hooks/usePieces'
import {
  FIT_GROUP_LABEL,
  MAX_MEASURE,
  MIN_MEASURE,
  SHAPES,
  SHAPE_ORDER,
  classifyShape,
  fitIsRecommended,
  isValidMeasure,
} from '../lib/body'
import type { BodyResult, BodyShape, FitGroup, Measurements } from '../lib/body'
import { CLOTHING_CATEGORIES, FITS, categoryLabel, fitLabel } from '../types'
import type { Fit, Piece } from '../types'
import { buttonPrimary, buttonSecondary, fieldLabel, input, sectionTitle } from '../ui'
import { PieceThumb } from './ContrastResultView'
import { Silhouette } from './Silhouette'

type Mode = 'measure' | 'silhouette'

/** Medida no formato brasileiro, com vírgula: "92,5 cm". */
function formatCm(value: number) {
  return `${value.toLocaleString('pt-BR', { maximumFractionDigits: 1 })} cm`
}

const MEASURE_FIELDS: { key: keyof Measurements; label: string; hint: string }[] = [
  { key: 'chest', label: 'Tórax (busto ou peito)', hint: 'Na parte mais larga do tórax, com a fita reta nas costas.' },
  { key: 'waist', label: 'Cintura', hint: 'Na parte mais fina do tronco, sem encolher a barriga.' },
  { key: 'hips', label: 'Quadril', hint: 'Na parte mais larga do quadril e do bumbum, com os pés juntos.' },
]

const pill =
  'inline-block cursor-pointer rounded-full border border-steel-blue-400 px-4 py-1.75 text-papaya-whip transition-colors hover:border-papaya-whip peer-checked:border-steel-blue peer-checked:bg-steel-blue peer-checked:text-deep-space-blue-200 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-3 peer-focus-visible:outline-papaya-whip-400'

export function BodyTab() {
  const { result, loading, error, save, changeShape, remove } = useBody()
  const { pieces, updatePiece } = usePieces()
  const [editing, setEditing] = useState(false)
  const [mode, setMode] = useState<Mode>('measure')
  const [actionError, setActionError] = useState<string | null>(null)

  async function run(action: () => Promise<void>) {
    setActionError(null)
    try {
      await action()
    } catch {
      setActionError('Não foi possível salvar. Tente de novo.')
    }
  }

  async function handleSave(next: BodyResult) {
    await run(async () => {
      await save(next)
      setEditing(false)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    })
  }

  const showFlow = !result || editing

  return (
    <>
      <p className="mb-10 max-w-[60ch] text-lg text-steel-blue-700">
        O formato do corpo compara as medidas do tórax, da cintura e do quadril. Ele ajuda a escolher modelagens
        de roupa. É uma orientação, não uma regra.
      </p>

      {(error || actionError) && (
        <p className="mb-6 text-brick-red-800" role="alert">
          {error ?? actionError}
        </p>
      )}

      {loading ? (
        <p className="text-steel-blue-700">Carregando…</p>
      ) : showFlow ? (
        <section className="grid gap-8" aria-label="Descobrir meu formato">
          <fieldset>
            <legend className={`${fieldLabel} mb-2`}>Como você quer descobrir?</legend>
            <div className="flex flex-wrap gap-2">
              {(
                [
                  ['measure', 'Tenho fita métrica'],
                  ['silhouette', 'Escolher pela silhueta'],
                ] as const
              ).map(([value, label]) => (
                <label key={value}>
                  <input
                    className="peer sr-only"
                    type="radio"
                    name="body-mode"
                    checked={mode === value}
                    onChange={() => setMode(value)}
                  />
                  <span className={pill}>{label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          {mode === 'measure' ? (
            <MeasureForm initial={result?.measurements ?? null} onSubmit={handleSave} />
          ) : (
            <SilhouettePicker current={result?.shape ?? null} onPick={handleSave} />
          )}

          {editing && (
            <button
              type="button"
              className="justify-self-start py-2 text-steel-blue-700 underline underline-offset-4 hover:text-papaya-whip"
              onClick={() => setEditing(false)}
            >
              Voltar ao meu resultado
            </button>
          )}
        </section>
      ) : (
        result && (
          <BodyResultView
            result={result}
            pieces={pieces}
            onChangeShape={(shape) => run(() => changeShape(shape))}
            onChangeFit={(piece, fit) => run(() => updatePiece({ ...piece, fit }))}
            onRedo={() => {
              setMode(result.source === 'silhouette' ? 'silhouette' : 'measure')
              setEditing(true)
            }}
            onDelete={() => run(remove)}
          />
        )
      )}
    </>
  )
}

function MeasureForm({
  initial,
  onSubmit,
}: {
  initial: Measurements | null
  onSubmit: (result: BodyResult) => void
}) {
  const [values, setValues] = useState<Record<keyof Measurements, string>>({
    chest: initial ? String(initial.chest).replace('.', ',') : '',
    waist: initial ? String(initial.waist).replace('.', ',') : '',
    hips: initial ? String(initial.hips).replace('.', ',') : '',
  })
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const parsed = {
      chest: Number(values.chest.replace(',', '.')),
      waist: Number(values.waist.replace(',', '.')),
      hips: Number(values.hips.replace(',', '.')),
    }
    const invalid = MEASURE_FIELDS.find((field) => !isValidMeasure(parsed[field.key]))
    if (invalid) {
      setError(`Confira a medida "${invalid.label}": use um valor entre ${MIN_MEASURE} e ${MAX_MEASURE} cm.`)
      return
    }
    setError(null)
    const shape = classifyShape(parsed)
    onSubmit({ measurements: parsed, measuredShape: shape, shape, source: 'measurements', createdAt: Date.now() })
  }

  return (
    <div className="grid items-start gap-8 min-[880px]:grid-cols-[260px_1fr]">
      <figure className="grid justify-items-center gap-3 rounded-2xl border border-steel-blue-300 bg-deep-space-blue p-6">
        <Silhouette widths={[36, 28, 38]} guides className="w-44" title="Onde medir: 1 tórax, 2 cintura, 3 quadril" />
        <figcaption className="text-center text-sm text-steel-blue-700">
          Use fita métrica, por cima de roupa fina. A fita fica reta e firme, sem apertar.
        </figcaption>
      </figure>

      <form className="grid max-w-[480px] gap-5" onSubmit={handleSubmit} noValidate>
        {MEASURE_FIELDS.map((field, index) => (
          <div key={field.key} className="grid gap-2">
            <label className={fieldLabel} htmlFor={`measure-${field.key}`}>
              {index + 1}. {field.label}
            </label>
            <div className="relative">
              <input
                id={`measure-${field.key}`}
                className={`${input} pr-12`}
                type="text"
                inputMode="decimal"
                autoComplete="off"
                placeholder="Ex.: 90"
                value={values[field.key]}
                aria-describedby={`measure-${field.key}-hint`}
                onChange={(event) => setValues((current) => ({ ...current, [field.key]: event.target.value }))}
              />
              <span className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-steel-blue-700">
                cm
              </span>
            </div>
            <p id={`measure-${field.key}-hint`} className="text-sm text-steel-blue-700">
              {field.hint}
            </p>
          </div>
        ))}

        <p className="text-brick-red-800 empty:-mt-5" role="alert">
          {error}
        </p>

        <button type="submit" className={`${buttonPrimary} justify-self-start`}>
          Ver meu formato
        </button>
      </form>
    </div>
  )
}

function SilhouettePicker({ current, onPick }: { current: BodyShape | null; onPick: (result: BodyResult) => void }) {
  return (
    <div className="grid gap-4">
      <p className="max-w-[60ch] text-steel-blue-800">
        Escolha o desenho que mais parece com o seu corpo, olhando ombros, cintura e quadril.
      </p>
      <ul className="grid grid-cols-2 gap-3 min-[600px]:grid-cols-3 min-[960px]:grid-cols-5">
        {SHAPE_ORDER.map((shape) => {
          const info = SHAPES[shape]
          return (
            <li key={shape}>
              <button
                type="button"
                className={`grid h-full w-full cursor-pointer justify-items-center gap-2 rounded-xl border p-4 text-center transition-colors hover:border-papaya-whip ${
                  current === shape ? 'border-papaya-whip bg-deep-space-blue-300' : 'border-steel-blue-300 bg-deep-space-blue'
                }`}
                onClick={() =>
                  onPick({ measurements: null, measuredShape: null, shape, source: 'silhouette', createdAt: Date.now() })
                }
              >
                <Silhouette widths={info.widths} className="h-36" />
                <span className="font-display text-lg font-bold text-papaya-whip">{info.name}</span>
                <span className="text-sm text-steel-blue-700">{info.description}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function BodyResultView({
  result,
  pieces,
  onChangeShape,
  onChangeFit,
  onRedo,
  onDelete,
}: {
  result: BodyResult
  pieces: Piece[]
  onChangeShape: (shape: BodyShape) => void
  onChangeFit: (piece: Piece, fit: Fit | undefined) => void
  onRedo: () => void
  onDelete: () => void
}) {
  const info = SHAPES[result.shape]
  const adjusted = result.source === 'measurements' && result.shape !== result.measuredShape
  const m = result.measurements

  return (
    <div className="grid gap-12">
      <section className="grid gap-6 rounded-2xl border border-steel-blue-300 bg-deep-space-blue p-6 min-[700px]:grid-cols-[1fr_180px] min-[700px]:p-8">
        <div className="grid content-start gap-3">
          <p className="text-sm font-medium text-steel-blue-700">
            {result.source === 'silhouette'
              ? 'Formato escolhido pela silhueta'
              : adjusted
                ? 'Formato escolhido por você'
                : 'Seu formato'}
          </p>
          <h2 className="text-[clamp(2rem,5vw,2.75rem)] font-extrabold text-papaya-whip">{info.name}</h2>
          <p className="text-lg text-papaya-whip">{info.description}</p>
          <p className="max-w-[60ch] text-steel-blue-800">{info.tips}</p>
          {m && (
            <p className="text-sm text-steel-blue-700">
              Suas medidas: tórax {formatCm(m.chest)}, cintura {formatCm(m.waist)}, quadril {formatCm(m.hips)}.
            </p>
          )}
        </div>
        <Silhouette widths={info.widths} className="hidden h-52 justify-self-center min-[700px]:block" />

        <fieldset className="grid gap-2 min-[700px]:col-span-2">
          <legend className="mb-2 text-sm font-medium text-steel-blue-700">
            Não se reconhece? Escolha o formato que combina mais com você.
          </legend>
          <div className="flex flex-wrap gap-2">
            {SHAPE_ORDER.map((shape) => (
              <label key={shape}>
                <input
                  className="peer sr-only"
                  type="radio"
                  name="body-shape"
                  checked={result.shape === shape}
                  onChange={() => onChangeShape(shape)}
                />
                <span className={pill}>
                  {SHAPES[shape].name}
                  {shape === result.measuredShape && ' (pelas medidas)'}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      </section>

      <section aria-labelledby="fits-title">
        <h2 id="fits-title" className={`${sectionTitle} mb-2`}>
          Modelagens que costumam valorizar
        </h2>
        <p className="mb-6 max-w-[60ch] text-steel-blue-700">Use como referência, não como regra.</p>
        <div className="grid gap-4 min-[700px]:grid-cols-3">
          {(Object.keys(FIT_GROUP_LABEL) as FitGroup[]).map((group) => (
            <div key={group} className="rounded-xl border border-steel-blue-300 p-5">
              <h3 className="mb-3 text-lg text-papaya-whip">{FIT_GROUP_LABEL[group]}</h3>
              <ul className="grid gap-2">
                {info.fits[group].map((fit) => (
                  <li key={fit}>
                    <span className="font-semibold text-papaya-whip">{fitLabel(fit)}</span>
                    <span className="block text-sm text-steel-blue-700">
                      {FITS.find((item) => item.value === fit)?.hint}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <WardrobeFits pieces={pieces} shape={result.shape} onChangeFit={onChangeFit} />

      <div className="flex flex-wrap gap-3 border-t border-steel-blue-300 pt-8">
        <button type="button" className={buttonSecondary} onClick={onRedo}>
          Refazer
        </button>
        <button
          type="button"
          className="inline-flex h-12.5 cursor-pointer items-center px-2 font-semibold text-brick-red-800 underline underline-offset-4 hover:text-brick-red-900"
          onClick={() => {
            if (window.confirm('Apagar o resultado do seu formato de corpo?')) onDelete()
          }}
        >
          Apagar meu resultado
        </button>
      </div>
    </div>
  )
}

function WardrobeFits({
  pieces,
  shape,
  onChangeFit,
}: {
  pieces: Piece[]
  shape: BodyShape
  onChangeFit: (piece: Piece, fit: Fit | undefined) => void
}) {
  const clothes = pieces.filter((piece) => CLOTHING_CATEGORIES.has(piece.category))
  const recommended = clothes.filter((piece) => fitIsRecommended(shape, piece.category, piece.fit))
  const withoutFit = clothes.filter((piece) => !piece.fit)
  const others = clothes.filter((piece) => piece.fit && !fitIsRecommended(shape, piece.category, piece.fit))

  const groups = [
    { id: 'recommended', title: 'Valorizam seu formato', items: recommended },
    { id: 'without', title: 'Sem modelagem definida', items: withoutFit },
    { id: 'others', title: 'Outras peças', items: others },
  ].filter((group) => group.items.length > 0)

  return (
    <section aria-labelledby="wardrobe-fit-title">
      <h2 id="wardrobe-fit-title" className={`${sectionTitle} mb-2`}>
        No seu guarda-roupa
      </h2>
      <p className="mb-6 max-w-[60ch] text-steel-blue-700">
        Defina ou corrija a modelagem de cada roupa aqui mesmo. As peças mudam de grupo na hora.
      </p>

      {clothes.length === 0 ? (
        <div className="grid justify-items-start gap-4 rounded-2xl border-[1.5px] border-dashed border-steel-blue-300 p-6">
          <p className="text-steel-blue-800">Cadastre suas roupas para ver quais modelagens você já tem.</p>
          <a className={buttonSecondary} href={routeHref['guarda-roupa']}>
            Ir para o guarda-roupa
          </a>
        </div>
      ) : (
        <div className="grid gap-8">
          {groups.map((group) => (
            <div key={group.id}>
              <h3 className="mb-3 text-lg text-papaya-whip">
                {group.title} <span className="font-sans text-base font-normal text-steel-blue-700">({group.items.length})</span>
              </h3>
              <ul className="grid gap-3 min-[600px]:grid-cols-2 min-[960px]:grid-cols-3">
                {group.items.map((piece) => (
                  <li
                    key={piece.id}
                    className="grid grid-cols-[72px_1fr] items-center gap-3 rounded-xl border border-steel-blue-300 bg-deep-space-blue p-3"
                  >
                    <PieceThumb piece={piece} />
                    <div className="grid min-w-0 gap-1.5">
                      <p className="truncate font-semibold text-papaya-whip">{piece.name}</p>
                      <p className="text-sm text-steel-blue-700">{categoryLabel(piece.category)}</p>
                      <label className="sr-only" htmlFor={`fit-${piece.id}`}>
                        Modelagem de {piece.name}
                      </label>
                      <select
                        id={`fit-${piece.id}`}
                        className={`${input} select-chevron h-10 cursor-pointer pr-10 text-sm`}
                        value={piece.fit ?? ''}
                        onChange={(event) => onChangeFit(piece, (event.target.value || undefined) as Fit | undefined)}
                      >
                        <option value="">Modelagem não definida</option>
                        {FITS.map((fit) => (
                          <option key={fit.value} value={fit.value}>
                            {fit.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
      {clothes.length > 0 && clothes.length < pieces.length && (
        <p className="mt-4 text-sm text-steel-blue-700">Calçados e acessórios não têm modelagem e não aparecem aqui.</p>
      )}
    </section>
  )
}
