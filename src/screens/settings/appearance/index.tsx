import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { moderateScale } from 'react-native-size-matters';
import { Feather } from '@expo/vector-icons';
import { useAppTheme } from '../../../theme';
import { useStyles, useAppNavigation } from '../../../hooks';
import { ACCENT_PALETTES } from '../../../theme/accent-colors';
import type { AppTheme, ColorScheme, AccentColor } from '../../../types';

const SCHEME_OPTIONS: { value: ColorScheme; label: string; icon: string }[] = [
  { value: 'light', label: 'Light', icon: 'sun' },
  { value: 'dark', label: 'Dark', icon: 'moon' },
  { value: 'oled', label: 'OLED Black', icon: 'circle' },
  { value: 'system', label: 'System', icon: 'smartphone' },
];

const ACCENT_OPTIONS = Object.keys(ACCENT_PALETTES) as AccentColor[];

export default function AppearanceSettingsScreen() {
  const { theme, isDark, colorScheme, accentColor, setColorScheme, setAccentColor } = useAppTheme();
  const styles = useStyles(makeStyles);
  const insets = useSafeAreaInsets();
  const navigation = useAppNavigation();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingTop: insets.top + moderateScale(8), paddingBottom: insets.bottom + moderateScale(40) }}
    >
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Feather name="arrow-left" size={moderateScale(24)} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.heading}>Appearance</Text>
        <View style={{ width: moderateScale(44) }} />
      </View>

      {/* Theme */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Color Scheme</Text>
        <View style={[styles.card, { ...theme.shadows.sm as object }]}>
          {SCHEME_OPTIONS.map((opt, i) => (
            <TouchableOpacity
              key={opt.value}
              style={[styles.option, i > 0 && styles.optionBorder]}
              onPress={() => setColorScheme(opt.value)}
            >
              <Feather name={opt.icon as any} size={moderateScale(20)} color={theme.colors.textSecondary} />
              <Text style={styles.optionLabel}>{opt.label}</Text>
              {colorScheme === opt.value && (
                <Feather name="check" size={moderateScale(20)} color={theme.colors.primary} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Accent color */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Accent Color</Text>
        <View style={[styles.card, styles.accentGrid, { ...theme.shadows.sm as object }]}>
          {ACCENT_OPTIONS.map(color => {
            const palette = ACCENT_PALETTES[color];
            const selected = accentColor === color;
            return (
              <TouchableOpacity
                key={color}
                style={styles.accentItem}
                onPress={() => setAccentColor(color)}
              >
                <View style={[styles.accentDot, { backgroundColor: palette.primary }, selected && styles.accentDotSelected]}>
                  {selected && <Feather name="check" size={moderateScale(14)} color="#fff" />}
                </View>
                <Text style={styles.accentLabel}>{color[0].toUpperCase() + color.slice(1)}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
}

const makeStyles = (theme: AppTheme) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  headerRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: moderateScale(16), marginBottom: moderateScale(8) },
  heading: { flex: 1, fontSize: theme.typography.headlineMedium, fontWeight: '700', color: theme.colors.text, textAlign: 'center' },
  section: { paddingHorizontal: moderateScale(16), marginBottom: moderateScale(20) },
  sectionTitle: { fontSize: theme.typography.labelLarge, fontWeight: '600', color: theme.colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: moderateScale(8) },
  card: { backgroundColor: theme.colors.card, borderRadius: theme.radius.xl, overflow: 'hidden' },
  option: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: moderateScale(16), height: moderateScale(52), gap: moderateScale(14) },
  optionBorder: { borderTopWidth: 1, borderTopColor: theme.colors.separator },
  optionLabel: { flex: 1, fontSize: theme.typography.bodyLarge, color: theme.colors.text },
  accentGrid: { flexDirection: 'row', flexWrap: 'wrap', padding: moderateScale(16), gap: moderateScale(16) },
  accentItem: { alignItems: 'center', gap: moderateScale(6) },
  accentDot: { width: moderateScale(44), height: moderateScale(44), borderRadius: moderateScale(22), alignItems: 'center', justifyContent: 'center' },
  accentDotSelected: { borderWidth: 3, borderColor: 'rgba(255,255,255,0.6)', transform: [{ scale: 1.1 }] },
  accentLabel: { fontSize: theme.typography.labelSmall, color: theme.colors.textSecondary },
});
