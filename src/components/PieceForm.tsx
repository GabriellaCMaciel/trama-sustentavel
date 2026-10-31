import { useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { prepareImage } from '../lib/image'
import { CATEGORIES, OCCASIONS } from '../types'
import type { Category, NewPiece, Occasion } from '../types'
import { buttonPrimary, fieldLabel, input } from '../ui'
import { PhotoPicker } from './PhotoPicker'

const field = 'm-0 grid min-w-0 gap-2 border-0 p-0'

interface PieceFormProps {
  onAdd: (piece: NewPiece) => Promise<unknown>
}

export function PieceForm({ onAdd }: PieceFormProps) {
  const [name, setName] = useState('')
  const [category, setCategory] = useState<Category>('top')
  const [color, setColor] = useState('#1a1a1a')
  const [occasions, setOccasions] = useState<Occasion[]>(['casual'])
  const [file, setFile] = useState<File | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInput = useRef<HTMLInputElement>(null)

  function toggleOccasion(value: Occasion) {
    setOccasions((current) =>
      current.includes(value) ? current.filter((item) => item !== value) : [...current, value],
    )
  }

  function reset() {
    setName('')
    setCategory('top')
    setColor('#1a1a1a')
    setOccasions(['casual'])
    setFile(null)
    if (fileInput.current) fileInput.current.value = ''
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    const trimmedName = name.trim()
    if (!trimmedName) {
      setError('Dê um nome para a peça.')
      return
    }
    if (!file) {
      setError('Escolha uma foto da peça.')
      return
    }

    setBusy(true)
    try {
      const photo = await prepareImage(file)
      await onAdd({ name: trimmedName, category, color, occasions, photo })
      reset()
    } catch {
      setError('Não foi possível salvar a peça. Tente com outra foto.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <form className="grid gap-5" onSubmit={handleSubmit} noValidate>
      <div className={field}>
        {/* O campo de arquivo usa este texto como nome acessível (aria-labelledby). */}
        <span className={fieldLabel} id="piece-photo-label">
          Foto da peça
        </span>
        <PhotoPicker id="piece-photo" file={file} inputRef={fileInput} onChange={setFile} />
      </div>

      <div className={field}>
        <label className={fieldLabel} htmlFor="piece-name">
          Nome
        </label>
        <input
          id="piece-name"
          className={input}
          type="text"
          value={name}
          maxLength={60}
          placeholder="Ex.: Camisa de linho branca"
          onChange={(event) => setName(event.target.value)}
        />
      </div>

      <div className="grid grid-cols-[1fr_auto] items-end gap-4">
        <div className={field}>
          <label className={fieldLabel} htmlFor="piece-category">
            Categoria
          </label>
          <select
            id="piece-category"
            className={`${input} select-chevron cursor-pointer pr-10`}
            value={category}
            onChange={(event) => setCategory(event.target.value as Category)}
          >
            {CATEGORIES.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        <div className={field}>
          <label className={fieldLabel} htmlFor="piece-color">
            Cor principal
          </label>
          <span className="flex h-11.5 items-center gap-2.5 rounded-[10px] border border-steel-blue-400 bg-deep-space-blue-200 pr-3.5 pl-1.5">
            <input
              id="piece-color"
              className="color-swatch size-8.5 cursor-pointer border-0 bg-transparent p-0"
              type="color"
              value={color}
              onChange={(event) => setColor(event.target.value)}
            />
            <span className="text-sm text-steel-blue-700 tabular-nums" aria-hidden="true">
              {color.toUpperCase()}
            </span>
          </span>
        </div>
      </div>

      <fieldset className={field}>
        <legend className={`${fieldLabel} mb-2`}>Ocasiões</legend>
        <div className="flex flex-wrap gap-2">
          {OCCASIONS.map((item) => (
            <label key={item.value} className="group">
              <input
                className="peer sr-only"
                type="checkbox"
                checked={occasions.includes(item.value)}
                onChange={() => toggleOccasion(item.value)}
              />
              <span className="inline-block cursor-pointer rounded-full border border-steel-blue-400 px-4 py-1.75 text-[0.9375rem] text-papaya-whip transition-colors group-hover:border-papaya-whip peer-checked:border-steel-blue peer-checked:bg-steel-blue peer-checked:text-deep-space-blue-200 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-3 peer-focus-visible:outline-papaya-whip-400">
                {item.label}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <p className="text-brick-red-800 empty:-mt-5" role="alert">
        {error}
      </p>

      <button type="submit" className={`${buttonPrimary} cursor-pointer`} disabled={busy}>
        {busy ? 'Salvando…' : 'Adicionar ao guarda-roupa'}
      </button>
    </form>
  )
}
