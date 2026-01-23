import React from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';

const recommendedMuseums = [
  {
    name: 'Атырау облыстық тарихи-өлкетану музейі',
    location: 'Атырау, Қазақстан',
    category: 'Өлкетану',
    description: 'Каспий өңірінің тарихы мен археологиялық мұрасына арналған негізгі коллекция.',
  },
  {
    name: 'Әзірет Сұлтан музей-қорығы',
    location: 'Түркістан, Қазақстан',
    category: 'Қорық-музей',
    description: 'Қасиетті Түркістан кешенінің экспозициялары мен археологиялық қорлары.',
  },
  {
    name: 'Алтын адам павильоны',
    location: 'Алматы, Қазақстан',
    category: 'Археология',
    description: 'Сақ дәуірінің жәдігерлері мен символдық реконструкциялары.',
  },
  {
    name: 'Жаркент мешіті музейі',
    location: 'Жетісу, Қазақстан',
    category: 'Сәулет',
    description: 'Сәулеттік мұра, ағаш ою өнері және өңірлік тарих.',
  },
  {
    name: 'Ұлттық музей',
    location: 'Астана, Қазақстан',
    category: 'Ұлттық музей',
    description: 'Қазақстан тарихының негізгі кезеңдерін қамтитын үлкен экспозиция.',
  },
  {
    name: 'Отырар музей-қорығы',
    location: 'Түркістан, Қазақстан',
    category: 'Қорық-музей',
    description: 'Ортағасырлық қалалар археологиясы және қазба материалдары.',
  },
];

const museumCards = [
  {
    name: 'Ақтөбе облыстық тарихи-өлкетану музейі',
    location: 'Ақтөбе, Қазақстан',
    category: 'Өлкетану',
    description: 'Өңір тарихы, этнография және археология экспозициялары.',
    hours: '09:00–18:00',
    badge: 'Ұсынылады',
  },
  {
    name: 'Ботай музей-қорығы',
    location: 'СҚО, Қазақстан',
    category: 'Археология',
    description: 'Ежелгі қоныстар мен жылқы мәдениеті туралы ғылыми экспозиция.',
    hours: '10:00–19:00',
    badge: '⭐ 4.8',
  },
  {
    name: 'Шым қала тарихи-мәдени кешені',
    location: 'Шымкент, Қазақстан',
    category: 'Тарих',
    description: 'Қаланың ежелгі тарихын ашатын интерактивті залдар.',
    hours: '09:30–18:30',
    badge: 'Ұсынылады',
  },
  {
    name: 'Көкшетау тарих музейі',
    location: 'Көкшетау, Қазақстан',
    category: 'Өлкетану',
    description: 'Аймақтың археологиялық және мәдени құндылықтары.',
    hours: '10:00–18:00',
    badge: '⭐ 4.6',
  },
  {
    name: 'Сарайшык музей-қорығы',
    location: 'Атырау, Қазақстан',
    category: 'Қорық-музей',
    description: 'Алтын Орда дәуірінің археологиялық мұралары.',
    hours: '09:00–17:30',
    badge: 'Ұсынылады',
  },
  {
    name: 'Кастеев өнер музейі',
    location: 'Алматы, Қазақстан',
    category: 'Өнер',
    description: 'Классикалық және заманауи өнер коллекциялары.',
    hours: '10:00–19:00',
    badge: '⭐ 4.9',
  },
];

