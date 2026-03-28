import React, { useCallback, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Platform, Switch,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { moderateScale } from 'react-native-size-matters';
import { Feather } from '@expo/vector-icons';
import { useAppTheme } from '../../theme';
import { useStyles, useAppNavigation, useAppRoute, useHaptics } from '../../hooks';
import { useTaskStore } from '../../store/task-store';
import PriorityBadge from '../../components/priority-badge';
import TagChip from '../../components/tag-chip';
import { PRIORITY_OPTIONS, PRIORITY_CONFIG } from '../../constants';
import { generateId, createEmptyTask } from '../../utils';
import type { AppTheme, Priority, Tag } from '../../types';

export default function TaskCreateScreen() {
  const { theme } = useAppTheme();
  const styles = useStyles(makeStyles);
  const insets = useSafeAreaInsets();
  const navigation = useAppNavigation();
  const route = useAppRoute<'TaskCreate'>();
  const haptics = useHaptics();

  const { addTask, projects, tags } = useTaskStore();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('none');
  const [dueDate, setDueDate] = useState(route.params?.dueDate ?? '');
  const [projectId, setProjectId] = useState(route.params?.projectId);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [estimatedMinutes, setEstimatedMinutes] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const canSave = title.trim().length > 0;

  const handleSave = useCallback(() => {
    if (!canSave) return;
    haptics.success();
    addTask({
      ...createEmptyTask(),
      id: generateId(),
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      dueDate: dueDate || undefined,
      projectId,
      tagIds: selectedTagIds,
      estimatedMinutes: estimatedMinutes ? parseInt(estimatedMinutes) : undefined,
    });
    navigation.goBack();
  }, [canSave, title, description, priority, dueDate, projectId, selectedTagIds, estimatedMinutes, addTask, navigation, haptics]);

  const toggleTag = useCallback((tagId: string) => {
    haptics.selection();
    setSelectedTagIds(prev =>
      prev.includes(tagId) ? prev.filter(id => id !== tagId) : [...prev, tagId],
    );
  }, [haptics]);

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + moderateScale(4) }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={[styles.headerAction, { color: theme.colors.textSecondary }]}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Task</Text>
        <TouchableOpacity onPress={handleSave} disabled={!canSave} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={[styles.headerAction, { color: canSave ? theme.colors.primary : theme.colors.textTertiary, fontWeight: '600' }]}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + moderateScale(40) }]} keyboardShouldPersistTaps="handled">
        {/* Title */}
        <TextInput
          style={styles.titleInput}
          placeholder="What needs to be done?"
          placeholderTextColor={theme.colors.textTertiary}
          value={title}
          onChangeText={setTitle}
          multiline
          autoFocus
          returnKeyType="next"
        />

        {/* Description */}
        <TextInput
          style={styles.descInput}
          placeholder="Add notes…"
          placeholderTextColor={theme.colors.textTertiary}
          value={description}
          onChangeText={setDescription}
          multiline
        />

        <View style={styles.divider} />

        {/* Priority Row */}
        <View style={styles.row}>
          <View style={styles.rowLabel}>
            <Feather name="flag" size={moderateScale(18)} color={theme.colors.textSecondary} />
            <Text style={styles.rowLabelText}>Priority</Text>
          </View>
          <View style={styles.priorityOptions}>
            {PRIORITY_OPTIONS.map(p => (
              <TouchableOpacity
                key={p}
                onPress={() => { haptics.selection(); setPriority(p); }}
                style={[styles.priorityOption, priority === p && { backgroundColor: PRIORITY_CONFIG[p].color + '22', borderColor: PRIORITY_CONFIG[p].color }]}
              >
                <Text style={[styles.priorityOptionText, { color: priority === p ? PRIORITY_CONFIG[p].color : theme.colors.textSecondary }]}>
                  {PRIORITY_CONFIG[p].label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Due Date */}
        <View style={styles.row}>
          <View style={styles.rowLabel}>
            <Feather name="calendar" size={moderateScale(18)} color={theme.colors.textSecondary} />
            <Text style={styles.rowLabelText}>Due Date</Text>
          </View>
          <TextInput
            style={styles.inlineInput}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={theme.colors.textTertiary}
            value={dueDate}
            onChangeText={setDueDate}
          />
        </View>

        {/* Project */}
        {projects.length > 0 && (
          <View style={styles.column}>
            <View style={styles.rowLabel}>
              <Feather name="folder" size={moderateScale(18)} color={theme.colors.textSecondary} />
              <Text style={styles.rowLabelText}>Project</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
              <TouchableOpacity
                style={[styles.chipOption, !projectId && { borderColor: theme.colors.primary, backgroundColor: theme.colors.primary + '18' }]}
                onPress={() => { haptics.selection(); setProjectId(undefined); }}
              >
                <Text style={[styles.chipOptionText, { color: !projectId ? theme.colors.primary : theme.colors.textSecondary }]}>None</Text>
              </TouchableOpacity>
              {projects.filter(p => !p.isArchived).map(project => (
                <TouchableOpacity
                  key={project.id}
                  style={[styles.chipOption, projectId === project.id && { borderColor: project.color, backgroundColor: project.color + '18' }]}
                  onPress={() => { haptics.selection(); setProjectId(project.id); }}
                >
                  <Text style={[styles.chipOptionText, { color: projectId === project.id ? project.color : theme.colors.textSecondary }]}>{project.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <View style={styles.column}>
            <View style={styles.rowLabel}>
              <Feather name="tag" size={moderateScale(18)} color={theme.colors.textSecondary} />
              <Text style={styles.rowLabelText}>Tags</Text>
            </View>
            <View style={styles.tagsWrap}>
              {tags.map(tag => (
                <TouchableOpacity key={tag.id} onPress={() => toggleTag(tag.id)}>
                  <TagChip tag={tag} selected={selectedTagIds.includes(tag.id)} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Advanced toggle */}
        <TouchableOpacity style={styles.advancedToggle} onPress={() => setShowAdvanced(v => !v)}>
          <Feather name={showAdvanced ? 'chevron-up' : 'chevron-down'} size={moderateScale(16)} color={theme.colors.textSecondary} />
          <Text style={styles.advancedToggleText}>Advanced options</Text>
        </TouchableOpacity>

        {showAdvanced && (
          <>
            {/* Estimate */}
            <View style={styles.row}>
              <View style={styles.rowLabel}>
                <Feather name="clock" size={moderateScale(18)} color={theme.colors.textSecondary} />
                <Text style={styles.rowLabelText}>Estimate (minutes)</Text>
              </View>
              <TextInput
                style={styles.inlineInput}
                placeholder="e.g. 30"
                placeholderTextColor={theme.colors.textTertiary}
                value={estimatedMinutes}
                onChangeText={setEstimatedMinutes}
                keyboardType="number-pad"
              />
            </View>

            {/* Recurring */}
            <View style={styles.row}>
              <View style={styles.rowLabel}>
                <Feather name="repeat" size={moderateScale(18)} color={theme.colors.textSecondary} />
                <Text style={styles.rowLabelText}>Recurring</Text>
              </View>
              <Switch
                value={isRecurring}
                onValueChange={v => { haptics.selection(); setIsRecurring(v); }}
                trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                thumbColor="#fff"
              />
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const makeStyles = (theme: AppTheme) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: moderateScale(20), paddingBottom: moderateScale(12) },
  headerTitle: { fontSize: theme.typography.titleMedium, fontWeight: '600', color: theme.colors.text },
  headerAction: { fontSize: theme.typography.bodyLarge },
  content: { paddingHorizontal: moderateScale(20) },
  titleInput: { fontSize: theme.typography.headlineSmall, fontWeight: '600', color: theme.colors.text, paddingVertical: moderateScale(8), minHeight: moderateScale(56) },
  descInput: { fontSize: theme.typography.bodyLarge, color: theme.colors.text, paddingVertical: moderateScale(8), minHeight: moderateScale(80), lineHeight: moderateScale(26) },
  divider: { height: 1, backgroundColor: theme.colors.separator, marginVertical: moderateScale(16) },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: moderateScale(12), borderBottomWidth: 1, borderBottomColor: theme.colors.separator },
  column: { paddingVertical: moderateScale(12), borderBottomWidth: 1, borderBottomColor: theme.colors.separator, gap: moderateScale(10) },
  rowLabel: { flexDirection: 'row', alignItems: 'center', gap: moderateScale(10) },
  rowLabelText: { fontSize: theme.typography.bodyLarge, color: theme.colors.text },
  inlineInput: { fontSize: theme.typography.bodyLarge, color: theme.colors.text, textAlign: 'right' },
  priorityOptions: { flexDirection: 'row', gap: moderateScale(6) },
  priorityOption: { paddingHorizontal: moderateScale(10), paddingVertical: moderateScale(4), borderRadius: moderateScale(20), borderWidth: 1, borderColor: theme.colors.border },
  priorityOptionText: { fontSize: theme.typography.labelSmall, fontWeight: '500' },
  chipScroll: { marginTop: moderateScale(4) },
  chipOption: { paddingHorizontal: moderateScale(12), paddingVertical: moderateScale(6), borderRadius: moderateScale(20), borderWidth: 1, borderColor: theme.colors.border, marginRight: moderateScale(6) },
  chipOptionText: { fontSize: theme.typography.labelMedium, fontWeight: '500' },
  tagsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: moderateScale(6) },
  advancedToggle: { flexDirection: 'row', alignItems: 'center', gap: moderateScale(6), paddingVertical: moderateScale(16) },
  advancedToggleText: { fontSize: theme.typography.bodyMedium, color: theme.colors.textSecondary },
});
