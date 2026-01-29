import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import type {
  AnalyticsSummary,
  GameContentRecord,
  GameLevelConfig,
  GameProgressPayload,
  ScoringRules,
  ThemeSettings,
} from '../../../types/gameSystem';

const ADMIN_ROLE_HEADER = { 'x-user-role': 'admin' };

const AdminGamesPage: React.FC = () => {
  const [content, setContent] = useState<GameContentRecord[]>([]);
  const [scoring, setScoring] = useState<ScoringRules | null>(null);
  const [levels, setLevels] = useState<GameLevelConfig[]>([]);
  const [theme, setTheme] = useState<ThemeSettings | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [userEmail, setUserEmail] = useState('');
  const [userProgress, setUserProgress] = useState<GameProgressPayload | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const [contentRes, scoringRes, levelsRes, themeRes, analyticsRes] = await Promise.all([
        fetch('/api/admin/games/content', { headers: ADMIN_ROLE_HEADER }),
        fetch('/api/admin/games/scoring', { headers: ADMIN_ROLE_HEADER }),
        fetch('/api/admin/games/levels', { headers: ADMIN_ROLE_HEADER }),
        fetch('/api/admin/games/theme', { headers: ADMIN_ROLE_HEADER }),
        fetch('/api/admin/games/analytics', { headers: ADMIN_ROLE_HEADER }),
      ]);
      setContent(contentRes.ok ? await contentRes.json() : []);
      setScoring(scoringRes.ok ? await scoringRes.json() : null);
      setLevels(levelsRes.ok ? await levelsRes.json() : []);
      setTheme(themeRes.ok ? await themeRes.json() : null);
      setAnalytics(analyticsRes.ok ? await analyticsRes.json() : null);
    };
    loadData();
  }, []);

  const handleFetchProgress = async () => {
    if (!userEmail) return;
    const response = await fetch(`/api/admin/games/progress?userEmail=${encodeURIComponent(userEmail)}`, {
      headers: ADMIN_ROLE_HEADER,
    });
    setUserProgress(response.ok ? await response.json() : null);
  };

  return (
    <div className="page">
      <Head>
        <title>Admin Game System — museonet</title>
      </Head>
      <Header />
      <main>
        <section className="section">
          <div className="container admin-layout">
            <div className="admin-panel">
              <span className="eyebrow">Admin MVP</span>
              <h2>Game System басқару панелі</h2>
              <p>Ойын контенті, деңгейлері, ұпай ережелері және аналитика осы жерден басқарылады.</p>
            </div>

            <div className="admin-grid">
              <div className="admin-card">
                <h3>Контент менеджері</h3>
                <p>Жалпы контент саны: {content.length}</p>
                <ul>
                  {content.slice(0, 4).map((item) => (
                    <li key={item.id}>
                      <strong>{item.title}</strong> — {item.gameType} · {item.status}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="admin-card">
                <h3>Scoring rules</h3>
                {scoring ? (
                  <div className="admin-list">
                    <p>Puzzle base: {scoring.puzzle.basePoints}</p>
                    <p>Quiz correct: {scoring.quiz.correctPoints}</p>
                    <p>Matching correct: {scoring.matching.correctMatchPoints}</p>
                  </div>
                ) : (
                  <p>Loading...</p>
                )}
              </div>

              <div className="admin-card">
                <h3>Level presets</h3>
                <ul>
                  {levels.map((level) => (
                    <li key={`${level.gameType}-${level.level}`}>
                      {level.gameType} — Level {level.level}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="admin-card">
                <h3>Theme & Experience</h3>
                {theme ? (
                  <div>
                    <p>Animation: {theme.animationIntensity}</p>
                    <p>Sound: {theme.soundEnabled ? 'On' : 'Off'}</p>
                    <p>Win animation: {theme.winAnimation}</p>
                  </div>
                ) : (
                  <p>Loading...</p>
                )}
              </div>
            </div>

            <div className="admin-grid">
              <div className="admin-card">
                <h3>Analytics snapshot</h3>
                {analytics ? (
                  <div>
                    <p>Plays: {analytics.totalPlays}</p>
                    <p>Returning users: {analytics.returningUsers}</p>
                    <p>Last activity: {analytics.lastActivityAt ?? '—'}</p>
                  </div>
                ) : (
                  <p>Loading...</p>
                )}
              </div>
              <div className="admin-card">
                <h3>User progress tools</h3>
                <label className="admin-field">
                  Email
                  <input value={userEmail} onChange={(event) => setUserEmail(event.target.value)} />
                </label>
                <button className="button button-primary" type="button" onClick={handleFetchProgress}>
                  Load progress
                </button>
                {userProgress && (
                  <div className="admin-list">
                    <p>Total score: {userProgress.totalScore}</p>
                    <p>Last played: {userProgress.lastPlayedGame ?? '—'}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <style jsx>{`
        .admin-layout {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .admin-panel {
          background: rgba(255, 255, 255, 0.75);
          border-radius: var(--radius-lg);
          padding: 28px;
          border: var(--border);
        }

        .admin-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 20px;
        }

        .admin-card {
          background: rgba(255, 255, 255, 0.8);
          border-radius: var(--radius-md);
          padding: 20px;
          border: var(--border);
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .admin-card ul {
          list-style: none;
          display: grid;
          gap: 6px;
          font-size: 14px;
        }

        .admin-field {
          display: grid;
          gap: 6px;
          font-size: 14px;
        }

        .admin-field input {
          padding: 10px 12px;
          border-radius: 10px;
          border: 1px solid rgba(138, 106, 69, 0.2);
        }
      `}</style>
    </div>
  );
};

export default AdminGamesPage;
