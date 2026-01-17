# Museonet backend

Simple JSON-backed API for the cabinet and games pages. Run locally:

```bash
cd backend
npm install
npm run start
```

The server listens on `http://localhost:4000` by default.

## Endpoints

- `POST /api/auth/register` `{ name, email, password }`
- `POST /api/auth/login` `{ email, password }` → `{ token, user }`
- `POST /api/auth/logout`
- `GET /api/profile`
- `GET /api/history`
- `POST /api/history` `{ label, points }`
- `GET /api/objects`
- `POST /api/objects` `{ name }`
- `POST /api/games/result` `{ gameId?, title, points }`
