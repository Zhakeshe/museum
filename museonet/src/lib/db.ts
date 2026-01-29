import type { Pool } from 'pg';
import { seedMuseums, type MuseumRecord } from './seedMuseums';

export type UserRecord = {
  id: number;
  name: string;
  email: string;
  points: number;
  role: 'user' | 'admin';
  status: 'active' | 'banned';
  visits: number;
  lastActive: string;
};

let pool: Pool | null = null;
let schemaReady = false;
let memoryMode = false;
let memoryMuseums: MuseumRecord[] | null = null;
let memoryUsers: UserRecord[] | null = null;

const ensureMemoryStore = () => {
  if (!memoryMuseums) {
    memoryMuseums = seedMuseums();
  }
  if (!memoryUsers) {
    memoryUsers = [];
  }
};

const getPool = () => {
  if (!pool) {
    if (!process.env.DATABASE_URL) {
      memoryMode = true;
      ensureMemoryStore();
      throw new Error('DATABASE_URL is not set');
    }
    const { Pool } = (eval('require') as NodeRequire)('pg') as typeof import('pg');
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
  }
  return pool;
};

const ensureSchema = async () => {
  if (memoryMode) return;
  if (schemaReady) return;
  if (!process.env.DATABASE_URL) {
    memoryMode = true;
    ensureMemoryStore();
    return;
  }
  let client: Awaited<ReturnType<Pool['connect']>> | null = null;
  try {
    client = await getPool().connect();
  } catch {
    memoryMode = true;
    ensureMemoryStore();
    return;
  }
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS museums (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        location TEXT NOT NULL,
        city TEXT NOT NULL,
        region TEXT NOT NULL,
        category TEXT NOT NULL,
        description TEXT NOT NULL,
        address TEXT NOT NULL,
        hours TEXT NOT NULL,
        badge TEXT NOT NULL,
        price TEXT NOT NULL,
        kids BOOLEAN NOT NULL,
        rating NUMERIC NOT NULL,
        hue INTEGER NOT NULL,
        phone TEXT NOT NULL,
        website TEXT NOT NULL,
        image TEXT NOT NULL,
        gis_link TEXT NOT NULL
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        points INTEGER NOT NULL,
        role TEXT NOT NULL,
        status TEXT NOT NULL,
        visits INTEGER NOT NULL,
        last_active TEXT NOT NULL
      );
    `);

    const museumsCount = await client.query('SELECT COUNT(*) FROM museums');
    if (Number(museumsCount.rows[0]?.count ?? 0) === 0) {
      const museums = seedMuseums();
      await client.query('BEGIN');
      for (const museum of museums) {
        await client.query(
          `
          INSERT INTO museums (
            name,
            location,
            city,
            region,
            category,
            description,
            address,
            hours,
            badge,
            price,
            kids,
            rating,
            hue,
            phone,
            website,
            image,
            gis_link
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
          `,
          [
            museum.name,
            museum.location,
            museum.city,
            museum.region,
            museum.category,
            museum.description,
            museum.address,
            museum.hours,
            museum.badge,
            museum.price,
            museum.kids,
            museum.rating,
            museum.hue,
            museum.phone,
            museum.website,
            museum.image,
            museum.gisLink,
          ],
        );
      }
      await client.query('COMMIT');
    }

    const usersCount = await client.query('SELECT COUNT(*) FROM users');
    if (Number(usersCount.rows[0]?.count ?? 0) === 0) {
      await client.query(
        `
        INSERT INTO users (name, email, points, role, status, visits, last_active)
        VALUES
          ($1, $2, $3, $4, $5, $6, $7),
          ($8, $9, $10, $11, $12, $13, $14),
          ($15, $16, $17, $18, $19, $20, $21)
        `,
        [
          'Айдана Ж.',
          'aidana@museonet.kz',
          20,
          'admin',
          'active',
          18,
          '2024-05-12',
          'Ерлан Т.',
          'erlan@museonet.kz',
          20,
          'user',
          'active',
          6,
          '2024-05-10',
          'Ақбота К.',
          'akbota@museonet.kz',
          20,
          'user',
          'banned',
          2,
          '2024-04-30',
        ],
      );
    }

    schemaReady = true;
  } finally {
    client?.release();
  }
};

const mapMuseumRow = (row: any): MuseumRecord => ({
  id: row.id,
  name: row.name,
  location: row.location,
  city: row.city,
  region: row.region,
  category: row.category,
  description: row.description,
  address: row.address,
  hours: row.hours,
  badge: row.badge,
  price: row.price,
  kids: row.kids,
  rating: Number(row.rating),
  hue: row.hue,
  phone: row.phone,
  website: row.website,
  image: row.image,
  gisLink: row.gisLink,
});

const mapUserRow = (row: any): UserRecord => ({
  id: row.id,
  name: row.name,
  email: row.email,
  points: row.points,
  role: row.role,
  status: row.status,
  visits: row.visits,
  lastActive: row.lastActive,
});

export const fetchMuseums = async (): Promise<MuseumRecord[]> => {
  await ensureSchema();
  if (memoryMode) {
    return memoryMuseums ? [...memoryMuseums] : [];
  }
  const { rows } = await getPool().query(
    `
    SELECT
      id,
      name,
      location,
      city,
      region,
      category,
      description,
      address,
      hours,
      badge,
      price,
      kids,
      rating,
      hue,
      phone,
      website,
      image,
      gis_link AS "gisLink"
    FROM museums
    ORDER BY id
    `,
  );
  return rows.map(mapMuseumRow);
};

export const fetchMuseumById = async (id: number): Promise<MuseumRecord | null> => {
  await ensureSchema();
  if (memoryMode) {
    return memoryMuseums?.find((museum) => museum.id === id) ?? null;
  }
  const { rows } = await getPool().query(
    `
    SELECT
      id,
      name,
      location,
      city,
      region,
      category,
      description,
      address,
      hours,
      badge,
      price,
      kids,
      rating,
      hue,
      phone,
      website,
      image,
      gis_link AS "gisLink"
    FROM museums
    WHERE id = $1
    `,
    [id],
  );
  if (!rows[0]) return null;
  return mapMuseumRow(rows[0]);
};

export const createMuseum = async (payload: Partial<MuseumRecord>): Promise<MuseumRecord> => {
  await ensureSchema();
  const fallback = seedMuseums(1)[0];
  const museum = {
    ...fallback,
    ...payload,
  } as MuseumRecord;

  if (memoryMode) {
    const nextId = memoryMuseums?.length ? Math.max(...memoryMuseums.map((item) => item.id)) + 1 : 1;
    const created = { ...museum, id: nextId };
    memoryMuseums = [...(memoryMuseums ?? []), created];
    return created;
  }

  const { rows } = await getPool().query(
    `
    INSERT INTO museums (
      name,
      location,
      city,
      region,
      category,
      description,
      address,
      hours,
      badge,
      price,
      kids,
      rating,
      hue,
      phone,
      website,
      image,
      gis_link
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
    RETURNING
      id,
      name,
      location,
      city,
      region,
      category,
      description,
      address,
      hours,
      badge,
      price,
      kids,
      rating,
      hue,
      phone,
      website,
      image,
      gis_link AS "gisLink"
    `,
    [
      museum.name,
      museum.location,
      museum.city,
      museum.region,
      museum.category,
      museum.description,
      museum.address,
      museum.hours,
      museum.badge,
      museum.price,
      museum.kids,
      museum.rating,
      museum.hue,
      museum.phone,
      museum.website,
      museum.image,
      museum.gisLink,
    ],
  );
  return mapMuseumRow(rows[0]);
};

export const updateMuseum = async (id: number, payload: Partial<MuseumRecord>): Promise<MuseumRecord | null> => {
  await ensureSchema();
  if (memoryMode) {
    if (!memoryMuseums) return null;
    const index = memoryMuseums.findIndex((museum) => museum.id === id);
    if (index === -1) return null;
    const updated = { ...memoryMuseums[index], ...payload, id };
    memoryMuseums = memoryMuseums.map((museum, idx) => (idx === index ? updated : museum));
    return updated;
  }
  const existing = await fetchMuseumById(id);
  if (!existing) return null;
  const museum = { ...existing, ...payload, id };

  const { rows } = await getPool().query(
    `
    UPDATE museums
    SET
      name = $1,
      location = $2,
      city = $3,
      region = $4,
      category = $5,
      description = $6,
      address = $7,
      hours = $8,
      badge = $9,
      price = $10,
      kids = $11,
      rating = $12,
      hue = $13,
      phone = $14,
      website = $15,
      image = $16,
      gis_link = $17
    WHERE id = $18
    RETURNING
      id,
      name,
      location,
      city,
      region,
      category,
      description,
      address,
      hours,
      badge,
      price,
      kids,
      rating,
      hue,
      phone,
      website,
      image,
      gis_link AS "gisLink"
    `,
    [
      museum.name,
      museum.location,
      museum.city,
      museum.region,
      museum.category,
      museum.description,
      museum.address,
      museum.hours,
      museum.badge,
      museum.price,
      museum.kids,
      museum.rating,
      museum.hue,
      museum.phone,
      museum.website,
      museum.image,
      museum.gisLink,
      id,
    ],
  );
  return mapMuseumRow(rows[0]);
};

export const deleteMuseum = async (id: number): Promise<boolean> => {
  await ensureSchema();
  if (memoryMode) {
    if (!memoryMuseums) return false;
    const next = memoryMuseums.filter((museum) => museum.id !== id);
    const removed = next.length !== memoryMuseums.length;
    memoryMuseums = next;
    return removed;
  }
  const result = await getPool().query('DELETE FROM museums WHERE id = $1', [id]);
  return result.rowCount > 0;
};

export const fetchUsers = async (): Promise<UserRecord[]> => {
  await ensureSchema();
  if (memoryMode) {
    return memoryUsers ? [...memoryUsers] : [];
  }
  const { rows } = await getPool().query(
    `
    SELECT
      id,
      name,
      email,
      points,
      role,
      status,
      visits,
      last_active AS "lastActive"
    FROM users
    ORDER BY id
    `,
  );
  return rows.map(mapUserRow);
};

export const fetchUserById = async (id: number): Promise<UserRecord | null> => {
  await ensureSchema();
  if (memoryMode) {
    return memoryUsers?.find((user) => user.id === id) ?? null;
  }
  const { rows } = await getPool().query(
    `
    SELECT
      id,
      name,
      email,
      points,
      role,
      status,
      visits,
      last_active AS "lastActive"
    FROM users
    WHERE id = $1
    `,
    [id],
  );
  if (!rows[0]) return null;
  return mapUserRow(rows[0]);
};

export const createUser = async (payload: Partial<UserRecord>): Promise<UserRecord> => {
  await ensureSchema();
  const user = {
    name: payload.name ?? 'Жаңа қолданушы',
    email: payload.email ?? `user-${Date.now()}@museonet.kz`,
    points: payload.points ?? 20,
    role: payload.role ?? 'user',
    status: payload.status ?? 'active',
    visits: payload.visits ?? 0,
    lastActive: payload.lastActive ?? '—',
  } as UserRecord;

  if (memoryMode) {
    const nextId = memoryUsers?.length ? Math.max(...memoryUsers.map((item) => item.id)) + 1 : 1;
    const created = { ...user, id: nextId };
    memoryUsers = [...(memoryUsers ?? []), created];
    return created;
  }

  const { rows } = await getPool().query(
    `
    INSERT INTO users (name, email, points, role, status, visits, last_active)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING
      id,
      name,
      email,
      points,
      role,
      status,
      visits,
      last_active AS "lastActive"
    `,
    [user.name, user.email, user.points, user.role, user.status, user.visits, user.lastActive],
  );
  return mapUserRow(rows[0]);
};

export const updateUser = async (id: number, payload: Partial<UserRecord>): Promise<UserRecord | null> => {
  await ensureSchema();
  if (memoryMode) {
    if (!memoryUsers) return null;
    const index = memoryUsers.findIndex((user) => user.id === id);
    if (index === -1) return null;
    const updated = { ...memoryUsers[index], ...payload, id };
    memoryUsers = memoryUsers.map((user, idx) => (idx === index ? updated : user));
    return updated;
  }
  const existing = await fetchUserById(id);
  if (!existing) return null;
  const user = { ...existing, ...payload, id };

  const { rows } = await getPool().query(
    `
    UPDATE users
    SET
      name = $1,
      email = $2,
      points = $3,
      role = $4,
      status = $5,
      visits = $6,
      last_active = $7
    WHERE id = $8
    RETURNING
      id,
      name,
      email,
      points,
      role,
      status,
      visits,
      last_active AS "lastActive"
    `,
    [user.name, user.email, user.points, user.role, user.status, user.visits, user.lastActive, id],
  );
  return mapUserRow(rows[0]);
};

export const deleteUser = async (id: number): Promise<boolean> => {
  await ensureSchema();
  if (memoryMode) {
    if (!memoryUsers) return false;
    const next = memoryUsers.filter((user) => user.id !== id);
    const removed = next.length !== memoryUsers.length;
    memoryUsers = next;
    return removed;
  }
  const result = await getPool().query('DELETE FROM users WHERE id = $1', [id]);
  return result.rowCount > 0;
};

export const findUserByEmail = async (email: string): Promise<UserRecord | null> => {
  await ensureSchema();
  if (memoryMode) {
    return memoryUsers?.find((user) => user.email === email) ?? null;
  }
  const { rows } = await getPool().query(
    `
    SELECT
      id,
      name,
      email,
      points,
      role,
      status,
      visits,
      last_active AS "lastActive"
    FROM users
    WHERE email = $1
    `,
    [email],
  );
  if (!rows[0]) return null;
  return mapUserRow(rows[0]);
};
