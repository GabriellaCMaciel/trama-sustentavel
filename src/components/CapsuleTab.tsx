import { useMemo } from 'react'
import { routeHref } from '../hooks/useHashRoute'
import { buildCapsule, idlePieces, looksPerPiece, purchaseSuggestions } from '../lib/looks'
import type { Look, StyleProfile } from '../lib/looks'
import { categoryLabel } from '../types'
import type { Piece } from '../types'
import { buttonSecondary, sectionTitle } from '../ui'
import { PieceThumb } from './ContrastResultView'
import { ProfileHint } from './LooksTab'

interface CapsuleTabProps {
  pieces: Piece[]
  looks: Look[]
  profile: StyleProfile
}

function plural(count: number, one: string, many: string) {
  return `${count} ${count === 1 ? one : many}`
}

export function CapsuleTab({ pieces, looks, profile }: CapsuleTabProps) {
  const capsule = useMemo(() => buildCapsule(pieces, looks, profile), [pieces, looks, profile])
  const idle = useMemo(() => idlePieces(pieces, looks), [pieces, looks])
  const suggestions = useMemo(() => purchaseSuggestions(pieces, profile), [pieces, profile])
  const counts = useMemo(() => {
    const map = looksPerPiece(looks)
    looks.forEach((look) => {
      if (look.outerwear) map.set(look.outerwear.id, (map.get(look.outerwear.id) ?? 0) + 1)
    })
    return map
  }, [looks])

  if (pieces.length === 0) {
    return (
      <div className="grid justify-items-start gap-4 rounded-2xl border-[1.5px] border-dashed border-steel-blue-300 p-6">
        <p className="text-steel-blue-800">Cadastre suas peças para ver a cápsula que já existe no seu guarda-roupa.</p>
        <a className={buttonSecondary} href={routeHref['guarda-roupa']}>
          Ir para o guarda-roupa
        </a>
      </div>
    )
  }

  return (
    <div className="grid gap-14">
      <div className="grid gap-8 [&>p:last-child]:mb-0">
        <p className="max-w-[60ch] text-lg text-steel-blue-700">
          Uma cápsula é um conjunto pequeno de peças que combinam quase todas entre si. Esta é a que já existe dentro
          do seu guarda-roupa.
        </p>
        <ProfileHint profile={profile} />
      </div>

      <section aria-labelledby="capsule-title">
        <h2 id="capsule-title" className={`${sectionTitle} mb-2`}>
          Sua cápsula
        </h2>
        {capsule.pieces.length === 0 ? (
          <p className="text-steel-blue-800">
            Ainda não dá para montar uma cápsula: nenhuma combinação do guarda-roupa forma um look completo. As
            sugestões de compra abaixo mostram o que mais ajudaria.
          </p>
        ) : (
          <>
            <p className="mb-6 max-w-[60ch] text-steel-blue-800">
              Com {plural(capsule.pieces.length, 'peça', 'peças')}, sua cápsula forma{' '}
              <strong className="text-papaya-whip">{plural(capsule.looks.length, 'look', 'looks')}</strong>. No guarda-roupa
              inteiro, são {plural(looks.length, 'look', 'looks')} com {plural(pieces.length, 'peça', 'peças')}.
            </p>
            <ul className="grid grid-cols-2 gap-4 min-[480px]:grid-cols-3 min-[700px]:grid-cols-4 min-[960px]:grid-cols-6">
              {capsule.pieces.map((piece) => (
                <li key={piece.id} className="grid content-start gap-2">
                  <PieceThumb piece={piece} />
                  <p className="leading-tight text-papaya-whip">{piece.name}</p>
                  <p className="text-sm text-steel-blue-700">
                    {categoryLabel(piece.category)}, em {plural(counts.get(piece.id) ?? 0, 'look', 'looks')}
                  </p>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>

      <section aria-labelledby="idle-title">
        <h2 id="idle-title" className={`${sectionTitle} mb-2`}>
          Peças paradas
        </h2>
        {idle.length === 0 ? (
          <p className="text-steel-blue-800">Todas as suas roupas e calçados entram em pelo menos um look.</p>
        ) : (
          <>
            <p className="mb-6 max-w-[60ch] text-steel-blue-800">
              Estas peças ainda não entram em nenhum look. Antes de deixar de lado, tente nesta ordem: combinar com uma
              peça nova da lista abaixo, consertar ou customizar, e trocar ou doar.
            </p>
            <ul className="grid gap-3 min-[600px]:grid-cols-2 min-[960px]:grid-cols-3">
              {idle.map((piece) => (
                <li
                  key={piece.id}
                  className="grid grid-cols-[64px_1fr] items-center gap-3 rounded-xl border border-steel-blue-300 bg-deep-space-blue p-3"
                >
                  <PieceThumb piece={piece} />
                  <div>
                    <p className="font-semibold text-papaya-whip">{piece.name}</p>
                    <p className="text-sm text-steel-blue-700">{categoryLabel(piece.category)}</p>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>

      <section aria-labelledby="shopping-title">
        <h2 id="shopping-title" className={`${sectionTitle} mb-2`}>
          Se for comprar
        </h2>
        <p className="mb-6 max-w-[60ch] rounded-xl border-l-4 border-brick-red bg-deep-space-blue px-4 py-3 text-steel-blue-800">
          Antes de comprar uma peça nova, procure em brechó, troque com amigos ou veja se uma peça parada resolve com um
          conserto.
        </p>
        {suggestions.length === 0 ? (
          <p className="text-steel-blue-800">
            Nenhuma peça neutra simples aumentaria seus looks agora. Seu guarda-roupa já está bem aproveitado.
          </p>
        ) : (
          <ol className="grid gap-3 min-[700px]:grid-cols-3">
            {suggestions.map((suggestion) => (
              <li
                key={suggestion.name}
                className="grid grid-cols-[48px_1fr] items-center gap-4 rounded-xl border border-steel-blue-300 bg-deep-space-blue p-4"
              >
                <span
                  className="size-12 rounded-lg border border-steel-blue-600"
                  style={{ backgroundColor: suggestion.color }}
                  aria-hidden="true"
                />
                <div>
                  <p className="font-semibold text-papaya-whip">{suggestion.name}</p>
                  <p className="text-sm text-steel-blue-800">
                    Cria <strong className="text-papaya-whip">{plural(suggestion.newLooks, 'look novo', 'looks novos')}</strong>{' '}
                    com o que você já tem
                  </p>
                </div>
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  )
}
