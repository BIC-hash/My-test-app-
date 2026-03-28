import { MMKV } from 'react-native-mmkv';

export const storage = new MMKV({ id: 'taskpro-storage' });

export function storageGet<T>(key: string): T | undefined {
  const raw = storage.getString(key);
  if (!raw) return undefined;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return undefined;
  }
}

export function storageSet<T>(key: string, value: T): void {
  storage.set(key, JSON.stringify(value));
}

export function storageDelete(key: string): void {
  storage.delete(key);
}

export function storageClear(): void {
  storage.clearAll();
}

// AsyncStorage-compatible wrapper for React Query persister
export const mmkvStorageAdapter = {
  getItem: (key: string): Promise<string | null> =>
    Promise.resolve(storage.getString(key) ?? null),
  setItem: (key: string, value: string): Promise<void> =>
    Promise.resolve(storage.set(key, value)),
  removeItem: (key: string): Promise<void> =>
    Promise.resolve(storage.delete(key)),
};
