module.exports = {
  extends: ['expo', 'prettier'],
  plugins: ['react-hooks', 'react-native'],
  rules: {
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'react-native/no-inline-styles': 'warn',
    'no-console': ['warn', { allow: ['warn', 'error'] }],
  },
};
