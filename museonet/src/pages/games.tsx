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
    steps: [
      {
        title: 'Қазбаны бастау',
        prompt: 'Қауіпсіздік белдеуін тексеріп, қазба алаңын белгілеңіз.',
        choices: ['Белдеуді бекіту', 'Картаны жаңарту', 'Қазуды бастау'],
      },
      {
        title: 'Қабатты тіркеу',
        prompt: 'Алғашқы мәдени қабатты анықтап, түсін сипаттаңыз.',
        choices: ['Түс үлгісін өлшеу', 'Құрамын жазу', 'Фотофиксация жасау'],
      },
      {
        title: 'Мәліметті сақтау',
        prompt: 'Қабат координаттарын журналға енгізіңіз.',
        choices: ['GPS координаты', 'Қолмен картаға түсіру', 'Дронмен түсіру'],
      },
      {
        title: 'Қорытындылау',
        prompt: 'Қазба деректерін қорытындылап, есеп жазыңыз.',
        choices: ['Есеп дайындау', 'Материалды сақтау', 'Командаға жіберу'],
      },
    ],
  },
  {
    id: 'artifact',
    title: 'Артефакт іздеуі',
    level: 'Beginner',
    text: 'Жәдігерлерді сәйкестендіру ойыны.',
    points: 12,
    scenario: 'Табылған жәдігерді кезең мен материалға сәйкестендіріңіз.',
    steps: [
      {
        title: 'Табылған жәдігер',
        prompt: 'Жәдігердің материалын анықтаңыз.',
        choices: ['Қыш', 'Металл', 'Тас'],
      },
      {
        title: 'Хронология',
        prompt: 'Жәдігердің уақыттық кезеңін белгілеңіз.',
        choices: ['Ежелгі дәуір', 'Орта ғасыр', 'Жаңа дәуір'],
      },
      {
        title: 'Қорғау',
        prompt: 'Сақтау әдісін таңдаңыз.',
        choices: ['Қорапқа орау', 'Көлеңкеге қою', 'Зертханаға жіберу'],
      },
      {
        title: 'Картаға енгізу',
        prompt: 'Табылған орынды картаға белгілеңіз.',
        choices: ['Координат жазу', 'Фото және белгі', 'Командаға хабарлау'],
      },
    ],
  },
  {
    id: 'map',
    title: 'Картадағы экспедиция',
    level: 'Beginner',
    text: 'Ежелгі мекендерді картадан табу.',
    points: 10,
    scenario: 'Экспедиция маршрутын дұрыс жоспарлаңыз.',
    steps: [
      {
        title: 'Маршрут жоспары',
        prompt: 'Экспедиция бағытын қауіпсіздікпен жоспарлаңыз.',
        choices: ['Өзен бойымен', 'Таулы жол', 'Автожол'],
      },
      {
        title: 'Лагерь',
        prompt: 'Лагерь орнын таңдаңыз.',
        choices: ['Жоғары төбе', 'Су көзі', 'Орман жиегі'],
      },
      {
        title: 'Қор',
        prompt: 'Қажетті құралдарды түгендеңіз.',
        choices: ['Дрон және GPS', 'Өлшеу құралдары', 'Медицина жиынтығы'],
      },
      {
        title: 'Байланыс',
        prompt: 'Команда байланысын реттеңіз.',
        choices: ['Радио', 'Спутник телефоны', 'Ұялы байланыс'],
      },
    ],
  },
  {
    id: 'journal',
    title: 'Ғалым күнделігі',
    level: 'Advanced',
    text: 'Зерттеу жазбаларын жүйелеу.',
    points: 20,
    scenario: 'Дала журналының жазбаларын категорияларға бөліңіз.',
    steps: [
      {
        title: 'Жазбаларды жинау',
        prompt: 'Күнделіктерді жинақтап, бөлімдерге бөліңіз.',
        choices: ['Артефакт', 'Қабат', 'Экология'],
      },
      {
        title: 'Терминдер',
        prompt: 'Қысқартуларды толықтырыңыз.',
        choices: ['Түсіндірме қосу', 'Сөздік жасау', 'Сарапшыға беру'],
      },
      {
        title: 'Фото-мұрағат',
        prompt: 'Фотофиксацияны дерекқорға жүктеңіз.',
        choices: ['Каталогқа қосу', 'Метадерек жазу', 'Қорға сақтау'],
      },
      {
        title: 'Есеп беру',
        prompt: 'Ғылыми есепті дайындаңыз.',
        choices: ['Тексеруге жіберу', 'Редакциялау', 'Архивтеу'],
      },
    ],
  },
  {
    id: 'ceramics',
    title: 'Қыш сынықтары',
    level: 'Advanced',
    text: 'Қалпына келтіру логикасы.',
    points: 18,
    scenario: 'Қыш бөліктерін пішін бойынша жинаңыз.',
    steps: [
      {
        title: 'Сынықтарды сұрыптау',
        prompt: 'Пішіні мен өрнегін сәйкестендіріңіз.',
        choices: ['Бүйір бөліктер', 'Түбі', 'Ернеу'],
      },
      {
        title: 'Құрастыру',
        prompt: 'Қалпына келтіру реті қандай?',
        choices: ['Бүйірден бастау', 'Түбін бекіту', 'Ернеуді сәйкестендіру'],
      },
      {
        title: 'Желімдеу',
        prompt: 'Желімдеу әдісін таңдаңыз.',
        choices: ['Уақытша фиксация', 'Тұрақты желім', '3D модельдеу'],
      },
      {
        title: 'Қорытынды',
        prompt: 'Қалпына келтіру нәтижесін есептеңіз.',
        choices: ['Фотофиксация', 'Құжаттау', 'Қорға өткізу'],
      },
    ],
  },
  {
    id: 'lab',
    title: 'Талдау станциясы',
    level: 'Advanced',
    text: 'Лабораториялық шешім қабылдау.',
    points: 25,
    scenario: 'Зертханалық талдау әдісін таңдаңыз.',
    steps: [
      {
        title: 'Сынама іріктеу',
        prompt: 'Зертханаға қандай сынама жіберіледі?',
        choices: ['Топырақ', 'Қыш үлгісі', 'Металл бөлшек'],
      },
      {
        title: 'Әдіс таңдау',
        prompt: 'Талдау әдісін таңдаңыз.',
        choices: ['Спектрлік', 'Микроскопиялық', 'Химиялық'],
      },
      {
        title: 'Нәтиже тексеру',
        prompt: 'Нәтижені валидациялаңыз.',
        choices: ['Қайта өлшеу', 'Салыстыру', 'Сарапшыға беру'],
      },
      {
        title: 'Қорытынды',
        prompt: 'Зертхана қорытындысын бекітіңіз.',
        choices: ['Бекіту', 'Түзету', 'Архивке жіберу'],
      },
    ],
  },
];

