import React from 'react';
import { motion } from 'framer-motion';
import type { ProfilePayload } from '../../types/profile';

const initialsFromName = (name: string) => {
  const safe = name.trim();
  if (!safe) return 'M';
  const parts = safe.split(' ').filter(Boolean);
  return parts
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
};

type ProfileHeaderProps = {
  profile: ProfilePayload;
  greeting: string;
  onExport: () => void;
  onSettings: () => void;
};

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ profile, greeting, onExport, onSettings }) => {
  return (
    <motion.section
      className="profile-header"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="profile-header__avatar">
        <span>{initialsFromName(profile.name)}</span>
        <button type="button" className="avatar-edit">
          ✎
        </button>
      </div>
      <div className="profile-header__meta">
        <span className="eyebrow">Profile</span>
        <h1>{greeting}</h1>
        <div className="profile-header__info">
          <div>
            <span>Аты</span>
            <strong>{profile.name || '—'}</strong>
          </div>
          <div>
            <span>Email</span>
            <strong>{profile.email || '—'}</strong>
          </div>
        </div>
      </div>
      <div className="profile-header__score">
        <div>
          <span>Жалпы ұпай</span>
          <strong>{profile.totalScore}</strong>
        </div>
        <div className="profile-header__level">
          <span>Level {profile.level}</span>
          <div className="level-bar">
            <span style={{ width: `${profile.levelProgress}%` }} />
          </div>
        </div>
        <div className="profile-header__saved">Сақталды ✅ {profile.lastSavedAt}</div>
        <div className="profile-header__actions">
          <button className="button button-secondary" type="button" onClick={onSettings}>
            Settings
          </button>
          <button className="button button-primary" type="button" onClick={onExport}>
            Экспорт JSON
          </button>
        </div>
      </div>
      <style jsx>{`
        .profile-header {
          display: grid;
          grid-template-columns: auto minmax(0, 1fr) minmax(220px, 280px);
          gap: 24px;
          padding: 32px;
          border-radius: 24px;
          background: rgba(255, 255, 255, 0.82);
          border: var(--border);
          box-shadow: var(--shadow);
          position: relative;
          overflow: hidden;
        }

        .profile-header__avatar {
          width: 88px;
          height: 88px;
          border-radius: 24px;
          background: rgba(138, 106, 69, 0.12);
          display: grid;
          place-items: center;
          font-size: 28px;
          font-weight: 700;
          color: var(--accent);
          position: relative;
        }

        .avatar-edit {
          position: absolute;
          bottom: -6px;
          right: -6px;
          border: none;
          background: #fff;
          border-radius: 12px;
          padding: 4px 6px;
          box-shadow: var(--shadow-soft);
          cursor: pointer;
        }

        .profile-header__info {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
          margin-top: 12px;
        }

        .profile-header__info span {
          font-size: 12px;
          color: rgba(43, 43, 43, 0.6);
        }

        .profile-header__score {
          display: grid;
          gap: 12px;
          align-content: center;
        }

        .profile-header__score strong {
          font-size: 28px;
        }

        .level-bar {
          height: 8px;
          border-radius: 999px;
          background: rgba(138, 106, 69, 0.15);
          overflow: hidden;
        }

        .level-bar span {
          display: block;
          height: 100%;
          background: linear-gradient(90deg, #8a6a45, #c2a679);
        }

        .profile-header__actions {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .profile-header__saved {
          font-size: 12px;
          color: rgba(43, 43, 43, 0.6);
        }

        @media (max-width: 900px) {
          .profile-header {
            grid-template-columns: 1fr;
          }

          .profile-header__actions {
            flex-direction: row;
            flex-wrap: wrap;
          }
        }
      `}</style>
    </motion.section>
  );
};

export default ProfileHeader;
