import * as fs from 'fs';
import * as path from 'path';

export async function getJsAssets(entryHtml) {
  // 开发环境
  if (process.env.START_ENV === 'dev') {
    return getDevAssets(entryHtml);
  }
  // 生产环境
  try {
    const assets = await require(
      path.join(global.baseConfig.clientProdPath, 'asset.json'),
    );
    return assets[entryHtml].js;
  } catch (e) {
    console.warn(e);
  }
}

export async function getCssAssets(entryHtml) {
  if (process.env.START_ENV === 'dev') return '';
  // 生产环境
  try {
    const assets = await require(
      path.join(global.baseConfig.clientProdPath, 'asset.json'),
    );
    return assets[entryHtml].css;
  } catch (e) {
    console.warn(e);
  }
}

export function getDevAssets(entryHtml) {
  const filePath = path.resolve(process.cwd(), `../client/${entryHtml}`);
  const htmlStr = fs.readFileSync(filePath);

  const script = getHtmlScript(htmlStr);
  // vue热更新需要
  const hotScript = `
      <script type="module" src="${global.baseConfig.devStaticBase}@vite/client"></script>`;
  return (
    hotScript +
    script.replace(/src="(.*?)"/g, (m, p1) => {
      // 给script标签加上前缀
      return `src="${path.join(global.baseConfig.devStaticBase, p1)}"`;
    })
  );
}

function getHtmlScript(code) {
  let result = '';
  const scriptReg = /<script.*?script>/g;
  let script = scriptReg.exec(code);
  while (script) {
    result += script[0];
    script = scriptReg.exec(code);
  }
  return result;
}
