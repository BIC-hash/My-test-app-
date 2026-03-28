import React from 'react';
import { TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { moderateScale } from 'react-native-size-matters';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '../../theme';
import { useStyles } from '../../hooks';
import { LAYOUT } from '../../constants/layout';
import type { AppTheme } from '../../types';

interface Props {
  onPress: () => void;
  icon?: string;
}

export default function Fab({ onPress, icon = 'plus' }: Props) {
  const { theme } = useAppTheme();
  const styles = useStyles(makeStyles);
  const insets = useSafeAreaInsets();

  return (
    <TouchableOpacity
      style={[styles.fab, { bottom: insets.bottom + LAYOUT.fabBottom, ...theme.shadows.lg as object }]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <Feather name={icon as any} size={moderateScale(26)} color="#fff" />
    </TouchableOpacity>
  );
}

const makeStyles = (theme: AppTheme) => StyleSheet.create({
  fab: { position: 'absolute', right: moderateScale(20), width: LAYOUT.fabSize, height: LAYOUT.fabSize, borderRadius: LAYOUT.fabSize / 2, backgroundColor: theme.colors.primary, alignItems: 'center', justifyContent: 'center' },
});
