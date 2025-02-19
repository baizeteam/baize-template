import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve, join } from 'path';
import {
  clientServerPort,
  clientBuildPath,
  assetsBaseUrl,
  isDev,
} from '../server/clientConfig.js';
import assetsJsonPlugin from './vite-plugin/vite-plugin-assets-json';
import reactStylename from '@banshan-alec/vite-plugin-react-stylename';
import autoprefixer from 'autoprefixer';
import childProcess from 'child_process';
import { sentryVitePlugin } from '@sentry/vite-plugin';
import { codeInspectorPlugin } from 'code-inspector-plugin';

const baseUrl = assetsBaseUrl[process.env.NODE_ENV];

function generateSentryRelease() {
  try {
    // 获取commit hash
    const versionBuffer = childProcess.execSync('git rev-parse --short HEAD');
    const sentryRelease = 'sentry' + versionBuffer.toString().trim();
    return sentryRelease;
  } catch (error) {
    console.error('获取commit hash失败');
    return null;
  }
}

const sentryRelease = JSON.stringify(generateSentryRelease());

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    SENTRY_RELEASE: sentryRelease,
  },
  base: baseUrl,
  plugins: [
    react(),
    // 开发环境不执行 sentryVitePlugin
    !isDev &&
      sentryVitePlugin({
        include: '../server/dist/build/',
        release: generateSentryRelease(),
        url: '你的sentry地址',
        org: '你的sentry组织',
        // sentry 项目名称
        project: '你的sentry项目',
        // sentry 认证 token
        authToken: '你的sentry认证token',
      }),
    isDev &&
      codeInspectorPlugin({
        bundler: 'vite',
      }),
    reactStylename(),
    assetsJsonPlugin(),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@common': resolve(__dirname, './src/common'),
      '@index': resolve(__dirname, './src/site/index'),
      '@mobile': resolve(__dirname, './src/site/mobile'),
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
  server: {
    port: clientServerPort,
    strictPort: true,
    host: '127.0.0.1',
    hmr: {
      protocol: 'ws',
      host: '127.0.0.1',
      clientPort: clientServerPort,
    },
  },
  build: {
    sourcemap: 'hidden',
    outDir: clientBuildPath,
    emptyOutDir: true,
    assetsDir: './',
    rollupOptions: {
      input: [
        resolve(__dirname, './src/site/index/index.html'),
        resolve(__dirname, './src/site/mobile/index.html'),
      ],
      output: {
        manualChunks: {
          // 将项目基础库打包成单独的 chunk 中
          base: [
            'react',
            'react-dom',
            'react-router-dom',
            'axios',
            'mobx',
            'mobx-react',
          ],
          // 将组件库的代码打包
          antd: ['antd'],
        },
      },
    },
  },
});
