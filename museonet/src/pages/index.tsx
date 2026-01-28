import React, { useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';

const museums = [
  {
    id: 1,
    name: 'Отырар музей-қорығы',
    location: 'Түркістан облысы',
    category: 'Археология',
    description: 'Қалашық тарихы, көне жазбалар және археологиялық олжалар көрмесі.',
    hours: '09:00–18:00',
    rating: 4.8,
  },
  {
    id: 2,
    name: 'Әзірет Сұлтан музей-қорығы',
    location: 'Түркістан',
    category: 'Қорық-музей',
    description: 'Кесене ансамблі, рухани тарих және мәдени мұра экспозициялары.',
    hours: '10:00–19:00',
    rating: 4.7,
  },
  {
    id: 3,
    name: 'Кастеев өнер музейі',
    location: 'Алматы',
    category: 'Өнер',
    description: 'Қазақ және әлемдік бейнелеу өнері, заманауи көрме залдары.',
    hours: '10:00–20:00',
    rating: 4.6,
  },
  {
    id: 4,
    name: 'Есік музей-қорығы',
    location: 'Алматы облысы',
    category: 'Археология',
    description: 'Алтын адам мұрасы, сақ дәуірінің мәдениеті және қазба материалдары.',
    hours: '09:30–18:30',
    rating: 4.9,
  },
  {
    id: 5,
    name: 'Берел музей-қорығы',
    location: 'ШҚО',
    category: 'Қорық-музей',
    description: 'Берел қорғандары, ат әбзелдері және экспедициялық артефактілер.',
    hours: '09:00–17:30',
    rating: 4.5,
  },
  {
    id: 6,
    name: 'Жаркент мешіті музейі',
    location: 'Жетісу облысы',
    category: 'Үй-музей',
    description: 'Ағаш сәулет үлгісі, қолөнер және рухани мұра жинағы.',
    hours: '09:00–18:00',
    rating: 4.4,
  },
  {
    id: 7,
    name: 'Таңбалы музей-қорығы',
    location: 'Алматы облысы',
    category: 'Археология',
    description: 'Жартастағы суреттер, далалық мәдениет және ашық аспан экспозициясы.',
    hours: '08:30–18:00',
    rating: 4.9,
  },
  {
    id: 8,
    name: 'Ұлттық музей',
    location: 'Астана',
    category: 'Өнер',
    description: 'Ежелгі тарихтан заманауи өнерге дейінгі кең көлемді залдар.',
    hours: '09:00–20:00',
    rating: 4.7,
  },
];

const virtualTours = [
  {
    id: 1,
    title: 'ҚР облыстық тарихи музейі — виртуалды тур',
    url: 'https://qrgis.kz/tours/Virtualtour/',
  },
  {
    id: 2,
    title: 'Ақтау қаласының виртуалды туры',
    url: 'https://qrgis.kz/tours/Virtual_Aqtau/',
  },
  {
    id: 3,
    title: 'Шаймардан мешіті — виртуалды тур',
    url: 'https://torus360.kz/tours/shaimardan/',
  },
  {
    id: 4,
    title: 'Алматы қаласы — 360° тур',
    url: 'https://torus.kz/almaty_tour/',
  },
  {
    id: 5,
    title: 'Ақтөбе музейі — 360° тур',
    url: 'https://torus360.kz/tours/aqtobe-tour-new/index.html',
  },
];

const HomePage: React.FC = () => {
  const [activeTour, setActiveTour] = useState(0);
  const featuredMuseums = useMemo(() => museums.slice(0, 5), []);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTour((prev) => (prev + 1) % virtualTours.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="page">
      <Head>
        <title>museonet — Виртуалды музей</title>
        <meta
          name="description"
          content="museonet — археология, виртуалды музей және мәдени мұраға арналған цифрлық платформа."
        />
      </Head>

      <Header />

      <main>
        <section className="hero">
          <div className="hero-overlay"></div>
          <div className="container hero-content">
            <span className="eyebrow">Виртуалды музей</span>
            <h1>Археология әлемі — museonet</h1>
            <p>
              Қазақстан археологиясының мұрасын бір кеңістікте жинақтаған цифрлық платформа. Экспедициялар,
              коллекциялар және зерттеу материалдары кез келген уақытта қолжетімді.
            </p>
            <div className="hero-actions">
              <button className="button button-primary">Зерттеу</button>
              <button className="button button-outline">Көбірек білу</button>
            </div>
          </div>
        </section>

        <section className="featured-museums">
          <div className="container">
            <div className="section-heading">
              <h2>Музейлер тізімі</h2>
              <p>Ең танымал 5 музей.</p>
            </div>
            <div className="museum-grid">
              {featuredMuseums.map((museum) => (
                <article className="museum-card" key={museum.id}>
                  <div className="card-thumb">
                    <span className="category-chip">{museum.category}</span>
                  </div>
                  <div className="card-body">
                    <h3>{museum.name}</h3>
                    <p className="location">{museum.location}</p>
                    <p className="description">{museum.description}</p>
                    <div className="meta">
                      <span>{museum.hours}</span>
                      <span>⭐ {museum.rating.toFixed(1)}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="virtual-tours">
          <div className="container">
            <h2>Виртуалды турлар</h2>
            <p className="subtitle">Келесі турға қолмен ауыстыра аласыз.</p>
            <div className="tour-slider">
              <button
                className="slider-nav prev"
                type="button"
                onClick={() => setActiveTour((prev) => (prev - 1 + virtualTours.length) % virtualTours.length)}
              >
                ‹
              </button>
              {virtualTours.map((tour, index) => (
                <div
                  key={tour.id}
                  className={`tour-slide ${index === activeTour ? 'is-active' : ''}`}
                  aria-hidden={index !== activeTour}
                >
                  <div className="tour-frame">
                    <iframe
                      src={tour.url}
                      title={tour.title}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                  <div className="tour-meta">
                    <h3>{tour.title}</h3>
                    <a className="button button-primary" href={tour.url} target="_blank" rel="noreferrer">
                      Турды ашу
                    </a>
                  </div>
                </div>
              ))}
              <button
                className="slider-nav next"
                type="button"
                onClick={() => setActiveTour((prev) => (prev + 1) % virtualTours.length)}
              >
                ›
              </button>
            </div>
          </div>
        </section>

        <section className="model-showcase">
          <div className="container">
            <div className="model-grid">
              <div className="model-info">
                <h2>3D моделдер</h2>
                <p className="model-title">Подвеска, бронза. XIX ғ.</p>
              </div>
              <div className="model-image">
                <div className="model-placeholder">3D</div>
              </div>
              <div className="model-meta">
                <p>Сақталатын орын:</p>
                <strong>Шым қала тарихи-мәдени кешені</strong>
              </div>
            </div>
            <div className="model-thumbs">
              {['1', '2', '3', '4', '5', '6'].map((item) => (
                <div className="thumb" key={item}>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="artifact-section">
          <div className="container">
            <div className="artifact-header">
              <h2>Музейные предметы</h2>
              <div className="artifact-nav">
                <button type="button">‹</button>
                <button type="button">›</button>
              </div>
            </div>
            <div className="artifact-grid">
              {['Молитвенный коврик', 'Молитвенный коврик', 'Медаль', 'Пиджак'].map((title, index) => (
                <article className="artifact-card" key={`${title}-${index}`}>
                  <div className="artifact-image"></div>
                  <h3>{title}</h3>
                  <p>Ұлттық музей коллекциясы</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="stats-strip">
          <div className="container stats-grid">
            {[
              { value: '285', label: 'Музейных экспонатов' },
              { value: '66,000', label: '3D моделей' },
              { value: '750', label: 'Виртуальных туров' },
              { value: '15', label: 'Экспедиций' },
            ].map((stat) => (
              <div className="stat-card" key={stat.label}>
                <span className="stat-value">{stat.value}</span>
                <span className="stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />

      <style jsx>{`
        :global(body) {
          background: #f6f1e9;
          color: #2b2b2b;
        }

        .hero {
          position: relative;
          padding: 120px 0;
          background: linear-gradient(120deg, rgba(74, 48, 28, 0.92), rgba(41, 29, 18, 0.72)),
            linear-gradient(135deg, #b88a5a 0%, #d8b38b 55%, #f4e7d7 100%);
          color: #fff;
        }

        .hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, rgba(25, 20, 14, 0.78), rgba(25, 20, 14, 0.35));
        }

        .hero-content {
          position: relative;
          z-index: 1;
          max-width: 640px;
        }

        .eyebrow {
          text-transform: uppercase;
          letter-spacing: 0.3em;
          font-size: 12px;
          opacity: 0.85;
        }

        h1 {
          font-size: 48px;
          line-height: 56px;
          margin: 16px 0;
        }

        .hero p {
          font-size: 18px;
          line-height: 28px;
          margin-bottom: 32px;
          color: rgba(255, 255, 255, 0.85);
        }

        .hero-actions {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }

        .featured-museums {
          padding: 64px 0 20px;
        }

        .section-heading h2 {
          font-size: 32px;
          margin-bottom: 8px;
        }

        .section-heading p {
          color: rgba(43, 43, 43, 0.7);
          margin-bottom: 24px;
        }

        .virtual-tours {
          padding: 40px 0 64px;
        }

        .virtual-tours h2 {
          font-size: 34px;
          margin-bottom: 8px;
          color: #7b2f2f;
        }

        .virtual-tours .subtitle {
          color: rgba(43, 43, 43, 0.7);
          margin-bottom: 24px;
        }

        .tour-slider {
          position: relative;
          background: #fff;
          border-radius: 24px;
          padding: 18px;
          border: 1px solid rgba(180, 106, 60, 0.2);
          box-shadow: 0 18px 32px rgba(64, 42, 18, 0.1);
          overflow: hidden;
        }

        .slider-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 1px solid rgba(180, 106, 60, 0.3);
          background: #fff;
          color: #7b4c2a;
          font-size: 24px;
          cursor: pointer;
          z-index: 2;
        }

        .slider-nav.prev {
          left: 12px;
        }

        .slider-nav.next {
          right: 12px;
        }

        .tour-slide {
          display: none;
          align-items: center;
          gap: 24px;
        }

        .tour-slide.is-active {
          display: grid;
          grid-template-columns: 1.3fr 1fr;
          gap: 24px;
        }

        .tour-frame {
          border-radius: 20px;
          overflow: hidden;
          border: 1px solid rgba(180, 106, 60, 0.15);
          background: #f4efe7;
          aspect-ratio: 16 / 9;
        }

        .tour-frame iframe {
          width: 100%;
          height: 100%;
          border: none;
        }

        .tour-meta h3 {
          margin-bottom: 16px;
          font-size: 20px;
        }

        .tour-dots {
          margin-top: 16px;
          display: flex;
          justify-content: center;
          gap: 8px;
        }

        .model-showcase {
          padding: 60px 0;
          background: #fff;
        }

        .model-grid {
          display: grid;
          grid-template-columns: 1fr 1.2fr 1fr;
          align-items: center;
          gap: 24px;
        }

        .model-info h2 {
          font-size: 32px;
          color: #7b2f2f;
          margin-bottom: 16px;
        }

        .model-title {
          font-size: 20px;
          color: rgba(43, 43, 43, 0.7);
        }

        .model-image {
          display: flex;
          justify-content: center;
        }

        .model-placeholder {
          width: 320px;
          height: 220px;
          border-radius: 24px;
          background: #f2ebe1;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 36px;
          color: rgba(180, 106, 60, 0.6);
        }

        .model-meta {
          color: rgba(43, 43, 43, 0.7);
        }

        .model-thumbs {
          display: flex;
          justify-content: center;
          gap: 12px;
          margin-top: 24px;
          flex-wrap: wrap;
        }

        .thumb {
          width: 54px;
          height: 54px;
          border-radius: 12px;
          background: #f7f2ea;
          border: 1px solid rgba(180, 106, 60, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          color: rgba(43, 43, 43, 0.6);
        }

        .artifact-section {
          padding: 64px 0;
        }

        .artifact-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .artifact-header h2 {
          font-size: 32px;
          color: #7b2f2f;
        }

        .artifact-nav button {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 1px solid rgba(180, 106, 60, 0.3);
          background: transparent;
          color: #7b2f2f;
          font-size: 20px;
          margin-left: 8px;
        }

        .artifact-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 24px;
        }

        .artifact-card {
          background: #fff;
          border-radius: 24px;
          padding: 18px;
          border: 1px solid rgba(180, 106, 60, 0.2);
          display: grid;
          gap: 10px;
        }

        .artifact-image {
          height: 220px;
          border-radius: 20px;
          background: #f3ece3;
        }

        .artifact-card h3 {
          font-size: 18px;
          color: #8b6a4b;
        }

        .artifact-card p {
          color: rgba(43, 43, 43, 0.6);
          font-size: 14px;
        }

        .stats-strip {
          padding: 40px 0 80px;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        }

        .dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          border: none;
          background: rgba(180, 106, 60, 0.3);
          cursor: pointer;
        }

        .dot.is-active {
          background: #b46a3c;
        }

        .button {
          border-radius: 999px;
          padding: 12px 24px;
          font-size: 15px;
          border: none;
          cursor: pointer;
        }

        .button-primary {
          background: #b46a3c;
          color: #fff;
          box-shadow: 0 10px 20px rgba(180, 106, 60, 0.3);
        }

        .button-outline {
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.7);
          color: #fff;
        }

        .catalog {
          padding: 96px 0;
        }

        .catalog-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 48px;
          align-items: start;
        }

        .catalog-info h2 {
          font-size: 32px;
          line-height: 40px;
          margin-bottom: 16px;
        }

        .catalog-info p {
          color: rgba(43, 43, 43, 0.7);
          line-height: 26px;
        }

        .stats-row {
          display: flex;
          gap: 16px;
          margin-top: 24px;
          font-size: 14px;
          color: rgba(43, 43, 43, 0.6);
        }

        .catalog-controls {
          background: rgba(255, 255, 255, 0.9);
          border-radius: 24px;
          padding: 24px;
          border: 1px solid rgba(180, 106, 60, 0.2);
          box-shadow: 0 12px 24px rgba(64, 42, 18, 0.08);
        }

        .search-field input {
          width: 100%;
          min-height: 48px;
          border-radius: 16px;
          border: 1px solid rgba(180, 106, 60, 0.2);
          padding: 0 16px;
          font-size: 15px;
          background: linear-gradient(180deg, #fff, #fdf9f4);
        }

        .filters {
          margin-top: 20px;
          display: grid;
          gap: 16px;
        }

        .chip-row {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .chip {
          border-radius: 999px;
          border: 1px solid rgba(180, 106, 60, 0.2);
          padding: 8px 14px;
          background: #fff;
          font-size: 13px;
          cursor: pointer;
          transition: box-shadow 0.2s ease, transform 0.2s ease;
        }

        .chip.is-active {
          background: rgba(180, 106, 60, 0.12);
          border-color: rgba(180, 106, 60, 0.6);
        }

        .chip:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 14px rgba(180, 106, 60, 0.2);
        }

        .filter-actions {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          align-items: center;
          flex-wrap: wrap;
        }

        .filter-actions select {
          min-height: 40px;
          border-radius: 999px;
          border: 1px solid rgba(180, 106, 60, 0.25);
          padding: 0 16px;
          background: #fff;
        }

        .view-toggle {
          display: flex;
          gap: 8px;
        }

        .view-toggle button {
          border-radius: 999px;
          border: 1px solid rgba(180, 106, 60, 0.2);
          padding: 8px 14px;
          background: #fff;
        }

        .view-toggle .is-active {
          background: rgba(180, 106, 60, 0.15);
          border-color: rgba(180, 106, 60, 0.6);
        }

        .mobile-filter-toggle {
          display: none;
          margin-top: 16px;
          width: 100%;
          border-radius: 999px;
          border: 1px solid rgba(180, 106, 60, 0.3);
          padding: 10px 16px;
          background: #fff;
        }

        .museum-grid {
          margin-top: 40px;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 24px;
        }

        .museum-grid.list {
          grid-template-columns: 1fr;
        }

        .museum-card {
          background: #fff;
          border-radius: 24px;
          overflow: hidden;
          border: 1px solid rgba(180, 106, 60, 0.15);
          box-shadow: 0 12px 24px rgba(64, 42, 18, 0.08);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .museum-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 32px rgba(64, 42, 18, 0.12);
        }

        .card-thumb {
          position: relative;
          aspect-ratio: 16 / 9;
          background: linear-gradient(135deg, rgba(180, 106, 60, 0.2), rgba(255, 255, 255, 0.1));
        }

        .category-chip {
          position: absolute;
          top: 16px;
          left: 16px;
          background: rgba(255, 255, 255, 0.9);
          border-radius: 999px;
          padding: 6px 12px;
          font-size: 12px;
        }

        .card-body {
          padding: 20px;
          display: grid;
          gap: 10px;
        }

        .location {
          color: rgba(43, 43, 43, 0.6);
          font-size: 14px;
        }

        .description {
          color: rgba(43, 43, 43, 0.75);
          font-size: 14px;
          line-height: 22px;
        }

        .meta {
          display: flex;
          justify-content: space-between;
          font-size: 13px;
          color: rgba(43, 43, 43, 0.6);
        }

        .card-actions {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 6px;
        }

        .favorite {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 1px solid rgba(180, 106, 60, 0.25);
          background: #fff;
          font-size: 16px;
        }

        .skeleton-grid {
          margin-top: 40px;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 24px;
        }

        .skeleton-card {
          background: #fff;
          border-radius: 24px;
          padding: 20px;
          display: grid;
          gap: 12px;
          box-shadow: 0 12px 24px rgba(64, 42, 18, 0.08);
        }

        .skeleton-thumb {
          height: 160px;
          border-radius: 16px;
          background: linear-gradient(90deg, #f1e8dc, #f7f2ea, #f1e8dc);
          background-size: 200% 100%;
          animation: shimmer 1.2s infinite;
        }

        .skeleton-line {
          height: 12px;
          border-radius: 999px;
          background: #f1e8dc;
        }

        .skeleton-line.short {
          width: 70%;
        }

        .empty-state {
          margin-top: 40px;
          padding: 32px;
          border-radius: 24px;
          background: #fff;
          text-align: center;
          box-shadow: 0 12px 24px rgba(64, 42, 18, 0.08);
        }

        .digital-experience {
          padding: 96px 0;
        }

        .digital-header {
          max-width: 680px;
          margin-bottom: 32px;
        }

        .digital-header h2 {
          font-size: 32px;
          line-height: 40px;
          margin-bottom: 12px;
        }

        .digital-header p {
          color: rgba(43, 43, 43, 0.7);
          line-height: 26px;
        }

        .digital-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 24px;
        }

        .digital-card {
          background: #fff;
          border-radius: 24px;
          padding: 24px;
          border: 1px solid rgba(180, 106, 60, 0.18);
          box-shadow: 0 14px 28px rgba(64, 42, 18, 0.08);
          transition: transform 0.35s ease, box-shadow 0.35s ease;
        }

        .digital-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 32px rgba(64, 42, 18, 0.12);
        }

        .digital-card h3 {
          margin-bottom: 10px;
          font-size: 20px;
        }

        .digital-card p {
          color: rgba(43, 43, 43, 0.7);
          line-height: 24px;
        }

        .digital-stats {
          margin-top: 32px;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        }

        .stat-card {
          background: linear-gradient(140deg, rgba(255, 255, 255, 0.95), rgba(249, 241, 231, 0.9));
          border-radius: 20px;
          padding: 20px;
          text-align: center;
          border: 1px solid rgba(180, 106, 60, 0.2);
          box-shadow: 0 10px 20px rgba(64, 42, 18, 0.08);
          animation: float 6s ease-in-out infinite;
        }

        .stat-card:nth-child(2) {
          animation-delay: 0.4s;
        }

        .stat-card:nth-child(3) {
          animation-delay: 0.8s;
        }

        .stat-card:nth-child(4) {
          animation-delay: 1.2s;
        }

        .stat-value {
          font-size: 32px;
          font-weight: 700;
          color: #b46a3c;
          display: block;
          margin-bottom: 4px;
        }

        .stat-label {
          font-size: 13px;
          color: rgba(43, 43, 43, 0.65);
          letter-spacing: 0.02em;
        }

        .design-system {
          padding: 80px 0;
        }

        .design-system h2 {
          font-size: 32px;
          margin-bottom: 24px;
        }

        .design-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 24px;
        }

        .design-card {
          background: #fff;
          border-radius: 20px;
          padding: 20px;
          border: 1px solid rgba(180, 106, 60, 0.18);
          box-shadow: 0 10px 20px rgba(64, 42, 18, 0.08);
        }

        .design-card ul {
          margin: 12px 0 0;
          padding-left: 18px;
          color: rgba(43, 43, 43, 0.7);
        }

        .mobile-sheet {
          position: fixed;
          inset: 0;
          z-index: 200;
          display: flex;
          align-items: flex-end;
        }

        .sheet-backdrop {
          position: absolute;
          inset: 0;
          background: rgba(17, 12, 6, 0.45);
          border: none;
        }

        .sheet-panel {
          position: relative;
          background: #fff;
          width: 100%;
          border-radius: 24px 24px 0 0;
          padding: 24px;
          display: grid;
          gap: 16px;
        }

        .sheet-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .sheet-content {
          display: grid;
          gap: 16px;
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-6px);
          }
        }

        @keyframes shimmer {
          0% {
            background-position: 0% 50%;
          }
          100% {
            background-position: 100% 50%;
          }
        }

        @media (max-width: 960px) {
          .catalog-grid {
            grid-template-columns: 1fr;
          }

          .tour-slide.is-active {
            grid-template-columns: 1fr;
          }

          .model-grid {
            grid-template-columns: 1fr;
            text-align: center;
          }

          .mobile-filter-toggle {
            display: block;
          }

          .filters {
            display: none;
          }
        }

        @media (max-width: 700px) {
          .hero {
            padding: 96px 0;
          }

          .tour-slider {
            padding: 14px;
          }

          h1 {
            font-size: 36px;
            line-height: 44px;
          }

          .model-placeholder {
            width: 240px;
            height: 180px;
          }
        }
      `}</style>
    </div>
  );
};

export default HomePage;
