import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { AppProviders } from './src/providers';
import RootNavigator from './src/navigation';
import { useTaskStore } from './src/store/task-store';
import { useAppTheme } from './src/theme';

function AppContent() {
  const { isDark } = useAppTheme();
  const loadFromStorage = useTaskStore(s => s.loadFromStorage);

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <RootNavigator />
    </>
  );
}

export default function App() {
  return (
    <AppProviders>
      <AppContent />
    </AppProviders>
  );
}
