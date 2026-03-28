import type { AppTheme, AccentColor } from '../types';
import { ACCENT_PALETTES } from './accent-colors';

const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 };
const typography = {
  displayLarge: 57, displayMedium: 45,
  headlineLarge: 32, headlineMedium: 28, headlineSmall: 24,
  titleLarge: 22, titleMedium: 16, titleSmall: 14,
  bodyLarge: 16, bodyMedium: 14, bodySmall: 12,
  labelLarge: 14, labelMedium: 12, labelSmall: 11,
};
const radius = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, full: 9999 };

export function buildTheme(scheme: 'light' | 'dark' | 'oled', accent: AccentColor): AppTheme {
  const palette = ACCENT_PALETTES[accent];
  const isDark = scheme === 'dark' || scheme === 'oled';
  const isOled = scheme === 'oled';

  const colors = isDark
    ? {
        primary: palette.primary,
        primaryLight: palette.dark,
        primaryDark: palette.dark,
        background: isOled ? '#000000' : '#0F0F0F',
        surface: isOled ? '#0A0A0A' : '#1A1A1A',
        surfaceVariant: isOled ? '#111111' : '#242424',
        card: isOled ? '#111111' : '#1F1F1F',
        text: '#F5F5F5',
        textSecondary: '#A3A3A3',
        textTertiary: '#6B6B6B',
        textInverse: '#0F0F0F',
        border: '#2A2A2A',
        borderLight: '#1F1F1F',
        separator: '#1F1F1F',
        success: '#22C55E',
        warning: '#EAB308',
        error: '#EF4444',
        info: '#3B82F6',
        urgent: '#EF4444',
        high: '#F97316',
        medium: '#EAB308',
        low: '#22C55E',
        overlay: 'rgba(0,0,0,0.7)',
        tabBar: isOled ? '#000000' : '#0F0F0F',
        tabBarBorder: '#1A1A1A',
        skeleton: '#2A2A2A',
        ripple: 'rgba(255,255,255,0.08)',
      }
    : {
        primary: palette.primary,
        primaryLight: palette.light,
        primaryDark: palette.dark,
        background: '#FAFAFA',
        surface: '#FFFFFF',
        surfaceVariant: '#F4F4F5',
        card: '#FFFFFF',
        text: '#111111',
        textSecondary: '#6B7280',
        textTertiary: '#9CA3AF',
        textInverse: '#FFFFFF',
        border: '#E5E7EB',
        borderLight: '#F3F4F6',
        separator: '#F3F4F6',
        success: '#16A34A',
        warning: '#D97706',
        error: '#DC2626',
        info: '#2563EB',
        urgent: '#DC2626',
        high: '#EA580C',
        medium: '#D97706',
        low: '#16A34A',
        overlay: 'rgba(0,0,0,0.4)',
        tabBar: '#FFFFFF',
        tabBarBorder: '#E5E7EB',
        skeleton: '#F3F4F6',
        ripple: 'rgba(0,0,0,0.06)',
      };

  const shadows = isDark
    ? {
        sm: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.4, shadowRadius: 3, elevation: 2 },
        md: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.5, shadowRadius: 8, elevation: 5 },
        lg: { shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.6, shadowRadius: 16, elevation: 10 },
      }
    : {
        sm: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 3, elevation: 2 },
        md: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 5 },
        lg: { shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.10, shadowRadius: 16, elevation: 10 },
      };

  return { colors, spacing, typography, radius, shadows };
}

export const lightTheme = (accent: AccentColor = 'violet') => buildTheme('light', accent);
export const darkTheme  = (accent: AccentColor = 'violet') => buildTheme('dark', accent);
export const oledTheme  = (accent: AccentColor = 'violet') => buildTheme('oled', accent);
