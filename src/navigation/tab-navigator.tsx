import React from 'react';
import { Platform, View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import { moderateScale } from 'react-native-size-matters';
import { BlurView } from 'expo-blur';
import { useAppTheme } from '../theme';
import InboxScreen from '../screens/inbox';
import UpcomingScreen from '../screens/upcoming';
import ProjectsScreen from '../screens/projects';
import FocusScreen from '../screens/focus';
import ProfileScreen from '../screens/profile';
import type { TabParamList } from '../types';

const Tab = createBottomTabNavigator<TabParamList>();

const TAB_ICONS: Record<keyof TabParamList, string> = {
  Inbox: 'inbox',
  Upcoming: 'calendar',
  Projects: 'folder',
  Focus: 'target',
  Profile: 'user',
};

export default function TabNavigator() {
  const { theme, isDark } = useAppTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textTertiary,
        tabBarStyle: {
          backgroundColor: theme.colors.tabBar,
          borderTopColor: theme.colors.tabBarBorder,
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? moderateScale(83) : moderateScale(60),
          paddingBottom: Platform.OS === 'ios' ? moderateScale(24) : moderateScale(8),
          paddingTop: moderateScale(8),
        },
        tabBarLabelStyle: { fontSize: moderateScale(10), fontWeight: '600' },
        tabBarIcon: ({ color, size }) => (
          <Feather name={TAB_ICONS[route.name] as any} size={moderateScale(22)} color={color} />
        ),
      })}
    >
      <Tab.Screen name="Inbox" component={InboxScreen} />
      <Tab.Screen name="Upcoming" component={UpcomingScreen} />
      <Tab.Screen name="Projects" component={ProjectsScreen} />
      <Tab.Screen name="Focus" component={FocusScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
