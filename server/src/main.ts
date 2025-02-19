import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import { initBaseConfig } from '@/helper/baseConfig';
import hbs from 'hbs';

async function bootstrap() {
  await initBaseConfig();
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['error', 'warn'], // 只显示 error 和 warn 级别的日志
  });
  app.useStaticAssets(join(global.baseConfig.clientBuildPath));
  app.useStaticAssets(join(__dirname, '../', 'public'));
  app.setBaseViewsDir(join(__dirname, '../', 'views'));
  app.setViewEngine('hbs');
  const partialsPath = join(__dirname, '../', '/views/partials');
  hbs.registerPartials(partialsPath);
  // 设置请求体大小限制
  app.useBodyParser('json', { limit: '4mb' });
  app.use(cookieParser());
  app.use(compression());

  if (process.env.START_ENV === 'dev') {
    console.log(`➜   LOCAL:  http://127.0.0.1:${global.baseConfig.serverPort}`);
  }
  await app.listen(global.baseConfig.serverPort);
}
bootstrap();
