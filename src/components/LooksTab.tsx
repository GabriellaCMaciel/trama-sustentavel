import { useMemo, useState } from 'react'
import { routeHref } from '../hooks/useHashRoute'
import { REASON_LABEL, rankLooks } from '../lib/looks'
import type { Look, StyleProfile } from '../lib/looks'
import { OCCASIONS, categoryLabel } from '../types'
import type { Occasion, Piece } from '../types'
import { buttonSecondary } from '../ui'
import { PieceThumb } from './ContrastResultView'

const PAGE_SIZE = 12

const pill =
  'inline-block cursor-pointer rounded-full border border-steel-blue-400 px-4 py-1.75 text-papaya-whip transition-colors hover:border-papaya-whip peer-checked:border-steel-blue peer-checked:bg-steel-blue peer-checked:text-deep-space-blue-200 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-3 peer-focus-visible:outline-papaya-whip-400'

interface LooksTabProps {
  pieces: Piece[]
  looks: Look[]
  profile: StyleProfile
}

export function LooksTab({ pieces, looks, profile }: LooksTabProps) {
  const [occasion, setOccasion] = useState<Occasion | 'all'>('all')
  const [shown, setShown] = useState(PAGE_SIZE)

  const filtered = useMemo(
    () => (occasion === 'all' ? looks : looks.filter((look) => look.occasions.includes(occasion))),
    [looks, occasion],
  )
  const ranked = useMemo(() => rankLooks(filtered, shown), [filtered, shown])

  const missing = missingForLooks(pieces)

  return (
    <>
      <p className="mb-8 max-w-[60ch] text-lg text-steel-blue-700">
        Combinações montadas só com as peças que você já tem: parte de cima e de baixo (ou peça única) e calçado.
      </p>

      <ProfileHint profile={profile} />

      {missing ? (
        <EmptyState text={missing} />
      ) : (
        <>
          <fieldset className="mb-6">
            <legend className="mb-2 text-sm font-medium text-steel-blue-700">Ocasião</legend>
            <div className="flex flex-wrap gap-2">
              {[{ value: 'all' as const, label: 'Todas' }, ...OCCASIONS].map((item) => (
                <label key={item.value}>
                  <input
                    className="peer sr-only"
                    type="radio"
                    name="look-occasion"
                    checked={occasion === item.value}
                    onChange={() => {
                      setOccasion(item.value)
                      setShown(PAGE_SIZE)
                    }}
                  />
                  <span className={pill}>{item.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <p className="mb-6 text-steel-blue-800" aria-live="polite">
            {filtered.length === 0
              ? 'Nenhum look para essa ocasião ainda.'
              : filtered.length === 1
                ? '1 look encontrado.'
                : `${filtered.length} looks encontrados.`}
          </p>

          {filtered.length === 0 ? (
            <EmptyState
              text={
                looks.length === 0
                  ? 'Nenhuma combinação do seu guarda-roupa passou nas regras de cor e contraste. Veja na aba Cápsula quais peças ajudariam.'
                  : 'Marque essa ocasião em mais peças do guarda-roupa ou escolha outra ocasião.'
              }
              href={looks.length === 0 ? routeHref['looks-capsula'] : routeHref['guarda-roupa']}
              linkLabel={looks.length === 0 ? 'Ver a cápsula' : 'Ir para o guarda-roupa'}
            />
          ) : (
            <>
              <ul className="grid gap-4 min-[700px]:grid-cols-2 min-[1040px]:grid-cols-3" aria-label="Looks sugeridos">
                {ranked.map((look) => (
                  <LookCard key={look.id} look={look} />
                ))}
              </ul>
              {ranked.length < filtered.length && (
                <button
                  type="button"
                  className={`${buttonSecondary} mt-6`}
                  onClick={() => setShown((current) => current + PAGE_SIZE)}
                >
                  Ver mais looks
                </button>
              )}
            </>
          )}
        </>
      )}
    </>
  )
}

function LookCard({ look }: { look: Look }) {
  const complements = [look.outerwear, look.accessory].filter((piece): piece is Piece => piece !== null)
  return (
    <li className="grid content-start gap-4 rounded-2xl border border-steel-blue-300 bg-deep-space-blue p-4">
      <div className="flex gap-2">
        {look.pieces.map((piece) => (
          <PieceThumb key={piece.id} piece={piece} />
        ))}
      </div>
      <ul className="grid gap-0.5">
        {look.pieces.map((piece) => (
          <li key={piece.id} className="text-papaya-whip">
            {piece.name} <span className="text-sm text-steel-blue-700">({categoryLabel(piece.category).toLowerCase()})</span>
          </li>
        ))}
      </ul>
      {complements.length > 0 && (
        <p className="text-sm text-steel-blue-800">
          Para completar: {complements.map((piece) => piece.name.charAt(0).toLowerCase() + piece.name.slice(1)).join(' e ')}.
        </p>
      )}
      {look.reasons.length > 0 && (
        <ul className="flex flex-wrap gap-1.5">
          {look.reasons.map((reason) => (
            <li key={reason} className="rounded-full bg-steel-blue-300 px-2.5 py-0.5 text-xs font-medium text-papaya-whip">
              {REASON_LABEL[reason]}
            </li>
          ))}
        </ul>
      )}
    </li>
  )
}

/** O que falta no guarda-roupa para existir qualquer look. */
function missingForLooks(pieces: Piece[]): string | null {
  const has = (category: Piece['category']) => pieces.some((piece) => piece.category === category)
  if (pieces.length === 0) return 'Cadastre suas peças para ver os looks que dá para montar com elas.'
  const hasBase = (has('top') && has('bottom')) || has('one-piece')
  let baseMissing: string | null = null
  if (!hasBase) {
    if (has('top')) baseMissing = 'uma parte de baixo (ou uma peça única)'
    else if (has('bottom')) baseMissing = 'uma parte de cima (ou uma peça única)'
    else baseMissing = 'uma parte de cima e uma de baixo (ou uma peça única)'
  }
  const shoesMissing = has('shoes') ? null : 'um calçado'
  const missing = [baseMissing, shoesMissing].filter(Boolean)
  return missing.length > 0 ? `Cadastre ${missing.join(' e ')} para montar looks.` : null
}

export function ProfileHint({ profile }: { profile: StyleProfile }) {
  const missing = [
    !profile.contrastLevel && { label: 'seu contraste', href: routeHref['perfil-contraste'] },
    !profile.shape && { label: 'o formato do seu corpo', href: routeHref['perfil-corpo'] },
  ].filter((item): item is { label: string; href: string } => Boolean(item))
  if (missing.length === 0) return null
  return (
    <p className="mb-8 max-w-[70ch] rounded-xl border-l-4 border-brick-red bg-deep-space-blue px-4 py-3 text-steel-blue-800">
      Os looks ficam mais personalizados quando você descobre{' '}
      {missing.map((item, index) => (
        <span key={item.href}>
          {index > 0 && ' e '}
          <a className="font-semibold text-papaya-whip underline underline-offset-4" href={item.href}>
            {item.label}
          </a>
        </span>
      ))}
      .
    </p>
  )
}

function EmptyState({ text, href = routeHref['guarda-roupa'], linkLabel = 'Ir para o guarda-roupa' }: { text: string; href?: string; linkLabel?: string }) {
  return (
    <div className="grid justify-items-start gap-4 rounded-2xl border-[1.5px] border-dashed border-steel-blue-300 p-6">
      <p className="text-steel-blue-800">{text}</p>
      <a className={buttonSecondary} href={href}>
        {linkLabel}
      </a>
    </div>
  )
}
