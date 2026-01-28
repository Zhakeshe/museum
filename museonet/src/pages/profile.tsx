import React, { useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useLanguage } from '../contexts/LanguageContext';

const ProfilePage: React.FC = () => {
  const { language } = useLanguage();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setName(window.localStorage.getItem('museonetUserName') ?? '');
    setEmail(window.localStorage.getItem('museonetUserEmail') ?? '');
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
              </div>
              <div className="profile-actions">
                <Link href="/admin" className="button button-secondary">
                  {language === 'kk' ? 'Админ панель' : language === 'ru' ? 'Админ панель' : 'Admin panel'}
                </Link>
                <button type="button" className="button button-outline" onClick={handleLogout}>
                  {language === 'kk' ? 'Шығу' : language === 'ru' ? 'Выйти' : 'Log out'}
                </button>
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
