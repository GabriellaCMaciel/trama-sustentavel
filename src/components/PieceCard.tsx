import { useObjectUrl } from '../hooks/useObjectUrl'
import { categoryLabel, occasionLabel } from '../types'
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
    <article className={`piece-card${isNew ? ' is-new' : ''}`}>
      <div className="piece-photo">
        {photoUrl && <img src={photoUrl} alt={`Foto de ${piece.name}`} />}
        <button
          type="button"
          className="remove-button"
          onClick={handleRemove}
          aria-label={`Remover ${piece.name}`}
          title="Remover"
        >
          <CloseIcon className="remove-icon" />
        </button>
      </div>

      {/* A parte de baixo imita a etiqueta de uma roupa. */}
      <div className="piece-tag">
        <span className="tag-hole" aria-hidden="true" />
        <h3>{piece.name}</h3>
        <p className="piece-meta">
          <span className="color-dot" style={{ backgroundColor: piece.color }} aria-hidden="true" />
          {categoryLabel(piece.category)}
        </p>
        {piece.occasions.length > 0 && (
          <ul className="tags">
            {piece.occasions.map((occasion) => (
              <li key={occasion}>{occasionLabel(occasion)}</li>
            ))}
          </ul>
        )}
      </div>
    </article>
  )
}
