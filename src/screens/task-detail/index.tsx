import React, { useCallback, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput,
  Platform, Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { moderateScale } from 'react-native-size-matters';
import { Feather } from '@expo/vector-icons';
import { format } from 'date-fns';
import { useAppTheme } from '../../theme';
import { useStyles, useAppNavigation, useAppRoute, useHaptics } from '../../hooks';
import { useTaskStore } from '../../store/task-store';
import { useTaskActions } from '../../hooks/use-task-actions';
import PriorityBadge from '../../components/priority-badge';
import TagChip from '../../components/tag-chip';
import Checkbox from '../../components/checkbox';
import { PRIORITY_CONFIG } from '../../constants';
import { formatDueDate, getSubtaskProgress, generateId } from '../../utils';
import type { AppTheme } from '../../types';

export default function TaskDetailScreen() {
  const { theme, isDark } = useAppTheme();
  const styles = useStyles(makeStyles);
  const insets = useSafeAreaInsets();
  const navigation = useAppNavigation();
  const route = useAppRoute<'TaskDetail'>();
  const haptics = useHaptics();

  const task = useTaskStore(s => s.tasks.find(t => t.id === route.params.taskId));
  const tags = useTaskStore(s => s.tags);
  const projects = useTaskStore(s => s.projects);
  const { updateTask, deleteTask, toggleSubtask } = useTaskStore();
  const { handleComplete } = useTaskActions();

  const [newSubtask, setNewSubtask] = useState('');

  if (!task) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Task not found</Text>
      </View>
    );
  }

  const project = projects.find(p => p.id === task.projectId);
  const taskTags = tags.filter(t => task.tagIds.includes(t.id));
  const { completed: subtasksDone, total: subtasksTotal } = getSubtaskProgress(task);
  const due = task.dueDate ? formatDueDate(task.dueDate) : null;

  const handleDelete = () => {
    Alert.alert('Delete Task', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive', onPress: () => {
          deleteTask(task.id);
          navigation.goBack();
        },
      },
    ]);
  };

  const handleAddSubtask = () => {
    if (!newSubtask.trim()) return;
    haptics.light();
    updateTask(task.id, {
      subtasks: [...task.subtasks, { id: generateId(), title: newSubtask.trim(), completed: false, createdAt: new Date().toISOString() }],
    });
    setNewSubtask('');
  };

  const priorityCfg = PRIORITY_CONFIG[task.priority];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + moderateScale(4) }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Feather name="arrow-left" size={moderateScale(24)} color={theme.colors.text} />
        </TouchableOpacity>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={() => navigation.navigate('TaskEdit', { taskId: task.id })} style={styles.headerBtn}>
            <Feather name="edit-2" size={moderateScale(20)} color={theme.colors.text} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDelete} style={styles.headerBtn}>
            <Feather name="trash-2" size={moderateScale(20)} color={theme.colors.error} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + moderateScale(40) }]} showsVerticalScrollIndicator={false}>
        {/* Complete + Title */}
        <View style={styles.titleRow}>
          <Checkbox checked={task.status === 'done'} onPress={() => handleComplete(task)} size={moderateScale(28)} />
          <Text style={[styles.title, task.status === 'done' && styles.titleDone]}>{task.title}</Text>
        </View>

        {/* Priority + Project */}
        <View style={styles.metaRow}>
          <PriorityBadge priority={task.priority} />
          {project && (
            <View style={[styles.projectChip, { backgroundColor: project.color + '22', borderColor: project.color + '44' }]}>
              <Text style={[styles.projectChipText, { color: project.color }]}>{project.name}</Text>
            </View>
          )}
          {task.isFavorite && (
            <View style={styles.favBadge}>
              <Text>⭐</Text>
            </View>
          )}
        </View>

        {/* Due Date */}
        {due && (
          <View style={[styles.dueBadge, { backgroundColor: due.isOverdue ? theme.colors.error + '18' : theme.colors.surface }]}>
            <Feather name="calendar" size={moderateScale(14)} color={due.isOverdue ? theme.colors.error : theme.colors.textSecondary} />
            <Text style={[styles.dueText, { color: due.isOverdue ? theme.colors.error : theme.colors.textSecondary }]}>
              Due {due.label}
              {task.dueTime ? ` at ${task.dueTime}` : ''}
            </Text>
          </View>
        )}

        {/* Tags */}
        {taskTags.length > 0 && (
          <View style={styles.tagsRow}>
            {taskTags.map(tag => <TagChip key={tag.id} tag={tag} />)}
          </View>
        )}

        {/* Description */}
        {task.description ? (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Notes</Text>
            <Text style={styles.description}>{task.description}</Text>
          </View>
        ) : null}

        {/* Subtasks */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionLabel}>Subtasks</Text>
            {subtasksTotal > 0 && (
              <Text style={styles.subtaskCount}>{subtasksDone}/{subtasksTotal}</Text>
            )}
          </View>

          {task.subtasks.map(sub => (
            <TouchableOpacity
              key={sub.id}
              style={styles.subtaskRow}
              onPress={() => { haptics.light(); toggleSubtask(task.id, sub.id); }}
              activeOpacity={0.7}
            >
              <Checkbox checked={sub.completed} onPress={() => { haptics.light(); toggleSubtask(task.id, sub.id); }} size={moderateScale(22)} />
              <Text style={[styles.subtaskText, sub.completed && styles.subtaskDone]}>{sub.title}</Text>
            </TouchableOpacity>
          ))}

          {/* Add subtask input */}
          <View style={styles.addSubtaskRow}>
            <Feather name="plus" size={moderateScale(18)} color={theme.colors.textTertiary} />
            <TextInput
              style={styles.addSubtaskInput}
              placeholder="Add subtask…"
              placeholderTextColor={theme.colors.textTertiary}
              value={newSubtask}
              onChangeText={setNewSubtask}
              onSubmitEditing={handleAddSubtask}
              returnKeyType="done"
            />
          </View>
        </View>

        {/* Estimated time */}
        {task.estimatedMinutes != null && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Time Estimate</Text>
            <View style={styles.timeRow}>
              <Feather name="clock" size={moderateScale(16)} color={theme.colors.textSecondary} />
              <Text style={styles.timeText}>{task.estimatedMinutes} min</Text>
              {task.actualMinutes != null && (
                <Text style={styles.timeActual}>(actual: {task.actualMinutes} min)</Text>
              )}
            </View>
          </View>
        )}

        {/* Start Focus */}
        <TouchableOpacity
          style={[styles.focusButton, { backgroundColor: theme.colors.primary }]}
          onPress={() => navigation.navigate('FocusTimer', { taskId: task.id })}
          activeOpacity={0.8}
        >
          <Feather name="target" size={moderateScale(18)} color="#fff" />
          <Text style={styles.focusButtonText}>Start Focus Session</Text>
        </TouchableOpacity>

        {/* Timestamps */}
        <Text style={styles.timestamp}>
          Created {format(new Date(task.createdAt), 'MMM d, yyyy')}
        </Text>
        {task.completedAt && (
          <Text style={styles.timestamp}>
            Completed {format(new Date(task.completedAt), 'MMM d, yyyy HH:mm')}
          </Text>
        )}
      </ScrollView>
    </View>
  );
}

