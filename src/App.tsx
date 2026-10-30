import { useState } from 'react'
import { PieceCard } from './components/PieceCard'
import { PieceForm } from './components/PieceForm'
import { usePieces } from './hooks/usePieces'
import './App.css'

export default function App() {
  const { pieces, loading, error, addPiece, removePiece } = usePieces()
  const [removeError, setRemoveError] = useState<string | null>(null)

  async function handleRemove(id: string) {
    setRemoveError(null)
    try {
      await removePiece(id)
    } catch {
      setRemoveError('Não foi possível remover a peça. Tente de novo.')
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Trama Sustentável</h1>
        <p>Vista-se bem com o que você já tem.</p>
      </header>

      <main>
        <section className="panel" aria-labelledby="add-title">
          <h2 id="add-title">Adicionar peça</h2>
          <PieceForm onAdd={addPiece} />
        </section>

        <section aria-labelledby="closet-title">
          <h2 id="closet-title">
            Meu guarda-roupa <span className="count">{pieces.length === 1 ? '1 peça' : `${pieces.length} peças`}</span>
          </h2>

          {error && <p className="form-error" role="alert">{error}</p>}
          {removeError && <p className="form-error" role="alert">{removeError}</p>}

          {loading ? (
            <p className="muted">Carregando…</p>
          ) : pieces.length === 0 ? (
            <p className="muted">Seu guarda-roupa está vazio. Adicione a primeira peça acima.</p>
          ) : (
            <div className="piece-grid">
              {pieces.map((piece) => (
                <PieceCard key={piece.id} piece={piece} onRemove={handleRemove} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
