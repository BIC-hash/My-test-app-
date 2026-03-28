import { useContext } from 'react';
import { ThemeContext } from '../providers/theme-provider';

export function useAppTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useAppTheme must be used inside ThemeProvider');
  return ctx;
}
