import type { ProfilePayload } from '../types/profile';
import { createDefaultProfile } from './profileSeeds';

const STORAGE_KEY = 'museonetProfile';
const DB_NAME = 'museonet-profile';
const STORE_NAME = 'profile';

const openDb = () =>
  new Promise<IDBDatabase | null>((resolve) => {
    if (typeof window === 'undefined' || !('indexedDB' in window)) {
      resolve(null);
      return;
    }
    const request = window.indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => resolve(null);
  });

const readFromIndexedDb = async () => {
  const db = await openDb();
  if (!db) return null;
  return new Promise<ProfilePayload | null>((resolve) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.get(STORAGE_KEY);
    request.onsuccess = () => resolve((request.result as ProfilePayload) ?? null);
    request.onerror = () => resolve(null);
  });
};

const writeToIndexedDb = async (payload: ProfilePayload) => {
  const db = await openDb();
  if (!db) return;
  await new Promise<void>((resolve) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.put(payload, STORAGE_KEY);
    tx.oncomplete = () => resolve();
    tx.onerror = () => resolve();
  });
};

export const loadProfileStorage = async (): Promise<ProfilePayload> => {
  if (typeof window === 'undefined') return createDefaultProfile();
  const localRaw = window.localStorage.getItem(STORAGE_KEY);
  const localPayload = localRaw ? (JSON.parse(localRaw) as ProfilePayload) : null;
  const indexedPayload = await readFromIndexedDb();
  if (!localPayload && !indexedPayload) {
    const created = createDefaultProfile();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(created));
    await writeToIndexedDb(created);
    return created;
  }
  return localPayload ?? indexedPayload ?? createDefaultProfile();
};

export const saveProfileStorage = async (payload: ProfilePayload) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  await writeToIndexedDb(payload);
};

export const mergeProfiles = (local: ProfilePayload, remote: ProfilePayload): ProfilePayload => {
  const newest = local.updatedAt >= remote.updatedAt ? local : remote;
  const other = newest === local ? remote : local;
  return {
    ...newest,
    totalScore: Math.max(local.totalScore, remote.totalScore),
    level: Math.max(local.level, remote.level),
    levelProgress: newest.levelProgress,
    achievements: newest.achievements.length ? newest.achievements : other.achievements,
    sessions: newest.sessions.length ? newest.sessions : other.sessions,
    weeklyActivity: newest.weeklyActivity.length ? newest.weeklyActivity : other.weeklyActivity,
    missions: newest.missions.length ? newest.missions : other.missions,
  };
};
