import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { moderateScale } from 'react-native-size-matters';
import { useAppTheme } from '../../theme';
import { useStyles } from '../../hooks';
import type { AppTheme } from '../../types';

interface Props {
  icon: string;
  title: string;
  subtitle?: string;
}

export default function EmptyState({ icon, title, subtitle }: Props) {
  const { theme } = useAppTheme();
  const styles = useStyles(makeStyles);

  return (
    <View style={styles.container}>
      <View style={[styles.iconContainer, { backgroundColor: theme.colors.surfaceVariant }]}>
        <Feather name={icon as any} size={moderateScale(32)} color={theme.colors.textTertiary} />
      </View>
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
}

const makeStyles = (theme: AppTheme) => StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: moderateScale(40), gap: moderateScale(12) },
  iconContainer: { width: moderateScale(72), height: moderateScale(72), borderRadius: moderateScale(36), alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: theme.typography.titleMedium, fontWeight: '600', color: theme.colors.text, textAlign: 'center' },
  subtitle: { fontSize: theme.typography.bodyMedium, color: theme.colors.textSecondary, textAlign: 'center', lineHeight: moderateScale(22) },
});
