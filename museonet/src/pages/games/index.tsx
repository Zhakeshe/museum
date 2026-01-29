import React, { useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import GameCard from '../../components/games/GameCard';
import { createDefaultProgress, loadGuestProgress, mergeProgress, saveGuestProgress } from '../../lib/gameProgress';
import type { GameProgressPayload, GameType } from '../../types/gameSystem';

const MAX_LEVELS = 5;

const gameCards = [
  {
    id: 'puzzle' as GameType,
    title: 'Puzzle жинағы',
    description: 'Жәдігерді бөліктерден құрастырып, уақытпен жарысыңыз.',
    href: '/games/puzzle',
    accent: 'linear-gradient(135deg, #d1b38c, #8a6a45)',
  },
  {
    id: 'quiz' as GameType,
    title: 'Музей викторинасы',
    description: 'Тарихи сұрақтарға жауап беріп, сериялы бонус жинаңыз.',
    href: '/games/quiz',
    accent: 'linear-gradient(135deg, #c2c4be, #7f8975)',
  },
  {
    id: 'matching' as GameType,
    title: 'Сәйкестендіру ойыны',
    description: 'Суретті тиісті атауымен сәйкестендіріп, дәлдік көрсетіңіз.',
    href: '/games/matching',
    accent: 'linear-gradient(135deg, #c9a78b, #6d5240)',
  },
];

const GamesDashboard: React.FC = () => {
  const [progress, setProgress] = useState<GameProgressPayload>(createDefaultProgress());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProgress = async () => {
      const guest = await loadGuestProgress();
      const userEmail = typeof window !== 'undefined' ? window.localStorage.getItem('museonetUserEmail') : null;
      if (!userEmail) {
        setProgress(guest);
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(`/api/games/progress?userEmail=${encodeURIComponent(userEmail)}`);
        const serverProgress = response.ok ? ((await response.json()) as GameProgressPayload) : guest;
        const merged = mergeProgress(guest, serverProgress);
        setProgress(merged);
        await saveGuestProgress(merged);
        await fetch('/api/games/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userEmail, progress: merged }),
        });
      } catch {
        setProgress(guest);
      } finally {
        setLoading(false);
      }
    };

    loadProgress();
  }, []);

  const lastPlayed = progress.lastPlayedGame
    ? gameCards.find((game) => game.id === progress.lastPlayedGame)?.title
    : '—';

  const lastActivity = progress.lastActivityAt ? new Date(progress.lastActivityAt).toLocaleDateString() : '—';

  const totals = useMemo(
    () =>
      gameCards.map((game) => {
        const level = progress.perGame[game.id].level;
        return {
          ...game,
          level,
          progress: Math.min(100, Math.round((level / MAX_LEVELS) * 100)),
        };
      }),
    [progress],
  );

  return (
    <div className="page">
      <Head>
        <title>Games Dashboard — museonet</title>
      </Head>

      <Header />

      <main>
        <section className="section games-hero">
          <motion.div
            className="games-hero__glow"
            animate={{ opacity: [0.4, 0.7, 0.4], scale: [1, 1.05, 1] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
          <div className="container">
            <div className="games-hero__content">
              <span className="eyebrow">MVP Game System</span>
              <h1>Музей ойындарына қош келдіңіз</h1>
              <p>
                Жеке прогресті бақылап, 3 форматтағы білім ойындарын ашыңыз. Ұпайлар, деңгейлер және соңғы
                белсенділік әрдайым сақталады.
              </p>
            </div>
          </div>
        </section>

        <section className="section section--tight">
          <div className="container">
            <div className="summary-grid">
              <div className="summary-card">
                <span>Жалпы ұпай</span>
                <strong>{progress.totalScore}</strong>
              </div>
              <div className="summary-card">
                <span>Соңғы ойын</span>
                <strong>{lastPlayed}</strong>
              </div>
              <div className="summary-card">
                <span>Соңғы белсенділік</span>
                <strong>{lastActivity}</strong>
              </div>
              <div className="summary-card">
                <span>Деңгейлер</span>
                <strong>
                  {progress.perGame.puzzle.level} / {progress.perGame.quiz.level} / {progress.perGame.matching.level}
                </strong>
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="section-heading">
              <div>
                <span className="eyebrow">Games</span>
                <h2>Бүгін ойнайтын ойын таңдаңыз</h2>
              </div>
              <p>Прогресс сақталады. Әр ойын жаңа деңгей мен бонус ұсынады.</p>
            </div>
            {loading ? (
              <div className="loading">Жүктелуде...</div>
            ) : (
              <div className="game-grid">
                {totals.map((game) => (
                  <GameCard key={game.id} {...game} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />

      <style jsx>{`
        .games-hero {
          position: relative;
          overflow: hidden;
          padding-bottom: 40px;
        }

        .games-hero__glow {
          position: absolute;
          width: 480px;
          height: 480px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(138, 106, 69, 0.35), transparent 70%);
          top: -120px;
          right: -120px;
          z-index: 0;
        }

        .games-hero__content {
          position: relative;
          z-index: 1;
          background: rgba(255, 255, 255, 0.7);
          border-radius: var(--radius-lg);
          padding: 32px;
          box-shadow: var(--shadow);
        }

        .summary-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        }

        .summary-card {
          border-radius: var(--radius-md);
          background: rgba(255, 255, 255, 0.75);
          padding: 18px;
          border: var(--border);
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .summary-card strong {
          font-size: 20px;
        }

        .game-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 20px;
        }

        .loading {
          padding: 32px;
          text-align: center;
          border-radius: var(--radius-md);
          background: rgba(255, 255, 255, 0.7);
        }
      `}</style>
    </div>
  );
};

export default GamesDashboard;