const GamesPage: React.FC = () => {
  const { language } = useLanguage();
  const [activeLevel, setActiveLevel] = useState<'All' | 'Beginner' | 'Advanced'>('All');
  const [activeGame, setActiveGame] = useState<(typeof games)[number] | null>(null);
  const [userName, setUserName] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [userPoints, setUserPoints] = useState(0);
  const [simulationStep, setSimulationStep] = useState(0);
  const [simulationStatus, setSimulationStatus] = useState('Күту режимі');
  const [fieldLog, setFieldLog] = useState<string[]>([]);
  const [activeChoice, setActiveChoice] = useState('');
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
    setNameInput(storedName);
    setUserPoints(Number.isNaN(storedPoints) ? 0 : storedPoints);
  }, []);

  const filteredGames = useMemo(() => {
    if (activeLevel === 'All') return games;
    return games.filter((game) => game.level === activeLevel);
  }, [activeLevel]);

  const canPlay = Boolean(userName);

  const handleNameSave = () => {
    const trimmed = nameInput.trim();
    if (!trimmed) return;
    setUserName(trimmed);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('museonetUserName', trimmed);
    }
  };

  const startSimulation = (game: (typeof games)[number]) => {
    setActiveGame(game);
    setSimulationStep(0);
    setSimulationStatus('Сценарий басталды');
    setActiveChoice('');
    setFieldLog([
      `${game.title}: ${game.scenario}`,
      'Журнал ашылды. Қауіпсіздік тексерілді.',
      'Команда байланыста, құралдар дайын.',
    ]);
  };

  const advanceSimulation = (choice: string) => {
    if (!activeGame) return;
    const nextStep = simulationStep + 1;
    setActiveChoice(choice);
    setSimulationStep(nextStep);
    setSimulationStatus(nextStep >= activeGame.steps.length ? 'Симуляция аяқталды' : 'Симуляция жүріп жатыр');
    setFieldLog((prev) => [
      ...prev,
      `Шешім: ${choice}.`,
      nextStep >= activeGame.steps.length ? 'Сессия аяқталды. Нәтижелер архивке жіберілді.' : 'Деректер енгізілді, келесі қадамға өтіңіз.',
    ]);
    if (nextStep >= activeGame.steps.length && typeof window !== 'undefined') {
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
                <span className="points-pill">
                  {language === 'kk' ? 'Ұпай' : language === 'ru' ? 'Очки' : 'Points'}: {userPoints}
                </span>
              ) : (
                <span className="points-pill">{loginHint}</span>
              )}
            </div>

            {!canPlay && (
              <div className="login-panel">
                <div>
                  <h3>{language === 'kk' ? 'Ойыншы профилі' : language === 'ru' ? 'Профиль игрока' : 'Player profile'}</h3>
                  <p>
                    {language === 'kk'
                      ? 'Атыңызды енгізіңіз — симуляцияны бірден бастай аласыз.'
                      : language === 'ru'
                        ? 'Введите имя — и сразу начните симуляцию.'
                        : 'Enter your name to start the simulation instantly.'}
                  </p>
                </div>
                <div className="login-controls">
                  <input
                    type="text"
                    placeholder={language === 'kk' ? 'Атыңыз' : language === 'ru' ? 'Ваше имя' : 'Your name'}
                    value={nameInput}
                    onChange={(event) => setNameInput(event.target.value)}
                  />
                  <button className="button button-primary" type="button" onClick={handleNameSave}>
                    {language === 'kk' ? 'Сеансты бастау' : language === 'ru' ? 'Начать сессию' : 'Start session'}
                  </button>
                </div>
              </div>
            )}

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
                  <div className="task-list">
                    <strong>{language === 'kk' ? 'Тапсырмалар' : language === 'ru' ? 'Задачи' : 'Tasks'}</strong>
                    <ul>
                      {activeGame.steps.map((step, index) => (
                        <li key={step.title} className={index <= simulationStep ? 'done' : ''}>
                          {step.title}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="console">
                  <div className="console-line">⏱️ Таймер: {Math.min(simulationStep + 1, activeGame.steps.length)} / {activeGame.steps.length}</div>
                  <div className="console-line">🔬 Этап: {activeGame.steps[Math.min(simulationStep, activeGame.steps.length - 1)].title}</div>
                  <div className="console-line">📍 Координат: X{simulationStep * 4 + 12} Y{simulationStep * 3 + 6}</div>
                  <div className="console-line">✅ Дерек сақталды</div>
                  <div className="step-panel">
                    <p>{activeGame.steps[Math.min(simulationStep, activeGame.steps.length - 1)].prompt}</p>
                    <div className="choices">
                      {activeGame.steps[Math.min(simulationStep, activeGame.steps.length - 1)].choices.map((choice) => (
                        <button
                          key={choice}
                          className={`choice ${activeChoice === choice ? 'is-active' : ''}`}
                          type="button"
                          onClick={() => advanceSimulation(choice)}
                          disabled={simulationStep >= activeGame.steps.length}
                        >
                          {choice}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {fieldLog.length > 0 && (
              <div className="field-log">
                <h3>{language === 'kk' ? 'Дала журналы' : language === 'ru' ? 'Полевой журнал' : 'Field log'}</h3>
                <ul>
                  {fieldLog.map((entry, index) => (
                    <li key={`${entry}-${index}`}>{entry}</li>
                  ))}
                </ul>
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

        .login-panel {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          padding: 18px 20px;
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid rgba(180, 106, 60, 0.2);
          margin-bottom: 24px;
        }

        .login-panel h3 {
          margin-bottom: 6px;
        }

        .login-panel p {
          color: rgba(43, 43, 43, 0.7);
        }

        .login-controls {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .login-controls input {
          padding: 10px 14px;
          border-radius: 12px;
          border: 1px solid rgba(180, 106, 60, 0.3);
          min-width: 220px;
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

        .task-list {
          margin-top: 16px;
        }

        .task-list ul {
          list-style: none;
          padding: 0;
          margin: 8px 0 0;
          display: grid;
          gap: 6px;
        }

        .task-list li {
          padding: 6px 10px;
          border-radius: 10px;
          background: rgba(180, 106, 60, 0.08);
          font-size: 13px;
        }

        .task-list li.done {
          background: rgba(91, 165, 107, 0.16);
          color: #2c5c36;
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

        .step-panel {
          margin-top: 12px;
          display: grid;
          gap: 12px;
        }

        .step-panel p {
          font-size: 14px;
          color: rgba(230, 225, 216, 0.9);
        }

        .choices {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .choice {
          padding: 8px 12px;
          border-radius: 12px;
          border: 1px solid rgba(230, 225, 216, 0.3);
          background: rgba(255, 255, 255, 0.08);
          color: #fff;
          font-size: 13px;
        }

        .choice.is-active {
          background: rgba(180, 106, 60, 0.6);
          border-color: rgba(180, 106, 60, 0.8);
        }

        .field-log {
          margin-top: 32px;
          padding: 20px;
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.95);
          border: 1px solid rgba(180, 106, 60, 0.2);
        }

        .field-log ul {
          margin: 12px 0 0;
          padding-left: 18px;
          display: grid;
          gap: 6px;
          color: rgba(43, 43, 43, 0.75);
        }

        @media (max-width: 900px) {
          .simulation-panel {
            grid-template-columns: 1fr;
          }

          .login-panel {
            flex-direction: column;
            align-items: flex-start;
          }

          .login-controls {
            width: 100%;
            flex-direction: column;
            align-items: stretch;
          }

          .login-controls input {
            min-width: auto;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default GamesPage;
