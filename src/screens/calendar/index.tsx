import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { moderateScale } from 'react-native-size-matters';
import { Feather } from '@expo/vector-icons';
import { format, isSameDay } from 'date-fns';
import { useAppTheme } from '../../theme';
import { useStyles, useAppNavigation } from '../../hooks';
import { useTaskStore } from '../../store/task-store';
import TaskCard from '../../components/task-card';
import EmptyState from '../../components/empty-state';
import type { AppTheme, Task } from '../../types';

export default function CalendarScreen() {
  const { theme } = useAppTheme();
  const styles = useStyles(makeStyles);
  const insets = useSafeAreaInsets();
  const navigation = useAppNavigation();
  const tasks = useTaskStore(s => s.tasks);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const tasksWithDue = useMemo(() => tasks.filter(t => t.dueDate), [tasks]);

  const markedDates = useMemo(() => {
    const marks: Record<string, { dots: { color: string }[] }> = {};
    tasksWithDue.forEach(t => {
      if (!t.dueDate) return;
      if (!marks[t.dueDate]) marks[t.dueDate] = { dots: [] };
      marks[t.dueDate].dots.push({ color: theme.colors.primary });
    });
    return marks;
  }, [tasksWithDue, theme.colors.primary]);

  const selectedTasks = useMemo(
    () => tasksWithDue.filter(t => t.dueDate && isSameDay(new Date(t.dueDate), selectedDate)),
    [tasksWithDue, selectedDate],
  );

  // Build 5-week grid manually (simple approach)
  const today = new Date();
  const weeks = Array.from({ length: 5 }, (_, week) =>
    Array.from({ length: 7 }, (_, day) => {
      const d = new Date(today);
      d.setDate(today.getDate() - today.getDay() + week * 7 + day - 14);
      return d;
    }),
  );

  const getDayCount = (d: Date) =>
    tasksWithDue.filter(t => t.dueDate && isSameDay(new Date(t.dueDate), d)).length;

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + moderateScale(8) }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Feather name="arrow-left" size={moderateScale(24)} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.heading}>{format(selectedDate, 'MMMM yyyy')}</Text>
        <View style={{ width: moderateScale(44) }} />
      </View>

      {/* Day names */}
      <View style={styles.dayNames}>
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
          <Text key={i} style={styles.dayName}>{d}</Text>
        ))}
      </View>

      {/* Grid */}
      {weeks.map((week, wi) => (
        <View key={wi} style={styles.week}>
          {week.map((day, di) => {
            const isSelected = isSameDay(day, selectedDate);
            const isToday = isSameDay(day, today);
            const count = getDayCount(day);
            return (
              <TouchableOpacity key={di} style={styles.dayCell} onPress={() => setSelectedDate(day)}>
                <View style={[styles.dayCircle, isSelected && { backgroundColor: theme.colors.primary }, isToday && !isSelected && { borderWidth: 2, borderColor: theme.colors.primary }]}>
                  <Text style={[styles.dayText, isSelected && { color: '#fff' }, isToday && !isSelected && { color: theme.colors.primary, fontWeight: '700' }]}>
                    {format(day, 'd')}
                  </Text>
                </View>
                {count > 0 && <View style={[styles.dot, { backgroundColor: isSelected ? '#fff' : theme.colors.primary }]} />}
              </TouchableOpacity>
            );
          })}
        </View>
      ))}

      <View style={styles.divider} />

      {/* Selected day tasks */}
      <Text style={styles.selectedLabel}>{format(selectedDate, 'EEEE, MMMM d')}</Text>

      <FlatList
        data={selectedTasks}
        keyExtractor={t => t.id}
        renderItem={({ item }) => <TaskCard task={item} onPress={(t) => navigation.navigate('TaskDetail', { taskId: t.id })} />}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + moderateScale(40) }, selectedTasks.length === 0 && styles.emptyFlex]}
        ListEmptyComponent={<EmptyState icon="calendar" title="No tasks" subtitle={`Nothing due on ${format(selectedDate, 'MMM d')}`} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const makeStyles = (theme: AppTheme) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: moderateScale(16), paddingBottom: moderateScale(8) },
  heading: { flex: 1, fontSize: theme.typography.titleLarge, fontWeight: '700', color: theme.colors.text, textAlign: 'center' },
  dayNames: { flexDirection: 'row', paddingHorizontal: moderateScale(8), marginBottom: moderateScale(4) },
  dayName: { flex: 1, textAlign: 'center', fontSize: theme.typography.labelSmall, fontWeight: '600', color: theme.colors.textTertiary },
  week: { flexDirection: 'row', paddingHorizontal: moderateScale(8), marginBottom: moderateScale(2) },
  dayCell: { flex: 1, alignItems: 'center', gap: moderateScale(2), paddingVertical: moderateScale(4) },
  dayCircle: { width: moderateScale(34), height: moderateScale(34), borderRadius: moderateScale(17), alignItems: 'center', justifyContent: 'center' },
  dayText: { fontSize: theme.typography.bodyMedium, color: theme.colors.text },
  dot: { width: moderateScale(4), height: moderateScale(4), borderRadius: moderateScale(2) },
  divider: { height: 1, backgroundColor: theme.colors.separator, marginHorizontal: moderateScale(16), marginVertical: moderateScale(8) },
  selectedLabel: { fontSize: theme.typography.titleSmall, fontWeight: '600', color: theme.colors.text, paddingHorizontal: moderateScale(16), marginBottom: moderateScale(8) },
  list: { paddingHorizontal: moderateScale(16) },
  emptyFlex: { flex: 1 },
});
