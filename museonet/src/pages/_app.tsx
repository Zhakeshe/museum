import type { AppProps } from 'next/app';
import { Inter } from 'next/font/google';
import { LanguageProvider } from '../contexts/LanguageContext';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <div className={inter.className}>
      <LanguageProvider>
        <Component {...pageProps} />
      </LanguageProvider>
      <style jsx global>{`
        :root {
          --sand: #d9c3a2;
          --light-brown: #b58b64;
          --beige-gray: #beb6a9;
          --background: #f6f1e8;
          --text: #2b2b2b;
          --accent: #8a6a45;
          --white: #ffffff;
          --shadow: 0 18px 40px rgba(43, 43, 43, 0.08);
          --shadow-soft: 0 10px 24px rgba(43, 43, 43, 0.08);
          --border: 1px solid rgba(181, 139, 100, 0.22);
          --radius-lg: 14px;
          --radius-md: 12px;
          --radius-sm: 10px;
        }

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        body {
          font-family: ${inter.style.fontFamily};
          background-color: var(--background);
          color: var(--text);
          line-height: 1.6;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        img {
          max-width: 100%;
          display: block;
        }

        .page {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          animation: fadePage 0.35s ease-out;
        }

        main {
          flex: 1;
        }

        .container {
          width: min(1200px, 92%);
          margin: 0 auto;
        }

        .section {
          padding: 64px 0;
        }

        .section--tight {
          padding: 48px 0;
        }

        .section-heading {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 24px;
          margin-bottom: 32px;
        }

        .section-heading h2 {
          font-size: clamp(28px, 2.5vw, 32px);
          font-weight: 600;
        }

        .section-heading p {
          max-width: 520px;
          color: rgba(43, 43, 43, 0.72);
          font-size: 16px;
        }

        .eyebrow {
          text-transform: uppercase;
          font-size: 12px;
          letter-spacing: 0.2em;
          color: rgba(43, 43, 43, 0.6);
        }

        .button {
          border-radius: 999px;
          padding: 12px 24px;
          font-size: 15px;
          font-weight: 500;
          border: 1px solid transparent;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: transform 0.25s ease-out, box-shadow 0.25s ease-out,
            background-color 0.25s ease-out, color 0.25s ease-out;
        }

        .button-primary {
          background-color: var(--accent);
          color: var(--white);
          box-shadow: var(--shadow-soft);
        }

        .button-primary:hover {
          transform: translateY(-2px);
          background-color: #7b5d3c;
        }

        .button-secondary {
          background-color: transparent;
          color: var(--accent);
          border: 1px solid rgba(138, 106, 69, 0.4);
        }

        .button-secondary:hover {
          transform: translateY(-2px);
          background-color: rgba(138, 106, 69, 0.08);
        }

        .card {
          background: rgba(255, 255, 255, 0.9);
          border-radius: var(--radius-md);
          border: var(--border);
          box-shadow: var(--shadow-soft);
          padding: 24px;
          transition: transform 0.25s ease-out, box-shadow 0.25s ease-out;
        }

        .card:hover {
          transform: translateY(-6px);
          box-shadow: var(--shadow);
        }

        .chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          border-radius: 999px;
          border: 1px solid rgba(181, 139, 100, 0.35);
          color: rgba(43, 43, 43, 0.74);
          background: rgba(217, 195, 162, 0.25);
          font-size: 13px;
          font-weight: 500;
        }

        .chip.is-active {
          background: rgba(138, 106, 69, 0.15);
          color: var(--accent);
          border-color: rgba(138, 106, 69, 0.45);
        }

        .input {
          width: 100%;
          padding: 12px 16px;
          border-radius: var(--radius-sm);
          border: 1px solid rgba(181, 139, 100, 0.3);
          background: rgba(255, 255, 255, 0.85);
          font-size: 15px;
          color: var(--text);
        }

        .input:focus {
          outline: none;
          border-color: rgba(138, 106, 69, 0.6);
          box-shadow: 0 0 0 3px rgba(138, 106, 69, 0.15);
        }

        .divider {
          height: 1px;
          background: rgba(181, 139, 100, 0.2);
          margin: 24px 0;
        }

        @keyframes fadePage {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 900px) {
          .section {
            padding: 48px 0;
          }

          .section-heading {
            flex-direction: column;
            align-items: flex-start;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  );
};

export default App;
