import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import reactStylename from '@banshan-alec/vite-plugin-react-stylename';
// import { visualizer } from 'rollup-plugin-visualizer';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), reactStylename()],
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
