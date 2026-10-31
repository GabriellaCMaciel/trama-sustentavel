import { useRef, useState } from 'react'
import { ContrastResultView } from '../components/ContrastResultView'
import { FacePointPicker } from '../components/FacePointPicker'
import { PhotoPicker } from '../components/PhotoPicker'
import { useContrast } from '../hooks/useContrast'
import { usePieces } from '../hooks/usePieces'
import { buildResult } from '../lib/contrast'
import type { ContrastLevel, FeatureKey } from '../lib/contrast'
import { sectionTitle } from '../ui'

const PHOTO_TIPS = [
  'Luz natural de frente, perto de uma janela. Evite luz amarela e flash.',
  'Sem filtro e sem óculos escuros. Maquiagem leve.',
  'O cabelo precisa aparecer. Se for tingido, vale a cor atual.',
]

export function ContrastPage() {
  const { result, loading, error, save, changeLevel, remove } = useContrast()
  const { pieces } = usePieces()
  const [redoing, setRedoing] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const fileInput = useRef<HTMLInputElement>(null)

  const showFlow = !result || redoing

  function resetPhoto() {
    setFile(null)
    if (fileInput.current) fileInput.current.value = ''
  }

  async function handleDone(samples: Record<FeatureKey, string>) {
    setActionError(null)
    try {
      await save(buildResult(samples))
      setRedoing(false)
      resetPhoto()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch {
      setActionError('Não foi possível salvar o resultado. Tente de novo.')
    }
  }

  async function handleAction(action: () => Promise<void>) {
    setActionError(null)
    try {
      await action()
    } catch {
      setActionError('Não foi possível salvar a mudança. Tente de novo.')
    }
  }

  return (
    <>
      <div className="mb-10">
        <h1 className="text-[clamp(2.25rem,6vw,3.5rem)] font-extrabold tracking-[-0.03em] text-papaya-whip">
          Meu contraste
        </h1>
        <p className="mt-3 max-w-[60ch] text-lg text-steel-blue-700">
          Contraste é a diferença de claridade entre sua pele, seu cabelo e seus olhos. Ele ajuda a escolher
          combinações de roupa que valorizam seu rosto.
        </p>
      </div>

      {error && (
        <p className="mb-6 text-brick-red-800" role="alert">
          {error}
        </p>
      )}
      {actionError && (
        <p className="mb-6 text-brick-red-800" role="alert">
          {actionError}
        </p>
      )}

      {loading ? (
        <p className="text-steel-blue-700">Carregando…</p>
      ) : showFlow ? (
        <section aria-labelledby="flow-title" className="grid gap-8">
          {!file ? (
            <div className="grid items-start gap-8 min-[880px]:grid-cols-[1fr_380px]">
              <div>
                <h2 id="flow-title" className={`${sectionTitle} mb-4`}>
                  1. Escolha uma foto do seu rosto
                </h2>
                <ul className="grid gap-3">
                  {PHOTO_TIPS.map((tip) => (
                    <li key={tip} className="border-l-[3px] border-brick-red pl-4 text-steel-blue-800">
                      {tip}
                    </li>
                  ))}
                </ul>
                <p className="mt-6 max-w-[60ch] text-sm text-steel-blue-700">
                  A foto não sai do seu aparelho e não é salva. Só guardamos as três cores que você marcar e o
                  resultado.
                </p>
              </div>
              <div className="grid gap-2">
                <span className="p-0 text-sm font-medium text-steel-blue-700" id="face-photo-label">
                  Foto do rosto
                </span>
                <PhotoPicker id="face-photo" file={file} inputRef={fileInput} onChange={setFile} />
                {redoing && (
                  <button
                    type="button"
                    className="justify-self-start py-2 text-steel-blue-700 underline underline-offset-4 hover:text-papaya-whip"
                    onClick={() => setRedoing(false)}
                  >
                    Voltar ao meu resultado
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div>
              <h2 id="flow-title" className={`${sectionTitle} mb-6`}>
                2. Toque na pele, no cabelo e no olho
              </h2>
              <FacePointPicker file={file} onDone={handleDone} onCancel={resetPhoto} />
            </div>
          )}
        </section>
      ) : (
        result && (
          <ContrastResultView
            result={result}
            pieces={pieces}
            onChangeLevel={(level: ContrastLevel) => handleAction(() => changeLevel(level))}
            onRedo={() => {
              resetPhoto()
              setRedoing(true)
            }}
            onDelete={() => handleAction(remove)}
          />
        )
      )}
    </>
  )
}
