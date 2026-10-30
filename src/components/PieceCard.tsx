import { useObjectUrl } from '../hooks/useObjectUrl'
import { categoryLabel, occasionLabel } from '../types'
import type { Piece } from '../types'

interface PieceCardProps {
  piece: Piece
  onRemove: (id: string) => void
}

export function PieceCard({ piece, onRemove }: PieceCardProps) {
  const photoUrl = useObjectUrl(piece.photo)

  function handleRemove() {
    if (window.confirm(`Remover "${piece.name}" do guarda-roupa?`)) {
      onRemove(piece.id)
    }
  }

  return (
    <article className="piece-card">
      <div className="piece-photo">
        {photoUrl && <img src={photoUrl} alt={`Foto de ${piece.name}`} />}
      </div>
      <div className="piece-info">
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
        <button
          type="button"
          className="link-danger"
          onClick={handleRemove}
          aria-label={`Remover ${piece.name}`}
        >
          Remover
        </button>
      </div>
    </article>
  )
}
