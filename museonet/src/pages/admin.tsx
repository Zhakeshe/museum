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

type UploadedImage = {
  id: string;
  name: string;
  url: string;
  uploadedAt: string;
};

const base32Alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

const decodeBase32 = (input: string) => {
  let bits = 0;
  let value = 0;
  const output: number[] = [];
  for (const char of input.toUpperCase().replace(/=+$/, '')) {
    const index = base32Alphabet.indexOf(char);
    if (index === -1) continue;
    value = (value << 5) | index;
    bits += 5;
    if (bits >= 8) {
      output.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }
  return new Uint8Array(output);
};

const sha1 = (message: Uint8Array) => {
  const words: number[] = [];
  const length = message.length * 8;
  for (let i = 0; i < message.length; i++) {
    words[i >> 2] |= message[i] << (24 - (i % 4) * 8);
  }
  words[length >> 5] |= 0x80 << (24 - (length % 32));
  words[(((length + 64) >> 9) << 4) + 15] = length;

  let h0 = 0x67452301;
  let h1 = 0xefcdab89;
  let h2 = 0x98badcfe;
  let h3 = 0x10325476;
  let h4 = 0xc3d2e1f0;

  for (let i = 0; i < words.length; i += 16) {
    const w = new Array(80);
    for (let j = 0; j < 16; j++) {
      w[j] = words[i + j] | 0;
    }
    for (let j = 16; j < 80; j++) {
      w[j] = ((w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16]) << 1) | ((w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16]) >>> 31);
    }

    let a = h0;
    let b = h1;
    let c = h2;
    let d = h3;
    let e = h4;

    for (let j = 0; j < 80; j++) {
      let f = 0;
      let k = 0;
      if (j < 20) {
        f = (b & c) | (~b & d);
        k = 0x5a827999;
      } else if (j < 40) {
        f = b ^ c ^ d;
        k = 0x6ed9eba1;
      } else if (j < 60) {
        f = (b & c) | (b & d) | (c & d);
        k = 0x8f1bbcdc;
      } else {
        f = b ^ c ^ d;
        k = 0xca62c1d6;
      }
      const temp = (((a << 5) | (a >>> 27)) + f + e + k + w[j]) | 0;
      e = d;
      d = c;
      c = (b << 30) | (b >>> 2);
      b = a;
      a = temp;
    }

    h0 = (h0 + a) | 0;
    h1 = (h1 + b) | 0;
    h2 = (h2 + c) | 0;
    h3 = (h3 + d) | 0;
    h4 = (h4 + e) | 0;
  }

  const hash = new Uint8Array(20);
  const h = [h0, h1, h2, h3, h4];
  for (let i = 0; i < h.length; i++) {
    hash[i * 4] = (h[i] >>> 24) & 0xff;
    hash[i * 4 + 1] = (h[i] >>> 16) & 0xff;
    hash[i * 4 + 2] = (h[i] >>> 8) & 0xff;
    hash[i * 4 + 3] = h[i] & 0xff;
  }
  return hash;
};

const hmacSha1 = (key: Uint8Array, message: Uint8Array) => {
  const blockSize = 64;
  let keyBytes = key;
  if (keyBytes.length > blockSize) {
    keyBytes = sha1(keyBytes);
  }
  const oKeyPad = new Uint8Array(blockSize);
  const iKeyPad = new Uint8Array(blockSize);
  oKeyPad.fill(0x5c);
  iKeyPad.fill(0x36);
  for (let i = 0; i < keyBytes.length; i++) {
    oKeyPad[i] ^= keyBytes[i];
    iKeyPad[i] ^= keyBytes[i];
  }
  const inner = new Uint8Array(iKeyPad.length + message.length);
  inner.set(iKeyPad);
  inner.set(message, iKeyPad.length);
  const innerHash = sha1(inner);
  const outer = new Uint8Array(oKeyPad.length + innerHash.length);
  outer.set(oKeyPad);
  outer.set(innerHash, oKeyPad.length);
  return sha1(outer);
};

const generateTotp = (secret: string, offset = 0) => {
  const keyData = decodeBase32(secret);
  const counter = Math.floor(Date.now() / 1000 / 30) + offset;
  const buffer = new ArrayBuffer(8);
  const view = new DataView(buffer);
  view.setUint32(4, counter);
  const hmac = hmacSha1(keyData, new Uint8Array(buffer));
  const offsetBits = hmac[hmac.length - 1] & 0xf;
  const code =
    ((hmac[offsetBits] & 0x7f) << 24) |
    ((hmac[offsetBits + 1] & 0xff) << 16) |
    ((hmac[offsetBits + 2] & 0xff) << 8) |
    (hmac[offsetBits + 3] & 0xff);
  return String(code % 1_000_000).padStart(6, '0');
};

const createAdminSecret = () =>
  Array.from({ length: 20 }, () => base32Alphabet[Math.floor(Math.random() * base32Alphabet.length)]).join('');

