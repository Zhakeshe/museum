import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import MatchingBoard from '../../components/games/MatchingBoard';
import { createDefaultProgress, loadGuestProgress, saveGuestProgress } from '../../lib/gameProgress';
import type { GameContentRecord, GameProgressPayload } from '../../types/gameSystem';

const MatchingPage: React.FC = () => {
  const [pairs, setPairs] = useState<GameContentRecord[]>([]);
  const [progress, setProgress] = useState<GameProgressPayload>(createDefaultProgress());
  const [summary, setSummary] = useState<{ correct: number; mistakes: number } | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const response = await fetch('/api/games/content?type=matching');
      const data = response.ok ? ((await response.json()) as GameContentRecord[]) : [];
      setPairs(data);
      const local = await loadGuestProgress();
      setProgress(local);
    };
    loadData();
  }, []);

  const handleComplete = async (result: { correct: number; mistakes: number }) => {
    setSummary(result);
    const userEmail = typeof window !== 'undefined' ? window.localStorage.getItem('museonetUserEmail') : null;
    const updatedAt = new Date().toISOString();
    const updated = {
      ...progress,
      lastPlayedGame: 'matching' as const,
      lastActivityAt: updatedAt,
      updatedAt,
      perGame: {
        ...progress.perGame,
        matching: {
          ...progress.perGame.matching,
          lastScore: result.correct,
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
          gameType: 'matching',
          level: progress.perGame.matching.level,
          timeSeconds: 0,
          mistakes: result.mistakes,
          correct: result.correct,
          streak: 0,
          win: result.mistakes === 0,
        },
      }),
    });
  };

  const formattedPairs = pairs.map((entry) => ({
    id: entry.id,
    image: String(entry.data.image),
    name: String(entry.data.name),
    description: entry.data.description ? String(entry.data.description) : undefined,
  }));

  return (
    <div className="page">
      <Head>
        <title>Matching Game — museonet</title>
      </Head>
      <Header />
      <main>
        <section className="section">
          <div className="container matching-layout">
            <div className="matching-panel">
              <span className="eyebrow">Matching</span>
              <h2>Сәйкестендіру ойыны</h2>
              <p>Артефакт суретін дұрыс атаумен сәйкестендіріңіз. Дәлдік жоғары болса, бонус аласыз.</p>
              {summary && (
                <div className="matching-summary">
                  <strong>Нәтиже</strong>
                  <p>Дұрыс жұптар: {summary.correct}</p>
                  <p>Қателіктер: {summary.mistakes}</p>
                </div>
              )}
            </div>
            <div className="matching-content">
              {formattedPairs.length ? (
                <MatchingBoard pairs={formattedPairs} onComplete={handleComplete} />
              ) : (
                <div className="matching-empty">Сәйкестендіру үшін жұптар дайындалуда.</div>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <style jsx>{`
        .matching-layout {
          display: grid;
          grid-template-columns: minmax(240px, 320px) 1fr;
          gap: 32px;
        }

        .matching-panel {
          background: rgba(255, 255, 255, 0.75);
          border-radius: var(--radius-lg);
          padding: 24px;
          border: var(--border);
          box-shadow: var(--shadow-soft);
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .matching-summary {
          margin-top: 12px;
          padding: 12px;
          border-radius: 12px;
          background: rgba(138, 106, 69, 0.12);
        }

        .matching-empty {
          padding: 24px;
          border-radius: var(--radius-lg);
          background: rgba(255, 255, 255, 0.75);
          border: var(--border);
          text-align: center;
        }

        @media (max-width: 900px) {
          .matching-layout {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default MatchingPage;
