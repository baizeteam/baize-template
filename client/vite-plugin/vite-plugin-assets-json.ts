import path from 'path';
import { Plugin } from 'vite';
import fs from 'fs';

export default function vitePluginCdnUpload(chunkKey = ''): Plugin {
  let originBundle: string;
  return {
    name: 'vite-plugin-assets-json',
    enforce: 'post',
    apply: 'build',
    configResolved(resolvedConfig) {
      const assetPath = path.resolve(
        process.cwd(),
        resolvedConfig.build.outDir,
        'asset.json',
      );
      try {
        fs.statSync(assetPath);
        originBundle = fs
          .readFileSync(
            path.resolve(
              process.cwd(),
              resolvedConfig.build.outDir,
              'asset.json',
            ),
          )
          .toString();
      } catch {
        originBundle = '{}';
      }
    },
    generateBundle(options, bundles) {
      const assetJson = JSON.parse(originBundle);
      Object.entries(bundles).forEach(([name, bundle]) => {
        if (bundle.type === 'asset' && name.endsWith('.html')) {
          const code = bundle.source as string;
          const assetName = chunkKey || name;
          assetJson[assetName] = {
            js: getHtmlScript(code),
            css: getHtmlCss(code),
          };
        }
      });
      this.emitFile({
        type: 'asset',
        fileName: 'asset.json',
        source: JSON.stringify(assetJson),
      });
    },
  };
}

function getHtmlScript(code: string): string {
  let result = '';
  const scriptReg = /<script.*?script>/g;
  let script = scriptReg.exec(code);
  while (script) {
    result += script[0];
    script = scriptReg.exec(code);
  }
  return result;
}

function getHtmlCss(code: string): string {
  let result = '';
  const cssReg = /<link rel="stylesheet".*?>/g;
  let css = cssReg.exec(code);
  while (css) {
    result += css[0];
    css = cssReg.exec(code);
  }
  return result;
}
