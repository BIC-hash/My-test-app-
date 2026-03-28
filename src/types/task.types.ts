export type Priority = 'urgent' | 'high' | 'medium' | 'low' | 'none';
export type TaskStatus = 'todo' | 'in_progress' | 'done' | 'archived';
export type RecurrenceFrequency = 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
  icon?: string;
}

export interface TaskAttachment {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'file' | 'link';
  size?: number;
}

export interface RecurrenceRule {
  frequency: RecurrenceFrequency;
  interval: number;
  daysOfWeek?: number[];
  endDate?: string;
  count?: number;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  projectId?: string;
  tagIds: string[];
  subtasks: Subtask[];
  attachments: TaskAttachment[];
  dueDate?: string;
  dueTime?: string;
  reminderMinutes?: number;
  recurrence?: RecurrenceRule;
  estimatedMinutes?: number;
  actualMinutes?: number;
  notes?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
  sortOrder: number;
  isFavorite: boolean;
  isTemplate: boolean;
  parentTaskId?: string;
}

export interface TaskFilter {
  status?: TaskStatus[];
  priority?: Priority[];
  projectIds?: string[];
  tagIds?: string[];
  dueBefore?: string;
  dueAfter?: string;
  search?: string;
}

export type TaskSortField = 'dueDate' | 'priority' | 'createdAt' | 'title' | 'sortOrder';
export type SortDirection = 'asc' | 'desc';

export interface TaskSortConfig {
  field: TaskSortField;
  direction: SortDirection;
}
