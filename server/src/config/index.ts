import dotenv from 'dotenv';
dotenv.config();

import * as fs from 'fs/promises';
import { join } from 'path';
import { serverConfig } from './baseConfig';

const configFilesDir = join(__dirname, 'module');

const loadConfigFiles = async () => {
  const configObj = {};
  try {
    // 读取目录中的所有文件
    const files = await fs.readdir(configFilesDir);
    // 筛选出以 .config.ts 结尾的文件
    const configFiles = files.filter((file) => file.endsWith('.config.js'));
    // 使用 import 动态引入模块，并保存到 configObj 中
    for (const configFile of configFiles) {
      const filePath = join(configFilesDir, configFile);
      const configModule = await import(filePath);
      // 从文件名中去掉后缀，作为对象的键
      const configKey = configFile.replace('.config.js', '');
      // 将模块内容保存到对象中
      configObj[configKey] = { ...serverConfig, ...configModule.default };
    }
  } catch (error) {
    console.error('Error loading config files', error);
  }
  return configObj;
};

export default loadConfigFiles;
