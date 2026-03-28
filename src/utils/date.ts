import { format, isToday, isTomorrow, isYesterday, isPast, differenceInDays } from 'date-fns';

export function formatDueDate(dateStr: string): { label: string; isOverdue: boolean; isUrgent: boolean } {
  const date = new Date(dateStr);
  const overdue = isPast(date) && !isToday(date);
  const urgent = !overdue && differenceInDays(date, new Date()) <= 1;

  let label: string;
  if (isToday(date)) label = 'Today';
  else if (isTomorrow(date)) label = 'Tomorrow';
  else if (isYesterday(date)) label = 'Yesterday';
  else if (differenceInDays(date, new Date()) < 7) label = format(date, 'EEEE');
  else label = format(date, 'MMM d');

  return { label, isOverdue: overdue, isUrgent: urgent };
}

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export function getWeekStart(date: Date = new Date()): Date {
  const d = new Date(date);
  d.setDate(d.getDate() - d.getDay());
  d.setHours(0, 0, 0, 0);
  return d;
}
