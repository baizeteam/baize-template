import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import autoprefixer from "autoprefixer";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";

export default {
  base: "./",
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
      "@background": resolve(__dirname, "./src/pages/background"),
      "@contentScript": resolve(__dirname, "./src/pages/contentScript"),
      "@popup": resolve(__dirname, "./src/pages/popup"),
      "@utils": resolve(__dirname, "./src/utils"),
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
