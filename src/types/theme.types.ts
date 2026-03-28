export type ColorScheme = 'light' | 'dark' | 'oled' | 'system';
export type AccentColor = 'violet' | 'blue' | 'green' | 'orange' | 'pink' | 'red' | 'teal';

export interface AppTheme {
  colors: ThemeColors;
  spacing: ThemeSpacing;
  typography: ThemeTypography;
  radius: ThemeRadius;
  shadows: ThemeShadows;
}

export interface ThemeColors {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  background: string;
  surface: string;
  surfaceVariant: string;
  card: string;
  text: string;
  textSecondary: string;
  textTertiary: string;
  textInverse: string;
  border: string;
  borderLight: string;
  separator: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  urgent: string;
  high: string;
  medium: string;
  low: string;
  overlay: string;
  tabBar: string;
  tabBarBorder: string;
  skeleton: string;
  ripple: string;
}

export interface ThemeSpacing {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
}

export interface ThemeTypography {
  displayLarge: number;
  displayMedium: number;
  headlineLarge: number;
  headlineMedium: number;
  headlineSmall: number;
  titleLarge: number;
  titleMedium: number;
  titleSmall: number;
  bodyLarge: number;
  bodyMedium: number;
  bodySmall: number;
  labelLarge: number;
  labelMedium: number;
  labelSmall: number;
}

export interface ThemeRadius {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  full: number;
}

export interface ThemeShadows {
  sm: object;
  md: object;
  lg: object;
}
