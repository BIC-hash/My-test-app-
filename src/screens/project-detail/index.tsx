import React, { useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { moderateScale } from 'react-native-size-matters';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppTheme } from '../../theme';
import { useStyles, useAppNavigation, useAppRoute } from '../../hooks';
import { useTaskStore } from '../../store/task-store';
import TaskCard from '../../components/task-card';
import EmptyState from '../../components/empty-state';
import Fab from '../../components/fab';
import type { AppTheme } from '../../types';

export default function ProjectDetailScreen() {
  const { theme } = useAppTheme();
  const styles = useStyles(makeStyles);
  const insets = useSafeAreaInsets();
  const navigation = useAppNavigation();
  const route = useAppRoute<'ProjectDetail'>();
  const { projects, tasks } = useTaskStore();

  const project = projects.find(p => p.id === route.params.projectId);
  const projectTasks = useMemo(
    () => tasks.filter(t => t.projectId === route.params.projectId && t.status !== 'archived'),
    [tasks, route.params.projectId],
  );

  if (!project) return null;

  const done = projectTasks.filter(t => t.status === 'done').length;
  const progress = projectTasks.length > 0 ? done / projectTasks.length : 0;

  return (
    <View style={styles.container}>
      <LinearGradient colors={[project.color, project.color + 'AA']} style={[styles.hero, { paddingTop: insets.top + moderateScale(8) }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Feather name="arrow-left" size={moderateScale(24)} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.projectName}>{project.name}</Text>
        <Text style={styles.taskCount}>{done}/{projectTasks.length} tasks done</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>
        <View style={styles.heroActions}>
          <TouchableOpacity onPress={() => navigation.navigate('Kanban', { projectId: project.id })} style={styles.heroAction}>
            <Feather name="columns" size={moderateScale(16)} color="rgba(255,255,255,0.85)" />
            <Text style={styles.heroActionText}>Kanban</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <FlatList
        data={projectTasks}
        keyExtractor={t => t.id}
        renderItem={({ item }) => <TaskCard task={item} onPress={(t) => navigation.navigate('TaskDetail', { taskId: t.id })} />}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + moderateScale(100) }, projectTasks.length === 0 && { flex: 1 }]}
        ListEmptyComponent={<EmptyState icon="check-square" title="No tasks yet" subtitle="Add your first task to this project." />}
        showsVerticalScrollIndicator={false}
      />
      <Fab onPress={() => navigation.navigate('TaskCreate', { projectId: project.id })} />
    </View>
  );
}

const makeStyles = (theme: AppTheme) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  hero: { paddingHorizontal: moderateScale(20), paddingBottom: moderateScale(20) },
  projectName: { fontSize: theme.typography.headlineMedium, fontWeight: '700', color: '#fff', marginTop: moderateScale(16) },
  taskCount: { fontSize: theme.typography.bodyMedium, color: 'rgba(255,255,255,0.7)', marginBottom: moderateScale(12) },
  progressBar: { height: moderateScale(6), backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: moderateScale(3), overflow: 'hidden', marginBottom: moderateScale(12) },
  progressFill: { height: '100%', backgroundColor: '#fff', borderRadius: moderateScale(3) },
  heroActions: { flexDirection: 'row', gap: moderateScale(10) },
  heroAction: { flexDirection: 'row', alignItems: 'center', gap: moderateScale(6), backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: moderateScale(12), paddingVertical: moderateScale(6), borderRadius: moderateScale(20) },
  heroActionText: { fontSize: theme.typography.labelMedium, color: '#fff', fontWeight: '500' },
  list: { paddingHorizontal: moderateScale(16), paddingTop: moderateScale(16) },
});
