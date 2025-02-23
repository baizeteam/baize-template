import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
// import { visualizer } from 'rollup-plugin-visualizer';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  base: './', // 设置打包路径
  css: {
    preprocessorOptions: {
      less: {
        additionalData: `@import '@/assets/styles/theme.less';`,
        javascriptEnabled: true,
      },
    },
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  // build: {
  //   rollupOptions: {
  //     plugins: [
  //       visualizer({
  //         open: true, // 直接在浏览器中打开分析报告
  //         filename: 'stats.html', // 输出文件的名称
  //         gzipSize: true, // 显示gzip后的大小
  //         brotliSize: true, // 显示brotli压缩后的大小
  //       }),
  //     ],
  //   },
  // },
});
