import React, { useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import PuzzleBoard from '../../components/games/PuzzleBoard';
import { createDefaultProgress, loadGuestProgress, saveGuestProgress } from '../../lib/gameProgress';
import type { GameContentRecord, GameLevelConfig, GameProgressPayload } from '../../types/gameSystem';

const PuzzlePage: React.FC = () => {
  const [content, setContent] = useState<GameContentRecord[]>([]);
  const [levels, setLevels] = useState<GameLevelConfig[]>([]);
  const [progress, setProgress] = useState<GameProgressPayload>(createDefaultProgress());
  const [previewing, setPreviewing] = useState(true);
  const [timeLeft, setTimeLeft] = useState(0);
  const [status, setStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const current = content[0];

  useEffect(() => {
    const loadData = async () => {
      const [contentRes, configRes] = await Promise.all([
        fetch('/api/games/content?type=puzzle'),
        fetch('/api/games/config'),
      ]);
      const contentData = contentRes.ok ? ((await contentRes.json()) as GameContentRecord[]) : [];
      const configData = configRes.ok ? await configRes.json() : { levels: [] };
      setContent(contentData);
      setLevels((configData.levels ?? []).filter((level: GameLevelConfig) => level.gameType === 'puzzle'));
      const local = await loadGuestProgress();
      setProgress(local);
    };
    loadData();
  }, []);

  const levelConfig = useMemo(() => {
    const level = progress.perGame.puzzle.level;
    return (
      levels.find((entry) => entry.level === level) ??
      ({
        gameType: 'puzzle',
        level,
        config: { gridSize: 3, timerSeconds: 120, previewDurationSeconds: 3 },
        updatedAt: new Date().toISOString(),
      } as GameLevelConfig)
    );
  }, [levels, progress]);

  useEffect(() => {
    if (!current) return;
    const previewDuration = Number(current.data.previewDurationSeconds ?? 3) * 1000;
    const timeout = setTimeout(() => setPreviewing(false), previewDuration);
    return () => clearTimeout(timeout);
  }, [current]);

  useEffect(() => {
    if (!levelConfig) return;
    setTimeLeft(Number(levelConfig.config.timerSeconds ?? 120));
    setStatus('playing');
  }, [levelConfig]);

  useEffect(() => {
    if (status !== 'playing') return;
    if (timeLeft <= 0) {
      setStatus('lost');
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [status, timeLeft]);

  const handleComplete = async (moves: number) => {
    setStatus('won');
    const userEmail = typeof window !== 'undefined' ? window.localStorage.getItem('museonetUserEmail') : null;
    const updatedAt = new Date().toISOString();
    const updated = {
      ...progress,
      lastPlayedGame: 'puzzle' as const,
      lastActivityAt: updatedAt,
      updatedAt,
      perGame: {
        ...progress.perGame,
        puzzle: {
          ...progress.perGame.puzzle,
          lastScore: Math.max(progress.perGame.puzzle.lastScore, moves),
          updatedAt,
        },
      },
    };
    setProgress(updated);
    await saveGuestProgress(updated);
    await fetch('/api/games/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userEmail,
        result: {
          gameType: 'puzzle',
          level: progress.perGame.puzzle.level,
          timeSeconds: timeLeft,
          mistakes: 0,
          correct: 1,
          streak: 0,
          hintsUsed: 0,
          win: true,
        },
      }),
    });
  };

  return (
    <div className="page">
      <Head>
        <title>Puzzle Game — museonet</title>
      </Head>
      <Header />
      <main>
        <section className="section">
          <div className="container puzzle-layout">
            <div className="puzzle-panel">
              <span className="eyebrow">Puzzle</span>
              <h2>{current?.title ?? 'Puzzle ойыны'}</h2>
              <p>Көрсетілген суретті құрастырыңыз. Уақыт аяқталмай тұрып аяқтаңыз.</p>
              <div className="puzzle-meta">
                <div>
                  <span>Деңгей</span>
                  <strong>{progress.perGame.puzzle.level}</strong>
                </div>
                <div>
                  <span>Уақыт</span>
                  <strong>{timeLeft}s</strong>
                </div>
              </div>
              {status !== 'playing' && (
                <div className={`puzzle-status ${status}`}>
                  {status === 'won' ? 'Жеңіс!' : 'Уақыт аяқталды.'}
                </div>
              )}
            </div>
            <div className="puzzle-board-wrapper">
              {current && previewing ? (
                <div className="puzzle-preview" style={{ backgroundImage: `url(${String(current.data.image)})` }}>
                  <span>Суретті есте сақтаңыз</span>
                </div>
              ) : (
                current && (
                  <PuzzleBoard
                    image={String(current.data.image)}
                    gridSize={Number(levelConfig.config.gridSize ?? 3)}
                    onComplete={handleComplete}
                  />
                )
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <style jsx>{`
        .puzzle-layout {
          display: grid;
          grid-template-columns: minmax(240px, 320px) 1fr;
          gap: 32px;
        }

        .puzzle-panel {
          background: rgba(255, 255, 255, 0.75);
          border-radius: var(--radius-lg);
          padding: 24px;
          border: var(--border);
          box-shadow: var(--shadow-soft);
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .puzzle-meta {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }

        .puzzle-meta span {
          color: rgba(43, 43, 43, 0.6);
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .puzzle-preview {
          height: 420px;
          border-radius: var(--radius-lg);
          background-size: cover;
          background-position: center;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          color: #fff;
          padding: 16px;
          box-shadow: var(--shadow);
        }

        .puzzle-preview span {
          background: rgba(43, 43, 43, 0.6);
          padding: 8px 12px;
          border-radius: 999px;
          font-size: 13px;
        }

        .puzzle-status {
          padding: 12px 16px;
          border-radius: 12px;
          font-weight: 600;
        }

        .puzzle-status.won {
          background: rgba(39, 174, 96, 0.12);
        }

        .puzzle-status.lost {
          background: rgba(231, 76, 60, 0.12);
        }

        @media (max-width: 900px) {
          .puzzle-layout {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default PuzzlePage;
