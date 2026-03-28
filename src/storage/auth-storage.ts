import { storageGet, storageSet, storageDelete } from './mmkv';
import { STORAGE_KEYS } from '../constants/storage-keys';

export const authStorage = {
  getToken: () => storageGet<string>(STORAGE_KEYS.authToken),
  setToken: (token: string) => storageSet(STORAGE_KEYS.authToken, token),
  clearToken: () => storageDelete(STORAGE_KEYS.authToken),

  getRefreshToken: () => storageGet<string>(STORAGE_KEYS.refreshToken),
  setRefreshToken: (token: string) => storageSet(STORAGE_KEYS.refreshToken, token),
  clearRefreshToken: () => storageDelete(STORAGE_KEYS.refreshToken),

  getUserId: () => storageGet<string>(STORAGE_KEYS.userId),
  setUserId: (id: string) => storageSet(STORAGE_KEYS.userId, id),

  clearAll: () => {
    storageDelete(STORAGE_KEYS.authToken);
    storageDelete(STORAGE_KEYS.refreshToken);
    storageDelete(STORAGE_KEYS.userId);
  },

  isOnboardingCompleted: () => storageGet<boolean>(STORAGE_KEYS.onboardingCompleted) ?? false,
  setOnboardingCompleted: () => storageSet(STORAGE_KEYS.onboardingCompleted, true),
};
