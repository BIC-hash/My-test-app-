import type { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabNavigationProp, BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeNavigationProp, CompositeScreenProps } from '@react-navigation/native';

export type AuthStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export type TabParamList = {
  Inbox: undefined;
  Upcoming: undefined;
  Projects: undefined;
  Focus: undefined;
  Profile: undefined;
};

export type AppStackParamList = {
  Tabs: undefined;
  TaskDetail: { taskId: string };
  TaskCreate: { projectId?: string; dueDate?: string };
  TaskEdit: { taskId: string };
  ProjectDetail: { projectId: string };
  TagsList: undefined;
  Calendar: undefined;
  Kanban: { projectId?: string };
  Eisenhower: undefined;
  Statistics: undefined;
  Achievements: undefined;
  Search: undefined;
  Settings: undefined;
  AppearanceSettings: undefined;
  NotificationSettings: undefined;
  AccountSettings: undefined;
  DataSettings: undefined;
  FocusTimer: { taskId?: string };
};

export type RootStackParamList = {
  Auth: undefined;
  App: undefined;
};

export type AppNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<AppStackParamList>,
  BottomTabNavigationProp<TabParamList>
>;
