import React, { useMemo, useState } from 'react';

export type PuzzlePiece = {
  id: number;
  correctIndex: number;
  image: string;
};

type PuzzleBoardProps = {
  image: string;
  gridSize: number;
  onComplete: (moves: number) => void;
};

const createPieces = (image: string, gridSize: number): PuzzlePiece[] => {
  const total = gridSize * gridSize;
  return Array.from({ length: total }, (_, index) => ({
    id: index,
    correctIndex: index,
    image,
  }));
};

const shufflePieces = (pieces: PuzzlePiece[]) => {
  const shuffled = [...pieces];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const PuzzleBoard: React.FC<PuzzleBoardProps> = ({ image, gridSize, onComplete }) => {
  const initial = useMemo(() => shufflePieces(createPieces(image, gridSize)), [image, gridSize]);
  const [pieces, setPieces] = useState<PuzzlePiece[]>(initial);
  const [selected, setSelected] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);

  const handleSelect = (index: number) => {
    if (selected === null) {
      setSelected(index);
      return;
    }
    if (selected === index) {
      setSelected(null);
      return;
    }
    const next = [...pieces];
    [next[selected], next[index]] = [next[index], next[selected]];
    setPieces(next);
    setSelected(null);
    const newMoves = moves + 1;
    setMoves(newMoves);
    if (next.every((piece, idx) => piece.correctIndex === idx)) {
      onComplete(newMoves);
    }
  };

  return (
    <div className="puzzle-board">
      <div
        className="puzzle-grid"
        style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
      >
        {pieces.map((piece, index) => (
          <button
            key={piece.id}
            type="button"
            className={`puzzle-tile ${selected === index ? 'is-selected' : ''}`}
            style={{
              backgroundImage: `url(${piece.image})`,
              backgroundPosition: `${(piece.correctIndex % gridSize) * (100 / (gridSize - 1))}% ${
                Math.floor(piece.correctIndex / gridSize) * (100 / (gridSize - 1))
              }%`,
              backgroundSize: `${gridSize * 100}% ${gridSize * 100}%`,
            }}
            onClick={() => handleSelect(index)}
          />
        ))}
      </div>
      <style jsx>{`
        .puzzle-board {
          width: 100%;
        }

        .puzzle-grid {
          display: grid;
          gap: 4px;
          background: rgba(138, 106, 69, 0.2);
          padding: 6px;
          border-radius: var(--radius-md);
        }

        .puzzle-tile {
          width: 100%;
          padding-bottom: 100%;
          border: none;
          border-radius: 8px;
          background-repeat: no-repeat;
          cursor: pointer;
          position: relative;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .puzzle-tile.is-selected {
          outline: 2px solid rgba(138, 106, 69, 0.8);
          transform: scale(0.98);
        }
      `}</style>
    </div>
  );
};

export default PuzzleBoard;
