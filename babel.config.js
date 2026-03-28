module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ['module-resolver', {
        root: ['./src'],
        alias: {
          '@': './src',
          '@components': './src/components',
          '@screens': './src/screens',
          '@hooks': './src/hooks',
          '@store': './src/store',
          '@theme': './src/theme',
          '@utils': './src/utils',
          '@constants': './src/constants',
          '@storage': './src/storage',
          '@navigation': './src/navigation',
        },
      }],
      'react-native-reanimated/plugin',
    ],
  };
};
