import { create } from 'zustand';
import type { User } from '../types';
import { authStorage } from '../storage';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  setUser: (user: User) => void;
  setToken: (token: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  addXp: (xp: number) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: authStorage.getToken() ?? null,
  isAuthenticated: !!authStorage.getToken(),
  isLoading: false,

  setUser: (user) => set({ user, isAuthenticated: true }),
  setToken: (token) => {
    authStorage.setToken(token);
    set({ token, isAuthenticated: true });
  },

  logout: () => {
    authStorage.clearAll();
    set({ user: null, token: null, isAuthenticated: false });
  },

  setLoading: (isLoading) => set({ isLoading }),

  addXp: (xp) => {
    const { user } = get();
    if (!user) return;
    const newXp = user.xp + xp;
    const newXpToNext = user.xpToNextLevel;
    let level = user.level;
    let remaining = newXp;
    let threshold = newXpToNext;

    if (remaining >= threshold) {
      level += 1;
      remaining -= threshold;
      threshold = Math.floor(threshold * 1.5);
    }

    set({
      user: {
        ...user,
        xp: remaining,
        level,
        xpToNextLevel: threshold,
      },
    });
  },
}));
