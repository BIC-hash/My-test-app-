import React, { useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { moderateScale } from 'react-native-size-matters';
import { format } from 'date-fns';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppTheme } from '../../theme';
import { useStyles, useTasks, useAppNavigation } from '../../hooks';
import { useAuthStore } from '../../store/auth-store';
import TaskCard from '../../components/task-card';
import EmptyState from '../../components/empty-state';
import Fab from '../../components/fab';
import type { AppTheme, Task } from '../../types';

export default function TodayScreen() {
  const { theme } = useAppTheme();
  const styles = useStyles(makeStyles);
  const insets = useSafeAreaInsets();
  const navigation = useAppNavigation();
  const { todayTasks } = useTasks();
  const user = useAuthStore(s => s.user);

  const today = new Date();
  const completedToday = todayTasks.filter(t => t.status === 'done').length;
  const remainingToday = todayTasks.filter(t => t.status !== 'done').length;
  const progress = todayTasks.length > 0 ? completedToday / todayTasks.length : 0;

  const handleTaskPress = useCallback((task: Task) => {
    navigation.navigate('TaskDetail', { taskId: task.id });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.primaryDark]}
        style={[styles.hero, { paddingTop: insets.top + moderateScale(16) }]}
      >
        <Text style={styles.greeting}>
          Good {today.getHours() < 12 ? 'morning' : today.getHours() < 17 ? 'afternoon' : 'evening'},{' '}
          {user?.name?.split(' ')[0] ?? 'there'}
        </Text>
        <Text style={styles.dateText}>{format(today, 'EEEE, MMMM d')}</Text>

        <View style={styles.progressRow}>
          <View style={styles.progressInfo}>
            <Text style={styles.progressCount}>{completedToday}/{todayTasks.length}</Text>
            <Text style={styles.progressLabel}>tasks done today</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
          </View>
        </View>

        <View style={styles.statsRow}>
          <TouchableOpacity style={styles.statChip} onPress={() => navigation.navigate('FocusTimer', {})}>
            <Feather name="clock" size={moderateScale(14)} color="rgba(255,255,255,0.9)" />
            <Text style={styles.statChipText}>Focus</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.statChip} onPress={() => navigation.navigate('Statistics')}>
            <Feather name="bar-chart-2" size={moderateScale(14)} color="rgba(255,255,255,0.9)" />
            <Text style={styles.statChipText}>Stats</Text>
          </TouchableOpacity>
          <View style={styles.statChip}>
            <Text style={styles.statChipText}>🔥 {user?.streakDays ?? 0} day streak</Text>
          </View>
        </View>
      </LinearGradient>

      <FlatList
        data={todayTasks.filter(t => t.status !== 'done')}
        keyExtractor={t => t.id}
        renderItem={({ item }) => <TaskCard task={item} onPress={handleTaskPress} />}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: insets.bottom + moderateScale(100) },
          todayTasks.length === 0 && { flex: 1 },
        ]}
        ListHeaderComponent={
          remainingToday > 0 ? (
            <Text style={styles.listHeader}>{remainingToday} task{remainingToday !== 1 ? 's' : ''} remaining</Text>
          ) : null
        }
        ListEmptyComponent={
          <EmptyState
            icon="sun"
            title={completedToday > 0 ? 'All done! 🎉' : 'No tasks today'}
            subtitle={completedToday > 0 ? 'Great work! You cleared your day.' : 'Add tasks due today or enjoy a free day.'}
          />
        }
        showsVerticalScrollIndicator={false}
      />

      <Fab onPress={() => navigation.navigate('TaskCreate', { dueDate: format(today, 'yyyy-MM-dd') })} />
    </View>
  );
}

const makeStyles = (theme: AppTheme) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  hero: { paddingHorizontal: moderateScale(20), paddingBottom: moderateScale(24) },
  greeting: { fontSize: theme.typography.titleLarge, fontWeight: '600', color: 'rgba(255,255,255,0.85)', marginBottom: moderateScale(4) },
  dateText: { fontSize: theme.typography.headlineMedium, fontWeight: '700', color: '#fff', marginBottom: moderateScale(20) },
  progressRow: { gap: moderateScale(8), marginBottom: moderateScale(16) },
  progressInfo: { flexDirection: 'row', alignItems: 'baseline', gap: moderateScale(8) },
  progressCount: { fontSize: theme.typography.headlineSmall, fontWeight: '700', color: '#fff' },
  progressLabel: { fontSize: theme.typography.bodyMedium, color: 'rgba(255,255,255,0.7)' },
  progressBar: { height: moderateScale(6), backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: moderateScale(3), overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#fff', borderRadius: moderateScale(3) },
  statsRow: { flexDirection: 'row', gap: moderateScale(8) },
  statChip: { flexDirection: 'row', alignItems: 'center', gap: moderateScale(4), backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: moderateScale(12), paddingVertical: moderateScale(6), borderRadius: moderateScale(20) },
  statChipText: { fontSize: theme.typography.labelMedium, color: '#fff', fontWeight: '500' },
  list: { paddingHorizontal: moderateScale(16), paddingTop: moderateScale(16) },
  listHeader: { fontSize: theme.typography.labelLarge, fontWeight: '600', color: theme.colors.textSecondary, marginBottom: moderateScale(8), textTransform: 'uppercase', letterSpacing: 0.5 },
});
