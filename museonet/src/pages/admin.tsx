import React, { useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';

type Museum = {
  id: number;
  name: string;
  region: string;
  city: string;
  address: string;
  phone: string;
  gisLink: string;
  image: string;
};

type User = {
  id: number;
  name: string;
  email: string;
  points: number;
  role: 'user' | 'admin';
  status: 'active' | 'banned';
  visits: number;
  lastActive: string;
};

const AdminPage: React.FC = () => {
  const [museums, setMuseums] = useState<Museum[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [search, setSearch] = useState('');
  const [region, setRegion] = useState('Барлығы');
  const [city, setCity] = useState('Барлығы');
  const [editingId, setEditingId] = useState<number | null>(null);

  const totalMuseums = useMemo(() => 285, []);
  const regionOptions = useMemo(
    () => ['Барлығы', ...new Set(museums.map((item) => item.region))],
    [museums],
  );
  const cityOptions = useMemo(
    () => ['Барлығы', ...new Set(museums.map((item) => item.city))],
    [museums],
  );
  const filteredMuseums = useMemo(() => {
    const normalizedSearch = search.toLowerCase();
    return museums.filter((museum) => {
      const matchesSearch =
        museum.name.toLowerCase().includes(normalizedSearch) ||
        museum.address.toLowerCase().includes(normalizedSearch);
      const matchesRegion = region === 'Барлығы' || museum.region === region;
      const matchesCity = city === 'Барлығы' || museum.city === city;
      return matchesSearch && matchesRegion && matchesCity;
    });
  }, [museums, search, region, city]);

  useEffect(() => {
    const loadData = async () => {
      const [museumsResponse, usersResponse] = await Promise.all([
        fetch('/api/museums'),
        fetch('/api/users'),
      ]);
      const museumsData = await museumsResponse.json();
      const usersData = await usersResponse.json();
      setMuseums(museumsData);
      setUsers(usersData);
      setLoading(false);
    };
    loadData();
  }, []);

  const handleMuseumChange = (id: number, field: keyof Museum, value: string) => {
    setMuseums((prev) => prev.map((museum) => (museum.id === id ? { ...museum, [field]: value } : museum)));
  };

  const handleMuseumSave = async (museum: Museum) => {
    await fetch(`/api/museums/${museum.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(museum),
    });
    setMessage('Музей жаңартылды.');
    setTimeout(() => setMessage(''), 2000);
    setEditingId(null);
  };

  const handleUserRole = async (id: number) => {
    const target = users.find((user) => user.id === id);
    if (!target) return;
    const updated: User = { ...target, role: target.role === 'admin' ? 'user' : 'admin' };
    await fetch(`/api/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    });
    setUsers((prev) => prev.map((user) => (user.id === id ? updated : user)));
  };

  const handleUserStatus = async (id: number) => {
    const target = users.find((user) => user.id === id);
    if (!target) return;
    const updated: User = { ...target, status: target.status === 'banned' ? 'active' : 'banned' };
    await fetch(`/api/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    });
    setUsers((prev) => prev.map((user) => (user.id === id ? updated : user)));
  };

  const handleUserCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!newUser.name || !newUser.email) {
      return;
    }
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser),
    });
    if (response.ok) {
      const created = await response.json();
      setUsers((prev) => [...prev, created]);
      setNewUser({ name: '', email: '' });
    }
  };

  return (
    <div className="page">
      <Head>
        <title>Админ панель — museonet</title>
        <meta name="description" content="museonet әкімші панелі: музейлер мен пайдаланушыларды басқару." />
      </Head>

      <Header />

      <main>
        <section className="admin-hero">
          <div className="container hero-grid">
            <div>
              <h1>Админ панель</h1>
              <p>Музейлерді, қолданушыларды және статистиканы бір жерден бақылаңыз.</p>
            </div>
            <div className="stats-panel">
              <div>
                <span className="stat-value">{totalMuseums}</span>
                <span className="stat-label">Музей</span>
              </div>
              <div>
                <span className="stat-value">{users.length}</span>
                <span className="stat-label">Қолданушы</span>
              </div>
              <div>
                <span className="stat-value">20</span>
                <span className="stat-label">Бастапқы балл</span>
              </div>
            </div>
          </div>
        </section>

        <section className="admin-section">
          <div className="container">
            <h2>Музейлерді басқару</h2>
            <p>Әр музейдің атауы, байланысы, 2GIS сілтемесі және суретін жаңарта аласыз.</p>
            <div className="filter-bar">
              <div className="filter-group">
                <input
                  placeholder="Музей атауын іздеу..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
                <select className="dropdown" value={region} onChange={(event) => setRegion(event.target.value)}>
                  {regionOptions.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                <select className="dropdown" value={city} onChange={(event) => setCity(event.target.value)}>
                  {cityOptions.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
              <button
                className="button button-secondary"
                type="button"
                onClick={() => {
                  setSearch('');
                  setRegion('Барлығы');
                  setCity('Барлығы');
                }}
              >
                Фильтрді тазалау
              </button>
            </div>
            <div className="admin-grid">
              {loading ? (
                <div className="loading-card">Деректер жүктелуде...</div>
              ) : (
                filteredMuseums.map((museum) => (
                  <div className="admin-card" key={museum.id}>
                    <div className="card-header">
                      <h3>{museum.name}</h3>
                      <span className="badge">ID {museum.id}</span>
                    </div>
                    <div className="meta">
                      <span>{museum.region}</span>
                      <span>{museum.city}</span>
                    </div>
                    {editingId === museum.id ? (
                      <>
                        <label>
                          Атауы
                          <input
                            value={museum.name}
                            onChange={(event) => handleMuseumChange(museum.id, 'name', event.target.value)}
                          />
                        </label>
                        <label>
                          Мекенжай
                          <input
                            value={museum.address}
                            onChange={(event) => handleMuseumChange(museum.id, 'address', event.target.value)}
                          />
                        </label>
                        <label>
                          Нөмір
                          <input
                            value={museum.phone}
                            onChange={(event) => handleMuseumChange(museum.id, 'phone', event.target.value)}
                          />
                        </label>
                        <label>
                          2GIS сілтемесі
                          <input
                            value={museum.gisLink}
                            onChange={(event) => handleMuseumChange(museum.id, 'gisLink', event.target.value)}
                          />
                        </label>
                        <label>
                          Сурет (сілтеме)
                          <input
                            value={museum.image}
                            onChange={(event) => handleMuseumChange(museum.id, 'image', event.target.value)}
                            placeholder="https://..."
                          />
                        </label>
                        <div className="button-row">
                          <button className="button button-primary" type="button" onClick={() => handleMuseumSave(museum)}>
                            Сақтау
                          </button>
                          <button
                            className="button button-secondary"
                            type="button"
                            onClick={() => setEditingId(null)}
                          >
                            Болдырмау
                          </button>
                        </div>
                      </>
                    ) : (
                      <button className="button button-primary" type="button" onClick={() => setEditingId(museum.id)}>
                        Өзгерту
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        <section className="admin-section">
          <div className="container">
            <div className="users-head">
              <div>
                <h2>Қолданушыларды басқару</h2>
                <p>Бан беру, баннан алу, админ құқықтарын тағайындау және статистиканы көру.</p>
              </div>
              <form className="user-form" onSubmit={handleUserCreate}>
                <input
                  placeholder="Аты-жөні"
                  value={newUser.name}
                  onChange={(event) => setNewUser((prev) => ({ ...prev, name: event.target.value }))}
                />
                <input
                  placeholder="Email"
                  value={newUser.email}
                  onChange={(event) => setNewUser((prev) => ({ ...prev, email: event.target.value }))}
                />
                <button className="button button-primary" type="submit">
                  Аккаунт жасау
                </button>
              </form>
            </div>
            <div className="users-table">
              {message && <div className="success-banner">{message}</div>}
              <div className="users-row users-head-row">
                <span>Қолданушы</span>
                <span>Рөл</span>
                <span>Балл</span>
                <span>Статус</span>
                <span>Сапар</span>
                <span>Соңғы белсенділік</span>
                <span>Басқару</span>
              </div>
              {users.map((user) => (
                <div className="users-row" key={user.id}>
                  <span>
                    <strong>{user.name}</strong>
                    <small>{user.email}</small>
                  </span>
                  <span>{user.role === 'admin' ? 'Админ' : 'Қолданушы'}</span>
                  <span>{user.points} балл</span>
                  <span>{user.status === 'banned' ? 'Блоктаулы' : 'Белсенді'}</span>
                  <span>{user.visits}</span>
                  <span>{user.lastActive}</span>
                  <span className="user-actions">
                    <button type="button" className="button button-secondary" onClick={() => handleUserRole(user.id)}>
                      {user.role === 'admin' ? 'Админді алу' : 'Админ беру'}
                    </button>
                    <button type="button" className="button button-outline" onClick={() => handleUserStatus(user.id)}>
                      {user.status === 'banned' ? 'Баннан алу' : 'Бан беру'}
                    </button>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <style jsx>{`
        :global(body) {
          background: #f6f1e9;
          color: #2b2b2b;
        }

        .admin-hero {
          padding: 64px 0 32px;
        }

        .hero-grid {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 32px;
          align-items: center;
        }

        h1 {
          font-size: 38px;
          margin-bottom: 12px;
        }

        .stats-panel {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          background: #fff;
          border-radius: 20px;
          padding: 20px;
          border: 1px solid rgba(180, 106, 60, 0.2);
          box-shadow: 0 12px 24px rgba(64, 42, 18, 0.08);
        }

        .stat-value {
          font-size: 28px;
          font-weight: 700;
          color: #b46a3c;
        }

        .stat-label {
          font-size: 13px;
          color: rgba(43, 43, 43, 0.6);
        }

        .admin-section {
          padding: 48px 0;
        }

        .admin-section h2 {
          font-size: 28px;
          margin-bottom: 12px;
        }

        .admin-section p {
          color: rgba(43, 43, 43, 0.7);
        }

        .admin-grid {
          margin-top: 24px;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 20px;
        }

        .filter-bar {
          margin-top: 20px;
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          align-items: center;
          justify-content: space-between;
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
          border: 1px solid rgba(180, 106, 60, 0.2);
          background: #fff;
          font-size: 14px;
          color: rgba(67, 50, 30, 0.9);
        }

        .loading-card {
          background: #fff;
          border-radius: 20px;
          padding: 20px;
          border: 1px dashed rgba(180, 106, 60, 0.3);
          color: rgba(43, 43, 43, 0.6);
        }

        .admin-card {
          background: #fff;
          border-radius: 20px;
          padding: 20px;
          border: 1px solid rgba(180, 106, 60, 0.15);
          box-shadow: 0 12px 24px rgba(64, 42, 18, 0.08);
          display: grid;
          gap: 12px;
        }

        .meta {
          display: flex;
          gap: 8px;
          font-size: 12px;
          color: rgba(43, 43, 43, 0.6);
        }

        .button-row {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .badge {
          font-size: 12px;
          padding: 4px 8px;
          border-radius: 999px;
          background: rgba(180, 106, 60, 0.12);
        }

        label {
          display: grid;
          gap: 6px;
          font-size: 13px;
          color: rgba(43, 43, 43, 0.7);
        }

        input {
          border-radius: 12px;
          border: 1px solid rgba(180, 106, 60, 0.2);
          padding: 10px 12px;
          font-size: 14px;
        }

        .users-head {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 24px;
          flex-wrap: wrap;
        }

        .user-form {
          display: grid;
          gap: 10px;
          min-width: 260px;
        }

        .users-table {
          margin-top: 24px;
          display: grid;
          gap: 12px;
        }

        .success-banner {
          padding: 12px 16px;
          border-radius: 14px;
          background: rgba(180, 106, 60, 0.1);
          color: #7b4c2a;
          border: 1px solid rgba(180, 106, 60, 0.2);
        }

        .users-row {
          display: grid;
          grid-template-columns: 1.4fr 0.6fr 0.6fr 0.7fr 0.5fr 0.8fr 1.2fr;
          gap: 12px;
          align-items: center;
          background: #fff;
          border-radius: 16px;
          padding: 14px 16px;
          border: 1px solid rgba(180, 106, 60, 0.1);
          font-size: 13px;
        }

        .users-head-row {
          background: transparent;
          border: none;
          font-weight: 600;
          color: rgba(43, 43, 43, 0.6);
        }

        .users-row strong {
          display: block;
          font-size: 14px;
        }

        .users-row small {
          color: rgba(43, 43, 43, 0.6);
        }

        .user-actions {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .button {
          border-radius: 999px;
          padding: 10px 18px;
          font-size: 13px;
          border: none;
          cursor: pointer;
        }

        .button-primary {
          background: #b46a3c;
          color: #fff;
          box-shadow: 0 8px 16px rgba(180, 106, 60, 0.25);
        }

        .button-secondary {
          background: #fff;
          color: #7b4c2a;
          border: 1px solid rgba(180, 106, 60, 0.25);
        }

        .button-outline {
          background: rgba(180, 106, 60, 0.1);
          color: #7b4c2a;
          border: 1px solid rgba(180, 106, 60, 0.25);
        }

        @media (max-width: 1100px) {
          .users-row {
            grid-template-columns: 1.4fr 0.6fr 0.6fr;
            grid-auto-rows: auto;
          }

          .users-row span:nth-child(n + 4) {
            grid-column: 1 / -1;
          }
        }

        @media (max-width: 900px) {
          .hero-grid {
            grid-template-columns: 1fr;
          }

          .stats-panel {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminPage;
