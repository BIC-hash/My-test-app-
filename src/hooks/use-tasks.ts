import { useMemo } from 'react';
import { isToday, isTomorrow, isPast, startOfDay, endOfDay, addDays } from 'date-fns';
import { useTaskStore } from '../store/task-store';
import type { Task, TaskFilter, TaskSortConfig } from '../types';
import { PRIORITY_CONFIG } from '../constants';

function applyFilter(tasks: Task[], filter: TaskFilter): Task[] {
  return tasks.filter(task => {
    if (filter.status?.length && !filter.status.includes(task.status)) return false;
    if (filter.priority?.length && !filter.priority.includes(task.priority)) return false;
    if (filter.projectIds?.length && (!task.projectId || !filter.projectIds.includes(task.projectId))) return false;
    if (filter.tagIds?.length && !filter.tagIds.some(id => task.tagIds.includes(id))) return false;
    if (filter.search) {
      const q = filter.search.toLowerCase();
      if (!task.title.toLowerCase().includes(q) && !task.description?.toLowerCase().includes(q)) return false;
    }
    if (filter.dueBefore && task.dueDate && task.dueDate > filter.dueBefore) return false;
    if (filter.dueAfter && task.dueDate && task.dueDate < filter.dueAfter) return false;
    return true;
  });
}

function applySort(tasks: Task[], sort: TaskSortConfig): Task[] {
  return [...tasks].sort((a, b) => {
    let result = 0;
    switch (sort.field) {
      case 'priority':
        result = PRIORITY_CONFIG[a.priority].order - PRIORITY_CONFIG[b.priority].order;
        break;
      case 'dueDate':
        if (!a.dueDate && !b.dueDate) result = 0;
        else if (!a.dueDate) result = 1;
        else if (!b.dueDate) result = -1;
        else result = a.dueDate.localeCompare(b.dueDate);
        break;
      case 'createdAt':
        result = b.createdAt.localeCompare(a.createdAt);
        break;
      case 'title':
        result = a.title.localeCompare(b.title);
        break;
      default:
        result = a.sortOrder - b.sortOrder;
    }
    return sort.direction === 'desc' ? -result : result;
  });
}

export function useTasks() {
  const { tasks, filter, sort } = useTaskStore();

  const activeTasks = useMemo(
    () => tasks.filter(t => t.status !== 'archived'),
    [tasks],
  );

  const filteredTasks = useMemo(
    () => applySort(applyFilter(activeTasks, filter), sort),
    [activeTasks, filter, sort],
  );

  const todayTasks = useMemo(
    () => activeTasks.filter(t => t.dueDate && isToday(new Date(t.dueDate)) && t.status !== 'done'),
    [activeTasks],
  );

  const overdueTasks = useMemo(
    () => activeTasks.filter(t => t.dueDate && isPast(endOfDay(new Date(t.dueDate))) && t.status !== 'done'),
    [activeTasks],
  );

  const upcomingTasks = useMemo(() => {
    const today = startOfDay(new Date());
    const in7days = addDays(today, 7);
    return activeTasks
      .filter(t => t.dueDate && new Date(t.dueDate) >= today && new Date(t.dueDate) <= in7days && t.status !== 'done')
      .sort((a, b) => a.dueDate!.localeCompare(b.dueDate!));
  }, [activeTasks]);

  const inboxTasks = useMemo(
    () => activeTasks.filter(t => !t.projectId && t.status !== 'done'),
    [activeTasks],
  );

  return { tasks: filteredTasks, todayTasks, overdueTasks, upcomingTasks, inboxTasks, allTasks: tasks };
}
