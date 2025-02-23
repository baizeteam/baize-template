import react from '@vitejs/plugin-react-swc';
import { resolve } from 'path';
import autoprefixer from 'autoprefixer';

export default {
  base: './',
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@background': resolve(__dirname, './src/pages/background'),
      '@contentScript': resolve(__dirname, './src/pages/contentScript'),
      '@popup': resolve(__dirname, './src/pages/popup'),
      '@utils': resolve(__dirname, './src/utils'),
    },
  },
  css: {
    postcss: {
      plugins: [autoprefixer],
    },
    preprocessorOptions: {
      less: {
        additionalData: `@import '@/assets/styles/theme.less';`,
        javascriptEnabled: true,
      },
    },
  },
};
