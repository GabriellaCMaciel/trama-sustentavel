import { useObjectUrl } from '../hooks/useObjectUrl'
import { categoryLabel, fitLabel, occasionLabel } from '../types'
import type { Piece } from '../types'
import { CloseIcon } from './Icons'

interface PieceCardProps {
  piece: Piece
  isNew: boolean
  onRemove: (id: string) => void
}

export function PieceCard({ piece, isNew, onRemove }: PieceCardProps) {
  const photoUrl = useObjectUrl(piece.photo)

  function handleRemove() {
    if (window.confirm(`Remover "${piece.name}" do guarda-roupa?`)) {
      onRemove(piece.id)
    }
  }

  return (
    <article className={`group flex origin-top flex-col ${isNew ? 'motion-safe:animate-tag-swing' : ''}`}>
      <div className="relative aspect-[4/5] overflow-hidden rounded-t-xl bg-deep-space-blue">
        {photoUrl && <img className="block size-full object-cover" src={photoUrl} alt={`Foto de ${piece.name}`} />}
        <button
          type="button"
          className="absolute top-2 right-2 grid size-8 cursor-pointer place-items-center rounded-full border-0 bg-deep-space-blue-200/75 p-0 text-papaya-whip opacity-0 transition hover:bg-brick-red focus-visible:opacity-100 group-hover:opacity-100 pointer-coarse:opacity-100"
          onClick={handleRemove}
          aria-label={`Remover ${piece.name}`}
          title="Remover"
        >
          <CloseIcon className="w-4.5" />
        </button>
      </div>

      {/* A parte de baixo imita a etiqueta de uma roupa. */}
      <div className="clip-tag relative grid gap-1.5 bg-papaya-whip px-3.5 pt-7 pb-4.5 text-deep-space-blue-200">
        <span
          className="absolute top-2.5 left-[calc(50%-4.5px)] size-2.25 rounded-full bg-deep-space-blue-200 ring-2 ring-brick-red"
          aria-hidden="true"
        />
        <h3 className="text-lg leading-tight font-semibold [overflow-wrap:anywhere]">{piece.name}</h3>
        <p className="flex items-center gap-2 text-sm text-deep-space-blue">
          <span
            className="size-3 flex-none rounded-full ring-1 ring-deep-space-blue-200/35"
            style={{ backgroundColor: piece.color }}
            aria-hidden="true"
          />
          <span>
            {categoryLabel(piece.category)}
            {piece.fit && `, ${fitLabel(piece.fit).toLowerCase()}`}
          </span>
        </p>
        {piece.occasions.length > 0 && (
          <ul className="mt-1 flex flex-wrap gap-1">
            {piece.occasions.map((occasion) => (
              <li
                key={occasion}
                className="rounded-full bg-steel-blue-300 px-2.25 py-px text-xs font-medium text-papaya-whip"
              >
                {occasionLabel(occasion)}
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  )
}
