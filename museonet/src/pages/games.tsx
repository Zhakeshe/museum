import React, { useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useLanguage } from '../contexts/LanguageContext';

const games = [
  {
    id: 'layers',
    title: 'Қабаттар құпиясы',
    level: 'Beginner',
    text: 'Қазба кезеңдерін таныстыру.',
    points: 15,
    scenario: 'Қазба шұңқырындағы қабаттарды дұрыс ретпен тіркеңіз.',
  },
  {
    id: 'artifact',
    title: 'Артефакт іздеуі',
    level: 'Beginner',
    text: 'Жәдігерлерді сәйкестендіру ойыны.',
    points: 12,
    scenario: 'Табылған жәдігерді кезең мен материалға сәйкестендіріңіз.',
  },
  {
    id: 'map',
    title: 'Картадағы экспедиция',
    level: 'Beginner',
    text: 'Ежелгі мекендерді картадан табу.',
    points: 10,
    scenario: 'Экспедиция маршрутын дұрыс жоспарлаңыз.',
  },
  {
    id: 'journal',
    title: 'Ғалым күнделігі',
    level: 'Advanced',
    text: 'Зерттеу жазбаларын жүйелеу.',
    points: 20,
    scenario: 'Дала журналының жазбаларын категорияларға бөліңіз.',
  },
  {
    id: 'ceramics',
    title: 'Қыш сынықтары',
    level: 'Advanced',
    text: 'Қалпына келтіру логикасы.',
    points: 18,
    scenario: 'Қыш бөліктерін пішін бойынша жинаңыз.',
  },
  {
    id: 'lab',
    title: 'Талдау станциясы',
    level: 'Advanced',
    text: 'Лабораториялық шешім қабылдау.',
    points: 25,
    scenario: 'Зертханалық талдау әдісін таңдаңыз.',
  },
];

