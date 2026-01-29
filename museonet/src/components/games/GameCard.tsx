import React from 'react';
import Link from 'next/link';

type GameCardProps = {
  title: string;
  description: string;
  href: string;
  level: number;
  progress: number;
  accent: string;
};

const GameCard: React.FC<GameCardProps> = ({ title, description, href, level, progress, accent }) => {
  return (
    <Link href={href} className="game-card">
      <div className="game-card__header">
        <span className="eyebrow">Level {level}</span>
        <span className="game-card__accent" style={{ background: accent }} />
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
      <div className="game-card__progress">
        <div className="game-card__bar">
          <span style={{ width: `${progress}%` }} />
        </div>
        <span>{progress}%</span>
      </div>
      <span className="game-card__cta">Ойынды бастау →</span>
      <style jsx>{`
        .game-card {
          background: rgba(255, 255, 255, 0.75);
          border: var(--border);
          border-radius: var(--radius-lg);
          padding: 24px;
          min-height: 230px;
          display: flex;
          flex-direction: column;
          gap: 14px;
          box-shadow: var(--shadow-soft);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }

        .game-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow);
        }

        .game-card__header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .game-card__accent {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          box-shadow: inset 0 0 0 4px rgba(255, 255, 255, 0.7);
        }

        p {
          color: rgba(43, 43, 43, 0.7);
        }

        .game-card__progress {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 14px;
          font-weight: 600;
          color: rgba(43, 43, 43, 0.7);
        }

        .game-card__bar {
          flex: 1;
          height: 8px;
          border-radius: 999px;
          background: rgba(138, 106, 69, 0.15);
          overflow: hidden;
        }

        .game-card__bar span {
          display: block;
          height: 100%;
          background: linear-gradient(90deg, #8a6a45, #c2a679);
          border-radius: 999px;
        }

        .game-card__cta {
          margin-top: auto;
          font-weight: 600;
          color: var(--accent);
        }
      `}</style>
    </Link>
  );
};

export default GameCard;
