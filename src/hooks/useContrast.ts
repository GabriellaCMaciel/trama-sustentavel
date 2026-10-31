import { useCallback, useEffect, useState } from 'react'
import type { ContrastLevel, ContrastResult } from '../lib/contrast'
import { deleteContrastResult, getContrastResult, saveContrastResult } from '../lib/db'

export function useContrast() {
  const [result, setResult] = useState<ContrastResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    getContrastResult()
      .then((saved) => {
        if (!cancelled) setResult(saved)
      })
      .catch(() => {
        if (!cancelled) setError('Não foi possível abrir o resultado salvo neste navegador.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const save = useCallback(async (next: ContrastResult) => {
    await saveContrastResult(next)
    setResult(next)
  }, [])

  const changeLevel = useCallback(
    async (level: ContrastLevel) => {
      if (!result) return
      const next = { ...result, level }
      await saveContrastResult(next)
      setResult(next)
    },
    [result],
  )

  const remove = useCallback(async () => {
    await deleteContrastResult()
    setResult(null)
  }, [])

  return { result, loading, error, save, changeLevel, remove }
}
