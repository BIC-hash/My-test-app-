import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { moderateScale } from 'react-native-size-matters';
import { Feather } from '@expo/vector-icons';
import { useAppTheme } from '../../theme';
import { useStyles, useAppNavigation } from '../../hooks';
import type { AppTheme } from '../../types';

const SETTINGS_SECTIONS = [
  {
    title: 'Personalization',
    items: [
      { icon: 'sun', label: 'Appearance', screen: 'AppearanceSettings', description: 'Theme, dark mode, accent color' },
    ],
  },
  {
    title: 'Notifications',
    items: [
      { icon: 'bell', label: 'Notifications', screen: 'NotificationSettings', description: 'Reminders, alerts, badges' },
    ],
  },
  {
    title: 'Account & Data',
    items: [
      { icon: 'user', label: 'Account', screen: 'AccountSettings', description: 'Profile, email, password' },
      { icon: 'database', label: 'Data & Backup', screen: 'DataSettings', description: 'Export, import, sync' },
    ],
  },
];

export default function SettingsScreen() {
  const { theme } = useAppTheme();
  const styles = useStyles(makeStyles);
  const insets = useSafeAreaInsets();
  const navigation = useAppNavigation();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingTop: insets.top + moderateScale(8), paddingBottom: insets.bottom + moderateScale(40) }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Feather name="arrow-left" size={moderateScale(24)} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.heading}>Settings</Text>
        <View style={{ width: moderateScale(44) }} />
      </View>

      {SETTINGS_SECTIONS.map(section => (
        <View key={section.title} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <View style={[styles.sectionCard, { ...theme.shadows.sm as object }]}>
            {section.items.map((item, i) => (
              <TouchableOpacity
                key={item.label}
                style={[styles.item, i > 0 && styles.itemBorder]}
                onPress={() => navigation.navigate(item.screen as any)}
                activeOpacity={0.7}
              >
                <View style={[styles.itemIcon, { backgroundColor: theme.colors.primaryLight }]}>
                  <Feather name={item.icon as any} size={moderateScale(18)} color={theme.colors.primary} />
                </View>
                <View style={styles.itemContent}>
                  <Text style={styles.itemLabel}>{item.label}</Text>
                  <Text style={styles.itemDesc}>{item.description}</Text>
                </View>
                <Feather name="chevron-right" size={moderateScale(18)} color={theme.colors.textTertiary} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}

      <Text style={styles.version}>TaskPro v1.0.0</Text>
    </ScrollView>
  );
}

const makeStyles = (theme: AppTheme) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  headerRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: moderateScale(16), marginBottom: moderateScale(8) },
  heading: { flex: 1, fontSize: theme.typography.headlineMedium, fontWeight: '700', color: theme.colors.text, textAlign: 'center' },
  section: { paddingHorizontal: moderateScale(16), marginBottom: moderateScale(20) },
  sectionTitle: { fontSize: theme.typography.labelLarge, fontWeight: '600', color: theme.colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: moderateScale(8) },
  sectionCard: { backgroundColor: theme.colors.card, borderRadius: theme.radius.xl, overflow: 'hidden' },
  item: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: moderateScale(16), height: moderateScale(64), gap: moderateScale(14) },
  itemBorder: { borderTopWidth: 1, borderTopColor: theme.colors.separator },
  itemIcon: { width: moderateScale(36), height: moderateScale(36), borderRadius: theme.radius.sm, alignItems: 'center', justifyContent: 'center' },
  itemContent: { flex: 1 },
  itemLabel: { fontSize: theme.typography.bodyLarge, fontWeight: '500', color: theme.colors.text },
  itemDesc: { fontSize: theme.typography.bodySmall, color: theme.colors.textSecondary },
  version: { textAlign: 'center', fontSize: theme.typography.labelSmall, color: theme.colors.textTertiary, marginTop: moderateScale(8) },
});
