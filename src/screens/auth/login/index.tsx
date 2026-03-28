import React, { useCallback } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, StyleSheet,
} from 'react-native';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { moderateScale } from 'react-native-size-matters';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppTheme } from '../../../theme';
import { useStyles } from '../../../hooks';
import { useAuthStore } from '../../../store/auth-store';
import type { AppTheme } from '../../../types';
import type { AppNavigationProp } from '../../../types';
import { useNavigation } from '@react-navigation/native';

const schema = Yup.object({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(6, 'Min 6 characters').required('Password is required'),
});

export default function LoginScreen() {
  const { theme } = useAppTheme();
  const styles = useStyles(makeStyles);
  const navigation = useNavigation<AppNavigationProp>();
  const { setUser, setToken, setLoading, isLoading } = useAuthStore();

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: schema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        // Simulated auth — replace with real API call
        await new Promise(resolve => setTimeout(resolve, 800));
        setToken('mock-jwt-token');
        setUser({
          id: '1', email: values.email, name: 'Task Pro User',
          level: 1, xp: 0, xpToNextLevel: 100, streakDays: 0, longestStreak: 0,
          totalTasksCompleted: 0, joinedAt: new Date().toISOString(),
        });
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.root}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <LinearGradient colors={[theme.colors.primary, theme.colors.primaryDark]} style={styles.logoContainer}>
          <Text style={styles.logoText}>✓</Text>
        </LinearGradient>

        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>Sign in to your TaskPro account</Text>

        <View style={styles.form}>
          <View style={styles.field}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[styles.input, formik.touched.email && formik.errors.email && styles.inputError]}
              placeholder="you@example.com"
              placeholderTextColor={theme.colors.textTertiary}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              value={formik.values.email}
              onChangeText={formik.handleChange('email')}
              onBlur={formik.handleBlur('email')}
            />
            {formik.touched.email && formik.errors.email && (
              <Text style={styles.errorText}>{formik.errors.email}</Text>
            )}
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={[styles.input, formik.touched.password && formik.errors.password && styles.inputError]}
              placeholder="••••••••"
              placeholderTextColor={theme.colors.textTertiary}
              secureTextEntry
              autoComplete="password"
              value={formik.values.password}
              onChangeText={formik.handleChange('password')}
              onBlur={formik.handleBlur('password')}
            />
            {formik.touched.password && formik.errors.password && (
              <Text style={styles.errorText}>{formik.errors.password}</Text>
            )}
          </View>

          <TouchableOpacity
            onPress={() => navigation.navigate('ForgotPassword')}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={[styles.forgotText, { color: theme.colors.primary }]}>Forgot password?</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.colors.primary }, isLoading && { opacity: 0.7 }]}
          onPress={() => formik.handleSubmit()}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>{isLoading ? 'Signing in…' : 'Sign In'}</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.colors.textSecondary }]}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={[styles.footerLink, { color: theme.colors.primary }]}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const makeStyles = (theme: AppTheme) => StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.background },
  container: { flexGrow: 1, paddingHorizontal: moderateScale(24), paddingTop: moderateScale(60), paddingBottom: moderateScale(40) },
  logoContainer: { width: moderateScale(72), height: moderateScale(72), borderRadius: moderateScale(20), alignItems: 'center', justifyContent: 'center', marginBottom: moderateScale(32) },
  logoText: { color: '#fff', fontSize: moderateScale(36), fontWeight: '700' },
  title: { fontSize: theme.typography.headlineMedium, fontWeight: '700', color: theme.colors.text, marginBottom: moderateScale(8) },
  subtitle: { fontSize: theme.typography.bodyLarge, color: theme.colors.textSecondary, marginBottom: moderateScale(32) },
  form: { gap: moderateScale(16), marginBottom: moderateScale(8) },
  field: { gap: moderateScale(6) },
  label: { fontSize: theme.typography.labelLarge, fontWeight: '500', color: theme.colors.text },
  input: { height: moderateScale(52), borderWidth: 1.5, borderColor: theme.colors.border, borderRadius: theme.radius.md, paddingHorizontal: moderateScale(16), fontSize: theme.typography.bodyLarge, color: theme.colors.text, backgroundColor: theme.colors.surface },
  inputError: { borderColor: theme.colors.error },
  errorText: { fontSize: theme.typography.labelSmall, color: theme.colors.error },
  forgotText: { fontSize: theme.typography.bodyMedium, textAlign: 'right', marginTop: moderateScale(4) },
  button: { height: moderateScale(54), borderRadius: theme.radius.lg, alignItems: 'center', justifyContent: 'center', marginTop: moderateScale(24) },
  buttonText: { color: '#fff', fontSize: theme.typography.titleMedium, fontWeight: '600' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: moderateScale(24) },
  footerText: { fontSize: theme.typography.bodyMedium },
  footerLink: { fontSize: theme.typography.bodyMedium, fontWeight: '600' },
});