const GamesPage: React.FC = () => {
  const { language } = useLanguage();
  const [activeLevel, setActiveLevel] = useState<'All' | 'Beginner' | 'Advanced'>('All');
  const [activeGame, setActiveGame] = useState<(typeof games)[number] | null>(null);
  const [userName, setUserName] = useState('');
  const [userPoints, setUserPoints] = useState(0);
  const [simulationStep, setSimulationStep] = useState(0);
  const [simulationStatus, setSimulationStatus] = useState('Күту режимі');
  const pageTitle =
    language === 'kk' ? 'Ойындар — museonet' : language === 'ru' ? 'Игры — museonet' : 'Games — museonet';
  const heading =
    language === 'kk' ? 'Ойындар' : language === 'ru' ? 'Игры' : 'Games';
  const subtext =
    language === 'kk'
      ? 'Күрделілік деңгейі бойынша сүзгі таңдаңыз.'
      : language === 'ru'
        ? 'Выберите фильтр по уровню сложности.'
        : 'Choose a difficulty filter.';
  const loginHint =
    language === 'kk'
      ? 'Ойындарды бастау үшін аккаунт қажет.'
      : language === 'ru'
        ? 'Чтобы играть, нужен аккаунт.'
        : 'You need an account to play.';

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const storedName = window.localStorage.getItem('museonetUserName') ?? '';
    const storedPoints = Number(window.localStorage.getItem('museonetUserPoints') ?? 0);
    setUserName(storedName);
    setUserPoints(Number.isNaN(storedPoints) ? 0 : storedPoints);
  }, []);

  const filteredGames = useMemo(() => {
    if (activeLevel === 'All') return games;
    return games.filter((game) => game.level === activeLevel);
  }, [activeLevel]);

  const canPlay = Boolean(userName);

  const startSimulation = (game: (typeof games)[number]) => {
    setActiveGame(game);
    setSimulationStep(0);
    setSimulationStatus('Сценарий басталды');
  };

  const advanceSimulation = () => {
    const nextStep = simulationStep + 1;
    setSimulationStep(nextStep);
    setSimulationStatus(nextStep >= 3 ? 'Симуляция аяқталды' : 'Симуляция жүріп жатыр');
    if (nextStep >= 3 && activeGame && typeof window !== 'undefined') {
      const nextPoints = userPoints + activeGame.points;
      setUserPoints(nextPoints);
      window.localStorage.setItem('museonetUserPoints', String(nextPoints));
    }
  };

  return (
    <div className="page">
      <Head>
        <title>{pageTitle}</title>
        <meta
          name="description"
          content={
            language === 'kk'
              ? 'Археологияға арналған білім беру ойындары.'
              : language === 'ru'
                ? 'Обучающие игры по археологии.'
                : 'Educational archaeology games.'
          }
        />
      </Head>

      <Header />

      <main>
        <section className="section">
          <div className="container">
            <div className="section-heading">
              <div>
                <span className="eyebrow">Оқу форматы</span>
                <h2>{heading}</h2>
              </div>
              <p>{subtext}</p>
            </div>

            <div className="filters">
              {(['All', 'Beginner', 'Advanced'] as const).map((level) => (
                <button
                  key={level}
                  className={`chip ${activeLevel === level ? 'is-active' : ''}`}
                  type="button"
                  onClick={() => setActiveLevel(level)}
                >
                  {level}
                </button>
              ))}
              {canPlay ? (
                <span className="points-pill">{language === 'kk' ? 'Ұпай' : language === 'ru' ? 'Очки' : 'Points'}: {userPoints}</span>
              ) : (
                <span className="points-pill">{loginHint}</span>
              )}
            </div>

            <div className="games-grid">
              {filteredGames.map((game) => (
                <div className="card" key={game.title}>
                  <div className="game-header">
                    <h3>{game.title}</h3>
                    <span className="chip">{game.level}</span>
                  </div>
                  <p>{game.text}</p>
                  <div className="game-meta">
                    <span>{language === 'kk' ? 'Сценарий' : language === 'ru' ? 'Сценарий' : 'Scenario'}</span>
                    <strong>{game.scenario}</strong>
                  </div>
                  <button
                    className="button button-secondary"
                    type="button"
                    onClick={() => startSimulation(game)}
                    disabled={!canPlay}
                  >
                    {canPlay ? 'Симуляцияны бастау' : 'Кіру керек'}
                  </button>
                </div>
              ))}
            </div>

            {activeGame && (
              <div className="simulation-panel">
                <div>
                  <h3>{activeGame.title} — симулятор</h3>
                  <p className="status">Статус: {simulationStatus}</p>
                  <p className="scenario">{activeGame.scenario}</p>
                </div>
                <div className="console">
                  <div className="console-line">⏱️ Таймер: {simulationStep + 1} / 4</div>
                  <div className="console-line">🔬 Анализ: қабат #{simulationStep + 1}</div>
                  <div className="console-line">📍 Координат: X{simulationStep * 4 + 12} Y{simulationStep * 3 + 6}</div>
                  <div className="console-line">✅ Дерек сақталды</div>
                  <button className="button button-primary" type="button" onClick={advanceSimulation}>
                    {simulationStep >= 3 ? 'Жинақтау' : 'Келесі қадам'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />

      <style jsx>{`
        .filters {
          display: flex;
          gap: 12px;
          margin-bottom: 24px;
          flex-wrap: wrap;
          align-items: center;
        }

        .games-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 24px;
        }

        .game-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .card h3 {
          font-size: 18px;
          font-weight: 600;
        }

        .card p {
          color: rgba(43, 43, 43, 0.7);
          margin-bottom: 20px;
          font-size: 15px;
        }

        .points-pill {
          padding: 6px 12px;
          border-radius: 999px;
          background: rgba(180, 106, 60, 0.12);
          color: #7b4c2a;
          font-size: 13px;
        }

        .game-meta {
          display: grid;
          gap: 4px;
          font-size: 13px;
          color: rgba(43, 43, 43, 0.7);
          margin-bottom: 16px;
        }

        .simulation-panel {
          margin-top: 32px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          background: #fff;
          border-radius: 24px;
          padding: 24px;
          border: 1px solid rgba(180, 106, 60, 0.2);
          box-shadow: 0 12px 24px rgba(64, 42, 18, 0.08);
        }

        .simulation-panel h3 {
          font-size: 22px;
          margin-bottom: 8px;
        }

        .status {
          color: #7b4c2a;
          margin-bottom: 12px;
        }

        .scenario {
          color: rgba(43, 43, 43, 0.7);
        }

        .console {
          background: #111;
          color: #e6e1d8;
          border-radius: 18px;
          padding: 18px;
          display: grid;
          gap: 10px;
          font-family: 'Courier New', monospace;
        }

        .console-line {
          font-size: 13px;
        }

        @media (max-width: 900px) {
          .simulation-panel {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default GamesPage;
