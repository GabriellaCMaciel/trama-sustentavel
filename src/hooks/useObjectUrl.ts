import { useEffect, useState } from 'react'

interface Entry {
  blob: Blob
  url: string
}

/** Cria um endereço temporário para mostrar uma foto e o libera quando não é mais usado. */
export function useObjectUrl(blob: Blob | null): string | undefined {
  const [entry, setEntry] = useState<Entry>()

  useEffect(() => {
    if (!blob) return
    const url = URL.createObjectURL(blob)
    // O endereço é um recurso externo do navegador e precisa ser liberado no cleanup,
    // por isso ele é criado aqui e não durante a renderização.
    // oxlint-disable-next-line react/set-state-in-effect
    setEntry({ blob, url })
    return () => URL.revokeObjectURL(url)
  }, [blob])

  // Só usa o endereço se ele for da foto atual. Um endereço de foto anterior já foi liberado.
  return blob && entry?.blob === blob ? entry.url : undefined
}
