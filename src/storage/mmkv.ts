/**
 * AsyncStorage-backed storage adapter.
 * Drop-in replacement for the MMKV implementation — same API, fully compatible with Expo Go.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

// Synchronous in-memory cache so reads stay sync (like MMKV)
const memCache: Record<string, string> = {};

// Boot: hydrate cache from AsyncStorage on startup (fire-and-forget)
AsyncStorage.getAllKeys()
  .then(keys => AsyncStorage.multiGet(keys as string[]))
  .then(pairs => pairs.forEach(([k, v]) => { if (v) memCache[k] = v; }))
  .catch(() => {});

function persist(key: string, value: string) {
  AsyncStorage.setItem(key, value).catch(() => {});
}

export const storage = {
  getString: (key: string) => memCache[key],
  set: (key: string, value: string) => {
    memCache[key] = value;
    persist(key, value);
  },
  delete: (key: string) => {
    delete memCache[key];
    AsyncStorage.removeItem(key).catch(() => {});
  },
  clearAll: () => {
    Object.keys(memCache).forEach(k => delete memCache[k]);
    AsyncStorage.clear().catch(() => {});
  },
};

export function storageGet<T>(key: string): T | undefined {
  const raw = memCache[key];
  if (!raw) return undefined;
  try { return JSON.parse(raw) as T; } catch { return undefined; }
}

export function storageSet<T>(key: string, value: T): void {
  const s = JSON.stringify(value);
  memCache[key] = s;
  persist(key, s);
}

export function storageDelete(key: string): void {
  delete memCache[key];
  AsyncStorage.removeItem(key).catch(() => {});
}

export function storageClear(): void {
  Object.keys(memCache).forEach(k => delete memCache[k]);
  AsyncStorage.clear().catch(() => {});
}

export const mmkvStorageAdapter = {
  getItem: (key: string): Promise<string | null> =>
    AsyncStorage.getItem(key),
  setItem: (key: string, value: string): Promise<void> =>
    AsyncStorage.setItem(key, value),
  removeItem: (key: string): Promise<void> =>
    AsyncStorage.removeItem(key),
};
