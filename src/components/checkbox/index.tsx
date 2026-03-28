import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { moderateScale } from 'react-native-size-matters';
import { useAppTheme } from '../../theme';
import { useStyles } from '../../hooks';
import type { AppTheme } from '../../types';

interface Props {
  checked: boolean;
  onPress: () => void;
  size?: number;
  color?: string;
}

export default function Checkbox({ checked, onPress, size = moderateScale(24), color }: Props) {
  const { theme } = useAppTheme();
  const styles = useStyles(makeStyles);
  const activeColor = color ?? theme.colors.primary;

  return (
    <TouchableOpacity
      onPress={onPress}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      style={[
        styles.box,
        { width: size, height: size, borderRadius: size / 2, borderColor: checked ? activeColor : theme.colors.border, backgroundColor: checked ? activeColor : 'transparent' },
      ]}
    >
      {checked && <Feather name="check" size={size * 0.6} color="#fff" />}
    </TouchableOpacity>
  );
}

const makeStyles = (theme: AppTheme) => StyleSheet.create({
  box: { alignItems: 'center', justifyContent: 'center', borderWidth: 2 },
});
