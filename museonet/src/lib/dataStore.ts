import fs from 'fs';
import path from 'path';
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

const dataDir = path.join(process.cwd(), 'data');
const museumsFile = path.join(dataDir, 'museums.json');
const usersFile = path.join(dataDir, 'users.json');

const ensureDataDir = () => {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
};

const readJson = <T>(filePath: string, fallback: T): T => {
  try {
    if (!fs.existsSync(filePath)) {
      return fallback;
    }
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

const writeJson = <T>(filePath: string, data: T) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

export const getMuseums = (): MuseumRecord[] => {
  ensureDataDir();
  const existing = readJson<MuseumRecord[]>(museumsFile, []);
  if (existing.length === 0) {
    const seeded = seedMuseums();
    writeJson(museumsFile, seeded);
    return seeded;
  }
  return existing;
};

export const saveMuseums = (museums: MuseumRecord[]) => {
  ensureDataDir();
  writeJson(museumsFile, museums);
};

export const getUsers = (): UserRecord[] => {
  ensureDataDir();
  const existing = readJson<UserRecord[]>(usersFile, []);
  if (existing.length === 0) {
    const seeded: UserRecord[] = [
      {
        id: 1,
        name: 'Айдана Ж.',
        email: 'aidana@museonet.kz',
        points: 20,
        role: 'admin',
        status: 'active',
        visits: 18,
        lastActive: '2024-05-12',
      },
      {
        id: 2,
        name: 'Ерлан Т.',
        email: 'erlan@museonet.kz',
        points: 20,
        role: 'user',
        status: 'active',
        visits: 6,
        lastActive: '2024-05-10',
      },
      {
        id: 3,
        name: 'Ақбота К.',
        email: 'akbota@museonet.kz',
        points: 20,
        role: 'user',
        status: 'banned',
        visits: 2,
        lastActive: '2024-04-30',
      },
    ];
    writeJson(usersFile, seeded);
    return seeded;
  }
  return existing;
};

export const saveUsers = (users: UserRecord[]) => {
  ensureDataDir();
  writeJson(usersFile, users);
};
