import React, { useRef, useState } from 'react';
import {
  View, Text, StyleSheet, Dimensions, TouchableOpacity, Platform,
} from 'react-native';
import Animated, {
  useSharedValue, useAnimatedScrollHandler, useAnimatedStyle, interpolate, Extrapolation,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { moderateScale } from 'react-native-size-matters';
import { useAppTheme } from '../../../theme';
import { useStyles } from '../../../hooks';
import { authStorage } from '../../../storage';
import type { AppTheme } from '../../../types';

const { width: W } = Dimensions.get('window');

const SLIDES = [
  {
    title: 'Capture Everything',
    subtitle: 'Add tasks in seconds with natural language, voice input, and smart due date parsing.',
    emoji: '⚡',
    gradient: ['#8B5CF6', '#6D28D9'] as [string, string],
  },
  {
    title: 'Stay in Flow',
    subtitle: 'Built-in Pomodoro timer, focus mode, and deep work tracking to maximize your productivity.',
    emoji: '🎯',
    gradient: ['#3B82F6', '#1D4ED8'] as [string, string],
  },
  {
    title: 'See Your Progress',
    subtitle: 'Beautiful analytics, streaks, achievements, and heatmaps show how far you\'ve come.',
    emoji: '📈',
    gradient: ['#22C55E', '#15803D'] as [string, string],
  },
  {
    title: 'Organize Your Way',
    subtitle: 'Projects, tags, Kanban boards, Eisenhower Matrix — see your work any way you want.',
    emoji: '🗂️',
    gradient: ['#EC4899', '#BE185D'] as [string, string],
  },
];

interface Props {
  onComplete: () => void;
}

export default function OnboardingScreen({ onComplete }: Props) {
  const { theme } = useAppTheme();
  const styles = useStyles(makeStyles);
  const scrollX = useSharedValue(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<any>(null);

  const scrollHandler = useAnimatedScrollHandler(e => {
    scrollX.value = e.contentOffset.x;
  });

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      const next = currentIndex + 1;
      flatListRef.current?.scrollToOffset({ offset: next * W });
      setCurrentIndex(next);
    } else {
      authStorage.setOnboardingCompleted();
      onComplete();
    }
  };

  const handleSkip = () => {
    authStorage.setOnboardingCompleted();
    onComplete();
  };

  return (
    <View style={styles.container}>
      <Animated.FlatList
        ref={flatListRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        onMomentumScrollEnd={e => {
          setCurrentIndex(Math.round(e.nativeEvent.contentOffset.x / W));
        }}
        renderItem={({ item }) => (
          <LinearGradient colors={item.gradient} style={styles.slide}>
            <Text style={styles.emoji}>{item.emoji}</Text>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subtitle}>{item.subtitle}</Text>
          </LinearGradient>
        )}
        keyExtractor={(_, i) => String(i)}
      />

      <View style={styles.footer}>
        {/* Dots */}
        <View style={styles.dots}>
          {SLIDES.map((_, i) => {
            const dotStyle = useAnimatedStyle(() => ({
              width: interpolate(scrollX.value, [(i - 1) * W, i * W, (i + 1) * W], [8, 24, 8], Extrapolation.CLAMP),
              opacity: interpolate(scrollX.value, [(i - 1) * W, i * W, (i + 1) * W], [0.4, 1, 0.4], Extrapolation.CLAMP),
            }));
            return <Animated.View key={i} style={[styles.dot, dotStyle]} />;
          })}
        </View>

        <TouchableOpacity style={[styles.button, { backgroundColor: SLIDES[currentIndex].gradient[0] }]} onPress={handleNext}>
          <Text style={styles.buttonText}>
            {currentIndex === SLIDES.length - 1 ? 'Get Started' : 'Next'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.skip} onPress={handleSkip}>
          <Text style={[styles.skipText, { color: theme.colors.textSecondary }]}>Skip</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const makeStyles = (theme: AppTheme) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  slide: { width: W, flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: moderateScale(40) },
  emoji: { fontSize: moderateScale(80), marginBottom: moderateScale(24) },
  title: { fontSize: theme.typography.headlineLarge, fontWeight: '700', color: '#fff', textAlign: 'center', marginBottom: moderateScale(16) },
  subtitle: { fontSize: theme.typography.bodyLarge, color: 'rgba(255,255,255,0.85)', textAlign: 'center', lineHeight: moderateScale(26) },
  footer: { paddingHorizontal: moderateScale(24), paddingBottom: moderateScale(40), backgroundColor: theme.colors.background },
  dots: { flexDirection: 'row', justifyContent: 'center', marginVertical: moderateScale(20), gap: moderateScale(6) },
  dot: { height: moderateScale(8), borderRadius: moderateScale(4), backgroundColor: theme.colors.primary },
  button: { height: moderateScale(54), borderRadius: theme.radius.lg, alignItems: 'center', justifyContent: 'center' },
  buttonText: { color: '#fff', fontSize: theme.typography.titleMedium, fontWeight: '600' },
  skip: { alignItems: 'center', paddingVertical: moderateScale(16) },
  skipText: { fontSize: theme.typography.bodyMedium },
});
