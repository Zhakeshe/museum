import React from 'react';
import type { ProfileAchievement, ProfilePayload } from '../../types/profile';

const AchievementsGrid: React.FC<{ achievements: ProfileAchievement[]; profile: ProfilePayload }> = ({
  achievements,
  profile,
}) => {
  return (
    <div className="achievements-grid">
      {achievements.map((achievement) => {
        const progress = profile.achievements.find((item) => item.key === achievement.key);
        const current = progress?.current ?? 0;
        const locked = !progress?.unlocked;
        const percentage = Math.min(100, Math.round((current / achievement.target) * 100));
        return (
          <div key={achievement.key} className={`achievement-card ${locked ? 'is-locked' : ''}`}>
            <div className="achievement-card__icon">{achievement.icon}</div>
            <div>
              <strong>{achievement.title}</strong>
              <p>{achievement.description}</p>
            </div>
            <div className="achievement-card__bar">
              <span style={{ width: `${percentage}%` }} />
            </div>
            <span className="achievement-card__meta">
              {current}/{achievement.target} {locked ? '🔒' : '✅'}
            </span>
          </div>
        );
      })}
      <style jsx>{`
        .achievements-grid {
          display: grid;
          gap: 12px;
        }

        .achievement-card {
          padding: 16px;
          border-radius: 16px;
          border: var(--border);
          background: rgba(255, 255, 255, 0.8);
          display: grid;
          gap: 10px;
          position: relative;
          transition: transform 0.2s ease;
        }

        .achievement-card:hover {
          transform: translateY(-2px);
        }

        .achievement-card.is-locked {
          filter: grayscale(1);
          opacity: 0.75;
        }

        .achievement-card__icon {
          font-size: 28px;
        }

        .achievement-card p {
          color: rgba(43, 43, 43, 0.65);
          font-size: 13px;
        }

        .achievement-card__bar {
          height: 6px;
          border-radius: 999px;
          background: rgba(138, 106, 69, 0.12);
          overflow: hidden;
        }

        .achievement-card__bar span {
          display: block;
          height: 100%;
          background: linear-gradient(90deg, #8a6a45, #c2a679);
        }

        .achievement-card__meta {
          font-size: 12px;
          color: rgba(43, 43, 43, 0.6);
        }
      `}</style>
    </div>
  );
};

export default AchievementsGrid;
