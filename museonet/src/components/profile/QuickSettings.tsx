import React from 'react';
import type { ProfilePayload } from '../../types/profile';

const QuickSettings: React.FC<{ profile: ProfilePayload; onChange: (payload: ProfilePayload) => void }> = ({
  profile,
  onChange,
}) => {
  return (
    <div className="quick-settings">
      <h3>Quick settings</h3>
      <label className="setting-row">
        Sound
        <input
          type="checkbox"
          checked={profile.settings.sound}
          onChange={(event) =>
            onChange({
              ...profile,
              settings: { ...profile.settings, sound: event.target.checked },
              updatedAt: new Date().toISOString(),
            })
          }
        />
      </label>
      <label className="setting-row">
        Animation
        <select
          value={profile.settings.animationIntensity}
          onChange={(event) =>
            onChange({
              ...profile,
              settings: { ...profile.settings, animationIntensity: event.target.value as ProfilePayload['settings']['animationIntensity'] },
              updatedAt: new Date().toISOString(),
            })
          }
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </label>
      <label className="setting-row">
        Language
        <select
          value={profile.settings.language}
          onChange={(event) =>
            onChange({
              ...profile,
              settings: { ...profile.settings, language: event.target.value as ProfilePayload['settings']['language'] },
              updatedAt: new Date().toISOString(),
            })
          }
        >
          <option value="kk">Қаз</option>
          <option value="ru">Рус</option>
          <option value="en">Eng</option>
        </select>
      </label>
      <style jsx>{`
        .quick-settings {
          display: grid;
          gap: 12px;
        }

        .setting-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 14px;
          padding: 10px 12px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.8);
          border: var(--border);
        }

        select {
          border: none;
          background: transparent;
          font-size: 13px;
        }
      `}</style>
    </div>
  );
};

export default QuickSettings;
