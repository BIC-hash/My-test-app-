import React, { useEffect, useRef, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Animated as RNAnimated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { moderateScale } from 'react-native-size-matters';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useAppTheme } from '../../theme';
import { useStyles, useAppNavigation } from '../../hooks';
import { useFocusStore } from '../../store/focus-store';
import { formatTime } from '../../utils/date';
import ProgressRing from '../../components/progress-ring';
import type { AppTheme } from '../../types';

const GRADIENT_BY_MODE = {
  work: ['#8B5CF6', '#6D28D9'] as [string, string],
  short_break: ['#22C55E', '#15803D'] as [string, string],
  long_break: ['#3B82F6', '#1D4ED8'] as [string, string],
};

const MODE_LABELS = {
  work: 'Focus',
  short_break: 'Short Break',
  long_break: 'Long Break',
};

export default function FocusScreen() {
  const { theme } = useAppTheme();
  const styles = useStyles(makeStyles);
  const insets = useSafeAreaInsets();
  const navigation = useAppNavigation();

  const { timerState, timerMode, secondsLeft, totalSeconds, sessionCount, start, pause, resume, stop, tick } = useFocusStore();

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pulseAnim = useRef(new RNAnimated.Value(1)).current;

  useEffect(() => {
    if (timerState === 'running') {
      intervalRef.current = setInterval(() => { tick(); }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [timerState, tick]);

  useEffect(() => {
    if (timerState === 'running') {
      RNAnimated.loop(
        RNAnimated.sequence([
          RNAnimated.timing(pulseAnim, { toValue: 1.03, duration: 1000, useNativeDriver: true }),
          RNAnimated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
        ]),
      ).start();
    } else {
      pulseAnim.stopAnimation();
      pulseAnim.setValue(1);
    }
  }, [timerState, pulseAnim]);

  const progress = totalSeconds > 0 ? (totalSeconds - secondsLeft) / totalSeconds : 0;
  const gradient = GRADIENT_BY_MODE[timerMode];

  const handleToggle = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (timerState === 'idle') start();
    else if (timerState === 'running') pause();
    else if (timerState === 'paused') resume();
  }, [timerState, start, pause, resume]);

  const handleStop = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    stop();
  }, [stop]);

  return (
    <LinearGradient colors={gradient} style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + moderateScale(8) }]}>
        <Text style={styles.heading}>Focus</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Statistics')} style={styles.statsBtn}>
          <Feather name="bar-chart-2" size={moderateScale(22)} color="rgba(255,255,255,0.85)" />
        </TouchableOpacity>
      </View>

      {/* Session tabs */}
      <View style={styles.modeTabs}>
        {(['work', 'short_break', 'long_break'] as const).map(mode => (
          <View key={mode} style={[styles.modeTab, timerMode === mode && styles.modeTabActive]}>
            <Text style={[styles.modeTabText, timerMode === mode && styles.modeTabTextActive]}>
              {MODE_LABELS[mode]}
            </Text>
          </View>
        ))}
      </View>

      {/* Timer ring */}
      <RNAnimated.View style={[styles.ringContainer, { transform: [{ scale: pulseAnim }] }]}>
        <ProgressRing
          progress={progress}
          size={moderateScale(260)}
          strokeWidth={moderateScale(10)}
          color="rgba(255,255,255,0.9)"
          trackColor="rgba(255,255,255,0.2)"
        >
          <Text style={styles.timerText}>{formatTime(secondsLeft)}</Text>
          <Text style={styles.timerMode}>{MODE_LABELS[timerMode]}</Text>
        </ProgressRing>
      </RNAnimated.View>

      {/* Session count */}
      <View style={styles.sessionsRow}>
        {Array.from({ length: 4 }).map((_, i) => (
          <View key={i} style={[styles.sessionDot, i < (sessionCount % 4) && styles.sessionDotFilled]} />
        ))}
        <Text style={styles.sessionsText}>{sessionCount} sessions today</Text>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        {timerState !== 'idle' && (
          <TouchableOpacity style={styles.stopBtn} onPress={handleStop}>
            <Feather name="square" size={moderateScale(22)} color="rgba(255,255,255,0.85)" />
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.playBtn} onPress={handleToggle}>
          <Feather
            name={timerState === 'running' ? 'pause' : 'play'}
            size={moderateScale(32)}
            color={gradient[0]}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.stopBtn} onPress={() => navigation.navigate('FocusTimer', {})}>
          <Feather name="settings" size={moderateScale(22)} color="rgba(255,255,255,0.85)" />
        </TouchableOpacity>
      </View>

      {/* Quick stats */}
      <View style={[styles.statsBar, { paddingBottom: insets.bottom + moderateScale(16) }]}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{Math.round((totalSeconds - secondsLeft) / 60)}</Text>
          <Text style={styles.statLabel}>min focused</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{sessionCount}</Text>
          <Text style={styles.statLabel}>sessions</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{sessionCount * 25}</Text>
          <Text style={styles.statLabel}>total min</Text>
        </View>
      </View>
    </LinearGradient>
  );
}

const makeStyles = (theme: AppTheme) => StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: moderateScale(20), paddingBottom: moderateScale(8) },
  heading: { fontSize: theme.typography.headlineMedium, fontWeight: '700', color: '#fff' },
  statsBtn: { width: moderateScale(44), height: moderateScale(44), alignItems: 'center', justifyContent: 'center' },
  modeTabs: { flexDirection: 'row', justifyContent: 'center', gap: moderateScale(8), marginBottom: moderateScale(16) },
  modeTab: { paddingHorizontal: moderateScale(16), paddingVertical: moderateScale(6), borderRadius: moderateScale(20) },
  modeTabActive: { backgroundColor: 'rgba(255,255,255,0.25)' },
  modeTabText: { fontSize: theme.typography.labelMedium, color: 'rgba(255,255,255,0.6)', fontWeight: '500' },
  modeTabTextActive: { color: '#fff' },
  ringContainer: { alignItems: 'center', marginVertical: moderateScale(24) },
  timerText: { fontSize: moderateScale(60), fontWeight: '700', color: '#fff', textAlign: 'center', letterSpacing: -2 },
  timerMode: { fontSize: theme.typography.bodyLarge, color: 'rgba(255,255,255,0.75)', textAlign: 'center' },
  sessionsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: moderateScale(6), marginBottom: moderateScale(32) },
  sessionDot: { width: moderateScale(10), height: moderateScale(10), borderRadius: moderateScale(5), backgroundColor: 'rgba(255,255,255,0.3)' },
  sessionDotFilled: { backgroundColor: '#fff' },
  sessionsText: { fontSize: theme.typography.labelMedium, color: 'rgba(255,255,255,0.7)' },
  controls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: moderateScale(24) },
  playBtn: { width: moderateScale(80), height: moderateScale(80), borderRadius: moderateScale(40), backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  stopBtn: { width: moderateScale(52), height: moderateScale(52), borderRadius: moderateScale(26), backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  statsBar: { flexDirection: 'row', justifyContent: 'center', marginTop: 'auto', paddingTop: moderateScale(24), paddingHorizontal: moderateScale(40) },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: theme.typography.titleLarge, fontWeight: '700', color: '#fff' },
  statLabel: { fontSize: theme.typography.labelSmall, color: 'rgba(255,255,255,0.6)' },
  statDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.2)' },
});
