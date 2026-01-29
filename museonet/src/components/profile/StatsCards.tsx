import React from 'react';
import Link from 'next/link';
import type { ProfilePayload } from '../../types/profile';

const StatCard: React.FC<{
  title: string;
  level: number;
  wins: number;
  attempts: number;
  bestLabel: string;
  bestValue: string;
  href: string;
}> = ({ title, level, wins, attempts, bestLabel, bestValue, href }) => {
  const winrate = attempts ? Math.round((wins / attempts) * 100) : 0;
  return (
    <div className="stat-card">
      <h3>{title}</h3>
      <div className="stat-card__meta">
        <div>
          <span>Level</span>
          <strong>{level}</strong>
        </div>
        <div>
          <span>Wins/Attempts</span>
          <strong>
            {wins}/{attempts}
          </strong>
        </div>
        <div>
          <span>Winrate</span>
          <strong>{winrate}%</strong>
        </div>
        <div>
          <span>{bestLabel}</span>
          <strong>{bestValue}</strong>
        </div>
      </div>
      <Link href={href} className="button button-primary">
        Continue
      </Link>
      <style jsx>{`
        .stat-card {
          padding: 20px;
          border-radius: 18px;
          border: var(--border);
          background: rgba(255, 255, 255, 0.8);
          display: grid;
          gap: 16px;
          box-shadow: var(--shadow-soft);
        }

        .stat-card__meta {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
        }

        .stat-card span {
          font-size: 12px;
          color: rgba(43, 43, 43, 0.6);
        }
      `}</style>
    </div>
  );
};

type StatsCardsProps = {
  profile: ProfilePayload;
};

const StatsCards: React.FC<StatsCardsProps> = ({ profile }) => {
  return (
    <div className="stats-cards">
      <StatCard
        title="Puzzle"
        level={profile.perGame.puzzle.level}
        wins={profile.perGame.puzzle.wins}
        attempts={profile.perGame.puzzle.attempts}
        bestLabel="Best time"
        bestValue={profile.perGame.puzzle.bestTimeSeconds ? `${profile.perGame.puzzle.bestTimeSeconds}s` : '—'}
        href="/games/puzzle"
      />
      <StatCard
        title="Quiz"
        level={profile.perGame.quiz.level}
        wins={profile.perGame.quiz.wins}
        attempts={profile.perGame.quiz.attempts}
        bestLabel="Best streak"
        bestValue={profile.perGame.quiz.bestStreak ? String(profile.perGame.quiz.bestStreak) : '—'}
        href="/games/quiz"
      />
      <StatCard
        title="Matching"
        level={profile.perGame.matching.level}
        wins={profile.perGame.matching.wins}
        attempts={profile.perGame.matching.attempts}
        bestLabel="Best accuracy"
        bestValue={profile.perGame.matching.bestAccuracy ? `${profile.perGame.matching.bestAccuracy}%` : '—'}
        href="/games/matching"
      />
      <style jsx>{`
        .stats-cards {
          display: grid;
          gap: 16px;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        }
      `}</style>
    </div>
  );
};

export default StatsCards;
