import React from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';

const museums = [
  { name: 'Археология ғылыми орталығы', city: 'Астана', desc: 'Қазба есептері мен қор сақтау.' },
  { name: 'Ежелгі қалалар музейі', city: 'Тараз', desc: 'Орта ғасырлар мұрасы.' },
  { name: 'Алтын адам павильоны', city: 'Алматы', desc: 'Сақ дәуірінің коллекциясы.' },
  { name: 'Отырар қорығы', city: 'Түркістан', desc: 'Жібек жолы археологиясы.' },
];

const MuseumsPage: React.FC = () => {
  return (
    <div className="page">
      <Head>
        <title>Музейлер — Archeo</title>
        <meta name="description" content="Археологиялық музейлер тізімі." />
      </Head>

      <Header />

      <main>
        <section className="section">
          <div className="container">
            <div className="section-heading">
              <div>
                <span className="eyebrow">Каталог</span>
                <h2>Музейлер</h2>
              </div>
              <p>Аймақ немесе тип бойынша сүзгілеңіз.</p>
            </div>

            <div className="search-row">
              <input className="input" placeholder="Музей атауын іздеу" />
              <div className="filters">
                <span className="chip is-active">Region</span>
                <span className="chip">Type</span>
              </div>
            </div>

            <div className="museum-grid">
              {museums.map((museum) => (
                <div className="card museum-item" key={museum.name}>
                  <div className="image-placeholder"></div>
                  <div>
                    <h3>{museum.name}</h3>
                    <p>{museum.city}</p>
                    <span>{museum.desc}</span>
                  </div>
                  <button className="button button-secondary" type="button">
                    Open details
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <style jsx>{`
        .search-row {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
          margin-bottom: 24px;
        }

        .filters {
          display: flex;
          gap: 10px;
          align-items: center;
        }

        .museum-grid {
          display: grid;
          gap: 24px;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
        }

        .museum-item {
          display: grid;
          gap: 16px;
        }

        .image-placeholder {
          height: 140px;
          border-radius: 12px;
          background: linear-gradient(135deg, rgba(217, 195, 162, 0.4), rgba(190, 182, 169, 0.35));
          border: 1px solid rgba(181, 139, 100, 0.25);
        }

        .museum-item h3 {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 4px;
        }

        .museum-item p {
          color: rgba(43, 43, 43, 0.65);
          margin-bottom: 8px;
        }

        .museum-item span {
          color: rgba(43, 43, 43, 0.6);
          font-size: 14px;
        }
      `}</style>
    </div>
  );
};

export default MuseumsPage;
