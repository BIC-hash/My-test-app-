import React from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, StyleSheet,
} from 'react-native';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { moderateScale } from 'react-native-size-matters';
import { useNavigation } from '@react-navigation/native';
import { useAppTheme } from '../../../theme';
import { useStyles } from '../../../hooks';
import { useAuthStore } from '../../../store/auth-store';
import type { AppTheme, AppNavigationProp } from '../../../types';

const schema = Yup.object({
  name: Yup.string().min(2, 'Name too short').required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(6, 'Min 6 characters').required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
});

export default function RegisterScreen() {
  const { theme } = useAppTheme();
  const styles = useStyles(makeStyles);
  const navigation = useNavigation<AppNavigationProp>();
  const { setUser, setToken, setLoading, isLoading } = useAuthStore();

  const formik = useFormik({
    initialValues: { name: '', email: '', password: '', confirmPassword: '' },
    validationSchema: schema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 800));
        setToken('mock-jwt-token');
        setUser({
          id: '1', email: values.email, name: values.name,
          level: 1, xp: 0, xpToNextLevel: 100, streakDays: 0, longestStreak: 0,
          totalTasksCompleted: 0, joinedAt: new Date().toISOString(),
        });
      } finally {
        setLoading(false);
      }
    },
  });

  const fields: Array<{ key: keyof typeof formik.values; label: string; placeholder: string; secure?: boolean; keyboard?: any; complete?: any }> = [
    { key: 'name', label: 'Full Name', placeholder: 'Alex Johnson', complete: 'name' },
    { key: 'email', label: 'Email', placeholder: 'you@example.com', keyboard: 'email-address', complete: 'email' },
    { key: 'password', label: 'Password', placeholder: '••••••••', secure: true, complete: 'new-password' },
    { key: 'confirmPassword', label: 'Confirm Password', placeholder: '••••••••', secure: true },
  ];

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.root}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Create account</Text>
        <Text style={styles.subtitle}>Start your productivity journey</Text>

        <View style={styles.form}>
          {fields.map(({ key, label, placeholder, secure, keyboard, complete }) => (
            <View key={key} style={styles.field}>
              <Text style={styles.label}>{label}</Text>
              <TextInput
                style={[styles.input, formik.touched[key] && formik.errors[key] && styles.inputError]}
                placeholder={placeholder}
                placeholderTextColor={theme.colors.textTertiary}
                secureTextEntry={secure}
                keyboardType={keyboard}
                autoCapitalize={key === 'name' ? 'words' : 'none'}
                autoComplete={complete}
                value={formik.values[key]}
                onChangeText={formik.handleChange(key)}
                onBlur={formik.handleBlur(key)}
              />
              {formik.touched[key] && formik.errors[key] && (
                <Text style={styles.errorText}>{formik.errors[key]}</Text>
              )}
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.colors.primary }, isLoading && { opacity: 0.7 }]}
          onPress={() => formik.handleSubmit()}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>{isLoading ? 'Creating account…' : 'Create Account'}</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.colors.textSecondary }]}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={[styles.footerLink, { color: theme.colors.primary }]}>Sign in</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const makeStyles = (theme: AppTheme) => StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.background },
  container: { flexGrow: 1, paddingHorizontal: moderateScale(24), paddingTop: moderateScale(60), paddingBottom: moderateScale(40) },
  title: { fontSize: theme.typography.headlineMedium, fontWeight: '700', color: theme.colors.text, marginBottom: moderateScale(8) },
  subtitle: { fontSize: theme.typography.bodyLarge, color: theme.colors.textSecondary, marginBottom: moderateScale(32) },
  form: { gap: moderateScale(16), marginBottom: moderateScale(8) },
  field: { gap: moderateScale(6) },
  label: { fontSize: theme.typography.labelLarge, fontWeight: '500', color: theme.colors.text },
  input: { height: moderateScale(52), borderWidth: 1.5, borderColor: theme.colors.border, borderRadius: theme.radius.md, paddingHorizontal: moderateScale(16), fontSize: theme.typography.bodyLarge, color: theme.colors.text, backgroundColor: theme.colors.surface },
  inputError: { borderColor: theme.colors.error },
  errorText: { fontSize: theme.typography.labelSmall, color: theme.colors.error },
  button: { height: moderateScale(54), borderRadius: theme.radius.lg, alignItems: 'center', justifyContent: 'center', marginTop: moderateScale(24) },
  buttonText: { color: '#fff', fontSize: theme.typography.titleMedium, fontWeight: '600' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: moderateScale(24) },
  footerText: { fontSize: theme.typography.bodyMedium },
  footerLink: { fontSize: theme.typography.bodyMedium, fontWeight: '600' },
});
