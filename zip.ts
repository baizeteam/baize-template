import zip from 'cross-zip';
import { join } from 'path';
import packageJson from './package.json';

const __dirname = new URL('.', import.meta.url).pathname;

const inPath = join(__dirname, packageJson.name);
const outPath = join(__dirname, `${packageJson.name}.zip`);

zip.zipSync(inPath, outPath);
console.log(`打包完成，文件路径：${outPath}`);
