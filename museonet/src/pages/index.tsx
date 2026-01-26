import React, { useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';

const categoryFilters = ['Үй-музей', 'Археология', 'Өнер', 'Қорық-музей'];
const sortOptions = ['Танымал', 'Жаңа', 'A–Я'];

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

const HomePage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('Барлығы');
  const [sort, setSort] = useState('Танымал');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [isLoading, setIsLoading] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const filteredMuseums = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    let items = museums.filter((museum) => {
      const matchesSearch =
        museum.name.toLowerCase().includes(normalized) ||
        museum.location.toLowerCase().includes(normalized);
      const matchesCategory = activeCategory === 'Барлығы' || museum.category === activeCategory;
      return matchesSearch && matchesCategory;
    });

    if (sort === 'Жаңа') {
      items = [...items].reverse();
    }
    if (sort === 'A–Я') {
      items = [...items].sort((a, b) => a.name.localeCompare(b.name));
    }
    if (sort === 'Танымал') {
      items = [...items].sort((a, b) => b.rating - a.rating);
    }

    return items;
  }, [search, activeCategory, sort]);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, [search, activeCategory, sort, view]);

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

        <section className="catalog">
          <div className="container catalog-grid">
            <div className="catalog-info">
              <h2>Музейлер тізімі</h2>
              <p>
                Қазақстан бойынша музейлерді тақырып, өңір және танымалдығы бойынша іздеңіз. Әр музей
                карточкасында негізгі мәліметтер мен байланыс деректері көрсетіледі.
              </p>
              <div className="stats-row">
                <span>285 музей</span>
                <span>17 өңір</span>
                <span>12 категория</span>
              </div>
            </div>
            <div className="catalog-controls">
              <div className="search-field">
                <input
                  type="search"
                  placeholder="Музей атауын немесе қаланы іздеу..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </div>
              <div className="filters">
                <div className="chip-row">
                  {['Барлығы', ...categoryFilters].map((item) => (
                    <button
                      key={item}
                      className={`chip ${activeCategory === item ? 'is-active' : ''}`}
                      type="button"
                      onClick={() => setActiveCategory(item)}
                    >
                      {item}
                    </button>
                  ))}
                </div>
                <div className="filter-actions">
                  <select value={sort} onChange={(event) => setSort(event.target.value)}>
                    {sortOptions.map((option) => (
                      <option key={option} value={option}>
                        Сұрыптау: {option}
                      </option>
                    ))}
                  </select>
                  <div className="view-toggle">
                    {['grid', 'list'].map((item) => (
                      <button
                        key={item}
                        type="button"
                        className={view === item ? 'is-active' : ''}
                        onClick={() => setView(item as 'grid' | 'list')}
                      >
                        {item === 'grid' ? 'Тор' : 'Тізім'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <button className="mobile-filter-toggle" type="button" onClick={() => setMobileFiltersOpen(true)}>
                Фильтрлерді ашу
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="container skeleton-grid">
              {[1, 2, 3].map((item) => (
                <div className="skeleton-card" key={item}>
                  <div className="skeleton-thumb"></div>
                  <div className="skeleton-line"></div>
                  <div className="skeleton-line short"></div>
                  <div className="skeleton-line"></div>
                </div>
              ))}
            </div>
          ) : filteredMuseums.length === 0 ? (
            <div className="container empty-state">
              <h3>Нәтиже табылмады</h3>
              <p>Іздеу шарттарын өзгертіп көріңіз немесе басқа категория таңдаңыз.</p>
            </div>
          ) : (
            <div className={`container museum-grid ${view}`}>
              {filteredMuseums.map((museum) => (
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
                    <div className="card-actions">
                      <button className="button button-primary">Толық ақпарат</button>
                      <button className="favorite" type="button" aria-label="Таңдаулыға қосу">
                        ♡
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="digital-experience">
          <div className="container">
            <div className="digital-header">
              <h2>Цифрлық мұра кеңістігі</h2>
              <p>
                3D модельдер, музейные предметы және виртуалные туры — бәрі бір платформада. Контент
                архивтері мен экспедициялық материалдар цифрландырылып, зерттеуге дайын тұрады.
              </p>
            </div>
            <div className="digital-grid">
              <article className="digital-card">
                <h3>3D моделдер</h3>
                <p>Артефактілердің 360° модельдері, масштабтауға және зерттеуге ыңғайлы формат.</p>
              </article>
              <article className="digital-card">
                <h3>Музейные предметы</h3>
                <p>Қордағы негізгі экспонаттар мен тарихи жәдігерлердің цифрлық паспорттары.</p>
              </article>
              <article className="digital-card">
                <h3>Виртуалные туры</h3>
                <p>Иммерсивті турлар арқылы музей залдарын онлайн аралап шығыңыз.</p>
              </article>
            </div>
            <div className="digital-stats">
              <div className="stat-card">
                <span className="stat-value">285</span>
                <span className="stat-label">Музейных экспонатов</span>
              </div>
              <div className="stat-card">
                <span className="stat-value">66,000</span>
                <span className="stat-label">3D моделей</span>
              </div>
              <div className="stat-card">
                <span className="stat-value">750</span>
                <span className="stat-label">Виртуальных туров</span>
              </div>
              <div className="stat-card">
                <span className="stat-value">15</span>
                <span className="stat-label">Экспедиций</span>
              </div>
            </div>
          </div>
        </section>

        <section className="design-system">
          <div className="container">
            <h2>Дизайн нұсқаулығы</h2>
            <div className="design-grid">
              <div className="design-card">
                <h3>Типография</h3>
                <ul>
                  <li>H1 — 48px / 56px</li>
                  <li>H2 — 32px / 40px</li>
                  <li>H3 — 20px / 28px</li>
                  <li>Body — 16px / 26px</li>
                  <li>Caption — 13px / 20px</li>
                </ul>
              </div>
              <div className="design-card">
                <h3>Кеңістік</h3>
                <ul>
                  <li>8px модульдік тор</li>
                  <li>Section padding: 96px (desktop) / 64px (mobile)</li>
                  <li>Card gap: 24px</li>
                  <li>Radius: 16–28px</li>
                </ul>
              </div>
              <div className="design-card">
                <h3>Түс палитрасы</h3>
                <ul>
                  <li>Негізгі фон: #F6F1E9</li>
                  <li>Беткей: #FFFFFF</li>
                  <li>Акцент: #B46A3C</li>
                  <li>Мәтін: #2B2B2B</li>
                  <li>Жиек: rgba(180, 106, 60, 0.2)</li>
                </ul>
              </div>
              <div className="design-card">
                <h3>Компоненттер</h3>
                <ul>
                  <li>CTA: толық және контурлы стиль</li>
                  <li>Чиптер: rounded-pill, hover көлеңке</li>
                  <li>Карточка: 16:9 бейне, lift hover</li>
                  <li>Мобильді фильтр: төменгі sheet</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {mobileFiltersOpen && (
          <div className="mobile-sheet">
            <button className="sheet-backdrop" type="button" onClick={() => setMobileFiltersOpen(false)} />
            <div className="sheet-panel">
              <div className="sheet-header">
                <h3>Фильтрлер</h3>
                <button type="button" onClick={() => setMobileFiltersOpen(false)}>
                  Жабу
                </button>
              </div>
              <div className="sheet-content">
                <div className="chip-row">
                  {['Барлығы', ...categoryFilters].map((item) => (
                    <button
                      key={item}
                      className={`chip ${activeCategory === item ? 'is-active' : ''}`}
                      type="button"
                      onClick={() => setActiveCategory(item)}
                    >
                      {item}
                    </button>
                  ))}
                </div>
                <select value={sort} onChange={(event) => setSort(event.target.value)}>
                  {sortOptions.map((option) => (
                    <option key={option} value={option}>
                      Сұрыптау: {option}
                    </option>
                  ))}
                </select>
                <div className="view-toggle">
                  {['grid', 'list'].map((item) => (
                    <button
                      key={item}
                      type="button"
                      className={view === item ? 'is-active' : ''}
                      onClick={() => setView(item as 'grid' | 'list')}
                    >
                      {item === 'grid' ? 'Тор' : 'Тізім'}
                    </button>
                  ))}
                </div>
              </div>
              <button className="button button-primary" onClick={() => setMobileFiltersOpen(false)}>
                Қолдану
              </button>
            </div>
          </div>
        )}
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

          h1 {
            font-size: 36px;
            line-height: 44px;
          }

          .digital-experience {
            padding: 64px 0;
          }
        }
      `}</style>
    </div>
  );
};

export default HomePage;
