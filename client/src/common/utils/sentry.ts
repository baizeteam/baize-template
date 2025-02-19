import * as Sentry from '@sentry/react';
if (window.insertData.env !== 'dev') {
  // 开发环境不监控，仅监控测试环境和生产环境的异常
  Sentry.init({
    dsn: window.insertData.sentryUrl,
    environment: window.insertData.env,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.captureConsoleIntegration({
        levels: ['error'],
      }),
    ],
    // @ts-ignore
    release: SENTRY_RELEASE,
    tracesSampleRate: window.insertData.env === 'test' ? 1 : 0.3, //测试环境直接上报，生产环境使用建议的上报采样率
  });
}
