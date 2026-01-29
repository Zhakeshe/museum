import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import QuizRunner from '../../components/games/QuizRunner';
import { createDefaultProgress, loadGuestProgress, saveGuestProgress } from '../../lib/gameProgress';
import type { GameContentRecord, GameProgressPayload } from '../../types/gameSystem';

const QuizPage: React.FC = () => {
  const [questions, setQuestions] = useState<GameContentRecord[]>([]);
  const [progress, setProgress] = useState<GameProgressPayload>(createDefaultProgress());
  const [completed, setCompleted] = useState(false);
  const [summary, setSummary] = useState<{ correct: number; mistakes: number; streak: number } | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const response = await fetch('/api/games/content?type=quiz');
      const data = response.ok ? ((await response.json()) as GameContentRecord[]) : [];
      setQuestions(data);
      const local = await loadGuestProgress();
      setProgress(local);
    };
    loadData();
  }, []);

  const handleComplete = async (result: { correct: number; mistakes: number; streak: number }) => {
    setSummary(result);
    setCompleted(true);
    const userEmail = typeof window !== 'undefined' ? window.localStorage.getItem('museonetUserEmail') : null;
    const updatedAt = new Date().toISOString();
    const updated = {
      ...progress,
      lastPlayedGame: 'quiz' as const,
      lastActivityAt: updatedAt,
      updatedAt,
      perGame: {
        ...progress.perGame,
        quiz: {
          ...progress.perGame.quiz,
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
          gameType: 'quiz',
          level: progress.perGame.quiz.level,
          timeSeconds: 0,
          mistakes: result.mistakes,
          correct: result.correct,
          streak: result.streak,
          win: result.correct > result.mistakes,
        },
      }),
    });
  };

  const formattedQuestions = questions.map((entry) => ({
    id: entry.id,
    image: String(entry.data.image),
    question: String(entry.data.question),
    options: (entry.data.options as string[]) ?? [],
    correctIndex: Number(entry.data.correctIndex ?? 0),
    explanation: entry.data.explanation ? String(entry.data.explanation) : undefined,
  }));

  return (
    <div className="page">
      <Head>
        <title>Quiz Game — museonet</title>
      </Head>
      <Header />
      <main>
        <section className="section">
          <div className="container quiz-layout">
            <div className="quiz-panel">
              <span className="eyebrow">Quiz</span>
              <h2>Музей викторинасы</h2>
              <p>Әр сұраққа жауап беріп, қатарынан дұрыс жауап бергенде көбейтілген ұпай алыңыз.</p>
              {summary && (
                <div className="quiz-summary">
                  <strong>Нәтиже</strong>
                  <p>Дұрыс жауаптар: {summary.correct}</p>
                  <p>Қате жауаптар: {summary.mistakes}</p>
                </div>
              )}
            </div>
            <div className="quiz-content">
              {completed || formattedQuestions.length === 0 ? (
                <div className="quiz-finish">Сессия аяқталды.</div>
              ) : (
                <QuizRunner questions={formattedQuestions} onComplete={handleComplete} />
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <style jsx>{`
        .quiz-layout {
          display: grid;
          grid-template-columns: minmax(240px, 320px) 1fr;
          gap: 32px;
        }

        .quiz-panel {
          background: rgba(255, 255, 255, 0.75);
          border-radius: var(--radius-lg);
          padding: 24px;
          border: var(--border);
          box-shadow: var(--shadow-soft);
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .quiz-summary {
          margin-top: 12px;
          padding: 12px;
          border-radius: 12px;
          background: rgba(138, 106, 69, 0.12);
        }

        .quiz-finish {
          padding: 24px;
          border-radius: var(--radius-lg);
          background: rgba(255, 255, 255, 0.75);
          border: var(--border);
          text-align: center;
        }

        @media (max-width: 900px) {
          .quiz-layout {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default QuizPage;