const AdminPage: React.FC = () => {
  const [museums, setMuseums] = useState<Museum[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [otpSecret, setOtpSecret] = useState('');
  const [otpQr, setOtpQr] = useState('');
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
    const verified = typeof window !== 'undefined' ? window.localStorage.getItem('museonetAdminVerified') : null;
    const storedSecret = typeof window !== 'undefined' ? window.localStorage.getItem('museonetAdminSecret') : null;
    const secret = storedSecret ?? createAdminSecret();
    if (!storedSecret && typeof window !== 'undefined') {
      window.localStorage.setItem('museonetAdminSecret', secret);
    }
    setOtpSecret(secret);
    setOtpVerified(verified === 'true');
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const interval = window.setInterval(() => {
      const secret = createAdminSecret();
      window.localStorage.removeItem('museonetAdminVerified');
      window.localStorage.setItem('museonetAdminSecret', secret);
      setOtpVerified(false);
      setOtpInput('');
      setOtpError('');
      setOtpSecret(secret);
      setOtpQr('');
      setMuseums([]);
      setUsers([]);
      setLoading(true);
      setMessage('');
    }, 120000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!otpSecret) return;
    const label = encodeURIComponent('museonet Admin');
    const issuer = encodeURIComponent('museonet');
    const uri = `otpauth://totp/${label}?secret=${otpSecret}&issuer=${issuer}&algorithm=SHA1&digits=6&period=30`;
    setOtpQr(`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(uri)}`);
  }, [otpSecret]);

  useEffect(() => {
    const loadData = async () => {
      if (!otpVerified) return;
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
    void loadData();
  }, [otpVerified]);

  const handleOtpVerify = () => {
    setOtpError('');
    const token = otpInput.trim();
    if (token.length !== 6) {
      setOtpError('Код қате. Қайта тексеріңіз.');
      return;
    }
    const current = generateTotp(otpSecret, 0);
    const prev = generateTotp(otpSecret, -1);
    const next = generateTotp(otpSecret, 1);
    if (token !== current && token !== prev && token !== next) {
      setOtpError('Код қате. Қайта тексеріңіз.');
      return;
    }
    setOtpVerified(true);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('museonetAdminVerified', 'true');
    }
  };

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
        {!otpVerified && (
          <section className="admin-hero">
            <div className="container hero-grid">
              <div>
                <h1>Admin панельге кіру</h1>
                <p>Google Authenticator арқылы бір реттік код енгізіңіз.</p>
              </div>
              <div className="otp-card">
                {otpQr && <img src={otpQr} alt="Admin QR code" />}
                <p className="otp-hint">
                  Google Authenticator-ға QR кодты қосып, бір реттік код енгізіңіз. Егер QR ашылмаса, төмендегі
                  secret-ті қолмен енгізіңіз.
                </p>
                <div className="otp-secret">
                  <span>Secret:</span>
                  <strong>{otpSecret}</strong>
                </div>
                <div className="otp-inputs">
                  <input
                    value={otpInput}
                    onChange={(event) => setOtpInput(event.target.value)}
                    placeholder="123456"
                    inputMode="numeric"
                    maxLength={6}
                  />
                  <button className="button button-primary" type="button" onClick={handleOtpVerify}>
                    Тексеру
                  </button>
                </div>
                {otpError && <div className="error-banner">{otpError}</div>}
              </div>
            </div>
          </section>
        )}

        {otpVerified && (
          <>
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

            <section className="admin-section admin-games-section">
              <div className="container admin-games-card">
                <div>
                  <h2>Game System MVP</h2>
                  <p>Ойын контенті, scoring және аналитиканы жаңа басқару панелінен реттеңіз.</p>
                </div>
                <a className="button button-primary" href="/admin/games">
                  Game System ашу
                </a>
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
          </>
        )}
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

        .admin-games-card {
          background: rgba(255, 255, 255, 0.85);
          border-radius: 18px;
          padding: 24px;
          border: 1px solid rgba(180, 106, 60, 0.18);
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          gap: 16px;
          align-items: center;
          box-shadow: 0 12px 24px rgba(64, 42, 18, 0.08);
        }

        .otp-card {
          background: #fff;
          border-radius: 20px;
          padding: 24px;
          border: 1px solid rgba(180, 106, 60, 0.2);
          box-shadow: 0 12px 24px rgba(64, 42, 18, 0.08);
          display: grid;
          gap: 16px;
          justify-items: center;
        }

        .otp-card img {
          width: 180px;
          height: 180px;
        }

        .otp-hint {
          text-align: center;
          font-size: 13px;
          color: rgba(43, 43, 43, 0.7);
        }

        .otp-inputs {
          display: flex;
          gap: 12px;
          align-items: center;
          flex-wrap: wrap;
          justify-content: center;
        }

        .otp-secret {
          display: grid;
          gap: 4px;
          text-align: center;
          font-size: 12px;
          color: rgba(43, 43, 43, 0.7);
          word-break: break-all;
        }

        .error-banner {
          padding: 10px 14px;
          border-radius: 12px;
          background: rgba(206, 78, 54, 0.12);
          color: #a0351f;
          border: 1px solid rgba(206, 78, 54, 0.2);
          font-size: 13px;
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
