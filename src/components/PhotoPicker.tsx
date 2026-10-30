import { useState } from 'react'
import type { DragEvent, RefObject } from 'react'
import { useObjectUrl } from '../hooks/useObjectUrl'
import { CameraIcon } from './Icons'

interface PhotoPickerProps {
  id: string
  file: File | null
  inputRef: RefObject<HTMLInputElement | null>
  onChange: (file: File | null) => void
}

export function PhotoPicker({ id, file, inputRef, onChange }: PhotoPickerProps) {
  const preview = useObjectUrl(file)
  const [dragging, setDragging] = useState(false)

  function handleDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault()
    setDragging(false)
    const dropped = event.dataTransfer.files?.[0]
    if (dropped && dropped.type.startsWith('image/')) onChange(dropped)
  }

  return (
    <label
      htmlFor={id}
      className={`photo-picker${dragging ? ' is-dragging' : ''}${preview ? ' has-photo' : ''}`}
      onDragOver={(event) => {
        event.preventDefault()
        setDragging(true)
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
    >
      <input
        id={id}
        ref={inputRef}
        className="visually-hidden"
        aria-labelledby={`${id}-label`}
        type="file"
        accept="image/*"
        onChange={(event) => onChange(event.target.files?.[0] ?? null)}
      />
      {preview ? (
        <>
          <img className="photo-preview" src={preview} alt="Prévia da foto escolhida" />
          <span className="photo-change">Trocar foto</span>
        </>
      ) : (
        <span className="photo-empty">
          <CameraIcon className="photo-icon" />
          <span className="photo-cta">Escolher foto</span>
          <span className="photo-hint">ou arraste a imagem para cá</span>
        </span>
      )}
    </label>
  )
}
