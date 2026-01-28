import React, { useState } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useLanguage } from '../contexts/LanguageContext';

const LoginPage: React.FC = () => {
  const { language } = useLanguage();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const pageTitle =
    language === 'kk' ? 'Кіру — museonet' : language === 'ru' ? 'Вход — museonet' : 'Login — museonet';
  const heading =
    mode === 'login'
      ? language === 'kk'
        ? 'Кіру'
        : language === 'ru'
          ? 'Вход'
          : 'Login'
      : language === 'kk'
        ? 'Тіркелу'
        : language === 'ru'
          ? 'Регистрация'
          : 'Sign up';
  const intro =
    language === 'kk'
      ? 'Жеке кабинетті пайдалану үшін деректеріңізді енгізіңіз.'
      : language === 'ru'
        ? 'Введите данные для доступа в личный кабинет.'
        : 'Enter your details to access the account.';
  const registerLabel =
    language === 'kk' ? 'Тіркелу' : language === 'ru' ? 'Регистрация' : 'Sign up';
  const googleLabel =
    language === 'kk' ? 'Google арқылы кіру' : language === 'ru' ? 'Войти через Google' : 'Sign in with Google';
  const nameLabel = language === 'kk' ? 'Аты-жөні' : language === 'ru' ? 'Имя' : 'Name';
  const successMessage =
    language === 'kk'
      ? 'Тіркелу сәтті аяқталды!'
      : language === 'ru'
        ? 'Регистрация прошла успешно!'
        : 'Registration successful!';
  const errorMessage =
    language === 'kk'
      ? 'Қате пайда болды. Қайта көріңіз.'
      : language === 'ru'
        ? 'Произошла ошибка. Попробуйте еще раз.'
        : 'Something went wrong. Try again.';

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus(null);
    if (mode === 'register') {
      try {
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email }),
        });
        if (!response.ok) {
          const data = await response.json();
          setStatus({ type: 'error', text: data.message ?? errorMessage });
          return;
        }
        setStatus({ type: 'success', text: successMessage });
        setName('');
        setEmail('');
        setPassword('');
      } catch {
        setStatus({ type: 'error', text: errorMessage });
      }
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
              ? 'museonet жобасына кіру парағы.'
              : language === 'ru'
                ? 'Страница входа museonet.'
                : 'museonet login page.'
          }
        />
      </Head>

      <Header />

      <main>
        <section className="section login-section">
          <div className="container">
            <div className="login-card card">
              <div>
                <span className="eyebrow">Қош келдіңіз</span>
                <h2>{heading}</h2>
                <p>{intro}</p>
              </div>
              <div className="login-tabs">
                <button
                  type="button"
                  className={`tab ${mode === 'login' ? 'is-active' : ''}`}
                  onClick={() => {
                    setMode('login');
                    setStatus(null);
                  }}
                >
                  {language === 'kk' ? 'Кіру' : language === 'ru' ? 'Вход' : 'Login'}
                </button>
                <button
                  type="button"
                  className={`tab ${mode === 'register' ? 'is-active' : ''}`}
                  onClick={() => {
                    setMode('register');
                    setStatus(null);
                  }}
                >
                  {registerLabel}
                </button>
              </div>
              <form className="login-form" onSubmit={handleSubmit}>
                {mode === 'register' && (
                  <label>
                    {nameLabel}
                    <input
                      className="input"
                      type="text"
                      placeholder={language === 'kk' ? 'Есіміңіз' : language === 'ru' ? 'Ваше имя' : 'Your name'}
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      required
                    />
                  </label>
                )}
                <label>
                  {language === 'kk' ? 'Email' : language === 'ru' ? 'Email' : 'Email'}
                  <input
                    className="input"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                  />
                </label>
                <label>
                  {language === 'kk' ? 'Құпиясөз' : language === 'ru' ? 'Пароль' : 'Password'}
                  <input
                    className="input"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required={mode === 'login'}
                  />
                </label>
                {status && <div className={`status ${status.type}`}>{status.text}</div>}
                <button className="button button-primary" type="submit">
                  {heading}
                </button>
                <div className="login-links">
                  <a href="/">
                    {language === 'kk'
                      ? 'Құпиясөзді ұмыттыңыз ба?'
                      : language === 'ru'
                        ? 'Забыли пароль?'
                        : 'Forgot password?'}
                  </a>
                  <button
                    className="register-link"
                    type="button"
                    onClick={() => {
                      setMode(mode === 'login' ? 'register' : 'login');
                      setStatus(null);
                    }}
                  >
                    {mode === 'login' ? registerLabel : language === 'kk' ? 'Кіру' : language === 'ru' ? 'Вход' : 'Login'}
                  </button>
                  <button className="button button-secondary" type="button">
                    {googleLabel}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <style jsx>{`
        .login-section {
          display: flex;
          align-items: center;
        }

        .login-card {
          max-width: 480px;
          margin: 0 auto;
          display: grid;
          gap: 24px;
        }

        .login-tabs {
          display: flex;
          gap: 12px;
          background: rgba(255, 255, 255, 0.8);
          border-radius: 999px;
          padding: 6px;
          border: 1px solid rgba(180, 106, 60, 0.2);
        }

        .tab {
          flex: 1;
          padding: 8px 16px;
          border-radius: 999px;
          border: none;
          background: transparent;
          font-size: 14px;
          cursor: pointer;
          color: rgba(43, 43, 43, 0.7);
        }

        .tab.is-active {
          background: rgba(180, 106, 60, 0.12);
          color: #7b4c2a;
          font-weight: 600;
        }

        .login-card h2 {
          font-size: 32px;
          margin: 10px 0 12px;
        }

        .login-card p {
          color: rgba(43, 43, 43, 0.7);
          font-size: 15px;
        }

        .login-form {
          display: grid;
          gap: 16px;
        }

        label {
          display: grid;
          gap: 8px;
          font-size: 14px;
          color: rgba(43, 43, 43, 0.7);
        }

        .login-links {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .login-links a {
          font-size: 14px;
          color: var(--accent);
        }

        .register-link {
          font-weight: 600;
          border: none;
          background: none;
          color: var(--accent);
          cursor: pointer;
        }

        .status {
          padding: 10px 12px;
          border-radius: 12px;
          font-size: 14px;
        }

        .status.success {
          background: rgba(46, 150, 93, 0.15);
          color: #1e6b44;
        }

        .status.error {
          background: rgba(206, 78, 54, 0.12);
          color: #a0351f;
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
