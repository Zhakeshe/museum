import React from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';

const LoginPage: React.FC = () => {
  return (
    <div className="page">
      <Head>
        <title>Кіру — museonet</title>
        <meta name="description" content="museonet жобасына кіру парағы." />
      </Head>

      <Header />

      <main>
        <section className="section login-section">
          <div className="container">
            <div className="login-card card">
              <div>
                <span className="eyebrow">Қош келдіңіз</span>
                <h2>Кіру</h2>
                <p>Жеке кабинетті пайдалану үшін деректеріңізді енгізіңіз.</p>
              </div>
              <form className="login-form">
                <label>
                  Email
                  <input className="input" type="email" placeholder="you@example.com" />
                </label>
                <label>
                  Құпиясөз
                  <input className="input" type="password" placeholder="••••••••" />
                </label>
                <button className="button button-primary" type="submit">
                  Кіру
                </button>
                <div className="login-links">
                  <a href="/">Құпиясөзді ұмыттыңыз ба?</a>
                  <button className="button button-secondary" type="button">
                    Google
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
      `}</style>
    </div>
  );
};

export default LoginPage;
