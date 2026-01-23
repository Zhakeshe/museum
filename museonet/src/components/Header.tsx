import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useLanguage } from '../contexts/LanguageContext';

const navItems = [
  { key: 'home', href: '/' },
  { key: 'about', href: '/about' },
  { key: 'games', href: '/games' },
  { key: 'museums', href: '/museums' },
];

const Header: React.FC = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage } = useLanguage();
  const labels = useMemo(
    () => ({
      kk: {
        home: 'Басты бет',
        about: 'Біз туралы',
        games: 'Ойындар',
        museums: 'Музейлер',
        login: 'Кіру',
        aria: 'Негізгі навигация',
      },
      ru: {
        home: 'Главная',
        about: 'О проекте',
        games: 'Игры',
        museums: 'Музеи',
        login: 'Войти',
        aria: 'Главная навигация',
      },
      en: {
        home: 'Home',
        about: 'About',
        games: 'Games',
        museums: 'Museums',
        login: 'Login',
        aria: 'Main navigation',
      },
    }),
    [],
  );

  useEffect(() => {
    const handleRouteChange = () => setIsOpen(false);
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => router.events.off('routeChangeComplete', handleRouteChange);
  }, [router.events]);

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" className="logo">
          museonet
        </Link>

        <button
          className={`menu-toggle ${isOpen ? 'is-open' : ''}`}
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
          aria-label={isOpen ? 'Жабу' : 'Ашу'}
        >
          <span></span>
          <span></span>
        </button>

        <nav className={`main-nav ${isOpen ? 'is-open' : ''}`} aria-label={labels[language].aria}>
          <ul>
            {navItems.map((item) => {
              const isActive = router.pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`nav-link ${isActive ? 'is-active' : ''}`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {labels[language][item.key as keyof typeof labels.kk]}
                  </Link>
                </li>
              );
            })}
            <li>
              <Link href="/login" className="nav-button">
                {labels[language].login}
              </Link>
            </li>
            <li>
              <div className="lang-switch" role="group" aria-label="Language switch">
                <button
                  type="button"
                  className={`lang-chip ${language === 'kk' ? 'is-active' : ''}`}
                  onClick={() => setLanguage('kk')}
                >
                  Қаз
                </button>
                <button
                  type="button"
                  className={`lang-chip ${language === 'ru' ? 'is-active' : ''}`}
                  onClick={() => setLanguage('ru')}
                >
                  Рус
                </button>
                <button
                  type="button"
                  className={`lang-chip ${language === 'en' ? 'is-active' : ''}`}
                  onClick={() => setLanguage('en')}
                >
                  Eng
                </button>
              </div>
            </li>
          </ul>
        </nav>
      </div>
      <style jsx>{`
        .site-header {
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(246, 241, 232, 0.92);
          border-bottom: 1px solid rgba(181, 139, 100, 0.25);
          backdrop-filter: blur(12px);
        }

        .header-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 0;
          gap: 24px;
        }

        .logo {
          font-size: 20px;
          font-weight: 700;
          letter-spacing: 0.18em;
        }

        .main-nav ul {
          display: flex;
          list-style: none;
          gap: 24px;
          align-items: center;
        }

        .lang-switch {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 4px 8px;
          border-radius: 999px;
          border: 1px solid rgba(181, 139, 100, 0.25);
          background: rgba(255, 255, 255, 0.65);
        }

        .lang-chip {
          border: none;
          background: transparent;
          font-size: 12px;
          font-weight: 600;
          color: rgba(43, 43, 43, 0.7);
          padding: 4px 6px;
          border-radius: 999px;
          cursor: pointer;
          transition: background 0.25s ease-out, color 0.25s ease-out;
        }

        .lang-chip.is-active,
        .lang-chip:hover {
          background: rgba(138, 106, 69, 0.15);
          color: var(--accent);
        }

        .nav-link {
          position: relative;
          font-size: 15px;
          font-weight: 500;
          color: rgba(43, 43, 43, 0.82);
          transition: color 0.25s ease-out;
        }

        .nav-link::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: -8px;
          width: 100%;
          height: 2px;
          background: var(--accent);
          border-radius: 999px;
          opacity: 0;
          transform: scaleX(0.6);
          transition: opacity 0.25s ease-out, transform 0.25s ease-out;
        }

        .nav-link:hover {
          color: var(--accent);
        }

        .nav-link.is-active::after {
          opacity: 1;
          transform: scaleX(1);
        }

        .nav-button {
          background: rgba(138, 106, 69, 0.12);
          border: 1px solid rgba(138, 106, 69, 0.35);
          padding: 8px 18px;
          border-radius: 999px;
          font-size: 14px;
          font-weight: 600;
          color: var(--accent);
          transition: background 0.25s ease-out, transform 0.25s ease-out;
        }

        .nav-button:hover {
          background: rgba(138, 106, 69, 0.2);
          transform: translateY(-2px);
        }

        .menu-toggle {
          display: none;
          background: transparent;
          border: none;
          flex-direction: column;
          gap: 6px;
          padding: 6px;
        }

        .menu-toggle span {
          width: 24px;
          height: 2px;
          background: var(--text);
          transition: transform 0.25s ease-out, opacity 0.25s ease-out;
        }

        .menu-toggle.is-open span:first-child {
          transform: translateY(4px) rotate(45deg);
        }

        .menu-toggle.is-open span:last-child {
          transform: translateY(-4px) rotate(-45deg);
        }

        @media (max-width: 900px) {
          .menu-toggle {
            display: flex;
          }

          .main-nav {
            position: absolute;
            top: 64px;
            left: 0;
            right: 0;
            background: var(--background);
            border-top: 1px solid rgba(181, 139, 100, 0.2);
            transform: translateY(-12px);
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.25s ease-out, transform 0.25s ease-out;
          }

          .main-nav ul {
            flex-direction: column;
            align-items: flex-start;
            padding: 20px;
            gap: 16px;
          }

          .main-nav.is-open {
            opacity: 1;
            transform: translateY(0);
            pointer-events: auto;
          }
        }
      `}</style>
    </header>
  );
};

export default Header;
