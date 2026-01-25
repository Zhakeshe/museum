import React, { useMemo, useState } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';

const museumsData = [
  {
    id: 1,
    name: 'Ақтөбе облыстық тарихи-өлкетану музейі',
    location: 'Ақтөбе, Қазақстан',
    city: 'Ақтөбе',
    region: 'Ақтөбе облысы',
    category: 'Өлкетану',
    description: 'Өңір тарихы, этнография және археология экспозициялары.',
    address: 'Әбілқайыр хан даңғылы, 12',
    hours: '09:00–18:00',
    badge: 'Ұсынылады',
    price: 'Тегін',
    kids: true,
    rating: 4.6,
    phone: '+7 (7132) 00-00-00',
    website: 'https://museonet.kz',
  },
  {
    id: 2,
    name: 'Ботай музей-қорығы',
    location: 'СҚО, Қазақстан',
    city: 'Айыртау',
    region: 'СҚО',
    category: 'Археология',
    description: 'Ежелгі қоныстар мен жылқы мәдениеті туралы ғылыми экспозиция.',
    address: 'Ботай ауылы, орталық көше 1',
    hours: '10:00–19:00',
    badge: '⭐ 4.8',
    price: 'Ақылы',
    kids: true,
    rating: 4.8,
    phone: '+7 (7152) 11-11-11',
    website: 'https://museonet.kz',
  },
  {
    id: 3,
    name: 'Шым қала тарихи-мәдени кешені',
    location: 'Шымкент, Қазақстан',
    city: 'Шымкент',
    region: 'Шымкент',
    category: 'Тарих',
    description: 'Қаланың ежелгі тарихын ашатын интерактивті залдар.',
    address: 'Қонаев даңғылы, 45',
    hours: '09:30–18:30',
    badge: 'Ұсынылады',
    price: 'Тегін',
    kids: true,
    rating: 4.5,
    phone: '+7 (7252) 22-22-22',
    website: 'https://museonet.kz',
  },
  {
    id: 4,
    name: 'Көкшетау тарих музейі',
    location: 'Көкшетау, Қазақстан',
    city: 'Көкшетау',
    region: 'Ақмола облысы',
    category: 'Өлкетану',
    description: 'Аймақтың археологиялық және мәдени құндылықтары.',
    address: 'Абылай хан даңғылы, 20',
    hours: '10:00–18:00',
    badge: '⭐ 4.6',
    price: 'Ақылы',
    kids: false,
    rating: 4.6,
    phone: '+7 (7162) 33-33-33',
    website: 'https://museonet.kz',
  },
  {
    id: 5,
    name: 'Сарайшык музей-қорығы',
    location: 'Атырау, Қазақстан',
    city: 'Атырау',
    region: 'Атырау облысы',
    category: 'Қорық-музей',
    description: 'Алтын Орда дәуірінің археологиялық мұралары.',
    address: 'Сарайшык қалашығы, музей кешені',
    hours: '09:00–17:30',
    badge: 'Ұсынылады',
    price: 'Тегін',
    kids: true,
    rating: 4.7,
    phone: '+7 (7122) 44-44-44',
    website: 'https://museonet.kz',
  },
  {
    id: 6,
    name: 'Кастеев өнер музейі',
    location: 'Алматы, Қазақстан',
    city: 'Алматы',
    region: 'Алматы',
    category: 'Өнер',
    description: 'Классикалық және заманауи өнер коллекциялары.',
    address: 'Достық даңғылы, 44',
    hours: '10:00–19:00',
    badge: '⭐ 4.9',
    price: 'Ақылы',
    kids: false,
    rating: 4.9,
    phone: '+7 (727) 55-55-55',
    website: 'https://museonet.kz',
  },
];

const recommendedMuseums = museumsData.slice(0, 6);
const categories = ['Үй-музей', 'Археология', 'Өнер', 'Қорық-музей', 'Өлкетану', 'Тарих'];

const MuseumsPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [region, setRegion] = useState('Барлығы');
  const [city, setCity] = useState('Барлығы');
  const [category, setCategory] = useState('Барлығы');
  const [price, setPrice] = useState('Барлығы');
  const [kids, setKids] = useState(false);
  const [sort, setSort] = useState('Танымал');
  const [view, setView] = useState<'grid' | 'list' | 'map'>('grid');
  const [favorites, setFavorites] = useState<number[]>([]);
  const [selected, setSelected] = useState<typeof museumsData[0] | null>(null);

  const regions = useMemo(
    () => ['Барлығы', ...new Set(museumsData.map((item) => item.region))],
    [],
  );
  const cities = useMemo(
    () => ['Барлығы', ...new Set(museumsData.map((item) => item.city))],
    [],
  );

  const filteredMuseums = useMemo(() => {
    const normalizedSearch = search.toLowerCase();
    let items = museumsData.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(normalizedSearch) ||
        item.location.toLowerCase().includes(normalizedSearch);
      const matchesRegion = region === 'Барлығы' || item.region === region;
      const matchesCity = city === 'Барлығы' || item.city === city;
      const matchesCategory = category === 'Барлығы' || item.category === category;
      const matchesPrice = price === 'Барлығы' || item.price === price;
      const matchesKids = !kids || item.kids;
      return (
        matchesSearch &&
        matchesRegion &&
        matchesCity &&
        matchesCategory &&
        matchesPrice &&
        matchesKids
      );
    });

    if (sort === 'Жаңа') {
      items = [...items].reverse();
    }
    if (sort === 'А-Я') {
      items = [...items].sort((a, b) => a.name.localeCompare(b.name));
    }
    if (sort === 'Танымал') {
      items = [...items].sort((a, b) => b.rating - a.rating);
    }

    return items;
  }, [search, region, city, category, price, kids, sort]);

  const toggleFavorite = (id: number) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const resetFilters = () => {
    setSearch('');
    setRegion('Барлығы');
    setCity('Барлығы');
    setCategory('Барлығы');
    setPrice('Барлығы');
    setKids(false);
    setSort('Танымал');
  };

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
                <input
                  id="search"
                  type="search"
                  placeholder="Музей атауын іздеу…"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="filter-bar">
          <div className="container filter-grid">
            <div className="filter-group">
              <select className="dropdown" value={region} onChange={(event) => setRegion(event.target.value)}>
                {regions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              <select className="dropdown" value={city} onChange={(event) => setCity(event.target.value)}>
                {cities.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              <div className="chip-row">
                {['Барлығы', ...categories].map((item) => (
                  <button
                    key={item}
                    className={`chip ${category === item ? 'is-active' : ''}`}
                    onClick={() => setCategory(item)}
                    type="button"
                  >
                    {item}
                  </button>
                ))}
              </div>
              <div className="price-toggle">
                {['Барлығы', 'Тегін', 'Ақылы'].map((item) => (
                  <button
                    key={item}
                    className={`toggle ${price === item ? 'is-active' : ''}`}
                    onClick={() => setPrice(item)}
                    type="button"
                  >
                    {item}
                  </button>
                ))}
              </div>
              <button className={`switch ${kids ? 'is-active' : ''}`} type="button" onClick={() => setKids(!kids)}>
                <span>Балаларға лайық</span>
                <div className="switch-track">
                  <div className="switch-thumb"></div>
                </div>
              </button>
            </div>
            <div className="filter-actions">
              <select className="dropdown" value={sort} onChange={(event) => setSort(event.target.value)}>
                <option value="Танымал">Сұрыптау: Танымал</option>
                <option value="Жаңа">Сұрыптау: Жаңа</option>
                <option value="А-Я">Сұрыптау: А-Я</option>
              </select>
              <div className="view-toggle">
                {['grid', 'list', 'map'].map((item) => (
                  <button
                    key={item}
                    className={`view-btn ${view === item ? 'is-active' : ''}`}
                    onClick={() => setView(item as 'grid' | 'list' | 'map')}
                    type="button"
                  >
                    {item.toUpperCase()}
                  </button>
                ))}
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
                    <p className="address">Мекенжай: {museum.address}</p>
                    <p className="desc">{museum.description}</p>
                    <div className="meta">
                      <span>⏰ {museum.hours}</span>
                      <span>{museum.badge}</span>
                    </div>
                    <div className="card-actions">
                      <button className="button button-primary" onClick={() => setSelected(museum)}>
                        Толық ақпарат
                      </button>
                      <button className="icon-btn" type="button" onClick={() => toggleFavorite(museum.id)}>
                        {favorites.includes(museum.id) ? '❤' : '♡'}
                      </button>
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
            {filteredMuseums.length === 0 ? (
              <div className="empty-state">
                <h2>Нәтиже табылмады</h2>
                <p>Басқа сүзгілерді қолданып көріңіз немесе параметрлерді тазартыңыз.</p>
                <button className="button button-secondary" onClick={resetFilters}>
                  Фильтрді тазалау
                </button>
              </div>
            ) : (
              <div className={`grid ${view}`}>
                {filteredMuseums.map((museum) => (
                  <div className="card museum-card" key={museum.id}>
                    <div className="card-image">
                      <div className="image-overlay"></div>
                      <span className="chip chip-image">{museum.category}</span>
                    </div>
                    <div className="card-body">
                      <h3>{museum.name}</h3>
                      <p className="location">📍 {museum.location}</p>
                      <p className="address">Мекенжай: {museum.address}</p>
                      <p className="desc">{museum.description}</p>
                      <div className="meta">
                        <span>⏰ {museum.hours}</span>
                        <span>{museum.badge}</span>
                      </div>
                      <div className="card-actions">
                        <button className="button button-primary" onClick={() => setSelected(museum)}>
                          Толық ақпарат
                        </button>
                        <button className="icon-btn" type="button" onClick={() => toggleFavorite(museum.id)}>
                          {favorites.includes(museum.id) ? '❤' : '♡'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
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

        {selected && (
          <section className="section">
            <div className="container">
              <div className="detail-modal">
                <div className="modal-hero">
                  <div className="modal-gallery"></div>
                  <div className="modal-info">
                    <h2>{selected.name}</h2>
                  <p>📍 {selected.location}</p>
                  <p>Мекенжай: {selected.address}</p>
                  <p>⏰ {selected.hours}</p>
                    <p>☎️ {selected.phone}</p>
                    <p>🌐 {selected.website}</p>
                    <a
                      className="button button-primary"
                      href={`https://2gis.kz/search/${encodeURIComponent(selected.name)}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Картада ашу
                    </a>
                  </div>
                </div>
                <div className="modal-sections">
                  <div>
                    <h3>Сипаттама</h3>
                    <p>{selected.description}</p>
                  </div>
                  <div>
                    <h3>Экспозициялар</h3>
                    <p>Артефактілер, интерактивті залдар және мультимедиалық контент.</p>
                  </div>
                  <div>
                    <h3>Билеттер</h3>
                    <p>{selected.price === 'Тегін' ? 'Кіру тегін.' : 'Ересек — 1500 тг, студент — 800 тг.'}</p>
                  </div>
                  <div>
                    <h3>Қалай жетуге болады</h3>
                    <p>Қалалық маршруттар, қоғамдық көлік және жеке автотұрақ.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
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
          border: none;
          background: transparent;
        }

        .switch.is-active .switch-track {
          background: var(--accent);
        }

        .switch.is-active .switch-thumb {
          left: 23px;
        }

        .switch-track {
          width: 44px;
          height: 24px;
          background: #e5d9c7;
          border-radius: 999px;
          position: relative;
          transition: background 0.2s ease;
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
          transition: left 0.2s ease;
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

        .grid.list {
          grid-template-columns: 1fr;
        }

        .grid.map {
          grid-template-columns: 1fr;
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

        .address {
          color: rgba(43, 43, 43, 0.6);
          font-size: 13px;
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
          animation: fadeIn 0.3s ease;
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

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
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
