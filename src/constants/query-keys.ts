export const QUERY_KEYS = {
  tasks: {
    all: ['tasks'] as const,
    lists: () => [...QUERY_KEYS.tasks.all, 'list'] as const,
    list: (filters: object) => [...QUERY_KEYS.tasks.lists(), filters] as const,
    detail: (id: string) => [...QUERY_KEYS.tasks.all, 'detail', id] as const,
    today: () => [...QUERY_KEYS.tasks.all, 'today'] as const,
    upcoming: (days: number) => [...QUERY_KEYS.tasks.all, 'upcoming', days] as const,
    overdue: () => [...QUERY_KEYS.tasks.all, 'overdue'] as const,
    byProject: (projectId: string) => [...QUERY_KEYS.tasks.all, 'project', projectId] as const,
  },
  projects: {
    all: ['projects'] as const,
    list: () => [...QUERY_KEYS.projects.all, 'list'] as const,
    detail: (id: string) => [...QUERY_KEYS.projects.all, 'detail', id] as const,
  },
  tags: {
    all: ['tags'] as const,
    list: () => [...QUERY_KEYS.tags.all, 'list'] as const,
  },
  stats: {
    all: ['stats'] as const,
    daily: (date: string) => [...QUERY_KEYS.stats.all, 'daily', date] as const,
    weekly: (weekStart: string) => [...QUERY_KEYS.stats.all, 'weekly', weekStart] as const,
    heatmap: (year: number) => [...QUERY_KEYS.stats.all, 'heatmap', year] as const,
  },
  user: {
    me: ['user', 'me'] as const,
    achievements: ['user', 'achievements'] as const,
  },
  focusSessions: {
    all: ['focus-sessions'] as const,
    list: () => [...QUERY_KEYS.focusSessions.all, 'list'] as const,
  },
};

export const STORAGE_KEYS = {
  authToken: 'auth_token',
  refreshToken: 'refresh_token',
  userId: 'user_id',
  colorScheme: 'color_scheme',
  accentColor: 'accent_color',
  tasks: 'tasks',
  projects: 'projects',
  tags: 'tags',
  pomodoroSettings: 'pomodoro_settings',
  onboardingCompleted: 'onboarding_completed',
  lastSyncAt: 'last_sync_at',
};
