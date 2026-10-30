import { useCallback, useEffect, useState } from 'react'
import { deletePiece, getAllPieces, savePiece } from '../lib/db'
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

  return { pieces, loading, error, addPiece, removePiece }
}
