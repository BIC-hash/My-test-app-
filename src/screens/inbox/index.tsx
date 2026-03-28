import React, { useCallback, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, FlatList, Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { moderateScale } from 'react-native-size-matters';
import { Feather } from '@expo/vector-icons';
import { useAppTheme } from '../../theme';
import { useStyles, useTasks } from '../../hooks';
import { useTaskStore } from '../../store/task-store';
import TaskCard from '../../components/task-card';
import EmptyState from '../../components/empty-state';
import Fab from '../../components/fab';
import type { AppTheme, Task } from '../../types';
import { useAppNavigation } from '../../hooks';

export default function InboxScreen() {
  const { theme } = useAppTheme();
  const styles = useStyles(makeStyles);
  const insets = useSafeAreaInsets();
  const navigation = useAppNavigation();
  const { inboxTasks, overdueTasks } = useTasks();
  const [showOverdue, setShowOverdue] = useState(true);

  const handleTaskPress = useCallback((task: Task) => {
    navigation.navigate('TaskDetail', { taskId: task.id });
  }, [navigation]);

  const handleCreateTask = useCallback(() => {
    navigation.navigate('TaskCreate', {});
  }, [navigation]);

  const sections = [
    ...(overdueTasks.length > 0 ? [{ type: 'overdue-header' as const }, ...overdueTasks.map(t => ({ type: 'task' as const, task: t, isOverdue: true }))] : []),
    { type: 'inbox-header' as const },
    ...inboxTasks.map(t => ({ type: 'task' as const, task: t, isOverdue: false })),
  ];

  const renderItem = useCallback(({ item }: { item: typeof sections[number] }) => {
    if (item.type === 'overdue-header') {
      return (
        <TouchableOpacity style={styles.sectionHeader} onPress={() => setShowOverdue(v => !v)} activeOpacity={0.7}>
          <View style={[styles.sectionDot, { backgroundColor: theme.colors.error }]} />
          <Text style={[styles.sectionTitle, { color: theme.colors.error }]}>Overdue ({overdueTasks.length})</Text>
          <Feather name={showOverdue ? 'chevron-up' : 'chevron-down'} size={moderateScale(16)} color={theme.colors.error} />
        </TouchableOpacity>
      );
    }
    if (item.type === 'inbox-header') {
      return (
        <View style={styles.sectionHeader}>
          <View style={[styles.sectionDot, { backgroundColor: theme.colors.primary }]} />
          <Text style={styles.sectionTitle}>Inbox ({inboxTasks.length})</Text>
        </View>
      );
    }
    if (!showOverdue && item.isOverdue) return null;
    return <TaskCard task={item.task} onPress={handleTaskPress} />;
  }, [inboxTasks.length, overdueTasks.length, showOverdue, handleTaskPress, theme]);

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + moderateScale(8) }]}>
        <Text style={styles.heading}>Inbox</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton} onPress={() => navigation.navigate('Search')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Feather name="search" size={moderateScale(22)} color={theme.colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton} onPress={() => navigation.navigate('TagsList')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Feather name="tag" size={moderateScale(22)} color={theme.colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={sections.filter(Boolean)}
        keyExtractor={(item, i) => item.type === 'task' ? item.task.id : `${item.type}-${i}`}
        renderItem={renderItem}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: insets.bottom + moderateScale(100) },
          sections.length === 0 && { flex: 1 },
        ]}
        ListEmptyComponent={
          <EmptyState
            icon="inbox"
            title="Inbox is empty"
            subtitle="Tap + to add your first task"
          />
        }
        showsVerticalScrollIndicator={false}
      />

      <Fab onPress={handleCreateTask} />
    </View>
  );
}

const makeStyles = (theme: AppTheme) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: moderateScale(20), paddingBottom: moderateScale(12) },
  heading: { fontSize: theme.typography.headlineLarge, fontWeight: '700', color: theme.colors.text },
  headerActions: { flexDirection: 'row', gap: moderateScale(8) },
  headerButton: { width: moderateScale(44), height: moderateScale(44), alignItems: 'center', justifyContent: 'center' },
  list: { paddingHorizontal: moderateScale(16) },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', paddingVertical: moderateScale(12), gap: moderateScale(8) },
  sectionDot: { width: moderateScale(8), height: moderateScale(8), borderRadius: moderateScale(4) },
  sectionTitle: { flex: 1, fontSize: theme.typography.labelLarge, fontWeight: '600', color: theme.colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5 },
});
