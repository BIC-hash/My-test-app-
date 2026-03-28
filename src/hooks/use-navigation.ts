import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { AppStackParamList, AppNavigationProp } from '../types';

export function useAppNavigation() {
  return useNavigation<AppNavigationProp>();
}

export function useAppRoute<T extends keyof AppStackParamList>() {
  return useRoute<RouteProp<AppStackParamList, T>>();
}
