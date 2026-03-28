import { create } from 'zustand';
import type { FocusSession } from '../types';
import { storageGet, storageSet } from '../storage/mmkv';
import { STORAGE_KEYS } from '../constants/storage-keys';

type TimerState = 'idle' | 'running' | 'paused' | 'break';
type TimerMode = 'work' | 'short_break' | 'long_break';

interface FocusState {
  timerState: TimerState;
  timerMode: TimerMode;
  secondsLeft: number;
  totalSeconds: number;
  sessionCount: number;
  currentTaskId: string | null;
  sessions: FocusSession[];
  settings: { work: number; shortBreak: number; longBreak: number; sessionsBeforeLong: number };

  start: (taskId?: string) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  tick: () => void;
  nextPhase: () => void;
  setTaskId: (id: string | null) => void;
  updateSettings: (s: Partial<FocusState['settings']>) => void;
}

export const useFocusStore = create<FocusState>((set, get) => ({
  timerState: 'idle',
  timerMode: 'work',
  secondsLeft: 25 * 60,
  totalSeconds: 25 * 60,
  sessionCount: 0,
  currentTaskId: null,
  sessions: storageGet<FocusSession[]>(STORAGE_KEYS.focusSessions) ?? [],
  settings: { work: 25, shortBreak: 5, longBreak: 15, sessionsBeforeLong: 4 },

  start: (taskId) => {
    const { settings } = get();
    const totalSeconds = settings.work * 60;
    set({ timerState: 'running', timerMode: 'work', secondsLeft: totalSeconds, totalSeconds, currentTaskId: taskId ?? null });
  },

  pause: () => set({ timerState: 'paused' }),
  resume: () => set({ timerState: 'running' }),

  stop: () => {
    const { settings } = get();
    set({ timerState: 'idle', timerMode: 'work', secondsLeft: settings.work * 60, totalSeconds: settings.work * 60, currentTaskId: null });
  },

  tick: () => {
    const { secondsLeft } = get();
    if (secondsLeft > 0) {
      set({ secondsLeft: secondsLeft - 1 });
    } else {
      get().nextPhase();
    }
  },

  nextPhase: () => {
    const { timerMode, sessionCount, settings } = get();
    const newCount = timerMode === 'work' ? sessionCount + 1 : sessionCount;
    let nextMode: TimerMode = 'work';
    let duration = settings.work;

    if (timerMode === 'work') {
      if (newCount % settings.sessionsBeforeLong === 0) {
        nextMode = 'long_break';
        duration = settings.longBreak;
      } else {
        nextMode = 'short_break';
        duration = settings.shortBreak;
      }
    }

    const session: FocusSession = {
      id: Date.now().toString(),
      taskId: get().currentTaskId ?? undefined,
      startedAt: new Date(Date.now() - get().totalSeconds * 1000).toISOString(),
      endedAt: new Date().toISOString(),
      durationMinutes: get().settings.work,
      type: 'pomodoro',
      completed: timerMode === 'work',
    };

    const sessions = [...get().sessions, session];
    storageSet(STORAGE_KEYS.focusSessions, sessions);

    set({
      timerMode: nextMode,
      timerState: 'running',
      sessionCount: newCount,
      secondsLeft: duration * 60,
      totalSeconds: duration * 60,
      sessions,
    });
  },

  setTaskId: (id) => set({ currentTaskId: id }),

  updateSettings: (s) => {
    set(state => ({ settings: { ...state.settings, ...s } }));
  },
}));
