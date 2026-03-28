import React, { useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, SectionList, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { moderateScale } from 'react-native-size-matters';
import { format, isToday, isTomorrow, addDays, startOfDay } from 'date-fns';
import { useAppTheme } from '../../theme';
import { useStyles, useTasks, useAppNavigation } from '../../hooks';
import TaskCard from '../../components/task-card';
import EmptyState from '../../components/empty-state';
import Fab from '../../components/fab';
import type { AppTheme, Task } from '../../types';

export default function UpcomingScreen() {
  const { theme } = useAppTheme();
  const styles = useStyles(makeStyles);
  const insets = useSafeAreaInsets();
  const navigation = useAppNavigation();
  const { upcomingTasks } = useTasks();

  const sections = useMemo(() => {
    const groups: Record<string, Task[]> = {};
    upcomingTasks.forEach(task => {
      const key = task.dueDate!;
      if (!groups[key]) groups[key] = [];
      groups[key].push(task);
    });
    return Object.entries(groups)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, data]) => {
        const d = new Date(date);
        let title = format(d, 'EEEE, MMMM d');
        if (isToday(d)) title = `Today · ${format(d, 'MMMM d')}`;
        else if (isTomorrow(d)) title = `Tomorrow · ${format(d, 'MMMM d')}`;
        return { title, data };
      });
  }, [upcomingTasks]);

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + moderateScale(8) }]}>
        <Text style={styles.heading}>Upcoming</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Calendar')} style={styles.calendarBtn}>
          <Text style={[styles.calendarBtnText, { color: theme.colors.primary }]}>Calendar</Text>
        </TouchableOpacity>
      </View>

      <SectionList
        sections={sections}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <TaskCard task={item} onPress={(t) => navigation.navigate('TaskDetail', { taskId: t.id })} />}
        renderSectionHeader={({ section: { title } }) => (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{title}</Text>
          </View>
        )}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: insets.bottom + moderateScale(100) },
          sections.length === 0 && { flex: 1 },
        ]}
        ListEmptyComponent={<EmptyState icon="calendar" title="Nothing upcoming" subtitle="You're all clear for the next 7 days." />}
        stickySectionHeadersEnabled
        showsVerticalScrollIndicator={false}
      />

      <Fab onPress={() => navigation.navigate('TaskCreate', {})} />
    </View>
  );
}

const makeStyles = (theme: AppTheme) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: moderateScale(20), paddingBottom: moderateScale(12) },
  heading: { fontSize: theme.typography.headlineLarge, fontWeight: '700', color: theme.colors.text },
  calendarBtn: { paddingHorizontal: moderateScale(12), paddingVertical: moderateScale(6) },
  calendarBtnText: { fontSize: theme.typography.bodyMedium, fontWeight: '600' },
  list: { paddingHorizontal: moderateScale(16) },
  sectionHeader: { backgroundColor: theme.colors.background, paddingVertical: moderateScale(10) },
  sectionTitle: { fontSize: theme.typography.labelLarge, fontWeight: '600', color: theme.colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5 },
});
