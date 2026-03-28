import React, { useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { Feather } from '@expo/vector-icons';
import { useAppTheme } from '../../theme';
import { useStyles } from '../../hooks';
import { useTaskActions } from '../../hooks/use-task-actions';
import { useTaskStore } from '../../store/task-store';
import PriorityBadge from '../priority-badge';
import TagChip from '../tag-chip';
import Checkbox from '../checkbox';
import { formatDueDate, getSubtaskProgress } from '../../utils';
import type { AppTheme, Task } from '../../types';

interface Props {
  task: Task;
  onPress: (task: Task) => void;
  compact?: boolean;
}

export default function TaskCard({ task, onPress, compact }: Props) {
  const { theme } = useAppTheme();
  const styles = useStyles(makeStyles);
  const { handleComplete, handleFavorite } = useTaskActions();
  const tags = useTaskStore(s => s.tags.filter(t => task.tagIds.includes(t.id)));

  const due = task.dueDate ? formatDueDate(task.dueDate) : null;
  const { completed: subtasksDone, total: subtasksTotal } = getSubtaskProgress(task);
  const isDone = task.status === 'done';

  const handlePress = useCallback(() => onPress(task), [onPress, task]);
  const handleCheck = useCallback(() => handleComplete(task), [handleComplete, task]);
  const handleFav = useCallback(() => handleFavorite(task), [handleFavorite, task]);

  return (
    <TouchableOpacity
      style={[styles.card, { ...theme.shadows.sm as object }, isDone && styles.cardDone]}
      onPress={handlePress}
      activeOpacity={0.75}
    >
      <View style={styles.leftCol}>
        <Checkbox checked={isDone} onPress={handleCheck} size={moderateScale(24)} color={task.priority !== 'none' ? theme.colors[task.priority] : undefined} />
      </View>

      <View style={styles.content}>
        <Text style={[styles.title, isDone && styles.titleDone]} numberOfLines={compact ? 1 : 2}>
          {task.title}
        </Text>

        {!compact && task.description ? (
          <Text style={styles.description} numberOfLines={1}>{task.description}</Text>
        ) : null}

        <View style={styles.meta}>
          {task.priority !== 'none' && <PriorityBadge priority={task.priority} compact />}

          {due && (
            <View style={styles.duePill}>
              <Feather
                name="calendar"
                size={moderateScale(11)}
                color={due.isOverdue ? theme.colors.error : due.isUrgent ? theme.colors.warning : theme.colors.textTertiary}
              />
              <Text style={[styles.dueText, { color: due.isOverdue ? theme.colors.error : due.isUrgent ? theme.colors.warning : theme.colors.textTertiary }]}>
                {due.label}
              </Text>
            </View>
          )}

          {subtasksTotal > 0 && (
            <View style={styles.subtaskPill}>
              <Feather name="check-square" size={moderateScale(11)} color={theme.colors.textTertiary} />
              <Text style={styles.subtaskText}>{subtasksDone}/{subtasksTotal}</Text>
            </View>
          )}

          {!compact && tags.slice(0, 2).map(tag => <TagChip key={tag.id} tag={tag} compact />)}
        </View>
      </View>

      <TouchableOpacity onPress={handleFav} style={styles.favBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
        <Feather
          name={task.isFavorite ? 'star' : 'star'}
          size={moderateScale(16)}
          color={task.isFavorite ? '#EAB308' : theme.colors.border}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const makeStyles = (theme: AppTheme) => StyleSheet.create({
  card: { flexDirection: 'row', backgroundColor: theme.colors.card, borderRadius: theme.radius.lg, padding: moderateScale(14), marginBottom: moderateScale(8), gap: moderateScale(12), alignItems: 'flex-start' },
  cardDone: { opacity: 0.55 },
  leftCol: { paddingTop: moderateScale(2) },
  content: { flex: 1, gap: moderateScale(6) },
  title: { fontSize: theme.typography.bodyLarge, fontWeight: '500', color: theme.colors.text, lineHeight: moderateScale(22) },
  titleDone: { textDecorationLine: 'line-through', color: theme.colors.textTertiary },
  description: { fontSize: theme.typography.bodySmall, color: theme.colors.textSecondary, lineHeight: moderateScale(18) },
  meta: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: moderateScale(6) },
  duePill: { flexDirection: 'row', alignItems: 'center', gap: moderateScale(3) },
  dueText: { fontSize: theme.typography.labelSmall },
  subtaskPill: { flexDirection: 'row', alignItems: 'center', gap: moderateScale(3) },
  subtaskText: { fontSize: theme.typography.labelSmall, color: theme.colors.textTertiary },
  favBtn: { width: moderateScale(32), height: moderateScale(32), alignItems: 'center', justifyContent: 'center' },
});
