import { useEffect, useState } from 'react'
import { HangerIcon } from '../components/Icons'
import { PieceCard } from '../components/PieceCard'
import { PieceForm } from '../components/PieceForm'
import { usePieces } from '../hooks/usePieces'
import type { NewPiece } from '../types'

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
      <div className="page-intro">
        <h1>Meu guarda-roupa</h1>
        <p>Cadastre as peças que você tem. Elas serão a base dos seus looks e da sua cápsula.</p>
      </div>

      <div className="layout">
        <section className="panel" aria-labelledby="add-title">
          <h2 id="add-title">Adicionar peça</h2>
          <PieceForm onAdd={handleAdd} />
        </section>

        <section className="closet" aria-labelledby="closet-title">
          <div className="closet-heading">
            <h2 id="closet-title">Minhas peças</h2>
            <span className="count">{pieces.length === 1 ? '1 peça' : `${pieces.length} peças`}</span>
          </div>

          {error && <p className="form-error" role="alert">{error}</p>}
          {removeError && <p className="form-error" role="alert">{removeError}</p>}

          {loading ? (
            <p className="muted">Carregando…</p>
          ) : pieces.length === 0 ? (
            <div className="empty">
              <HangerIcon className="empty-icon" />
              <p>Seu guarda-roupa está vazio. Adicione a primeira peça no formulário.</p>
            </div>
          ) : (
            <div className="piece-grid">
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

      <div className="toast-region" role="status" aria-live="polite">
        {notice && <p className="toast">{notice}</p>}
      </div>
    </>
  )
}
