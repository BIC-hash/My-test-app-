import type { Task } from '../types';

export function getSubtaskProgress(task: Task): { completed: number; total: number; percent: number } {
  const total = task.subtasks.length;
  const completed = task.subtasks.filter(s => s.completed).length;
  return { completed, total, percent: total > 0 ? completed / total : 0 };
}

export function createEmptyTask(overrides: Partial<Task> = {}): Omit<Task, 'id'> {
  return {
    title: '',
    status: 'todo',
    priority: 'none',
    tagIds: [],
    subtasks: [],
    attachments: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    sortOrder: Date.now(),
    isFavorite: false,
    isTemplate: false,
    ...overrides,
  };
}
