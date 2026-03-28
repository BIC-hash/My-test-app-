import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { moderateScale } from 'react-native-size-matters';
import { Feather } from '@expo/vector-icons';
import { useAppTheme } from '../../theme';
import { useStyles, useAppNavigation } from '../../hooks';
import { useTaskStore } from '../../store/task-store';
import type { AppTheme, Task, Priority } from '../../types';

const { width: W } = Dimensions.get('window');

interface Quadrant {
  label: string;
  subtitle: string;
  color: string;
  priorities: Priority[];
  action: string;
}

const QUADRANTS: Quadrant[] = [
  { label: 'Do First', subtitle: 'Urgent & Important', color: '#EF4444', priorities: ['urgent'], action: 'Do immediately' },
  { label: 'Schedule', subtitle: 'Not Urgent & Important', color: '#3B82F6', priorities: ['high'], action: 'Plan it' },
  { label: 'Delegate', subtitle: 'Urgent & Not Important', color: '#F97316', priorities: ['medium'], action: 'Delegate if possible' },
  { label: 'Eliminate', subtitle: 'Not Urgent & Not Important', color: '#6B7280', priorities: ['low', 'none'], action: 'Defer or drop' },
];

export default function EisenhowerScreen() {
  const { theme } = useAppTheme();
  const styles = useStyles(makeStyles);
  const insets = useSafeAreaInsets();
  const navigation = useAppNavigation();
  const tasks = useTaskStore(s => s.tasks.filter(t => t.status !== 'done' && t.status !== 'archived'));

  const quadrantTasks = useMemo(() =>
    QUADRANTS.map(q => ({
      ...q,
      tasks: tasks.filter(t => (q.priorities as string[]).includes(t.priority)),
    })),
    [tasks],
  );

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + moderateScale(8) }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Feather name="arrow-left" size={moderateScale(24)} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.heading}>Eisenhower Matrix</Text>
        <View style={{ width: moderateScale(44) }} />
      </View>

      <View style={styles.axisLabels}>
        <View style={styles.yAxisTop}><Text style={styles.axisText}>URGENT</Text></View>
        <View style={styles.yAxisBottom}><Text style={styles.axisText}>NOT URGENT</Text></View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + moderateScale(40) }}>
        <View style={styles.grid}>
          {quadrantTasks.map((q, i) => (
            <View key={q.label} style={[styles.quadrant, { borderColor: q.color + '33', borderWidth: 1.5 }]}>
              <View style={[styles.quadrantHeader, { backgroundColor: q.color + '18' }]}>
                <Text style={[styles.quadrantLabel, { color: q.color }]}>{q.label}</Text>
                <Text style={styles.quadrantSubtitle}>{q.subtitle}</Text>
                <View style={[styles.actionBadge, { backgroundColor: q.color + '22' }]}>
                  <Text style={[styles.actionText, { color: q.color }]}>{q.action}</Text>
                </View>
              </View>
              <View style={styles.quadrantTasks}>
                {q.tasks.slice(0, 5).map(task => (
                  <TouchableOpacity
                    key={task.id}
                    style={styles.taskRow}
                    onPress={() => navigation.navigate('TaskDetail', { taskId: task.id })}
                  >
                    <View style={[styles.taskDot, { backgroundColor: q.color }]} />
                    <Text style={styles.taskTitle} numberOfLines={1}>{task.title}</Text>
                  </TouchableOpacity>
                ))}
                {q.tasks.length > 5 && (
                  <Text style={[styles.moreText, { color: q.color }]}>+{q.tasks.length - 5} more</Text>
                )}
                {q.tasks.length === 0 && (
                  <Text style={styles.emptyText}>No tasks here</Text>
                )}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const makeStyles = (theme: AppTheme) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: moderateScale(16), paddingBottom: moderateScale(8) },
  heading: { flex: 1, fontSize: theme.typography.titleLarge, fontWeight: '700', color: theme.colors.text, textAlign: 'center' },
  axisLabels: { flexDirection: 'row', paddingHorizontal: moderateScale(16), justifyContent: 'space-between', marginBottom: moderateScale(4) },
  yAxisTop: {},
  yAxisBottom: {},
  axisText: { fontSize: theme.typography.labelSmall, fontWeight: '700', color: theme.colors.textTertiary, letterSpacing: 1 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', padding: moderateScale(12), gap: moderateScale(10) },
  quadrant: { width: (W - moderateScale(34)) / 2, borderRadius: theme.radius.lg, overflow: 'hidden' },
  quadrantHeader: { padding: moderateScale(12), gap: moderateScale(4) },
  quadrantLabel: { fontSize: theme.typography.titleSmall, fontWeight: '700' },
  quadrantSubtitle: { fontSize: theme.typography.labelSmall, color: theme.colors.textSecondary },
  actionBadge: { alignSelf: 'flex-start', paddingHorizontal: moderateScale(8), paddingVertical: moderateScale(2), borderRadius: moderateScale(10) },
  actionText: { fontSize: theme.typography.labelSmall, fontWeight: '600' },
  quadrantTasks: { padding: moderateScale(10), gap: moderateScale(6), minHeight: moderateScale(80) },
  taskRow: { flexDirection: 'row', alignItems: 'center', gap: moderateScale(8) },
  taskDot: { width: moderateScale(6), height: moderateScale(6), borderRadius: moderateScale(3), flexShrink: 0 },
  taskTitle: { flex: 1, fontSize: theme.typography.bodySmall, color: theme.colors.text },
  moreText: { fontSize: theme.typography.labelSmall, fontWeight: '600', marginTop: moderateScale(4) },
  emptyText: { fontSize: theme.typography.bodySmall, color: theme.colors.textTertiary, textAlign: 'center', paddingVertical: moderateScale(8) },
});
