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
      className={`relative grid h-45 cursor-pointer place-items-center overflow-hidden rounded-xl border-[1.5px] text-steel-blue-700 transition-colors has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-3 has-[input:focus-visible]:outline-papaya-whip-400 hover:border-papaya-whip hover:bg-deep-space-blue-300 ${
        preview ? 'border-solid' : 'border-dashed'
      } ${dragging ? 'border-papaya-whip bg-deep-space-blue-300' : 'border-steel-blue-400 bg-deep-space-blue-200'}`}
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
        className="sr-only"
        aria-labelledby={`${id}-label`}
        type="file"
        accept="image/*"
        onChange={(event) => onChange(event.target.files?.[0] ?? null)}
      />
      {preview ? (
        <>
          <img className="size-full object-contain" src={preview} alt="Prévia da foto escolhida" />
          <span className="absolute right-2.5 bottom-2.5 rounded-full bg-papaya-whip px-3 py-1 text-[0.8125rem] font-semibold text-deep-space-blue-200">
            Trocar foto
          </span>
        </>
      ) : (
        <span className="grid justify-items-center gap-1 text-center">
          <CameraIcon className="mb-1 w-8 text-brick-red-700" />
          <span className="font-semibold text-papaya-whip">Escolher foto</span>
          <span className="text-sm">ou arraste a imagem para cá</span>
        </span>
      )}
    </label>
  )
}
