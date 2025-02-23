import { readFileSync } from 'fs';
const packageJson = JSON.parse(readFileSync('../package.json', 'utf8'));

export const commonConfig = {
  packageName: packageJson.name,
  // sentry dsn路径
  sentryUrl:
    'https://e5650bd1670804877643a75ad9d6febf@o4508514839953408.ingest.us.sentry.io/4508837964283904',
  wxBotKey: '你的企业微信机器人key',
  ppanel: false, // 是否开启性能监控面板
  pageSpyHost: '', // pageSpy域名(如：localhost:6752)，部署方式查看：https://www.pagespy.org/#/docs/deploy-guide
  chiiUrl: '', // chii调试url（如：https://chii.liriliri.io），部署方式查看https://github.com/liriliri/chii
};
