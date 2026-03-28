import React, { useCallback, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert, Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { moderateScale } from 'react-native-size-matters';
import { Feather } from '@expo/vector-icons';
import { useAppTheme } from '../../theme';
import { useStyles, useAppNavigation } from '../../hooks';
import { useTaskStore } from '../../store/task-store';
import EmptyState from '../../components/empty-state';
import { generateId } from '../../utils';
import type { AppTheme, Project, ProjectColor, ProjectIcon } from '../../types';

const COLORS: ProjectColor[] = ['#EF4444','#F97316','#EAB308','#22C55E','#06B6D4','#3B82F6','#8B5CF6','#EC4899','#6B7280'];

export default function ProjectsScreen() {
  const { theme } = useAppTheme();
  const styles = useStyles(makeStyles);
  const insets = useSafeAreaInsets();
  const navigation = useAppNavigation();
  const { projects, tasks, addProject } = useTaskStore();
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState<ProjectColor>('#8B5CF6');

  const activeProjects = projects.filter(p => !p.isArchived);

  const getTaskCount = useCallback((projectId: string) => ({
    total: tasks.filter(t => t.projectId === projectId && t.status !== 'archived').length,
    done: tasks.filter(t => t.projectId === projectId && t.status === 'done').length,
  }), [tasks]);

  const handleCreate = () => {
    if (!newName.trim()) return;
    addProject({
      id: generateId(),
      name: newName.trim(),
      color: newColor,
      icon: 'briefcase',
      isArchived: false,
      isFavorite: false,
      sortOrder: projects.length,
      taskCount: 0,
      completedTaskCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    setNewName('');
    setShowCreate(false);
  };

  const renderProject = useCallback(({ item }: { item: Project }) => {
    const counts = getTaskCount(item.id);
    const progress = counts.total > 0 ? counts.done / counts.total : 0;
    return (
      <TouchableOpacity
        style={[styles.projectCard, { ...theme.shadows.sm as object }]}
        onPress={() => navigation.navigate('ProjectDetail', { projectId: item.id })}
        activeOpacity={0.75}
      >
        <View style={[styles.projectIcon, { backgroundColor: item.color + '22' }]}>
          <Feather name="folder" size={moderateScale(22)} color={item.color} />
        </View>
        <View style={styles.projectInfo}>
          <Text style={styles.projectName}>{item.name}</Text>
          <View style={styles.projectMeta}>
            <Text style={styles.projectCount}>{counts.total} tasks</Text>
            {counts.done > 0 && <Text style={styles.projectDone}>· {counts.done} done</Text>}
          </View>
          {counts.total > 0 && (
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progress * 100}%`, backgroundColor: item.color }]} />
            </View>
          )}
        </View>
        <Feather name="chevron-right" size={moderateScale(18)} color={theme.colors.textTertiary} />
      </TouchableOpacity>
    );
  }, [getTaskCount, navigation, theme, styles]);

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + moderateScale(8) }]}>
        <Text style={styles.heading}>Projects</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => setShowCreate(true)}>
          <Feather name="plus" size={moderateScale(22)} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={activeProjects}
        keyExtractor={p => p.id}
        renderItem={renderProject}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + moderateScale(40) }, activeProjects.length === 0 && { flex: 1 }]}
        ListEmptyComponent={<EmptyState icon="folder" title="No projects yet" subtitle="Create a project to organize your tasks." />}
        showsVerticalScrollIndicator={false}
      />

      {/* Create Project Modal */}
      <Modal visible={showCreate} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>New Project</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Project name…"
              placeholderTextColor={theme.colors.textTertiary}
              value={newName}
              onChangeText={setNewName}
              autoFocus
            />
            <Text style={styles.colorLabel}>Color</Text>
            <View style={styles.colorRow}>
              {COLORS.map(c => (
                <TouchableOpacity key={c} style={[styles.colorDot, { backgroundColor: c }, newColor === c && styles.colorDotSelected]} onPress={() => setNewColor(c)} />
              ))}
            </View>
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalCancel} onPress={() => setShowCreate(false)}>
                <Text style={[styles.modalCancelText, { color: theme.colors.textSecondary }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalCreate, { backgroundColor: theme.colors.primary }]} onPress={handleCreate}>
                <Text style={styles.modalCreateText}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const makeStyles = (theme: AppTheme) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: moderateScale(20), paddingBottom: moderateScale(12) },
  heading: { fontSize: theme.typography.headlineLarge, fontWeight: '700', color: theme.colors.text },
  addBtn: { width: moderateScale(44), height: moderateScale(44), alignItems: 'center', justifyContent: 'center' },
  list: { paddingHorizontal: moderateScale(16), gap: moderateScale(10) },
  projectCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.card, borderRadius: theme.radius.lg, padding: moderateScale(16), gap: moderateScale(14) },
  projectIcon: { width: moderateScale(48), height: moderateScale(48), borderRadius: theme.radius.md, alignItems: 'center', justifyContent: 'center' },
  projectInfo: { flex: 1, gap: moderateScale(4) },
  projectName: { fontSize: theme.typography.titleMedium, fontWeight: '600', color: theme.colors.text },
  projectMeta: { flexDirection: 'row', gap: moderateScale(4) },
  projectCount: { fontSize: theme.typography.bodySmall, color: theme.colors.textSecondary },
  projectDone: { fontSize: theme.typography.bodySmall, color: theme.colors.textTertiary },
  progressBar: { height: moderateScale(4), backgroundColor: theme.colors.border, borderRadius: moderateScale(2), overflow: 'hidden', marginTop: moderateScale(4) },
  progressFill: { height: '100%', borderRadius: moderateScale(2) },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: theme.colors.surface, borderTopLeftRadius: theme.radius.xl, borderTopRightRadius: theme.radius.xl, padding: moderateScale(24), gap: moderateScale(16) },
  modalTitle: { fontSize: theme.typography.titleLarge, fontWeight: '700', color: theme.colors.text },
  modalInput: { height: moderateScale(52), borderWidth: 1.5, borderColor: theme.colors.border, borderRadius: theme.radius.md, paddingHorizontal: moderateScale(16), fontSize: theme.typography.bodyLarge, color: theme.colors.text },
  colorLabel: { fontSize: theme.typography.labelLarge, fontWeight: '500', color: theme.colors.textSecondary },
  colorRow: { flexDirection: 'row', flexWrap: 'wrap', gap: moderateScale(10) },
  colorDot: { width: moderateScale(36), height: moderateScale(36), borderRadius: moderateScale(18) },
  colorDotSelected: { borderWidth: 3, borderColor: '#fff', transform: [{ scale: 1.15 }] },
  modalActions: { flexDirection: 'row', gap: moderateScale(12), marginTop: moderateScale(8) },
  modalCancel: { flex: 1, height: moderateScale(52), alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radius.lg },
  modalCancelText: { fontSize: theme.typography.bodyLarge },
  modalCreate: { flex: 1, height: moderateScale(52), alignItems: 'center', justifyContent: 'center', borderRadius: theme.radius.lg },
  modalCreateText: { fontSize: theme.typography.bodyLarge, fontWeight: '600', color: '#fff' },
});
