import type { Priority } from '../types';

export const PRIORITY_CONFIG: Record<Priority, { label: string; color: string; icon: string; order: number }> = {
  urgent: { label: 'Urgent', color: '#EF4444', icon: 'alert-circle', order: 0 },
  high:   { label: 'High',   color: '#F97316', icon: 'arrow-up-circle', order: 1 },
  medium: { label: 'Medium', color: '#EAB308', icon: 'minus-circle', order: 2 },
  low:    { label: 'Low',    color: '#22C55E', icon: 'arrow-down-circle', order: 3 },
  none:   { label: 'None',   color: '#6B7280', icon: 'circle', order: 4 },
};

export const PRIORITY_OPTIONS: Priority[] = ['urgent', 'high', 'medium', 'low', 'none'];
