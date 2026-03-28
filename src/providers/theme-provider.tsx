import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import type { AppTheme, ColorScheme, AccentColor } from '../types';
import { buildTheme } from '../theme/theme';
import { settingsStorage } from '../storage';

interface ThemeContextValue {
  theme: AppTheme;
  colorScheme: ColorScheme;
  accentColor: AccentColor;
  isDark: boolean;
  setColorScheme: (scheme: ColorScheme) => void;
  setAccentColor: (color: AccentColor) => void;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [colorScheme, setColorSchemeState] = useState<ColorScheme>(settingsStorage.getColorScheme());
  const [accentColor, setAccentColorState] = useState<AccentColor>(settingsStorage.getAccentColor());

  const resolvedScheme = useMemo<'light' | 'dark' | 'oled'>(() => {
    if (colorScheme === 'system') return systemScheme === 'dark' ? 'dark' : 'light';
    return colorScheme as 'light' | 'dark' | 'oled';
  }, [colorScheme, systemScheme]);

  const theme = useMemo(() => buildTheme(resolvedScheme, accentColor), [resolvedScheme, accentColor]);
  const isDark = resolvedScheme === 'dark' || resolvedScheme === 'oled';

  const setColorScheme = useCallback((scheme: ColorScheme) => {
    settingsStorage.setColorScheme(scheme);
    setColorSchemeState(scheme);
  }, []);

  const setAccentColor = useCallback((color: AccentColor) => {
    settingsStorage.setAccentColor(color);
    setAccentColorState(color);
  }, []);

  const value = useMemo(
    () => ({ theme, colorScheme, accentColor, isDark, setColorScheme, setAccentColor }),
    [theme, colorScheme, accentColor, isDark, setColorScheme, setAccentColor],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
