import { defineConfig } from 'vite';
import viteBaseConfig from './vite.base.config';
import { resolve } from 'path';
import { readFileSync } from 'fs';
import { chromeHMRPlugin } from './plugin/chromeHMRPlugin';

const pkg = JSON.parse(
  readFileSync(resolve(__dirname, 'package.json'), 'utf-8')
);
const isDev = process.env.NODE_TYPE === 'development';

export default defineConfig({
  ...viteBaseConfig,
  plugins: [...viteBaseConfig.plugins, isDev && chromeHMRPlugin()],
  build: {
    sourcemap: isDev ? 'inline' : false,
    emptyOutDir: true,
    minify: isDev ? false : 'esbuild',
    assetsDir: './',
    outDir: `${pkg.name}/contentScript`,
    copyPublicDir: false,
    rollupOptions: {
      input: resolve(__dirname, './src/pages/contentScript/index.tsx'),
      output: {
        format: 'umd',
        entryFileNames: '[name].js',
        chunkFileNames: 'js/[hash].[name].js',
        assetFileNames: '[ext]/[name].[ext]',
      },
    },
  },
});
