import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { moderateScale } from 'react-native-size-matters';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppTheme } from '../../theme';
import { useStyles, useAppNavigation } from '../../hooks';
import { useAuthStore } from '../../store/auth-store';
import { useTaskStore } from '../../store/task-store';
import type { AppTheme } from '../../types';

const MENU_ITEMS = [
  { icon: 'bar-chart-2', label: 'Statistics', screen: 'Statistics' },
  { icon: 'award', label: 'Achievements', screen: 'Achievements' },
  { icon: 'calendar', label: 'Calendar', screen: 'Calendar' },
  { icon: 'layers', label: 'Eisenhower Matrix', screen: 'Eisenhower' },
  { icon: 'settings', label: 'Settings', screen: 'Settings' },
] as const;

export default function ProfileScreen() {
  const { theme } = useAppTheme();
  const styles = useStyles(makeStyles);
  const insets = useSafeAreaInsets();
  const navigation = useAppNavigation();
  const user = useAuthStore(s => s.user);
  const logout = useAuthStore(s => s.logout);
  const tasks = useTaskStore(s => s.tasks);

  const completedCount = tasks.filter(t => t.status === 'done').length;
  const totalCount = tasks.length;
  const xpProgress = user ? user.xp / user.xpToNextLevel : 0;

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: insets.bottom + moderateScale(40) }}
      showsVerticalScrollIndicator={false}
    >
      {/* Hero */}
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.primaryDark]}
        style={[styles.hero, { paddingTop: insets.top + moderateScale(20) }]}
      >
        <View style={styles.avatarRing}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user?.name?.[0]?.toUpperCase() ?? '?'}</Text>
          </View>
        </View>
        <Text style={styles.name}>{user?.name ?? 'User'}</Text>
        <Text style={styles.email}>{user?.email ?? ''}</Text>

        <View style={styles.levelRow}>
          <Text style={styles.levelText}>Level {user?.level ?? 1}</Text>
          <View style={styles.xpBar}>
            <View style={[styles.xpFill, { width: `${xpProgress * 100}%` }]} />
          </View>
          <Text style={styles.xpText}>{user?.xp ?? 0} / {user?.xpToNextLevel ?? 100}</Text>
        </View>
      </LinearGradient>

      {/* Quick stats */}
      <View style={styles.statsRow}>
        {[
          { value: user?.streakDays ?? 0, label: 'Day Streak', emoji: '🔥' },
          { value: completedCount, label: 'Completed', emoji: '✅' },
          { value: user?.longestStreak ?? 0, label: 'Best Streak', emoji: '⚡' },
        ].map(item => (
          <View key={item.label} style={styles.statCard}>
            <Text style={styles.statEmoji}>{item.emoji}</Text>
            <Text style={styles.statValue}>{item.value}</Text>
            <Text style={styles.statLabel}>{item.label}</Text>
          </View>
        ))}
      </View>

      {/* Menu */}
      <View style={[styles.menu, { ...theme.shadows.sm as object }]}>
        {MENU_ITEMS.map((item, i) => (
          <TouchableOpacity
            key={item.label}
            style={[styles.menuItem, i > 0 && styles.menuItemBorder]}
            onPress={() => navigation.navigate(item.screen as any)}
            activeOpacity={0.7}
          >
            <View style={[styles.menuIcon, { backgroundColor: theme.colors.primaryLight }]}>
              <Feather name={item.icon} size={moderateScale(18)} color={theme.colors.primary} />
            </View>
            <Text style={styles.menuLabel}>{item.label}</Text>
            <Feather name="chevron-right" size={moderateScale(18)} color={theme.colors.textTertiary} />
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={[styles.logoutBtn, { borderColor: theme.colors.error }]} onPress={handleLogout}>
        <Feather name="log-out" size={moderateScale(18)} color={theme.colors.error} />
        <Text style={[styles.logoutText, { color: theme.colors.error }]}>Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const makeStyles = (theme: AppTheme) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  hero: { alignItems: 'center', paddingBottom: moderateScale(28), paddingHorizontal: moderateScale(20) },
  avatarRing: { width: moderateScale(88), height: moderateScale(88), borderRadius: moderateScale(44), borderWidth: 3, borderColor: 'rgba(255,255,255,0.5)', alignItems: 'center', justifyContent: 'center', marginBottom: moderateScale(12) },
  avatar: { width: moderateScale(76), height: moderateScale(76), borderRadius: moderateScale(38), backgroundColor: 'rgba(255,255,255,0.25)', alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: moderateScale(32), fontWeight: '700', color: '#fff' },
  name: { fontSize: theme.typography.headlineSmall, fontWeight: '700', color: '#fff', marginBottom: moderateScale(4) },
  email: { fontSize: theme.typography.bodyMedium, color: 'rgba(255,255,255,0.7)', marginBottom: moderateScale(16) },
  levelRow: { width: '100%', gap: moderateScale(6) },
  levelText: { fontSize: theme.typography.labelLarge, fontWeight: '600', color: 'rgba(255,255,255,0.9)' },
  xpBar: { height: moderateScale(6), backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: moderateScale(3), overflow: 'hidden' },
  xpFill: { height: '100%', backgroundColor: '#fff', borderRadius: moderateScale(3) },
  xpText: { fontSize: theme.typography.labelSmall, color: 'rgba(255,255,255,0.65)', textAlign: 'right' },
  statsRow: { flexDirection: 'row', paddingHorizontal: moderateScale(16), paddingVertical: moderateScale(16), gap: moderateScale(10) },
  statCard: { flex: 1, backgroundColor: theme.colors.card, borderRadius: theme.radius.lg, padding: moderateScale(14), alignItems: 'center', gap: moderateScale(4) },
  statEmoji: { fontSize: moderateScale(22) },
  statValue: { fontSize: theme.typography.titleLarge, fontWeight: '700', color: theme.colors.text },
  statLabel: { fontSize: theme.typography.labelSmall, color: theme.colors.textSecondary, textAlign: 'center' },
  menu: { marginHorizontal: moderateScale(16), backgroundColor: theme.colors.card, borderRadius: theme.radius.xl, overflow: 'hidden', marginBottom: moderateScale(16) },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: moderateScale(16), height: moderateScale(60), gap: moderateScale(14) },
  menuItemBorder: { borderTopWidth: 1, borderTopColor: theme.colors.separator },
  menuIcon: { width: moderateScale(36), height: moderateScale(36), borderRadius: theme.radius.sm, alignItems: 'center', justifyContent: 'center' },
  menuLabel: { flex: 1, fontSize: theme.typography.bodyLarge, color: theme.colors.text },
  logoutBtn: { marginHorizontal: moderateScale(16), flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: moderateScale(52), borderRadius: theme.radius.lg, borderWidth: 1.5, gap: moderateScale(8) },
  logoutText: { fontSize: theme.typography.bodyLarge, fontWeight: '600' },
});
