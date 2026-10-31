import { useCallback, useEffect, useState } from 'react'
import { deletePiece, deletePieces, getAllPieces, savePiece, savePieces } from '../lib/db'
import { samplePieces } from '../lib/sampleWardrobe'
import type { NewPiece, Piece } from '../types'

export function usePieces() {
  const [pieces, setPieces] = useState<Piece[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    getAllPieces()
      .then((saved) => {
        if (!cancelled) setPieces(saved)
      })
      .catch(() => {
        if (!cancelled) setError('Não foi possível abrir o guarda-roupa salvo neste navegador.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const addPiece = useCallback(async (input: NewPiece) => {
    const piece: Piece = { ...input, id: crypto.randomUUID(), createdAt: Date.now() }
    await savePiece(piece)
    setPieces((current) => [piece, ...current])
    return piece.id
  }, [])

  const removePiece = useCallback(async (id: string) => {
    await deletePiece(id)
    setPieces((current) => current.filter((piece) => piece.id !== id))
  }, [])

  const updatePiece = useCallback(async (piece: Piece) => {
    await savePiece(piece)
    setPieces((current) => current.map((item) => (item.id === piece.id ? piece : item)))
  }, [])

  /** Adiciona o guarda-roupa de exemplo (uma vez só). */
  const addSamples = useCallback(async () => {
    if (pieces.some((piece) => piece.sample)) return
    const now = Date.now()
    // Ordem de criação crescente, para a lista mostrar as peças na ordem da tabela de exemplo.
    const created: Piece[] = samplePieces().map((input, index, all) => ({
      ...input,
      id: crypto.randomUUID(),
      createdAt: now + (all.length - index),
    }))
    await savePieces(created)
    setPieces((current) => [...created, ...current])
  }, [pieces])

  /** Apaga só as peças de exemplo; as peças da pessoa ficam. */
  const removeSamples = useCallback(async () => {
    const ids = pieces.filter((piece) => piece.sample).map((piece) => piece.id)
    await deletePieces(ids)
    setPieces((current) => current.filter((piece) => !piece.sample))
  }, [pieces])

  return { pieces, loading, error, addPiece, removePiece, updatePiece, addSamples, removeSamples }
}
