import loadConfigFiles from '@/config/index';

// 初始化配置
export async function initBaseConfig() {
  const { CONFIG_ENV = 'test' } = process.env;
  let baseConfig = {};
  const res = await loadConfigFiles();
  baseConfig = { ...baseConfig, ...res[CONFIG_ENV] };
  // 挂载到全局对象上
  global.baseConfig = baseConfig;
}
