import { defineConfig } from "vite";
import viteBaseConfig from "./vite.base.config";
import { join, resolve, sep } from "path";
import { readFileSync } from "fs";
import { promisify } from "util";
import fs from "fs";

const pkg = JSON.parse(
  readFileSync(resolve(__dirname, "package.json"), "utf-8")
);
const isDev = process.env.NODE_TYPE === "development";

import path from "path";

// Promisify fs.copyFile and fs.mkdir for async/await usage
const copyFile = promisify(fs.copyFile);
const mkdir = promisify(fs.mkdir);

function copyFilesPlugin(options) {
  return {
    name: "vite-plugin-copy-files", // 插件名

    // 在构建结束时复制文件
    async buildEnd() {
      const { src, dest } = options;

      // 确保目标目录存在
      const destDir = path.resolve(dest);
      await ensureDirExists(destDir);
      try {
        await ensureDirExists(destDir);
      } catch (err) {
        console.error("Error creating destination directory:", err);
      }

      // 复制文件
      const files = await getFiles(src);
      for (const file of files) {
        const fileDest = path.join(destDir, path.relative(src, file));
        await ensureDirExists(fileDest.split(sep).slice(0, -1).join(sep));
        await copyFile(file, fileDest); // 复制文件
      }
    },
  };
}

// 确保目录存在，若不存在则创建
async function ensureDirExists(dir) {
  try {
    await mkdir(dir, { recursive: true });
  } catch (err) {
    console.error("Error creating directory:", err);
    throw err; // 若创建目录失败，抛出错误
  }
}

// 辅助函数：递归获取目录中的所有文件
async function getFiles(dir) {
  const files = [];
  const items = await fs.promises.readdir(dir, { withFileTypes: true });
  for (const item of items) {
    const fullPath = join(dir, item.name);
    if (item.isDirectory()) {
      files.push(...(await getFiles(fullPath))); // 递归处理子目录
    } else {
      files.push(fullPath);
    }
  }
  return files;
}

export default defineConfig({
  ...viteBaseConfig,
  plugins: [
    ...viteBaseConfig.plugins,
    copyFilesPlugin({
      src: resolve(__dirname, "public"),
      dest: resolve(__dirname, pkg.name), // 将 public 内容拷贝到 dist 根目录
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
