import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { moderateScale } from 'react-native-size-matters';
import { Feather } from '@expo/vector-icons';
import { useAppTheme } from '../../theme';
import { useStyles, useAppNavigation } from '../../hooks';
import { useTaskStore } from '../../store/task-store';
import { useDebounce } from '../../hooks/use-debounce';
import TaskCard from '../../components/task-card';
import type { AppTheme, Priority } from '../../types';
import { PRIORITY_CONFIG, PRIORITY_OPTIONS } from '../../constants';

export default function SearchScreen() {
  const { theme } = useAppTheme();
  const styles = useStyles(makeStyles);
  const insets = useSafeAreaInsets();
  const navigation = useAppNavigation();
  const { tasks } = useTaskStore();

  const [query, setQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState<Priority | null>(null);
  const debouncedQuery = useDebounce(query, 200);

  const results = useMemo(() => {
    let filtered = tasks.filter(t => t.status !== 'archived');
    if (debouncedQuery) {
      const q = debouncedQuery.toLowerCase();
      filtered = filtered.filter(t =>
        t.title.toLowerCase().includes(q) ||
        t.description?.toLowerCase().includes(q) ||
        t.notes?.toLowerCase().includes(q),
      );
    }
    if (filterPriority) {
      filtered = filtered.filter(t => t.priority === filterPriority);
    }
    return filtered;
  }, [tasks, debouncedQuery, filterPriority]);

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + moderateScale(4) }]}>
        <View style={styles.searchBox}>
          <Feather name="search" size={moderateScale(18)} color={theme.colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search tasks, notes…"
            placeholderTextColor={theme.colors.textTertiary}
            value={query}
            onChangeText={setQuery}
            autoFocus
            returnKeyType="search"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Feather name="x" size={moderateScale(18)} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={[styles.cancelText, { color: theme.colors.primary }]}>Cancel</Text>
        </TouchableOpacity>
      </View>

      {/* Priority filters */}
      <View style={styles.filters}>
        <TouchableOpacity
          style={[styles.filterChip, !filterPriority && { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary }]}
          onPress={() => setFilterPriority(null)}
        >
          <Text style={[styles.filterText, !filterPriority && { color: '#fff' }]}>All</Text>
        </TouchableOpacity>
        {PRIORITY_OPTIONS.filter(p => p !== 'none').map(p => (
          <TouchableOpacity
            key={p}
            style={[styles.filterChip, filterPriority === p && { backgroundColor: PRIORITY_CONFIG[p].color, borderColor: PRIORITY_CONFIG[p].color }]}
            onPress={() => setFilterPriority(filterPriority === p ? null : p)}
          >
            <Text style={[styles.filterText, filterPriority === p && { color: '#fff' }]}>{PRIORITY_CONFIG[p].label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={results}
        keyExtractor={t => t.id}
        renderItem={({ item }) => <TaskCard task={item} onPress={(t) => navigation.navigate('TaskDetail', { taskId: t.id })} />}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + moderateScale(40) }]}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Feather name="search" size={moderateScale(40)} color={theme.colors.textTertiary} />
            <Text style={styles.emptyText}>{query ? 'No results found' : 'Start typing to search'}</Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const makeStyles = (theme: AppTheme) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: moderateScale(16), gap: moderateScale(10), paddingBottom: moderateScale(12) },
  searchBox: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.surfaceVariant, borderRadius: theme.radius.lg, paddingHorizontal: moderateScale(14), height: moderateScale(44), gap: moderateScale(10) },
  searchInput: { flex: 1, fontSize: theme.typography.bodyLarge, color: theme.colors.text },
  cancelText: { fontSize: theme.typography.bodyLarge },
  filters: { flexDirection: 'row', paddingHorizontal: moderateScale(16), gap: moderateScale(8), paddingBottom: moderateScale(12) },
  filterChip: { paddingHorizontal: moderateScale(12), paddingVertical: moderateScale(6), borderRadius: moderateScale(20), borderWidth: 1, borderColor: theme.colors.border },
  filterText: { fontSize: theme.typography.labelMedium, fontWeight: '500', color: theme.colors.textSecondary },
  list: { paddingHorizontal: moderateScale(16) },
  empty: { alignItems: 'center', paddingTop: moderateScale(60), gap: moderateScale(12) },
  emptyText: { fontSize: theme.typography.bodyLarge, color: theme.colors.textSecondary },
});
