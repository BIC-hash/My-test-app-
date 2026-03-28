import { Dimensions, Platform } from 'react-native';
import { moderateScale } from 'react-native-size-matters';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const LAYOUT = {
  screenWidth: SCREEN_WIDTH,
  screenHeight: SCREEN_HEIGHT,
  isSmallDevice: SCREEN_WIDTH < 375,
  isTablet: SCREEN_WIDTH >= 768,

  // Touch targets (44pt iOS / 48dp Android)
  touchTarget: Platform.OS === 'ios' ? moderateScale(44) : moderateScale(48),
  touchTargetSmall: moderateScale(36),

  tabBarHeight: Platform.OS === 'ios' ? moderateScale(83) : moderateScale(60),
  headerHeight: Platform.OS === 'ios' ? moderateScale(56) : moderateScale(64),
  fabSize: moderateScale(56),
  fabBottom: moderateScale(24),

  // Swipe thresholds
  swipeThreshold: SCREEN_WIDTH * 0.3,
  swipeVelocityThreshold: 500,
};

export const POMODORO = {
  workMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  sessionsBeforeLongBreak: 4,
};

export const GAMIFICATION = {
  xpPerTask: 10,
  xpPerUrgentTask: 25,
  xpPerStreak: 5,
  xpPerPomodoro: 15,
  levelXpBase: 100,
  levelXpMultiplier: 1.5,
};
