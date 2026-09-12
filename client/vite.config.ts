import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import clientConfig from '../server/src/config/client.config.json' with { type: 'json' };
import assetsJsonPlugin from './vite-plugin/vite-plugin-assets-json';
import autoprefixer from 'autoprefixer';
import childProcess from 'child_process';
import { sentryVitePlugin } from '@sentry/vite-plugin';
import { codeInspectorPlugin } from 'code-inspector-plugin';

const { clientServerPort, assetsBaseUrl } = clientConfig;
const clientBuildPath = resolve(import.meta.dirname, '../server/dist/build');
const isDev = process.env.NODE_ENV === 'development';
const baseUrl =
  assetsBaseUrl[process.env.NODE_ENV as keyof typeof assetsBaseUrl];
const shouldUploadSourcemaps = Boolean(
  !isDev &&
  process.env.SENTRY_AUTH_TOKEN &&
  process.env.SENTRY_ORG &&
  process.env.SENTRY_PROJECT,
);

function generateSentryRelease() {
  try {
    // 获取commit hash
    const versionBuffer = childProcess.execSync('git rev-parse --short HEAD');
    const sentryRelease = 'sentry' + versionBuffer.toString().trim();
    return sentryRelease;
  } catch {
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
    isDev &&
      codeInspectorPlugin({
        bundler: 'vite',
      }),
    react(),
    // 开发环境不执行 sentryVitePlugin
    shouldUploadSourcemaps &&
      sentryVitePlugin({
        url: process.env.SENTRY_URL,
        org: process.env.SENTRY_ORG,
        project: process.env.SENTRY_PROJECT,
        authToken: process.env.SENTRY_AUTH_TOKEN,
        release: {
          name: generateSentryRelease() ?? undefined,
        },
      }),
    assetsJsonPlugin(),
  ],
  resolve: {
    alias: {
      '@': resolve(import.meta.dirname, './src'),
      '@common': resolve(import.meta.dirname, './src/common'),
      '@index': resolve(import.meta.dirname, './src/site/index'),
      '@mobile': resolve(import.meta.dirname, './src/site/mobile'),
    },
  },
  css: {
    postcss: {
      plugins: [autoprefixer() as import('postcss').AcceptedPlugin],
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
        resolve(import.meta.dirname, './src/site/index/index.html'),
        resolve(import.meta.dirname, './src/site/mobile/index.html'),
      ],
      output: {
        codeSplitting: {
          groups: [
            {
              // 将项目基础库打包成单独的 chunk 中
              name: 'base',
              test: /node_modules[\\/](react(?:-dom|-router-dom)?|axios|mobx(?:-react)?)[\\/]/,
              priority: 20,
            },
            {
              // 将组件库的代码打包
              name: 'antd',
              test: /node_modules[\\/]antd[\\/]/,
              priority: 10,
            },
          ],
        },
      },
    },
  },
});