const makeStyles = (theme: AppTheme) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  notFound: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  notFoundText: { fontSize: theme.typography.bodyLarge, color: theme.colors.textSecondary },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: moderateScale(16), paddingBottom: moderateScale(8) },
  backBtn: { width: moderateScale(44), height: moderateScale(44), alignItems: 'center', justifyContent: 'center' },
  headerActions: { flexDirection: 'row' },
  headerBtn: { width: moderateScale(44), height: moderateScale(44), alignItems: 'center', justifyContent: 'center' },
  content: { paddingHorizontal: moderateScale(20) },
  titleRow: { flexDirection: 'row', alignItems: 'flex-start', gap: moderateScale(12), marginBottom: moderateScale(16) },
  title: { flex: 1, fontSize: theme.typography.headlineSmall, fontWeight: '700', color: theme.colors.text, lineHeight: moderateScale(32) },
  titleDone: { textDecorationLine: 'line-through', color: theme.colors.textTertiary },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: moderateScale(8), marginBottom: moderateScale(16) },
  projectChip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: moderateScale(10), paddingVertical: moderateScale(4), borderRadius: moderateScale(20), borderWidth: 1 },
  projectChipText: { fontSize: theme.typography.labelMedium, fontWeight: '600' },
  favBadge: { paddingHorizontal: moderateScale(8), paddingVertical: moderateScale(4) },
  dueBadge: { flexDirection: 'row', alignItems: 'center', gap: moderateScale(6), alignSelf: 'flex-start', paddingHorizontal: moderateScale(12), paddingVertical: moderateScale(6), borderRadius: moderateScale(20), marginBottom: moderateScale(16) },
  dueText: { fontSize: theme.typography.labelMedium, fontWeight: '500' },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: moderateScale(6), marginBottom: moderateScale(16) },
  section: { marginBottom: moderateScale(24) },
  sectionHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: moderateScale(12) },
  sectionLabel: { fontSize: theme.typography.labelLarge, fontWeight: '600', color: theme.colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5 },
  subtaskCount: { fontSize: theme.typography.labelMedium, color: theme.colors.textTertiary },
  description: { fontSize: theme.typography.bodyLarge, color: theme.colors.text, lineHeight: moderateScale(26) },
  subtaskRow: { flexDirection: 'row', alignItems: 'center', gap: moderateScale(12), paddingVertical: moderateScale(8) },
  subtaskText: { flex: 1, fontSize: theme.typography.bodyLarge, color: theme.colors.text },
  subtaskDone: { textDecorationLine: 'line-through', color: theme.colors.textTertiary },
  addSubtaskRow: { flexDirection: 'row', alignItems: 'center', gap: moderateScale(10), paddingVertical: moderateScale(8), borderTopWidth: 1, borderTopColor: theme.colors.separator, marginTop: moderateScale(4) },
  addSubtaskInput: { flex: 1, fontSize: theme.typography.bodyLarge, color: theme.colors.text },
  timeRow: { flexDirection: 'row', alignItems: 'center', gap: moderateScale(8) },
  timeText: { fontSize: theme.typography.bodyLarge, color: theme.colors.text, fontWeight: '500' },
  timeActual: { fontSize: theme.typography.bodyMedium, color: theme.colors.textSecondary },
  focusButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: moderateScale(8), height: moderateScale(52), borderRadius: theme.radius.lg, marginBottom: moderateScale(32) },
  focusButtonText: { fontSize: theme.typography.titleSmall, fontWeight: '600', color: '#fff' },
  timestamp: { fontSize: theme.typography.labelSmall, color: theme.colors.textTertiary, marginBottom: moderateScale(4) },
});
