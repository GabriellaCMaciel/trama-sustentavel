import { useState } from 'react'
import { SAMPLE_COUNT } from '../lib/sampleWardrobe'
import type { Piece } from '../types'
import { buttonPrimaryWrap } from '../ui'

/** Botão que preenche o guarda-roupa com as peças de exemplo. */
export function TrySampleButton({ onAdd, className = '' }: { onAdd: () => Promise<void>; className?: string }) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleClick() {
    setBusy(true)
    setError(null)
    try {
      await onAdd()
    } catch {
      setError('Não foi possível adicionar as peças de exemplo. Tente de novo.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className={`grid justify-items-start gap-2 ${className}`}>
      <button type="button" className={buttonPrimaryWrap} disabled={busy} onClick={handleClick}>
        {busy ? 'Adicionando…' : 'Experimentar com peças de exemplo'}
      </button>
      <p className="text-sm text-steel-blue-700">
        {SAMPLE_COUNT} peças ilustradas para ver looks e cápsula funcionando. Dá para apagar depois.
      </p>
      {error && (
        <p className="text-brick-red-800" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

/** Aviso mostrado enquanto houver peças de exemplo no guarda-roupa. */
export function SampleNotice({ pieces, onRemove }: { pieces: Piece[]; onRemove: () => Promise<void> }) {
  const [error, setError] = useState<string | null>(null)
  const count = pieces.filter((piece) => piece.sample).length
  if (count === 0) return null

  async function handleRemove() {
    if (!window.confirm('Apagar as peças de exemplo? Suas peças continuam no guarda-roupa.')) return
    setError(null)
    try {
      await onRemove()
    } catch {
      setError('Não foi possível apagar as peças de exemplo. Tente de novo.')
    }
  }

  return (
    <div
      className="mb-8 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 rounded-xl border-l-4 border-brick-red bg-deep-space-blue px-4 py-3"
      role="note"
    >
      <p className="text-steel-blue-800">
        {count === 1 ? 'Há 1 peça de exemplo' : `Há ${count} peças de exemplo`} no seu guarda-roupa, para experimentar o
        site.
      </p>
      <button
        type="button"
        className="cursor-pointer font-semibold text-papaya-whip underline underline-offset-4 hover:text-papaya-whip-400"
        onClick={handleRemove}
      >
        Apagar peças de exemplo
      </button>
      {error && (
        <p className="w-full text-brick-red-800" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
