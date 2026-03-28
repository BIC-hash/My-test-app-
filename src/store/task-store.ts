import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
// Note: requires zustand >= 4.x and immer installed
import type { Task, Project, Tag, TaskFilter, TaskSortConfig } from '../types';
import { taskStorage } from '../storage';
import { format } from 'date-fns';

interface TaskState {
  tasks: Task[];
  projects: Project[];
  tags: Tag[];
  filter: TaskFilter;
  sort: TaskSortConfig;
  activeProjectId: string | null;
  selectedTaskIds: string[];

  // Actions
  loadFromStorage: () => void;
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  completeTask: (id: string) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  reorderTasks: (fromIndex: number, toIndex: number) => void;

  addProject: (project: Project) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;

  addTag: (tag: Tag) => void;
  updateTag: (id: string, updates: Partial<Tag>) => void;
  deleteTag: (id: string) => void;

  setFilter: (filter: Partial<TaskFilter>) => void;
  clearFilter: () => void;
  setSort: (sort: TaskSortConfig) => void;
  setActiveProject: (id: string | null) => void;
}

export const useTaskStore = create<TaskState>()(
  immer((set, get) => ({
    tasks: [],
    projects: [],
    tags: [],
    filter: {},
    sort: { field: 'sortOrder', direction: 'asc' },
    activeProjectId: null,
    selectedTaskIds: [],

    loadFromStorage: () => {
      set(state => {
        state.tasks = taskStorage.getTasks();
        state.projects = taskStorage.getProjects();
        state.tags = taskStorage.getTags();
      });
    },

    addTask: (task) => {
      set(state => { state.tasks.unshift(task); });
      taskStorage.setTasks(get().tasks);
    },

    updateTask: (id, updates) => {
      set(state => {
        const idx = state.tasks.findIndex(t => t.id === id);
        if (idx !== -1) Object.assign(state.tasks[idx], updates, { updatedAt: new Date().toISOString() });
      });
      taskStorage.setTasks(get().tasks);
    },

    deleteTask: (id) => {
      set(state => { state.tasks = state.tasks.filter(t => t.id !== id); });
      taskStorage.setTasks(get().tasks);
    },

    completeTask: (id) => {
      set(state => {
        const task = state.tasks.find(t => t.id === id);
        if (task) {
          task.status = task.status === 'done' ? 'todo' : 'done';
          task.completedAt = task.status === 'done' ? new Date().toISOString() : undefined;
          task.updatedAt = new Date().toISOString();
        }
      });
      taskStorage.setTasks(get().tasks);
    },

    toggleSubtask: (taskId, subtaskId) => {
      set(state => {
        const task = state.tasks.find(t => t.id === taskId);
        if (task) {
          const sub = task.subtasks.find(s => s.id === subtaskId);
          if (sub) sub.completed = !sub.completed;
          task.updatedAt = new Date().toISOString();
        }
      });
      taskStorage.setTasks(get().tasks);
    },

    reorderTasks: (fromIndex, toIndex) => {
      set(state => {
        const [removed] = state.tasks.splice(fromIndex, 1);
        state.tasks.splice(toIndex, 0, removed);
        state.tasks.forEach((t, i) => { t.sortOrder = i; });
      });
      taskStorage.setTasks(get().tasks);
    },

    addProject: (project) => {
      set(state => { state.projects.push(project); });
      taskStorage.setProjects(get().projects);
    },

    updateProject: (id, updates) => {
      set(state => {
        const idx = state.projects.findIndex(p => p.id === id);
        if (idx !== -1) Object.assign(state.projects[idx], updates, { updatedAt: new Date().toISOString() });
      });
      taskStorage.setProjects(get().projects);
    },

    deleteProject: (id) => {
      set(state => {
        state.projects = state.projects.filter(p => p.id !== id);
        state.tasks.forEach(t => { if (t.projectId === id) t.projectId = undefined; });
      });
      taskStorage.setProjects(get().projects);
      taskStorage.setTasks(get().tasks);
    },

    addTag: (tag) => {
      set(state => { state.tags.push(tag); });
      taskStorage.setTags(get().tags);
    },

    updateTag: (id, updates) => {
      set(state => {
        const idx = state.tags.findIndex(t => t.id === id);
        if (idx !== -1) Object.assign(state.tags[idx], updates);
      });
      taskStorage.setTags(get().tags);
    },

    deleteTag: (id) => {
      set(state => {
        state.tags = state.tags.filter(t => t.id !== id);
        state.tasks.forEach(t => { t.tagIds = t.tagIds.filter(tid => tid !== id); });
      });
      taskStorage.setTags(get().tags);
      taskStorage.setTasks(get().tasks);
    },

    setFilter: (filter) => {
      set(state => { state.filter = { ...state.filter, ...filter }; });
    },

    clearFilter: () => {
      set(state => { state.filter = {}; });
    },

    setSort: (sort) => {
      set(state => { state.sort = sort; });
    },

    setActiveProject: (id) => {
      set(state => { state.activeProjectId = id; });
    },
  })),
);
