import React, { useMemo } from 'react';
import Link from 'next/link';
import { useLanguage } from '../contexts/LanguageContext';

const Footer: React.FC = () => {
  const { language } = useLanguage();
  const copy = useMemo(
    () => ({
      kk: {
        note: 'Виртуалды музейлер желісі · археологиялық мұра, білім және зерттеу кеңістігі.',
        rights: '© 2026 museonet. Барлық құқықтар қорғалған.',
      },
      ru: {
        note: 'Сеть виртуальных музеев · археологическое наследие, образование и исследования.',
        rights: '© 2026 museonet. Все права защищены.',
      },
      en: {
        note: 'Virtual museum network · archaeology heritage, learning, and research.',
        rights: '© 2026 museonet. All rights reserved.',
      },
    }),
    [],
  );

  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div>
          <div className="footer-logo">museonet</div>
          <p className="footer-note">{copy[language].note}</p>
        </div>

        <div className="footer-links">
          <Link href="/about">Біз туралы</Link>
          <Link href="/games">Ойындар</Link>
          <Link href="/museums">Музейлер</Link>
          <Link href="/login">Кіру</Link>
        </div>

        <div className="footer-copy">{copy[language].rights}</div>
      </div>
      <style jsx>{`
        .site-footer {
          border-top: 1px solid rgba(181, 139, 100, 0.2);
          background: rgba(255, 255, 255, 0.6);
          padding: 32px 0 40px;
        }

        .footer-inner {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 24px;
          align-items: center;
        }

        .footer-logo {
          font-size: 18px;
          font-weight: 700;
          letter-spacing: 0.14em;
          margin-bottom: 8px;
        }

        .footer-note {
          color: rgba(43, 43, 43, 0.6);
          font-size: 14px;
        }

        .footer-links {
          display: flex;
          flex-direction: column;
          gap: 8px;
          font-size: 14px;
        }

        .footer-links a {
          color: rgba(43, 43, 43, 0.75);
          transition: color 0.25s ease-out;
        }

        .footer-links a:hover {
          color: var(--accent);
        }

        .footer-copy {
          color: rgba(43, 43, 43, 0.6);
          font-size: 13px;
        }
      `}</style>
    </footer>
  );
};

export default Footer;
