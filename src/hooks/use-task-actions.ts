import { useCallback } from 'react';
import { useTaskStore } from '../store/task-store';
import { useAuthStore } from '../store/auth-store';
import { useHaptics } from './use-haptics';
import { GAMIFICATION } from '../constants/layout';
import { PRIORITY_CONFIG } from '../constants';
import type { Task } from '../types';

export function useTaskActions() {
  const { completeTask, deleteTask, updateTask } = useTaskStore();
  const addXp = useAuthStore(s => s.addXp);
  const haptics = useHaptics();

  const handleComplete = useCallback((task: Task) => {
    const wasCompleted = task.status === 'done';
    completeTask(task.id);
    if (!wasCompleted) {
      haptics.success();
      const xp = task.priority === 'urgent'
        ? GAMIFICATION.xpPerUrgentTask
        : GAMIFICATION.xpPerTask;
      addXp(xp);
    } else {
      haptics.light();
    }
  }, [completeTask, addXp, haptics]);

  const handleDelete = useCallback((id: string) => {
    haptics.medium();
    deleteTask(id);
  }, [deleteTask, haptics]);

  const handleFavorite = useCallback((task: Task) => {
    haptics.light();
    updateTask(task.id, { isFavorite: !task.isFavorite });
  }, [updateTask, haptics]);

  return { handleComplete, handleDelete, handleFavorite };
}