const MuseumsPage: React.FC = () => {
  return (
    <div className="page">
      <Head>
        <title>Музейлер тізімі — museonet</title>
        <meta
          name="description"
          content="Қазақстандағы музейлердің заманауи каталогы: іздеу, сүзгі, сұрыптау және толық ақпарат."
        />
      </Head>

      <Header />

      <main>
        <section className="directory-hero">
          <div className="container hero-grid">
            <div>
              <h1>Музейлер тізімі</h1>
              <p className="subtitle">
                Қазақстандағы музейлерді өңір, қала және тақырып бойынша тез табыңыз.
              </p>
              <div className="stats">285 музей • 17 өңір • 12 категория</div>
            </div>
            <div className="search-panel">
              <label className="search-label" htmlFor="search">
                Іздеу
              </label>
              <div className="search-input">
                <span>🔍</span>
                <input id="search" type="search" placeholder="Музей атауын іздеу…" />
              </div>
            </div>
          </div>
        </section>

        <section className="filter-bar">
          <div className="container filter-grid">
            <div className="filter-group">
              <div className="dropdown">Өңір ▾</div>
              <div className="dropdown">Қала ▾</div>
              <div className="chip-row">
                <span className="chip is-active">Үй-музей</span>
                <span className="chip">Археология</span>
                <span className="chip">Өнер</span>
                <span className="chip">Қорық-музей</span>
              </div>
              <div className="price-toggle">
                <button className="toggle is-active">Тегін</button>
                <button className="toggle">Ақылы</button>
              </div>
              <div className="switch">
                <span>Балаларға лайық</span>
                <div className="switch-track">
                  <div className="switch-thumb"></div>
                </div>
              </div>
            </div>
            <div className="filter-actions">
              <div className="dropdown">Сұрыптау: Танымал ▾</div>
              <div className="view-toggle">
                <button className="view-btn is-active">Grid</button>
                <button className="view-btn">List</button>
                <button className="view-btn">Map</button>
              </div>
            </div>
          </div>
          <button className="mobile-filter">Фильтрлер</button>
        </section>

        <section className="section">
          <div className="container">
            <div className="section-heading">
              <h2>Ұсынылатын музейлер</h2>
              <div className="carousel-controls">
                <button className="circle-btn">‹</button>
                <div className="dots">
                  <span className="dot is-active"></span>
                  <span className="dot"></span>
                  <span className="dot"></span>
                </div>
                <button className="circle-btn">›</button>
              </div>
            </div>
            <div className="carousel">
              {recommendedMuseums.map((museum) => (
                <div className="card museum-card" key={museum.name}>
                  <div className="card-image">
                    <div className="image-overlay"></div>
                    <span className="chip chip-image">{museum.category}</span>
                  </div>
                  <div className="card-body">
                    <h3>{museum.name}</h3>
                    <p className="location">📍 {museum.location}</p>
                    <p className="desc">{museum.description}</p>
                    <div className="meta">
                      <span>⏰ 09:00–18:00</span>
                      <span>Ұсынылады</span>
                    </div>
                    <div className="card-actions">
                      <button className="button button-primary">Толық ақпарат</button>
                      <button className="icon-btn">♡</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="section-heading">
              <h2>Барлық музейлер</h2>
              <p>Іздеу нәтижелерін кеңейту үшін қосымша параметрлерді қолданыңыз.</p>
            </div>
            <div className="grid">
              {museumCards.map((museum) => (
                <div className="card museum-card" key={museum.name}>
                  <div className="card-image">
                    <div className="image-overlay"></div>
                    <span className="chip chip-image">{museum.category}</span>
                  </div>
                  <div className="card-body">
                    <h3>{museum.name}</h3>
                    <p className="location">📍 {museum.location}</p>
                    <p className="desc">{museum.description}</p>
                    <div className="meta">
                      <span>⏰ {museum.hours}</span>
                      <span>{museum.badge}</span>
                    </div>
                    <div className="card-actions">
                      <button className="button button-primary">Толық ақпарат</button>
                      <button className="icon-btn">♡</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="load-more">
              <button className="button button-secondary">Жүктеу</button>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="section-heading">
              <h2>Жүктелу күйі</h2>
              <p>Жүйе жаңа мәліметтерді дайындап жатыр.</p>
            </div>
            <div className="grid">
              {[1, 2, 3].map((item) => (
                <div className="card skeleton" key={item}>
                  <div className="skeleton-image"></div>
                  <div className="skeleton-line"></div>
                  <div className="skeleton-line short"></div>
                  <div className="skeleton-line"></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container empty-state">
            <h2>Нәтиже табылмады</h2>
            <p>Басқа сүзгілерді қолданып көріңіз немесе параметрлерді тазартыңыз.</p>
            <button className="button button-secondary">Фильтрді тазалау</button>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="detail-modal">
              <div className="modal-hero">
                <div className="modal-gallery"></div>
                <div className="modal-info">
                  <h2>Алтын адам павильоны</h2>
                  <p>📍 Алматы, Қазақстан</p>
                  <p>⏰ 09:00–18:00</p>
                  <p>☎️ +7 (000) 000-00-00</p>
                  <p>🌐 museonet.kz</p>
                  <button className="button button-primary">Картада ашу</button>
                </div>
              </div>
              <div className="modal-sections">
                <div>
                  <h3>Сипаттама</h3>
                  <p>Сақ дәуірінің мәдени мұрасын таныстыратын негізгі экспозициялар.</p>
                </div>
                <div>
                  <h3>Экспозициялар</h3>
                  <p>Артефактілер, интерактивті залдар және мультимедиалық контент.</p>
                </div>
                <div>
                  <h3>Билеттер</h3>
                  <p>Ересек — 1500 тг, студент — 800 тг, балалар — тегін.</p>
                </div>
                <div>
                  <h3>Қалай жетуге болады</h3>
                  <p>Қалалық маршруттар, қоғамдық көлік және жеке автотұрақ.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <style jsx>{`
        .directory-hero {
          padding: 48px 0 24px;
        }

        .hero-grid {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 32px;
          align-items: center;
        }

        h1 {
          font-size: 40px;
          margin-bottom: 12px;
        }

        .subtitle {
          color: rgba(43, 43, 43, 0.7);
          font-size: 18px;
          max-width: 420px;
        }

        .stats {
          margin-top: 16px;
          font-size: 14px;
          color: rgba(43, 43, 43, 0.6);
        }

        .search-panel {
          background: var(--surface);
          padding: 20px;
          border-radius: 16px;
          border: 1px solid var(--line);
          box-shadow: var(--shadow-soft);
        }

        .search-label {
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: rgba(43, 43, 43, 0.6);
        }

        .search-input {
          margin-top: 12px;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 16px;
          border-radius: 999px;
          border: 1px solid var(--line);
          background: #fff;
        }

        .search-input input {
          border: none;
          width: 100%;
          font-size: 16px;
          outline: none;
          background: transparent;
        }

        .filter-bar {
          position: sticky;
          top: 70px;
          z-index: 30;
          background: var(--bg);
          border-top: 1px solid var(--line);
          border-bottom: 1px solid var(--line);
          padding: 12px 0;
        }

        .filter-grid {
          display: flex;
          justify-content: space-between;
          gap: 24px;
          flex-wrap: wrap;
        }

        .filter-group {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          align-items: center;
        }

        .dropdown {
          padding: 10px 16px;
          border-radius: 999px;
          border: 1px solid var(--line);
          background: #fff;
          font-size: 14px;
        }

        .chip-row {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .price-toggle {
          display: flex;
          border-radius: 999px;
          overflow: hidden;
          border: 1px solid var(--line);
        }

        .toggle {
          padding: 8px 14px;
          background: #fff;
          border: none;
          font-size: 14px;
        }

        .toggle.is-active {
          background: var(--accent);
          color: #fff;
        }

        .switch {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
        }

        .switch-track {
          width: 44px;
          height: 24px;
          background: #e5d9c7;
          border-radius: 999px;
          position: relative;
        }

        .switch-thumb {
          width: 18px;
          height: 18px;
          background: #fff;
          border-radius: 50%;
          position: absolute;
          top: 3px;
          left: 3px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
        }

        .filter-actions {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .view-toggle {
          display: flex;
          gap: 6px;
        }

        .view-btn {
          padding: 8px 12px;
          border-radius: 999px;
          border: 1px solid var(--line);
          background: #fff;
          font-size: 13px;
        }

        .view-btn.is-active {
          background: var(--accent);
          color: #fff;
          border-color: var(--accent);
        }

        .mobile-filter {
          display: none;
        }

        .carousel {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 24px;
        }

        .carousel-controls {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .circle-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 1px solid var(--line);
          background: #fff;
        }

        .dots {
          display: flex;
          gap: 6px;
        }

        .dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #d8c8b5;
        }

        .dot.is-active {
          background: var(--accent);
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
        }

        .museum-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .museum-card:hover {
          transform: translateY(-6px);
          box-shadow: var(--shadow-hover);
        }

        .card-image {
          position: relative;
          height: 180px;
          border-radius: 16px;
          background: linear-gradient(135deg, rgba(217, 195, 162, 0.4), rgba(190, 182, 169, 0.3));
          overflow: hidden;
        }

        .image-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(0, 0, 0, 0.2), transparent 60%);
        }

        .chip-image {
          position: absolute;
          top: 12px;
          left: 12px;
        }

        .card-body {
          padding-top: 16px;
          display: grid;
          gap: 8px;
        }

        .location {
          color: rgba(43, 43, 43, 0.6);
          font-size: 14px;
        }

        .desc {
          color: rgba(43, 43, 43, 0.7);
          font-size: 14px;
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
        }

        .icon-btn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 1px solid var(--line);
          background: #fff;
        }

        .load-more {
          display: flex;
          justify-content: center;
          margin-top: 32px;
        }

        .skeleton {
          display: grid;
          gap: 12px;
        }

        .skeleton-image {
          height: 180px;
          border-radius: 16px;
          background: #eee4d8;
          animation: pulse 1.5s ease-in-out infinite;
        }

        .skeleton-line {
          height: 12px;
          border-radius: 8px;
          background: #eee4d8;
          animation: pulse 1.5s ease-in-out infinite;
        }

        .skeleton-line.short {
          width: 70%;
        }

        .empty-state {
          text-align: center;
          background: #fff;
          border-radius: 20px;
          padding: 40px;
          box-shadow: var(--shadow-soft);
        }

        .detail-modal {
          background: #fff;
          border-radius: 24px;
          padding: 32px;
          box-shadow: var(--shadow-soft);
        }

        .modal-hero {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 24px;
          margin-bottom: 24px;
        }

        .modal-gallery {
          height: 220px;
          border-radius: 18px;
          background: linear-gradient(135deg, rgba(217, 195, 162, 0.4), rgba(190, 182, 169, 0.35));
        }

        .modal-info p {
          margin: 6px 0;
          color: rgba(43, 43, 43, 0.7);
        }

        .modal-sections {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 0.6;
          }
          50% {
            opacity: 1;
          }
        }

        @media (max-width: 900px) {
          .hero-grid {
            grid-template-columns: 1fr;
          }

          .filter-grid {
            flex-direction: column;
            align-items: flex-start;
          }

          .mobile-filter {
            display: block;
            margin: 12px auto 0;
            padding: 10px 16px;
            border-radius: 999px;
            border: 1px solid var(--line);
            background: #fff;
          }

          .modal-hero {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 700px) {
          .filter-group,
          .filter-actions {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default MuseumsPage;
