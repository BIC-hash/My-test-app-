export type ProjectColor =
  | '#EF4444' | '#F97316' | '#EAB308' | '#22C55E'
  | '#06B6D4' | '#3B82F6' | '#8B5CF6' | '#EC4899'
  | '#6B7280';

export type ProjectIcon =
  | 'briefcase' | 'home' | 'heart' | 'star'
  | 'book' | 'code' | 'shopping-cart' | 'music'
  | 'camera' | 'globe' | 'zap' | 'target';

export interface Project {
  id: string;
  name: string;
  description?: string;
  color: ProjectColor;
  icon: ProjectIcon;
  isArchived: boolean;
  isFavorite: boolean;
  sortOrder: number;
  taskCount: number;
  completedTaskCount: number;
  createdAt: string;
  updatedAt: string;
}
