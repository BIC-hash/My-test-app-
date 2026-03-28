import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { useStyles } from '../../hooks';
import type { Tag, AppTheme } from '../../types';

interface Props {
  tag: Tag;
  compact?: boolean;
  selected?: boolean;
}

export default function TagChip({ tag, compact, selected }: Props) {
  const styles = useStyles(makeStyles);
  return (
    <View style={[
      styles.chip,
      { backgroundColor: tag.color + (selected ? 'CC' : '22'), borderColor: tag.color + (selected ? 'FF' : '55') },
    ]}>
      <Text style={[styles.label, { color: selected ? '#fff' : tag.color }]}>
        {compact ? tag.name[0].toUpperCase() : `# ${tag.name}`}
      </Text>
    </View>
  );
}

const makeStyles = (theme: AppTheme) => StyleSheet.create({
  chip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: moderateScale(8), paddingVertical: moderateScale(3), borderRadius: moderateScale(20), borderWidth: 1 },
  label: { fontSize: moderateScale(11), fontWeight: '600' },
});
