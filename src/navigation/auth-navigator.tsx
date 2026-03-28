import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OnboardingScreen from '../screens/auth/onboarding';
import LoginScreen from '../screens/auth/login';
import RegisterScreen from '../screens/auth/register';
import { authStorage } from '../storage';
import type { AuthStackParamList } from '../types';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthNavigator() {
  const onboardingDone = authStorage.isOnboardingCompleted();

  return (
    <Stack.Navigator
      initialRouteName={onboardingDone ? 'Login' : 'Onboarding'}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Onboarding">
        {props => <OnboardingScreen onComplete={() => props.navigation.replace('Login')} />}
      </Stack.Screen>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="ForgotPassword" component={LoginScreen} options={{ animation: 'slide_from_right' }} />
    </Stack.Navigator>
  );
}
