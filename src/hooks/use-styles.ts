import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useAppTheme } from '../theme';
import type { AppTheme } from '../types';

export function useStyles<T extends StyleSheet.NamedStyles<T>>(
  factory: (theme: AppTheme) => T,
): T {
  const { theme } = useAppTheme();
  return useMemo(() => StyleSheet.create(factory(theme)), [theme]);
}
