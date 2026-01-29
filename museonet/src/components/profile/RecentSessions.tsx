import React from 'react';
import type { ProfileSession } from '../../types/profile';

const RecentSessions: React.FC<{ sessions: ProfileSession[] }> = ({ sessions }) => {
  return (
    <div className="recent-sessions">
      {sessions.map((session) => (
        <div key={session.id} className="session-row">
          <div>
            <strong>{session.gameType.toUpperCase()}</strong>
            <span>{new Date(session.playedAt).toLocaleString()}</span>
          </div>
          <div>
            <span className={session.scoreDelta >= 0 ? 'positive' : 'negative'}>
              {session.scoreDelta >= 0 ? '+' : ''}
              {session.scoreDelta}
            </span>
            <span>{Math.round(session.durationSeconds / 60)} мин</span>
          </div>
          <span className={`session-result ${session.result}`}>{session.result === 'win' ? 'Win' : 'Lose'}</span>
        </div>
      ))}
      {sessions.length === 0 && <div className="empty">Сессиялар әзірге жоқ.</div>}
      <style jsx>{`
        .recent-sessions {
          display: grid;
          gap: 12px;
        }

        .session-row {
          display: grid;
          grid-template-columns: 1fr auto auto;
          gap: 12px;
          align-items: center;
          padding: 12px 16px;
          border-radius: 14px;
          border: var(--border);
          background: rgba(255, 255, 255, 0.8);
        }

        .session-row div {
          display: grid;
        }

        .session-row span {
          font-size: 12px;
          color: rgba(43, 43, 43, 0.6);
        }

        .positive {
          color: #2f8f4e;
          font-weight: 600;
        }

        .negative {
          color: #b54b3c;
          font-weight: 600;
        }

        .session-result {
          padding: 6px 10px;
          border-radius: 999px;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .session-result.win {
          background: rgba(39, 174, 96, 0.15);
        }

        .session-result.lose {
          background: rgba(231, 76, 60, 0.15);
        }

        .empty {
          padding: 16px;
          border-radius: 12px;
          border: var(--border);
          background: rgba(255, 255, 255, 0.7);
          text-align: center;
        }
      `}</style>
    </div>
  );
};

export default RecentSessions;
