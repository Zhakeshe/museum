import React from 'react';
import type { WeeklyActivityPoint } from '../../types/profile';

const WeeklyActivity: React.FC<{ data: WeeklyActivityPoint[] }> = ({ data }) => {
  return (
    <div className="weekly-activity">
      {data.map((point) => (
        <div key={point.date} className="activity-day">
          <span>{new Date(point.date).toLocaleDateString(undefined, { weekday: 'short' })}</span>
          <div className="activity-bar">
            <span style={{ height: `${Math.min(100, point.points)}%` }} />
          </div>
          <strong>{point.points}</strong>
        </div>
      ))}
      {data.length === 0 && <div className="empty">Апта дерегі жоқ.</div>}
      <style jsx>{`
        .weekly-activity {
          display: grid;
          grid-template-columns: repeat(7, minmax(0, 1fr));
          gap: 8px;
        }

        .activity-day {
          display: grid;
          gap: 6px;
          text-align: center;
          font-size: 12px;
          color: rgba(43, 43, 43, 0.6);
        }

        .activity-bar {
          height: 80px;
          border-radius: 12px;
          background: rgba(138, 106, 69, 0.12);
          display: flex;
          align-items: flex-end;
          justify-content: center;
          overflow: hidden;
        }

        .activity-bar span {
          width: 100%;
          background: linear-gradient(180deg, #c2a679, #8a6a45);
        }

        .activity-day strong {
          color: rgba(43, 43, 43, 0.8);
        }

        .empty {
          grid-column: 1 / -1;
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

export default WeeklyActivity;
