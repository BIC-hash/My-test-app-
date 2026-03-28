export interface DailyStats {
  date: string;
  completed: number;
  created: number;
  focusMinutes: number;
  pomodoroSessions: number;
}

export interface WeeklyStats {
  weekStart: string;
  totalCompleted: number;
  totalCreated: number;
  completionRate: number;
  focusHours: number;
  averagePerDay: number;
  byPriority: Record<string, number>;
  byProject: Record<string, number>;
}

export interface ProductivityScore {
  score: number;
  label: 'excellent' | 'good' | 'average' | 'low';
  trend: 'up' | 'down' | 'stable';
  trendPercent: number;
}

export interface FocusSession {
  id: string;
  taskId?: string;
  startedAt: string;
  endedAt?: string;
  durationMinutes: number;
  type: 'pomodoro' | 'freeform';
  completed: boolean;
}
