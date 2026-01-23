import React from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';

const HomePage: React.FC = () => {
  return (
    <div className="page">
      <Head>
        <title>museonet — Виртуалды музей</title>
        <meta
          name="description"
          content="museonet — археологиялық мұра мен мәдени тарихты көптілді цифрлық форматта ұсынатын виртуалды музей."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Header />

      <main>
        <section className="hero">
          <div className="container hero-content">
            <span className="eyebrow">Виртуалды музей</span>
            <h1>Археология әлемі — museonet</h1>
            <p>
              Тарихтың нәзік қабаттарын ашатын көптілді цифрлық музей. Экспедициялар, артефактілер
              және ғылыми зерттеу материалдары бір кеңістікте жинақталады.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#features">
                Зерттеу
              </a>
              <a className="button button-secondary" href="#about-preview">
                Көбірек білу
              </a>
            </div>
          </div>
        </section>

        <section className="section" id="features">
          <div className="container">
            <div className="section-heading">
              <h2>Негізгі бағыттар</h2>
              <p>
                museonet — қазақ, орыс және ағылшын тілдерінде қолжетімді виртуалды музей. Біз
                археологиялық зерттеулерді, артефактілерді және білім беру жобаларын бір жерде
                жинақтадық.
              </p>
            </div>
            <div className="cards-grid">
              {[
                {
                  title: 'Экспедициялар',
                  description: 'Маусымдық қазбалардың күнделігі, маршрут және далалық есептер.',
                },
                {
                  title: 'Артефактілер',
                  description: 'Қордағы сирек жәдігерлердің 3D және фото каталогы.',
                },
                {
                  title: 'Ойындар',
                  description: 'Студенттерге арналған зертханалық тапсырмалар мен симуляциялар.',
                },
                {
                  title: 'Музейлер',
                  description: 'Қазақстандағы музейлердің ғылыми жобалары мен көрмелері.',
                },
              ].map((card) => (
                <div className="card feature-card" key={card.title}>
                  <div className="icon-circle" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M4 15.5c3.5-1.5 6.5-4.5 8-8m0 0 3 3m-3-3 3-3M5 19h14" />
                    </svg>
                  </div>
                  <h3>{card.title}</h3>
                  <p>{card.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section section--tight" id="about-preview">
          <div className="container">
            <div className="section-heading">
              <h2>Музейлер шолуы</h2>
              <p>Археологиялық коллекциялары бай үш маңызды нүкте және тұрақты серіктестер.</p>
            </div>
            <div className="museum-list">
              {[
                { name: 'Ұлттық музей', location: 'Астана', link: 'Толығырақ' },
                { name: 'Отырар қорығы', location: 'Түркістан', link: 'Толығырақ' },
                { name: 'Алтын адам павильоны', location: 'Алматы', link: 'Толығырақ' },
              ].map((item) => (
                <div className="card museum-card" key={item.name}>
                  <div>
                    <h3>{item.name}</h3>
                    <p>{item.location}</p>
                  </div>
                  <a className="text-link" href="/museums">
                    {item.link}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <style jsx>{`
        .hero {
          min-height: 70vh;
          display: flex;
          align-items: center;
          background-image: linear-gradient(
              110deg,
              rgba(246, 241, 232, 0.92) 10%,
              rgba(217, 195, 162, 0.5) 55%,
              rgba(246, 241, 232, 0.82) 100%
            ),
            url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80');
          background-size: cover;
          background-position: center;
        }

        .hero-content {
          padding: 120px 0 100px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          max-width: 620px;
        }

        .hero h1 {
          font-size: clamp(44px, 4vw, 52px);
          line-height: 1.1;
          font-weight: 700;
        }

        .hero p {
          font-size: 18px;
          color: rgba(43, 43, 43, 0.75);
        }

        .hero-actions {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }

        .cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 24px;
        }

        .feature-card h3 {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .feature-card p {
          color: rgba(43, 43, 43, 0.7);
          font-size: 15px;
        }

        .icon-circle {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: rgba(217, 195, 162, 0.35);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
          color: var(--accent);
        }

        .icon-circle svg {
          width: 20px;
          height: 20px;
        }

        .museum-list {
          display: grid;
          gap: 16px;
        }

        .museum-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .museum-card h3 {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 6px;
        }

        .museum-card p {
          color: rgba(43, 43, 43, 0.65);
        }

        .text-link {
          color: var(--accent);
          font-size: 14px;
          font-weight: 500;
        }

        @media (max-width: 700px) {
          .hero-content {
            padding: 96px 0 80px;
          }

          .museum-card {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }
        }
      `}</style>
    </div>
  );
};

export default HomePage;
