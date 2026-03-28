export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  streakDays: number;
  longestStreak: number;
  totalTasksCompleted: number;
  joinedAt: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
  xpReward: number;
  category: 'streak' | 'completion' | 'focus' | 'social' | 'special';
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface RegisterPayload extends AuthCredentials {
  name: string;
}
