import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve, join } from 'path';
import {
  clientServerPort,
  clientBuildPath,
  assetsBaseUrl,
  isDev,
} from '../server/clientConfig.js';
import autoprefixer from 'autoprefixer';
import assetsJsonPlugin from './vite-plugin/vite-plugin-assets-json';
import childProcess from 'child_process';
import { codeInspectorPlugin } from 'code-inspector-plugin';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import { VantResolver } from '@vant/auto-import-resolver';

const siteList = ['index', 'mobile'];

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
    vue(),
    isDev &&
      codeInspectorPlugin({
        bundler: 'vite',
      }),
    assetsJsonPlugin(),
    AutoImport({
      resolvers: [ElementPlusResolver(), VantResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver(), VantResolver()],
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@common': resolve(__dirname, './src/common'),
      ...siteList.reduce((acc, site) => {
        acc[`@${site}`] = resolve(__dirname, `./src/site/${site}`);
        return acc;
      }, {}),
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
      input: siteList.map((site) =>
        resolve(__dirname, `./src/site/${site}/index.html`),
      ),
      output: {
        manualChunks: {
          // 将项目基础库打包成单独的 chunk 中
          base: ['vue', 'vue-router', 'axios', 'pinia'],
          // 将组件库的代码打包
          element: ['element-plus'],
          vant: ['vant'],
        },
      },
    },
  },
});
