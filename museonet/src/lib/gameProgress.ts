import type { GameProgressPayload, GameType } from '../types/gameSystem';

const STORAGE_KEY = 'museonetGameProgress';
const DB_NAME = 'museonet-game';
const STORE_NAME = 'progress';

const now = () => new Date().toISOString();

export const createDefaultProgress = (): GameProgressPayload => ({
  totalScore: 0,
  perGame: {
    puzzle: {
      level: 1,
      unlockedLevels: [1],
      lastScore: 0,
      updatedAt: now(),
    },
    quiz: {
      level: 1,
      unlockedLevels: [1],
      lastScore: 0,
      updatedAt: now(),
    },
    matching: {
      level: 1,
      unlockedLevels: [1],
      lastScore: 0,
      updatedAt: now(),
    },
  },
  lastPlayedGame: null,
  lastActivityAt: now(),
  settings: {
    sound: true,
    animationIntensity: 'medium',
  },
  updatedAt: now(),
});

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
  return new Promise<GameProgressPayload | null>((resolve) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.get(STORAGE_KEY);
    request.onsuccess = () => resolve((request.result as GameProgressPayload) ?? null);
    request.onerror = () => resolve(null);
  });
};

const writeToIndexedDb = async (payload: GameProgressPayload) => {
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

export const loadGuestProgress = async (): Promise<GameProgressPayload> => {
  if (typeof window === 'undefined') return createDefaultProgress();
  const localRaw = window.localStorage.getItem(STORAGE_KEY);
  const localPayload = localRaw ? (JSON.parse(localRaw) as GameProgressPayload) : null;
  const indexedPayload = await readFromIndexedDb();
  if (!localPayload && !indexedPayload) {
    const created = createDefaultProgress();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(created));
    await writeToIndexedDb(created);
    return created;
  }
  if (localPayload && indexedPayload) {
    return mergeProgress(localPayload, indexedPayload);
  }
  return localPayload ?? indexedPayload ?? createDefaultProgress();
};

export const saveGuestProgress = async (payload: GameProgressPayload) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  await writeToIndexedDb(payload);
};

export const mergeProgress = (local: GameProgressPayload, remote: GameProgressPayload): GameProgressPayload => {
  const newest = local.updatedAt >= remote.updatedAt ? local : remote;
  const other = newest === local ? remote : local;
  const merged: GameProgressPayload = {
    ...newest,
    totalScore: Math.max(local.totalScore, remote.totalScore),
    lastActivityAt: newest.lastActivityAt,
    lastPlayedGame: newest.lastPlayedGame,
    perGame: {
      puzzle: mergeGameProgress('puzzle', local, remote),
      quiz: mergeGameProgress('quiz', local, remote),
      matching: mergeGameProgress('matching', local, remote),
    },
  };
  merged.settings = {
    ...other.settings,
    ...newest.settings,
  };
  merged.updatedAt = newest.updatedAt;
  return merged;
};

const mergeGameProgress = (
  game: GameType,
  local: GameProgressPayload,
  remote: GameProgressPayload,
): GameProgressPayload['perGame'][GameType] => {
  const localGame = local.perGame[game];
  const remoteGame = remote.perGame[game];
  const updated = localGame.updatedAt >= remoteGame.updatedAt ? localGame : remoteGame;
  return {
    ...updated,
    level: Math.max(localGame.level, remoteGame.level),
    unlockedLevels: Array.from(new Set([...localGame.unlockedLevels, ...remoteGame.unlockedLevels])).sort(
      (a, b) => a - b,
    ),
    lastScore: Math.max(localGame.lastScore, remoteGame.lastScore),
  };
};
