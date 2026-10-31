import { useEffect, useState } from 'react'
import { HangerIcon } from '../components/Icons'
import { PieceCard } from '../components/PieceCard'
import { PieceForm } from '../components/PieceForm'
import { usePieces } from '../hooks/usePieces'
import type { NewPiece } from '../types'
import { sectionTitle } from '../ui'

export function WardrobePage() {
  const { pieces, loading, error, addPiece, removePiece } = usePieces()
  const [removeError, setRemoveError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [newestId, setNewestId] = useState<string | null>(null)

  useEffect(() => {
    if (!notice) return
    const timer = window.setTimeout(() => setNotice(null), 3200)
    return () => window.clearTimeout(timer)
  }, [notice])

  async function handleAdd(input: NewPiece) {
    const id = await addPiece(input)
    setNewestId(id)
    setNotice(`"${input.name}" foi adicionada ao guarda-roupa.`)
  }

  async function handleRemove(id: string) {
    setRemoveError(null)
    try {
      await removePiece(id)
    } catch {
      setRemoveError('Não foi possível remover a peça. Tente de novo.')
    }
  }

  return (
    <>
      <div className="mb-10">
        <h1 className="text-[clamp(2.25rem,6vw,3.5rem)] font-extrabold tracking-[-0.03em] text-papaya-whip">
          Meu guarda-roupa
        </h1>
        <p className="mt-3 max-w-[52ch] text-lg text-steel-blue-700">
          Cadastre as peças que você tem. Elas serão a base dos seus looks e da sua cápsula.
        </p>
      </div>

      <div className="grid items-start gap-12 min-[880px]:grid-cols-[380px_1fr]">
        <section
          className="rounded-2xl border border-steel-blue-300 bg-deep-space-blue p-6 min-[880px]:sticky min-[880px]:top-22"
          aria-labelledby="add-title"
        >
          <h2 id="add-title" className={`${sectionTitle} mb-5`}>
            Adicionar peça
          </h2>
          <PieceForm onAdd={handleAdd} />
        </section>

        <section aria-labelledby="closet-title">
          <div className="mb-6 flex items-baseline gap-3">
            <h2 id="closet-title" className={sectionTitle}>
              Minhas peças
            </h2>
            <span className="text-steel-blue-700">{pieces.length === 1 ? '1 peça' : `${pieces.length} peças`}</span>
          </div>

          {error && (
            <p className="text-brick-red-800" role="alert">
              {error}
            </p>
          )}
          {removeError && (
            <p className="text-brick-red-800" role="alert">
              {removeError}
            </p>
          )}

          {loading ? (
            <p className="text-steel-blue-700">Carregando…</p>
          ) : pieces.length === 0 ? (
            <div className="grid justify-items-center gap-3 rounded-2xl border-[1.5px] border-dashed border-steel-blue-300 px-6 py-14 text-center text-steel-blue-700">
              <HangerIcon className="w-18 text-steel-blue-400" />
              <p className="max-w-[32ch]">Seu guarda-roupa está vazio. Adicione a primeira peça no formulário.</p>
            </div>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-x-5 gap-y-7 min-[880px]:grid-cols-[repeat(auto-fill,minmax(190px,1fr))]">
              {pieces.map((piece) => (
                <PieceCard
                  key={piece.id}
                  piece={piece}
                  isNew={piece.id === newestId}
                  onRemove={handleRemove}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      <div
        className="pointer-events-none fixed inset-x-4 bottom-5 flex justify-center"
        role="status"
        aria-live="polite"
      >
        {notice && (
          <p className="max-w-[420px] animate-toast-in rounded-[10px] border-l-4 border-brick-red bg-papaya-whip px-4.5 py-3 text-deep-space-blue-200 shadow-[0_10px_30px_rgb(0_19_29/0.7)]">
            {notice}
          </p>
        )}
      </div>
    </>
  )
}
