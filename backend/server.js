const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4000;
const DB_PATH = path.join(__dirname, 'data', 'db.json');

app.use(cors());
app.use(express.json({ limit: '1mb' }));

const readDb = () => {
  const raw = fs.readFileSync(DB_PATH, 'utf-8');
  return JSON.parse(raw);
};

const writeDb = (data) => {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
};

const hashPassword = (password) =>
  crypto.createHash('sha256').update(password).digest('hex');

const generateToken = () => crypto.randomUUID();

const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'Missing token' });
  }
  const db = readDb();
  const userId = db.sessions[token];
  if (!userId) {
    return res.status(401).json({ error: 'Invalid token' });
  }
  const user = db.users.find((u) => u.id === userId);
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }
  req.user = user;
  req.token = token;
  req.db = db;
  next();
};

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body || {};
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const db = readDb();
  const existing = db.users.find((u) => u.email === email);
  if (existing) {
    return res.status(400).json({ error: 'Email already registered' });
  }
  const user = {
    id: crypto.randomUUID(),
    name,
    email,
    passwordHash: hashPassword(password),
    points: 0,
    gamesPlayed: 0,
    objects: 0
  };
  db.users.push(user);
  writeDb(db);
  res.json({ success: true });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: 'Missing credentials' });
  }
  const db = readDb();
  const user = db.users.find((u) => u.email === email);
  if (!user || user.passwordHash !== hashPassword(password)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const token = generateToken();
  db.sessions[token] = user.id;
  writeDb(db);
  res.json({
    token,
    user: {
      name: user.name,
      email: user.email,
      points: user.points,
      gamesPlayed: user.gamesPlayed,
      objects: user.objects
    }
  });
});

app.post('/api/auth/logout', requireAuth, (req, res) => {
  const db = req.db;
  delete db.sessions[req.token];
  writeDb(db);
  res.json({ success: true });
});

app.get('/api/profile', requireAuth, (req, res) => {
  const user = req.user;
  res.json({
    name: user.name,
    email: user.email,
    points: user.points,
    gamesPlayed: user.gamesPlayed,
    objects: user.objects
  });
});

app.get('/api/history', requireAuth, (req, res) => {
  const history = req.db.history.filter((item) => item.userId === req.user.id);
  res.json({ history });
});

app.post('/api/history', requireAuth, (req, res) => {
  const { label, points } = req.body || {};
  if (!label || typeof points !== 'number') {
    return res.status(400).json({ error: 'Invalid history entry' });
  }
  const entry = {
    id: crypto.randomUUID(),
    userId: req.user.id,
    label,
    points,
    createdAt: new Date().toISOString()
  };
  req.db.history.push(entry);
  req.user.points += points;
  writeDb(req.db);
  res.json({ success: true, entry, points: req.user.points });
});

app.get('/api/objects', requireAuth, (req, res) => {
  const objects = req.db.objects.filter((item) => item.userId === req.user.id);
  res.json({ objects });
});

app.post('/api/objects', requireAuth, (req, res) => {
  const { name } = req.body || {};
  if (!name) {
    return res.status(400).json({ error: 'Missing object name' });
  }
  const entry = {
    id: crypto.randomUUID(),
    userId: req.user.id,
    name,
    createdAt: new Date().toISOString()
  };
  req.db.objects.push(entry);
  req.user.objects += 1;
  writeDb(req.db);
  res.json({ success: true, entry, objects: req.user.objects });
});

app.post('/api/games/result', requireAuth, (req, res) => {
  const { gameId, title, points } = req.body || {};
  if (!title || typeof points !== 'number') {
    return res.status(400).json({ error: 'Invalid game result' });
  }
  const entry = {
    id: crypto.randomUUID(),
    userId: req.user.id,
    gameId: gameId || null,
    title,
    points,
    createdAt: new Date().toISOString()
  };
  req.db.games.push(entry);
  req.db.history.push({
    id: crypto.randomUUID(),
    userId: req.user.id,
    label: `Ойын: ${title}`,
    points,
    createdAt: new Date().toISOString()
  });
  req.user.points += points;
  req.user.gamesPlayed += 1;
  writeDb(req.db);
  res.json({
    success: true,
    points: req.user.points,
    gamesPlayed: req.user.gamesPlayed
  });
});

app.listen(PORT, () => {
  console.log(`Museonet API running on http://localhost:${PORT}`);
});
