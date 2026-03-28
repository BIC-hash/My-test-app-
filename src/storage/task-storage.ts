import { storageGet, storageSet } from './mmkv';
import { STORAGE_KEYS } from '../constants/storage-keys';
import type { Task, Project, Tag } from '../types';

export const taskStorage = {
  getTasks: () => storageGet<Task[]>(STORAGE_KEYS.tasks) ?? [],
  setTasks: (tasks: Task[]) => storageSet(STORAGE_KEYS.tasks, tasks),

  getProjects: () => storageGet<Project[]>(STORAGE_KEYS.projects) ?? [],
  setProjects: (projects: Project[]) => storageSet(STORAGE_KEYS.projects, projects),

  getTags: () => storageGet<Tag[]>(STORAGE_KEYS.tags) ?? [],
  setTags: (tags: Tag[]) => storageSet(STORAGE_KEYS.tags, tags),
};
