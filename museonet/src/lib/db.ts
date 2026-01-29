import type { Pool, PoolClient } from 'pg';
import type {
  AnalyticsEvent,
  AnalyticsSummary,
  GameContentRecord,
  GameLevelConfig,
  GameProgressPayload,
  GameStatus,
  GameType,
  ScoringRules,
  ThemeSettings,
} from '../types/gameSystem';
import { defaultGameContent, defaultGameLevels, defaultScoringRules, defaultThemeSettings } from './gameSeeds';
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
let memoryGameProgress: Record<string, GameProgressPayload> | null = null;
let memoryGameContent: GameContentRecord[] | null = null;
let memoryScoringRules: ScoringRules | null = null;
let memoryThemeSettings: ThemeSettings | null = null;
let memoryGameLevels: GameLevelConfig[] | null = null;
let memoryAnalyticsEvents: AnalyticsEvent[] | null = null;

const ensureMemoryStore = () => {
  if (!memoryMuseums) {
    memoryMuseums = seedMuseums();
  }
  if (!memoryUsers) {
    memoryUsers = [];
  }
  if (!memoryGameProgress) {
    memoryGameProgress = {};
  }
  if (!memoryGameContent) {
    memoryGameContent = defaultGameContent;
  }
  if (!memoryScoringRules) {
    memoryScoringRules = defaultScoringRules;
  }
  if (!memoryThemeSettings) {
    memoryThemeSettings = defaultThemeSettings;
  }
  if (!memoryGameLevels) {
    memoryGameLevels = defaultGameLevels;
  }
  if (!memoryAnalyticsEvents) {
    memoryAnalyticsEvents = [];
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
  let client: PoolClient | null = null;
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

    await client.query(`
      CREATE TABLE IF NOT EXISTS game_progress (
        user_email TEXT PRIMARY KEY,
        payload JSONB NOT NULL,
        updated_at TIMESTAMP NOT NULL
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS scoring_rules (
        id INTEGER PRIMARY KEY,
        payload JSONB NOT NULL,
        updated_at TIMESTAMP NOT NULL
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS theme_settings (
        id INTEGER PRIMARY KEY,
        payload JSONB NOT NULL,
        updated_at TIMESTAMP NOT NULL
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS game_level_configs (
        id SERIAL PRIMARY KEY,
        game_type TEXT NOT NULL,
        level INTEGER NOT NULL,
        payload JSONB NOT NULL,
        updated_at TIMESTAMP NOT NULL,
        UNIQUE (game_type, level)
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS game_content (
        id SERIAL PRIMARY KEY,
        game_type TEXT NOT NULL,
        title TEXT NOT NULL,
        status TEXT NOT NULL,
        tags TEXT[] NOT NULL,
        payload JSONB NOT NULL,
        created_at TIMESTAMP NOT NULL,
        updated_at TIMESTAMP NOT NULL
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS analytics_events (
        id SERIAL PRIMARY KEY,
        event_type TEXT NOT NULL,
        payload JSONB NOT NULL,
        created_at TIMESTAMP NOT NULL
      );
    `);

    const museumsCount = await client.query<{ count: string }>('SELECT COUNT(*) FROM museums');
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

    const usersCount = await client.query<{ count: string }>('SELECT COUNT(*) FROM users');
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

    const scoringCount = await client.query<{ count: string }>('SELECT COUNT(*) FROM scoring_rules');
    if (Number(scoringCount.rows[0]?.count ?? 0) === 0) {
      await client.query(
        `
        INSERT INTO scoring_rules (id, payload, updated_at)
        VALUES ($1, $2, $3)
        `,
        [1, defaultScoringRules, defaultScoringRules.updatedAt],
      );
    }

    const themeCount = await client.query<{ count: string }>('SELECT COUNT(*) FROM theme_settings');
    if (Number(themeCount.rows[0]?.count ?? 0) === 0) {
      await client.query(
        `
        INSERT INTO theme_settings (id, payload, updated_at)
        VALUES ($1, $2, $3)
        `,
        [1, defaultThemeSettings, defaultThemeSettings.updatedAt],
      );
    }

    const levelCount = await client.query<{ count: string }>('SELECT COUNT(*) FROM game_level_configs');
    if (Number(levelCount.rows[0]?.count ?? 0) === 0) {
      for (const level of defaultGameLevels) {
        await client.query(
          `
          INSERT INTO game_level_configs (game_type, level, payload, updated_at)
          VALUES ($1, $2, $3, $4)
          `,
          [level.gameType, level.level, level.config, level.updatedAt],
        );
      }
    }

    const contentCount = await client.query<{ count: string }>('SELECT COUNT(*) FROM game_content');
    if (Number(contentCount.rows[0]?.count ?? 0) === 0) {
      for (const item of defaultGameContent) {
        await client.query(
          `
          INSERT INTO game_content (game_type, title, status, tags, payload, created_at, updated_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          `,
          [item.gameType, item.title, item.status, item.tags, item.data, item.createdAt, item.updatedAt],
        );
      }
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

const mapGameContentRow = (row: any): GameContentRecord => ({
  id: row.id,
  gameType: row.gameType,
  title: row.title,
  status: row.status,
  tags: row.tags ?? [],
  data: row.payload ?? {},
  createdAt: row.createdAt,
  updatedAt: row.updatedAt,
});

export const fetchGameContent = async (gameType?: GameType, status?: GameStatus): Promise<GameContentRecord[]> => {
  await ensureSchema();
  if (memoryMode) {
    const content = memoryGameContent ?? [];
    return content.filter((item) => (!gameType || item.gameType === gameType) && (!status || item.status === status));
  }
  const filters = [];
  const params: (string | GameStatus)[] = [];
  if (gameType) {
    params.push(gameType);
    filters.push(`game_type = $${params.length}`);
  }
  if (status) {
    params.push(status);
    filters.push(`status = $${params.length}`);
  }
  const where = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
  const { rows } = await getPool().query(
    `
    SELECT
      id,
      game_type AS "gameType",
      title,
      status,
      tags,
      payload,
      created_at AS "createdAt",
      updated_at AS "updatedAt"
    FROM game_content
    ${where}
    ORDER BY id
    `,
    params,
  );
  return rows.map(mapGameContentRow);
};

export const createGameContent = async (payload: Omit<GameContentRecord, 'id' | 'createdAt' | 'updatedAt'>) => {
  await ensureSchema();
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;
  const item = { ...payload, createdAt, updatedAt } as GameContentRecord;
  if (memoryMode) {
    const nextId = memoryGameContent?.length ? Math.max(...memoryGameContent.map((entry) => entry.id)) + 1 : 1;
    const created = { ...item, id: nextId };
    memoryGameContent = [...(memoryGameContent ?? []), created];
    return created;
  }
  const { rows } = await getPool().query(
    `
    INSERT INTO game_content (game_type, title, status, tags, payload, created_at, updated_at)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING
      id,
      game_type AS "gameType",
      title,
      status,
      tags,
      payload,
      created_at AS "createdAt",
      updated_at AS "updatedAt"
    `,
    [item.gameType, item.title, item.status, item.tags, item.data, item.createdAt, item.updatedAt],
  );
  return mapGameContentRow(rows[0]);
};

export const updateGameContent = async (
  id: number,
  payload: Partial<Omit<GameContentRecord, 'id' | 'createdAt'>>,
) => {
  await ensureSchema();
  if (memoryMode) {
    if (!memoryGameContent) return null;
    const index = memoryGameContent.findIndex((entry) => entry.id === id);
    if (index === -1) return null;
    const updated = {
      ...memoryGameContent[index],
      ...payload,
      updatedAt: new Date().toISOString(),
    } as GameContentRecord;
    memoryGameContent = memoryGameContent.map((entry, idx) => (idx === index ? updated : entry));
    return updated;
  }
  const existing = (await fetchGameContent()).find((entry) => entry.id === id);
  if (!existing) return null;
  const updated = {
    ...existing,
    ...payload,
    updatedAt: new Date().toISOString(),
  };
  const { rows } = await getPool().query(
    `
    UPDATE game_content
    SET
      game_type = $1,
      title = $2,
      status = $3,
      tags = $4,
      payload = $5,
      updated_at = $6
    WHERE id = $7
    RETURNING
      id,
      game_type AS "gameType",
      title,
      status,
      tags,
      payload,
      created_at AS "createdAt",
      updated_at AS "updatedAt"
    `,
    [updated.gameType, updated.title, updated.status, updated.tags, updated.data, updated.updatedAt, id],
  );
  return mapGameContentRow(rows[0]);
};

export const fetchScoringRules = async (): Promise<ScoringRules> => {
  await ensureSchema();
  if (memoryMode) {
    return memoryScoringRules ?? defaultScoringRules;
  }
  const { rows } = await getPool().query('SELECT payload FROM scoring_rules WHERE id = 1');
  return (rows[0]?.payload as ScoringRules) ?? defaultScoringRules;
};

export const updateScoringRules = async (payload: ScoringRules): Promise<ScoringRules> => {
  await ensureSchema();
  const updated = { ...payload, updatedAt: new Date().toISOString() };
  if (memoryMode) {
    memoryScoringRules = updated;
    return updated;
  }
  await getPool().query(
    `
    INSERT INTO scoring_rules (id, payload, updated_at)
    VALUES (1, $1, $2)
    ON CONFLICT (id)
    DO UPDATE SET payload = $1, updated_at = $2
    `,
    [updated, updated.updatedAt],
  );
  return updated;
};

export const fetchThemeSettings = async (): Promise<ThemeSettings> => {
  await ensureSchema();
  if (memoryMode) {
    return memoryThemeSettings ?? defaultThemeSettings;
  }
  const { rows } = await getPool().query('SELECT payload FROM theme_settings WHERE id = 1');
  return (rows[0]?.payload as ThemeSettings) ?? defaultThemeSettings;
};

export const updateThemeSettings = async (payload: ThemeSettings): Promise<ThemeSettings> => {
  await ensureSchema();
  const updated = { ...payload, updatedAt: new Date().toISOString() };
  if (memoryMode) {
    memoryThemeSettings = updated;
    return updated;
  }
  await getPool().query(
    `
    INSERT INTO theme_settings (id, payload, updated_at)
    VALUES (1, $1, $2)
    ON CONFLICT (id)
    DO UPDATE SET payload = $1, updated_at = $2
    `,
    [updated, updated.updatedAt],
  );
  return updated;
};

export const fetchGameLevels = async (): Promise<GameLevelConfig[]> => {
  await ensureSchema();
  if (memoryMode) {
    return memoryGameLevels ?? defaultGameLevels;
  }
  const { rows } = await getPool().query(
    `
    SELECT
      game_type AS "gameType",
      level,
      payload,
      updated_at AS "updatedAt"
    FROM game_level_configs
    ORDER BY game_type, level
    `,
  );
  return rows.map((row) => ({
    gameType: row.gameType,
    level: row.level,
    config: row.payload ?? {},
    updatedAt: row.updatedAt,
  }));
};

export const updateGameLevel = async (payload: GameLevelConfig): Promise<GameLevelConfig> => {
  await ensureSchema();
  const updated = { ...payload, updatedAt: new Date().toISOString() };
  if (memoryMode) {
    const levels = memoryGameLevels ?? [];
    const next = levels.filter((item) => !(item.gameType === updated.gameType && item.level === updated.level));
    memoryGameLevels = [...next, updated];
    return updated;
  }
  await getPool().query(
    `
    INSERT INTO game_level_configs (game_type, level, payload, updated_at)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (game_type, level)
    DO UPDATE SET payload = $3, updated_at = $4
    `,
    [updated.gameType, updated.level, updated.config, updated.updatedAt],
  );
  return updated;
};

export const fetchGameProgress = async (userEmail: string): Promise<GameProgressPayload | null> => {
  await ensureSchema();
  if (memoryMode) {
    return memoryGameProgress?.[userEmail] ?? null;
  }
  const { rows } = await getPool().query(
    `
    SELECT payload
    FROM game_progress
    WHERE user_email = $1
    `,
    [userEmail],
  );
  return (rows[0]?.payload as GameProgressPayload) ?? null;
};

export const upsertGameProgress = async (
  userEmail: string,
  payload: GameProgressPayload,
): Promise<GameProgressPayload> => {
  await ensureSchema();
  if (memoryMode) {
    if (!memoryGameProgress) {
      memoryGameProgress = {};
    }
    memoryGameProgress[userEmail] = payload;
    return payload;
  }
  await getPool().query(
    `
    INSERT INTO game_progress (user_email, payload, updated_at)
    VALUES ($1, $2, $3)
    ON CONFLICT (user_email)
    DO UPDATE SET payload = $2, updated_at = $3
    `,
    [userEmail, payload, payload.updatedAt],
  );
  return payload;
};

export const logAnalyticsEvent = async (eventType: string, payload: Record<string, unknown>) => {
  await ensureSchema();
  const createdAt = new Date().toISOString();
  if (memoryMode) {
    memoryAnalyticsEvents = [
      ...(memoryAnalyticsEvents ?? []),
      {
        id: (memoryAnalyticsEvents?.length ?? 0) + 1,
        eventType,
        payload,
        createdAt,
      },
    ];
    return;
  }
  await getPool().query(
    `
    INSERT INTO analytics_events (event_type, payload, created_at)
    VALUES ($1, $2, $3)
    `,
    [eventType, payload, createdAt],
  );
};

const summarizeAnalytics = (events: AnalyticsEvent[]): AnalyticsSummary => {
  const playsByGame: AnalyticsSummary['playsByGame'] = { puzzle: 0, quiz: 0, matching: 0 };
  const completionTotals: Record<GameType, { total: number; count: number }> = {
    puzzle: { total: 0, count: 0 },
    quiz: { total: 0, count: 0 },
    matching: { total: 0, count: 0 },
  };
  const winRateByLevel: Record<string, { win: number; total: number }> = {};
  const quizMisses: Record<string, number> = {};
  const pairMisses: Record<string, number> = {};
  const users = new Set<string>();
  let lastActivityAt: string | null = null;

  events.forEach((event) => {
    const payload = event.payload as Record<string, any>;
    const gameType = payload.gameType as GameType | undefined;
    if (payload.userEmail) {
      users.add(payload.userEmail);
    }
    if (!lastActivityAt || event.createdAt > lastActivityAt) {
      lastActivityAt = event.createdAt;
    }
    if (event.eventType === 'game_play' && gameType) {
      playsByGame[gameType] += 1;
      completionTotals[gameType].total += payload.timeSeconds ?? 0;
      completionTotals[gameType].count += 1;
      const levelKey = `${gameType}:${payload.level ?? 1}`;
      if (!winRateByLevel[levelKey]) {
        winRateByLevel[levelKey] = { win: 0, total: 0 };
      }
      winRateByLevel[levelKey].total += 1;
      if (payload.win) winRateByLevel[levelKey].win += 1;
    }
    if (event.eventType === 'quiz_miss') {
      const id = String(payload.questionId ?? 'unknown');
      quizMisses[id] = (quizMisses[id] ?? 0) + 1;
    }
    if (event.eventType === 'matching_miss') {
      const id = String(payload.pairId ?? 'unknown');
      pairMisses[id] = (pairMisses[id] ?? 0) + 1;
    }
  });

  const winRateResult: Record<string, number> = {};
  Object.entries(winRateByLevel).forEach(([key, value]) => {
    winRateResult[key] = value.total ? value.win / value.total : 0;
  });

  const avgCompletionByGame = Object.fromEntries(
    (Object.keys(completionTotals) as GameType[]).map((game) => [
      game,
      completionTotals[game].count ? completionTotals[game].total / completionTotals[game].count : 0,
    ]),
  ) as AnalyticsSummary['avgCompletionByGame'];

  return {
    totalPlays: events.length,
    playsByGame,
    winRateByLevel: winRateResult,
    avgCompletionByGame,
    hardestLevels: Object.entries(winRateResult)
      .map(([level, rate]) => ({ level, failRate: 1 - rate }))
      .sort((a, b) => b.failRate - a.failRate)
      .slice(0, 5),
    mostMissedQuiz: Object.entries(quizMisses)
      .map(([id, misses]) => ({ id, misses }))
      .sort((a, b) => b.misses - a.misses)
      .slice(0, 5),
    mostMistakenPairs: Object.entries(pairMisses)
      .map(([id, misses]) => ({ id, misses }))
      .sort((a, b) => b.misses - a.misses)
      .slice(0, 5),
    returningUsers: users.size,
    lastActivityAt,
  };
};

export const fetchAnalyticsSummary = async (): Promise<AnalyticsSummary> => {
  await ensureSchema();
  if (memoryMode) {
    return summarizeAnalytics(memoryAnalyticsEvents ?? []);
  }
  const { rows } = await getPool().query(
    `
    SELECT
      id,
      event_type AS "eventType",
      payload,
      created_at AS "createdAt"
    FROM analytics_events
    ORDER BY created_at DESC
    `,
  );
  return summarizeAnalytics(rows as AnalyticsEvent[]);
};
