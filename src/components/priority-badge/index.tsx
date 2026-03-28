import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { moderateScale } from 'react-native-size-matters';
import { useStyles } from '../../hooks';
import { PRIORITY_CONFIG } from '../../constants';
import type { Priority, AppTheme } from '../../types';

interface Props {
  priority: Priority;
  compact?: boolean;
}

export default function PriorityBadge({ priority, compact }: Props) {
  const styles = useStyles(makeStyles);
  const cfg = PRIORITY_CONFIG[priority];

  return (
    <View style={[styles.badge, { backgroundColor: cfg.color + '20', borderColor: cfg.color + '40' }]}>
      <Feather name={cfg.icon as any} size={compact ? moderateScale(10) : moderateScale(12)} color={cfg.color} />
      {!compact && <Text style={[styles.label, { color: cfg.color }]}>{cfg.label}</Text>}
    </View>
  );
}

const makeStyles = (theme: AppTheme) => StyleSheet.create({
  badge: { flexDirection: 'row', alignItems: 'center', gap: moderateScale(4), paddingHorizontal: moderateScale(8), paddingVertical: moderateScale(3), borderRadius: moderateScale(20), borderWidth: 1 },
  label: { fontSize: moderateScale(11), fontWeight: '600' },
});
