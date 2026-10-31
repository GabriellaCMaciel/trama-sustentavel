import { useCallback, useEffect, useState } from 'react'
import type { BodyResult, BodyShape } from '../lib/body'
import { deleteBodyResult, getBodyResult, saveBodyResult } from '../lib/db'

export function useBody() {
  const [result, setResult] = useState<BodyResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    getBodyResult()
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

  const save = useCallback(async (next: BodyResult) => {
    await saveBodyResult(next)
    setResult(next)
  }, [])

  const changeShape = useCallback(
    async (shape: BodyShape) => {
      if (!result) return
      const next = { ...result, shape }
      await saveBodyResult(next)
      setResult(next)
    },
    [result],
  )

  const remove = useCallback(async () => {
    await deleteBodyResult()
    setResult(null)
  }, [])

  return { result, loading, error, save, changeShape, remove }
}
