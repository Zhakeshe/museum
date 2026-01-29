import React, { useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useLanguage } from '../contexts/LanguageContext';

const ProfilePage: React.FC = () => {
  const { language } = useLanguage();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [points, setPoints] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const storedName = window.localStorage.getItem('museonetUserName') ?? '';
    const storedEmail = window.localStorage.getItem('museonetUserEmail') ?? '';
    const storedPoints = Number(window.localStorage.getItem('museonetUserPoints') ?? 0);
    setName(storedName);
    setEmail(storedEmail);
    setPoints(Number.isNaN(storedPoints) ? 0 : storedPoints);
  }, []);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    const baseName = name || 'museonet';
    const isMorning = hour >= 5 && hour < 12;
    const isAfternoon = hour >= 12 && hour < 18;
    const isEvening = hour >= 18 || hour < 5;

    if (language === 'ru') {
      if (isMorning) return `Доброе утро, ${baseName}!`;
      if (isAfternoon) return `Добрый день, ${baseName}!`;
      if (isEvening) return `Добрый вечер, ${baseName}!`;
    }

    if (language === 'en') {
      if (isMorning) return `Good morning, ${baseName}!`;
      if (isAfternoon) return `Good afternoon, ${baseName}!`;
      if (isEvening) return `Good evening, ${baseName}!`;
    }

    if (isMorning) return `Қайырлы таң, ${baseName}!`;
    if (isAfternoon) return `Қайырлы күн, ${baseName}!`;
    return `Қайырлы кеш, ${baseName}!`;
  }, [language, name]);

  const salutation =
    language === 'kk'
      ? 'Сәлеметсіз бе'
      : language === 'ru'
        ? 'Здравствуйте'
        : 'Hello';

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('museonetUserName');
      window.localStorage.removeItem('museonetUserEmail');
      window.localStorage.removeItem('museonetAdminSecret');
      window.localStorage.removeItem('museonetAdminVerified');
    }
    router.push('/');
  };

  return (
    <div className="page">
      <Head>
        <title>{language === 'kk' ? 'Профиль — museonet' : language === 'ru' ? 'Профиль — museonet' : 'Profile — museonet'}</title>
      </Head>

      <Header />

      <main>
        <section className="section profile-section">
          <div className="container">
            <div className="profile-card card">
              <span className="eyebrow">{salutation}</span>
              <h1>{greeting}</h1>
              <p className="subtitle">
                {language === 'kk'
                  ? 'Профиліңізге қош келдіңіз. Төменде жеке деректеріңіз көрсетілген.'
                  : language === 'ru'
                    ? 'Добро пожаловать в профиль. Ниже отображаются ваши данные.'
                    : 'Welcome to your profile. Your details are shown below.'}
              </p>
              <div className="profile-meta">
                <div>
                  <span>{language === 'kk' ? 'Аты' : language === 'ru' ? 'Имя' : 'Name'}</span>
                  <strong>{name || '—'}</strong>
                </div>
                <div>
                  <span>Email</span>
                  <strong>{email || '—'}</strong>
                </div>
                <div>
                  <span>{language === 'kk' ? 'Жалпы ұпай' : language === 'ru' ? 'Всего очков' : 'Total points'}</span>
                  <strong>{points}</strong>
                </div>
              </div>
              <div className="profile-actions">
                <button type="button" className="button button-outline" onClick={handleLogout}>
                  {language === 'kk' ? 'Шығу' : language === 'ru' ? 'Выйти' : 'Log out'}
                </button>
              </div>
            </div>
            <div className="profile-panels">
              <div className="panel card">
                <h2>{language === 'kk' ? 'Жетістіктер' : language === 'ru' ? 'Достижения' : 'Achievements'}</h2>
                <ul>
                  <li>{language === 'kk' ? 'Археолог (5 миссия)' : language === 'ru' ? 'Археолог (5 миссий)' : 'Archaeologist (5 missions)'}</li>
                  <li>{language === 'kk' ? 'Пазл шебері' : language === 'ru' ? 'Мастер пазлов' : 'Puzzle master'}</li>
                  <li>{language === 'kk' ? 'Зертхана аналитигі' : language === 'ru' ? 'Лабораторный аналитик' : 'Lab analyst'}</li>
                </ul>
              </div>
              <div className="panel card">
                <h2>{language === 'kk' ? 'Ойын белсенділігі' : language === 'ru' ? 'Активность' : 'Activity'}</h2>
                <div className="activity-list">
                  <div>
                    <span>{language === 'kk' ? 'Бүгін' : language === 'ru' ? 'Сегодня' : 'Today'}</span>
                    <strong>{language === 'kk' ? 'Пазл симуляторы' : language === 'ru' ? 'Пазл симулятор' : 'Puzzle simulator'}</strong>
                    <em>+20</em>
                  </div>
                  <div>
                    <span>{language === 'kk' ? 'Кеше' : language === 'ru' ? 'Вчера' : 'Yesterday'}</span>
                    <strong>{language === 'kk' ? 'Қыш сынықтары' : language === 'ru' ? 'Осколки керамики' : 'Ceramic shards'}</strong>
                    <em>+18</em>
                  </div>
                  <div>
                    <span>{language === 'kk' ? 'Апта' : language === 'ru' ? 'Неделя' : 'Week'}</span>
                    <strong>{language === 'kk' ? 'Талдау станциясы' : language === 'ru' ? 'Станция анализа' : 'Analysis station'}</strong>
                    <em>+25</em>
                  </div>
                </div>
              </div>
              <div className="panel card">
                <h2>{language === 'kk' ? 'Статистика' : language === 'ru' ? 'Статистика' : 'Stats'}</h2>
                <div className="stats-grid">
                  <div>
                    <span>{language === 'kk' ? 'Сессиялар' : language === 'ru' ? 'Сессии' : 'Sessions'}</span>
                    <strong>12</strong>
                  </div>
                  <div>
                    <span>{language === 'kk' ? 'Уақыт' : language === 'ru' ? 'Время' : 'Time'}</span>
                    <strong>4ч 20м</strong>
                  </div>
                  <div>
                    <span>{language === 'kk' ? 'Деңгей' : language === 'ru' ? 'Уровень' : 'Level'}</span>
                    <strong>5</strong>
                  </div>
                  <div>
                    <span>{language === 'kk' ? 'Рейтинг' : language === 'ru' ? 'Рейтинг' : 'Rank'}</span>
                    <strong>#28</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <style jsx>{`
        .profile-section {
          padding: 80px 0;
        }

        .profile-card {
          max-width: 640px;
          margin: 0 auto;
          display: grid;
          gap: 18px;
          text-align: left;
        }

        .profile-card h1 {
          font-size: 36px;
          margin: 0;
        }

        .subtitle {
          color: rgba(43, 43, 43, 0.7);
        }

        .profile-meta {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        }

        .profile-meta span {
          display: block;
          font-size: 12px;
          color: rgba(43, 43, 43, 0.6);
          margin-bottom: 6px;
        }

        .profile-meta strong {
          font-size: 16px;
        }

        .profile-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .profile-panels {
          margin-top: 28px;
          display: grid;
          gap: 20px;
        }

        .panel h2 {
          font-size: 20px;
          margin-bottom: 12px;
        }

        .panel ul {
          list-style: none;
          padding: 0;
          margin: 0;
          display: grid;
          gap: 8px;
          color: rgba(43, 43, 43, 0.75);
        }

        .panel ul li {
          padding: 10px 14px;
          border-radius: 12px;
          background: rgba(180, 106, 60, 0.08);
        }

        .activity-list {
          display: grid;
          gap: 12px;
        }

        .activity-list div {
          display: grid;
          gap: 4px;
          padding: 12px 14px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.7);
          border: 1px solid rgba(180, 106, 60, 0.12);
        }

        .activity-list span {
          font-size: 12px;
          color: rgba(43, 43, 43, 0.6);
        }

        .activity-list em {
          font-style: normal;
          color: #7b4c2a;
          font-weight: 600;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 12px;
        }

        .stats-grid div {
          padding: 12px 14px;
          border-radius: 12px;
          background: rgba(180, 106, 60, 0.08);
        }

        .stats-grid span {
          display: block;
          font-size: 12px;
          color: rgba(43, 43, 43, 0.6);
          margin-bottom: 6px;
        }

        .button {
          border-radius: 999px;
          padding: 10px 20px;
          font-size: 14px;
          border: none;
          cursor: pointer;
        }

        .button-secondary {
          background: rgba(180, 106, 60, 0.12);
          color: #7b4c2a;
          border: 1px solid rgba(180, 106, 60, 0.25);
        }

        .button-outline {
          background: transparent;
          border: 1px solid rgba(180, 106, 60, 0.4);
          color: #7b4c2a;
        }
      `}</style>
    </div>
  );
};

export default ProfilePage;
