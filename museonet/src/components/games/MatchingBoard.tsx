import React, { useMemo, useState } from 'react';

export type MatchingPair = {
  id: number;
  image: string;
  name: string;
  description?: string;
};

type MatchingBoardProps = {
  pairs: MatchingPair[];
  onComplete: (summary: { correct: number; mistakes: number }) => void;
};

const shuffle = <T,>(items: T[]) => {
  const clone = [...items];
  for (let i = clone.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [clone[i], clone[j]] = [clone[j], clone[i]];
  }
  return clone;
};

const MatchingBoard: React.FC<MatchingBoardProps> = ({ pairs, onComplete }) => {
  const images = useMemo(() => shuffle(pairs), [pairs]);
  const names = useMemo(() => shuffle(pairs), [pairs]);
  const [selectedImage, setSelectedImage] = useState<MatchingPair | null>(null);
  const [matched, setMatched] = useState<number[]>([]);
  const [mistakes, setMistakes] = useState(0);

  const handleSelectName = (pair: MatchingPair) => {
    if (!selectedImage || matched.includes(pair.id)) return;
    if (selectedImage.id === pair.id) {
      const next = [...matched, pair.id];
      setMatched(next);
      setSelectedImage(null);
      if (next.length === pairs.length) {
        onComplete({ correct: pairs.length, mistakes });
      }
    } else {
      setMistakes((prev) => prev + 1);
    }
  };

  return (
    <div className="matching-board">
      <div className="matching-column">
        {images.map((pair) => (
          <button
            key={pair.id}
            type="button"
            className={`matching-tile ${selectedImage?.id === pair.id ? 'is-selected' : ''} ${
              matched.includes(pair.id) ? 'is-matched' : ''
            }`}
            onClick={() => setSelectedImage(pair)}
          >
            <img src={pair.image} alt={pair.name} />
          </button>
        ))}
      </div>
      <div className="matching-column">
        {names.map((pair) => (
          <button
            key={pair.id}
            type="button"
            className={`matching-label ${matched.includes(pair.id) ? 'is-matched' : ''}`}
            onClick={() => handleSelectName(pair)}
          >
            {pair.name}
          </button>
        ))}
      </div>
      <style jsx>{`
        .matching-board {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .matching-column {
          display: grid;
          gap: 12px;
        }

        .matching-tile {
          border: 1px solid rgba(138, 106, 69, 0.2);
          border-radius: 12px;
          padding: 8px;
          background: rgba(255, 255, 255, 0.7);
          cursor: pointer;
        }

        .matching-tile img {
          width: 100%;
          border-radius: 8px;
          height: 120px;
          object-fit: cover;
        }

        .matching-tile.is-selected {
          outline: 2px solid rgba(138, 106, 69, 0.8);
        }

        .matching-label {
          text-align: left;
          padding: 16px;
          border-radius: 12px;
          border: 1px dashed rgba(138, 106, 69, 0.3);
          background: rgba(255, 255, 255, 0.6);
          cursor: pointer;
        }

        .matching-label.is-matched,
        .matching-tile.is-matched {
          background: rgba(39, 174, 96, 0.12);
          border-color: rgba(39, 174, 96, 0.35);
        }
      `}</style>
    </div>
  );
};

export default MatchingBoard;
