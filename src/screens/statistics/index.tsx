import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { moderateScale } from 'react-native-size-matters';
import { format, subDays, startOfDay, isToday, isSameDay } from 'date-fns';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppTheme } from '../../theme';
import { useStyles } from '../../hooks';
import { useTaskStore } from '../../store/task-store';
import { useAuthStore } from '../../store/auth-store';
import { useFocusStore } from '../../store/focus-store';
import type { AppTheme } from '../../types';

const { width: W } = Dimensions.get('window');
const HEATMAP_WEEKS = 16;
const HEATMAP_DAYS = HEATMAP_WEEKS * 7;

export default function StatisticsScreen() {
  const { theme } = useAppTheme();
  const styles = useStyles(makeStyles);
  const insets = useSafeAreaInsets();
  const tasks = useTaskStore(s => s.tasks);
  const user = useAuthStore(s => s.user);
  const sessions = useFocusStore(s => s.sessions);

  const completedTasks = useMemo(() => tasks.filter(t => t.status === 'done'), [tasks]);

  const last7 = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => {
      const d = subDays(new Date(), 6 - i);
      const done = completedTasks.filter(t => t.completedAt && isSameDay(new Date(t.completedAt), d)).length;
      return { date: d, done };
    });
  }, [completedTasks]);

  const maxBarValue = Math.max(...last7.map(d => d.done), 1);

  const heatmapData = useMemo(() => {
    return Array.from({ length: HEATMAP_DAYS }).map((_, i) => {
      const d = subDays(new Date(), HEATMAP_DAYS - 1 - i);
      const count = completedTasks.filter(t => t.completedAt && isSameDay(new Date(t.completedAt), d)).length;
      return { date: d, count };
    });
  }, [completedTasks]);

  const totalFocusMinutes = useMemo(
    () => sessions.filter(s => s.completed).reduce((acc, s) => acc + s.durationMinutes, 0),
    [sessions],
  );

  const completionRate = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0;

  const getHeatmapColor = (count: number) => {
    if (count === 0) return theme.colors.border;
    if (count === 1) return theme.colors.primary + '44';
    if (count === 2) return theme.colors.primary + '77';
    if (count <= 4) return theme.colors.primary + 'AA';
    return theme.colors.primary;
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + moderateScale(8), paddingBottom: insets.bottom + moderateScale(40) }]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.heading}>Statistics</Text>

      {/* XP / Level Card */}
      {user && (
        <LinearGradient colors={[theme.colors.primary, theme.colors.primaryDark]} style={styles.xpCard}>
          <View style={styles.xpRow}>
            <View>
              <Text style={styles.xpLevel}>Level {user.level}</Text>
              <Text style={styles.xpName}>{user.name}</Text>
            </View>
            <View style={styles.xpBadge}>
              <Text style={styles.xpBadgeText}>⭐ {user.xp} XP</Text>
            </View>
          </View>
          <View style={styles.xpBarTrack}>
            <View style={[styles.xpBarFill, { width: `${(user.xp / user.xpToNextLevel) * 100}%` }]} />
          </View>
          <Text style={styles.xpHint}>{user.xpToNextLevel - user.xp} XP to level {user.level + 1}</Text>
        </LinearGradient>
      )}

      {/* Summary cards */}
      <View style={styles.summaryGrid}>
        {[
          { label: 'Total Done', value: completedTasks.length, icon: '✅' },
          { label: 'Completion', value: `${completionRate}%`, icon: '📊' },
          { label: 'Day Streak', value: `${user?.streakDays ?? 0}🔥`, icon: '🔥' },
          { label: 'Focus Hours', value: `${Math.round(totalFocusMinutes / 60)}h`, icon: '⏱' },
        ].map(item => (
          <View key={item.label} style={[styles.summaryCard, { ...theme.shadows.sm as object }]}>
            <Text style={styles.summaryIcon}>{item.icon}</Text>
            <Text style={styles.summaryValue}>{item.value}</Text>
            <Text style={styles.summaryLabel}>{item.label}</Text>
          </View>
        ))}
      </View>

      {/* 7-day bar chart */}
      <View style={[styles.section, { ...theme.shadows.sm as object }]}>
        <Text style={styles.sectionTitle}>Tasks Completed (7 days)</Text>
        <View style={styles.barChart}>
          {last7.map(({ date, done }) => (
            <View key={date.toISOString()} style={styles.barColumn}>
              <Text style={styles.barValue}>{done > 0 ? done : ''}</Text>
              <View style={styles.barTrack}>
                <View style={[styles.barFill, { height: `${(done / maxBarValue) * 100}%`, backgroundColor: isToday(date) ? theme.colors.primary : theme.colors.primary + '66' }]} />
              </View>
              <Text style={[styles.barLabel, isToday(date) && { color: theme.colors.primary, fontWeight: '700' }]}>
                {format(date, 'EEE')[0]}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Heatmap */}
      <View style={[styles.section, { ...theme.shadows.sm as object }]}>
        <Text style={styles.sectionTitle}>Activity Heatmap</Text>
        <View style={styles.heatmap}>
          {heatmapData.map(({ date, count }, i) => (
            <View
              key={i}
              style={[styles.heatCell, { backgroundColor: getHeatmapColor(count) }]}
            />
          ))}
        </View>
        <View style={styles.heatmapLegend}>
          <Text style={styles.heatmapLegendText}>Less</Text>
          {[0, 1, 2, 4, 6].map(c => (
            <View key={c} style={[styles.heatCell, { backgroundColor: getHeatmapColor(c) }]} />
          ))}
          <Text style={styles.heatmapLegendText}>More</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const makeStyles = (theme: AppTheme) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { paddingHorizontal: moderateScale(16) },
  heading: { fontSize: theme.typography.headlineLarge, fontWeight: '700', color: theme.colors.text, marginBottom: moderateScale(20) },
  xpCard: { borderRadius: theme.radius.xl, padding: moderateScale(20), marginBottom: moderateScale(16) },
  xpRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: moderateScale(16) },
  xpLevel: { fontSize: theme.typography.headlineSmall, fontWeight: '700', color: '#fff' },
  xpName: { fontSize: theme.typography.bodyMedium, color: 'rgba(255,255,255,0.7)' },
  xpBadge: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: moderateScale(12), paddingVertical: moderateScale(6), borderRadius: moderateScale(20) },
  xpBadgeText: { fontSize: theme.typography.labelMedium, color: '#fff', fontWeight: '600' },
  xpBarTrack: { height: moderateScale(8), backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: moderateScale(4), overflow: 'hidden', marginBottom: moderateScale(8) },
  xpBarFill: { height: '100%', backgroundColor: '#fff', borderRadius: moderateScale(4) },
  xpHint: { fontSize: theme.typography.labelSmall, color: 'rgba(255,255,255,0.65)' },
  summaryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: moderateScale(10), marginBottom: moderateScale(16) },
  summaryCard: { flex: 1, minWidth: (W - moderateScale(48)) / 2, backgroundColor: theme.colors.card, borderRadius: theme.radius.lg, padding: moderateScale(16), alignItems: 'center', gap: moderateScale(4) },
  summaryIcon: { fontSize: moderateScale(24) },
  summaryValue: { fontSize: theme.typography.headlineSmall, fontWeight: '700', color: theme.colors.text },
  summaryLabel: { fontSize: theme.typography.labelSmall, color: theme.colors.textSecondary },
  section: { backgroundColor: theme.colors.card, borderRadius: theme.radius.xl, padding: moderateScale(20), marginBottom: moderateScale(16) },
  sectionTitle: { fontSize: theme.typography.titleSmall, fontWeight: '600', color: theme.colors.text, marginBottom: moderateScale(16) },
  barChart: { flexDirection: 'row', alignItems: 'flex-end', height: moderateScale(120), gap: moderateScale(6) },
  barColumn: { flex: 1, alignItems: 'center', gap: moderateScale(4), height: '100%', justifyContent: 'flex-end' },
  barValue: { fontSize: theme.typography.labelSmall, color: theme.colors.textSecondary },
  barTrack: { width: '100%', height: moderateScale(80), justifyContent: 'flex-end', backgroundColor: theme.colors.border, borderRadius: moderateScale(4), overflow: 'hidden' },
  barFill: { width: '100%', borderRadius: moderateScale(4) },
  barLabel: { fontSize: theme.typography.labelSmall, color: theme.colors.textTertiary },
  heatmap: { flexDirection: 'row', flexWrap: 'wrap', gap: moderateScale(3) },
  heatCell: { width: moderateScale(12), height: moderateScale(12), borderRadius: moderateScale(2) },
  heatmapLegend: { flexDirection: 'row', alignItems: 'center', gap: moderateScale(4), marginTop: moderateScale(8) },
  heatmapLegendText: { fontSize: theme.typography.labelSmall, color: theme.colors.textTertiary },
});
