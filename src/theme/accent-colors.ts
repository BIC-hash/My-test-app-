import type { AccentColor } from '../types';

export const ACCENT_PALETTES: Record<AccentColor, { primary: string; light: string; dark: string }> = {
  violet: { primary: '#8B5CF6', light: '#EDE9FE', dark: '#6D28D9' },
  blue:   { primary: '#3B82F6', light: '#DBEAFE', dark: '#1D4ED8' },
  green:  { primary: '#22C55E', light: '#DCFCE7', dark: '#15803D' },
  orange: { primary: '#F97316', light: '#FFEDD5', dark: '#C2410C' },
  pink:   { primary: '#EC4899', light: '#FCE7F3', dark: '#BE185D' },
  red:    { primary: '#EF4444', light: '#FEE2E2', dark: '#B91C1C' },
  teal:   { primary: '#14B8A6', light: '#CCFBF1', dark: '#0F766E' },
};

export const DEFAULT_ACCENT: AccentColor = 'violet';
