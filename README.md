# 前端模板

这是一个由 react + nestjs + vite + pnpm 搭建的前端BFF模板

- react 全家桶 + mobx + antd5
- 纯 typescript
- 支持多环境配置（inquirer 交互式选择 server 层环境）
- 支持多入口打包
- 支持 mockjs
- 支持企微机器人上报
- 支持 CSS Modules
- 支持日志系统（默认存储近 30d）
- 支持用户登录校验中间件
- vite 已配置默认 chunk 分包策略

## 开始

```shell
# 安装
pnpm i

# 启动
pnpm run start
```

## 自定义

### 端口号（建议先配置）

项目启动前，建议在 server/src/config/baseConfig.ts 中配置好端口号（`clientServerPort`和`nestServerPort`）。

```typescript
import { resolve } from 'path';

export const devStaticBase = '/client/static/';
export const clientBuildPath = resolve(__dirname, 'dist/build');
export const clientProdPath = resolve(__dirname, 'build');
export const clientServerPort = 6688;
export const nestServerPort = 6689;
export const assetsBaseUrl = {
  development: '/client/static/',
  production: '/dist/build/',
};
```

### 日志

日志主要是使用 winston 进行实现，路径如下 server/src/app.module.ts，这是此处是的配置项

ps：开发环境的接口请求默认不开启日志（线上的测试、生产环境会开启）

```typescript
new winston.transports.DailyRotateFile({
  dirname: `logs`, // 日志保存的目录
  filename: '%DATE%.log', // 日志名称，占位符 %DATE% 取值为 datePattern 值。
  datePattern: 'YYYY-MM-DD', // 日志轮换的频率，此处表示每天。
  zippedArchive: true, // 是否通过压缩的方式归档被轮换的日志文件。
  maxSize: '20m', // 设置日志文件的最大大小，m 表示 mb 。
  maxFiles: '30d', // 保留日志文件的最大天数，此处表示自动删除超过 30 天的日志文件。
  // 记录时添加时间戳信息
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    winston.format.json(),
  ),
});
```

### 多入口

**【sever 层】**

在 server/src/modules/render 中新增对应模块，具体内容可参考 server/src/modules/render/mobile 下的`mobile.controller.ts`和`mobile.module.ts

在 server/src/modules/render/render.module.ts 中，添加刚刚新增的模块加入到 imports 中

server/views 中新增渲染模版 xxx.hbs

```html
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>vite-react-nest</title>
    {{{cssAssets}}}
  </head>
  <body>
    <div id="root"></div>
    {{{jsAssets}}}
  </body>
</html>
```

**【client 层】**

client/src/site，中新建文件夹，文件夹下新增两个文件`index.html`、`index.tsx`

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite + React + Nest</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/site/mobile/index.tsx"></script>
  </body>
</html>
```

```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <div>mobile</div>
  </React.StrictMode>
);
```

client/vite.config.ts，中新增打包入口

```typescript
build: {
    outDir: clientBuildPath,
    assetsDir: './',
    rollupOptions: {
      input: [
        resolve(__dirname, './src/site/index/index.html'),
        resolve(__dirname, './src/site/mobile/index.html'),
      ],
    },
  },
```

### server 层环境

如果需要新增 server 层环境

调整根目录下的 start.ts，新增一个 choices

```typescript
const envInfoObj = await inquirer.prompt([
  {
    type: 'list',
    name: 'choice',
    message: '请选择server环境:',
    choices: [
      {
        name: 'test',
        value: {
          START_ENV: 'dev',
          CONFIG_ENV: 'test',
        },
      },
      {
        name: 'test1',
        value: {
          START_ENV: 'dev',
          CONFIG_ENV: 'test1',
        },
      },
      {
        name: 'test2',
        value: {
          START_ENV: 'dev',
          CONFIG_ENV: 'test2',
        },
      },
    ],
  },
]);
const envInfo = envInfoObj.choice;
```

server/config/module，下新增 xxx.config.ts

```typescript
export default {
  wxBotKey: '', // 微信机器人key
};
```
