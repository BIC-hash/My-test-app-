import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { moderateScale } from 'react-native-size-matters';
import { Feather } from '@expo/vector-icons';
import { useAppTheme } from '../../theme';
import { useStyles, useAppNavigation } from '../../hooks';
import { useTaskStore } from '../../store/task-store';
import TaskCard from '../../components/task-card';
import Fab from '../../components/fab';
import type { AppTheme, TaskStatus } from '../../types';

const COLUMNS: { status: TaskStatus; label: string; color: string }[] = [
  { status: 'todo', label: 'To Do', color: '#6B7280' },
  { status: 'in_progress', label: 'In Progress', color: '#3B82F6' },
  { status: 'done', label: 'Done', color: '#22C55E' },
];

export default function KanbanScreen() {
  const { theme } = useAppTheme();
  const styles = useStyles(makeStyles);
  const insets = useSafeAreaInsets();
  const navigation = useAppNavigation();
  const { tasks, updateTask } = useTaskStore();

  const activeTasks = useMemo(() => tasks.filter(t => t.status !== 'archived'), [tasks]);

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + moderateScale(8) }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Feather name="arrow-left" size={moderateScale(24)} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.heading}>Kanban Board</Text>
        <View style={{ width: moderateScale(44) }} />
      </View>

      <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
        {COLUMNS.map(col => {
          const colTasks = activeTasks.filter(t => t.status === col.status);
          return (
            <View key={col.status} style={styles.column}>
              <View style={[styles.columnHeader, { borderTopColor: col.color }]}>
                <Text style={styles.columnTitle}>{col.label}</Text>
                <View style={[styles.countBadge, { backgroundColor: col.color + '22' }]}>
                  <Text style={[styles.countText, { color: col.color }]}>{colTasks.length}</Text>
                </View>
              </View>
              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.columnList}>
                {colTasks.map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onPress={(t) => navigation.navigate('TaskDetail', { taskId: t.id })}
                  />
                ))}
                <TouchableOpacity
                  style={[styles.addTaskBtn, { borderColor: col.color + '44' }]}
                  onPress={() => navigation.navigate('TaskCreate', {})}
                >
                  <Feather name="plus" size={moderateScale(16)} color={col.color} />
                  <Text style={[styles.addTaskText, { color: col.color }]}>Add task</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const makeStyles = (theme: AppTheme) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: moderateScale(16), paddingBottom: moderateScale(8) },
  heading: { flex: 1, fontSize: theme.typography.titleLarge, fontWeight: '700', color: theme.colors.text, textAlign: 'center' },
  column: { width: moderateScale(300), marginLeft: moderateScale(12) },
  columnHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderTopWidth: 3, paddingTop: moderateScale(10), paddingBottom: moderateScale(8) },
  columnTitle: { fontSize: theme.typography.titleSmall, fontWeight: '700', color: theme.colors.text },
  countBadge: { paddingHorizontal: moderateScale(8), paddingVertical: moderateScale(2), borderRadius: moderateScale(12) },
  countText: { fontSize: theme.typography.labelSmall, fontWeight: '700' },
  columnList: { gap: moderateScale(8), paddingBottom: moderateScale(40) },
  addTaskBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: moderateScale(6), height: moderateScale(44), borderRadius: theme.radius.md, borderWidth: 1.5, borderStyle: 'dashed', marginTop: moderateScale(4) },
  addTaskText: { fontSize: theme.typography.bodyMedium, fontWeight: '500' },
});
