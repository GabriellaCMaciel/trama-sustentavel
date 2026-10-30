import { useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { useObjectUrl } from '../hooks/useObjectUrl'
import { prepareImage } from '../lib/image'
import { CATEGORIES, OCCASIONS } from '../types'
import type { Category, NewPiece, Occasion } from '../types'

interface PieceFormProps {
  onAdd: (piece: NewPiece) => Promise<void>
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
  const preview = useObjectUrl(file)

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
    <form className="piece-form" onSubmit={handleSubmit} noValidate>
      <div className="field">
        <label htmlFor="piece-photo">Foto da peça</label>
        <input
          id="piece-photo"
          ref={fileInput}
          type="file"
          accept="image/*"
          onChange={(event) => setFile(event.target.files?.[0] ?? null)}
        />
        {preview && <img className="form-preview" src={preview} alt="Prévia da foto escolhida" />}
      </div>

      <div className="field">
        <label htmlFor="piece-name">Nome</label>
        <input
          id="piece-name"
          type="text"
          value={name}
          maxLength={60}
          placeholder="Ex.: Camisa de linho branca"
          onChange={(event) => setName(event.target.value)}
        />
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="piece-category">Categoria</label>
          <select
            id="piece-category"
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

        <div className="field">
          <label htmlFor="piece-color">Cor principal</label>
          <input
            id="piece-color"
            type="color"
            value={color}
            onChange={(event) => setColor(event.target.value)}
          />
        </div>
      </div>

      <fieldset className="field">
        <legend>Ocasiões</legend>
        <div className="checks">
          {OCCASIONS.map((item) => (
            <label key={item.value} className="check">
              <input
                type="checkbox"
                checked={occasions.includes(item.value)}
                onChange={() => toggleOccasion(item.value)}
              />
              {item.label}
            </label>
          ))}
        </div>
      </fieldset>

      <p className="form-error" role="alert">
        {error}
      </p>

      <button type="submit" className="primary" disabled={busy}>
        {busy ? 'Salvando…' : 'Adicionar ao guarda-roupa'}
      </button>
    </form>
  )
}
