import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigator from './tab-navigator';
import TaskDetailScreen from '../screens/task-detail';
import TaskCreateScreen from '../screens/task-create';
import ProjectDetailScreen from '../screens/project-detail';
import CalendarScreen from '../screens/calendar';
import KanbanScreen from '../screens/kanban';
import EisenhowerScreen from '../screens/eisenhower';
import StatisticsScreen from '../screens/statistics';
import AchievementsScreen from '../screens/achievements';
import SearchScreen from '../screens/search';
import SettingsScreen from '../screens/settings';
import AppearanceSettingsScreen from '../screens/settings/appearance';
import FocusScreen from '../screens/focus';
import type { AppStackParamList } from '../types';

const Stack = createNativeStackNavigator<AppStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={TabNavigator} />
      <Stack.Screen name="TaskDetail" component={TaskDetailScreen} options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="TaskCreate" component={TaskCreateScreen} options={{ animation: 'slide_from_bottom', presentation: 'modal' }} />
      <Stack.Screen name="TaskEdit" component={TaskCreateScreen} options={{ animation: 'slide_from_bottom', presentation: 'modal' }} />
      <Stack.Screen name="ProjectDetail" component={ProjectDetailScreen} options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="Calendar" component={CalendarScreen} options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="Kanban" component={KanbanScreen} options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="Eisenhower" component={EisenhowerScreen} options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="Statistics" component={StatisticsScreen} options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="Achievements" component={AchievementsScreen} options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="Search" component={SearchScreen} options={{ animation: 'fade' }} />
      <Stack.Screen name="Settings" component={SettingsScreen} options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="AppearanceSettings" component={AppearanceSettingsScreen} options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="NotificationSettings" component={SettingsScreen} options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="AccountSettings" component={SettingsScreen} options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="DataSettings" component={SettingsScreen} options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="FocusTimer" component={FocusScreen} options={{ animation: 'slide_from_bottom', presentation: 'modal' }} />
      <Stack.Screen name="TagsList" component={SearchScreen} options={{ animation: 'slide_from_right' }} />
    </Stack.Navigator>
  );
}
