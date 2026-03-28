import { storageGet, storageSet } from './mmkv';
import { STORAGE_KEYS } from '../constants/storage-keys';
import type { ColorScheme, AccentColor } from '../types';
import { DEFAULT_ACCENT } from '../theme/accent-colors';

export const settingsStorage = {
  getColorScheme: () => storageGet<ColorScheme>(STORAGE_KEYS.colorScheme) ?? 'system',
  setColorScheme: (scheme: ColorScheme) => storageSet(STORAGE_KEYS.colorScheme, scheme),

  getAccentColor: () => storageGet<AccentColor>(STORAGE_KEYS.accentColor) ?? DEFAULT_ACCENT,
  setAccentColor: (color: AccentColor) => storageSet(STORAGE_KEYS.accentColor, color),

  getPomodoroSettings: () =>
    storageGet<{ work: number; shortBreak: number; longBreak: number; sessionsBeforeLong: number }>(
      STORAGE_KEYS.pomodoroSettings,
    ) ?? { work: 25, shortBreak: 5, longBreak: 15, sessionsBeforeLong: 4 },
  setPomodoroSettings: (s: { work: number; shortBreak: number; longBreak: number; sessionsBeforeLong: number }) =>
    storageSet(STORAGE_KEYS.pomodoroSettings, s),
};
