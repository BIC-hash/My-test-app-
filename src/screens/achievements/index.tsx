import React, { useMemo } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { moderateScale } from 'react-native-size-matters';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppTheme } from '../../theme';
import { useStyles } from '../../hooks';
import { useAuthStore } from '../../store/auth-store';
import { useTaskStore } from '../../store/task-store';
import { useFocusStore } from '../../store/focus-store';
import type { AppTheme, Achievement } from '../../types';

function buildAchievements(
  completedCount: number,
  streakDays: number,
  focusSessions: number,
): Achievement[] {
  return [
    { id: 'first_task', title: 'First Step', description: 'Complete your first task', icon: '🎯', unlockedAt: completedCount >= 1 ? 'unlocked' : undefined, progress: Math.min(completedCount, 1), maxProgress: 1, xpReward: 10, category: 'completion' },
    { id: '10_tasks', title: 'Getting Momentum', description: 'Complete 10 tasks', icon: '⚡', unlockedAt: completedCount >= 10 ? 'unlocked' : undefined, progress: Math.min(completedCount, 10), maxProgress: 10, xpReward: 50, category: 'completion' },
    { id: '50_tasks', title: 'Productivity Pro', description: 'Complete 50 tasks', icon: '🏆', unlockedAt: completedCount >= 50 ? 'unlocked' : undefined, progress: Math.min(completedCount, 50), maxProgress: 50, xpReward: 150, category: 'completion' },
    { id: '100_tasks', title: 'Centurion', description: 'Complete 100 tasks', icon: '💯', unlockedAt: completedCount >= 100 ? 'unlocked' : undefined, progress: Math.min(completedCount, 100), maxProgress: 100, xpReward: 300, category: 'completion' },
    { id: 'streak_3', title: 'On Fire', description: '3-day streak', icon: '🔥', unlockedAt: streakDays >= 3 ? 'unlocked' : undefined, progress: Math.min(streakDays, 3), maxProgress: 3, xpReward: 25, category: 'streak' },
    { id: 'streak_7', title: 'Week Warrior', description: '7-day streak', icon: '📅', unlockedAt: streakDays >= 7 ? 'unlocked' : undefined, progress: Math.min(streakDays, 7), maxProgress: 7, xpReward: 75, category: 'streak' },
    { id: 'streak_30', title: 'Monthly Champion', description: '30-day streak', icon: '🌟', unlockedAt: streakDays >= 30 ? 'unlocked' : undefined, progress: Math.min(streakDays, 30), maxProgress: 30, xpReward: 500, category: 'streak' },
    { id: 'focus_1', title: 'Deep Work', description: 'Complete your first focus session', icon: '🧘', unlockedAt: focusSessions >= 1 ? 'unlocked' : undefined, progress: Math.min(focusSessions, 1), maxProgress: 1, xpReward: 15, category: 'focus' },
    { id: 'focus_10', title: 'Flow State', description: 'Complete 10 focus sessions', icon: '🎵', unlockedAt: focusSessions >= 10 ? 'unlocked' : undefined, progress: Math.min(focusSessions, 10), maxProgress: 10, xpReward: 80, category: 'focus' },
    { id: 'focus_50', title: 'Focus Master', description: 'Complete 50 focus sessions', icon: '🔬', unlockedAt: focusSessions >= 50 ? 'unlocked' : undefined, progress: Math.min(focusSessions, 50), maxProgress: 50, xpReward: 250, category: 'focus' },
  ];
}

export default function AchievementsScreen() {
  const { theme } = useAppTheme();
  const styles = useStyles(makeStyles);
  const insets = useSafeAreaInsets();
  const user = useAuthStore(s => s.user);
  const tasks = useTaskStore(s => s.tasks);
  const sessions = useFocusStore(s => s.sessions);

  const completedCount = tasks.filter(t => t.status === 'done').length;
  const focusSessions = sessions.filter(s => s.completed).length;

  const achievements = useMemo(
    () => buildAchievements(completedCount, user?.streakDays ?? 0, focusSessions),
    [completedCount, user?.streakDays, focusSessions],
  );

  const unlocked = achievements.filter(a => a.unlockedAt);
  const locked = achievements.filter(a => !a.unlockedAt);

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + moderateScale(8) }]}>
        <Text style={styles.heading}>Achievements</Text>
        <Text style={styles.counter}>{unlocked.length}/{achievements.length} unlocked</Text>
      </View>

      <FlatList
        data={[...unlocked, ...locked]}
        keyExtractor={a => a.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + moderateScale(40) }]}
        renderItem={({ item }) => {
          const isUnlocked = !!item.unlockedAt;
          return (
            <View style={[styles.card, !isUnlocked && styles.cardLocked, { ...theme.shadows.sm as object }]}>
              <Text style={[styles.icon, !isUnlocked && styles.iconLocked]}>{item.icon}</Text>
              <Text style={[styles.title, !isUnlocked && styles.textLocked]}>{item.title}</Text>
              <Text style={[styles.desc, !isUnlocked && styles.textLocked]}>{item.description}</Text>

              {!isUnlocked && (
                <>
                  <View style={styles.progressTrack}>
                    <View style={[styles.progressFill, { width: `${(item.progress / item.maxProgress) * 100}%`, backgroundColor: theme.colors.primary }]} />
                  </View>
                  <Text style={styles.progressText}>{item.progress}/{item.maxProgress}</Text>
                </>
              )}

              {isUnlocked && (
                <View style={[styles.xpBadge, { backgroundColor: theme.colors.primary }]}>
                  <Text style={styles.xpText}>+{item.xpReward} XP</Text>
                </View>
              )}
            </View>
          );
        }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const makeStyles = (theme: AppTheme) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: { paddingHorizontal: moderateScale(20), paddingBottom: moderateScale(12) },
  heading: { fontSize: theme.typography.headlineLarge, fontWeight: '700', color: theme.colors.text },
  counter: { fontSize: theme.typography.bodyMedium, color: theme.colors.textSecondary, marginTop: moderateScale(4) },
  list: { paddingHorizontal: moderateScale(12) },
  row: { gap: moderateScale(10), marginBottom: moderateScale(10) },
  card: { flex: 1, backgroundColor: theme.colors.card, borderRadius: theme.radius.xl, padding: moderateScale(16), alignItems: 'center', gap: moderateScale(6) },
  cardLocked: { opacity: 0.55 },
  icon: { fontSize: moderateScale(36) },
  iconLocked: { opacity: 0.4 },
  title: { fontSize: theme.typography.titleSmall, fontWeight: '700', color: theme.colors.text, textAlign: 'center' },
  desc: { fontSize: theme.typography.bodySmall, color: theme.colors.textSecondary, textAlign: 'center' },
  textLocked: { color: theme.colors.textTertiary },
  progressTrack: { width: '100%', height: moderateScale(4), backgroundColor: theme.colors.border, borderRadius: moderateScale(2), overflow: 'hidden', marginTop: moderateScale(4) },
  progressFill: { height: '100%', borderRadius: moderateScale(2) },
  progressText: { fontSize: theme.typography.labelSmall, color: theme.colors.textTertiary },
  xpBadge: { paddingHorizontal: moderateScale(10), paddingVertical: moderateScale(3), borderRadius: moderateScale(12), marginTop: moderateScale(4) },
  xpText: { fontSize: theme.typography.labelSmall, color: '#fff', fontWeight: '700' },
});
