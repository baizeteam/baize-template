import { defineConfig } from "vite";
import viteBaseConfig from "./vite.base.config";
import { viteStaticCopy } from "vite-plugin-static-copy";
import { resolve } from "path";
import { readFileSync } from "fs";

const pkg = JSON.parse(
  readFileSync(resolve(__dirname, "package.json"), "utf-8")
);
const isDev = process.env.NODE_TYPE === "development";

export default defineConfig({
  ...viteBaseConfig,
  plugins: [
    ...viteBaseConfig.plugins,
    viteStaticCopy({
      targets: [
        {
          src: resolve(__dirname, "public/*"),
          dest: resolve(__dirname, pkg.name), // 将 public 内容拷贝到 dist 根目录
        },
      ],
    }),
  ],
  build: {
    sourcemap: isDev ? "inline" : false,
    emptyOutDir: true,
    minify: isDev ? false : "esbuild",
    assetsDir: "./",
    outDir: `${pkg.name}/main`,
    copyPublicDir: false,
    rollupOptions: {
      input: [
        resolve(__dirname, "./popup.html"),
        resolve(__dirname, "./src/pages/background/background.ts"),
      ],
      output: {
        format: "esm",
        entryFileNames: "[name].js",
        chunkFileNames: "js/[hash].[name].js",
        assetFileNames: "[ext]/[name].[ext]",
      },
    },
  },
});
