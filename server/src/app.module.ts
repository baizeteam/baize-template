import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { GlobalModule } from './modules/global/global.module';
import { RenderModule } from '@render/render.module';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { AppController } from './app.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import 'winston-daily-rotate-file';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    WinstonModule.forRoot({
      transports: [
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
        }),
      ],
    }),
    GlobalModule,
    RenderModule,
  ],
  exports: [GlobalModule],
  controllers: [AppController],
  providers: [],
})
// export class AppModule {}
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    const devStaticPath = global.baseConfig.devStaticBase.replace(
      /^\/+|\/+$/g,
      '',
    );

    consumer
      .apply(
        createProxyMiddleware({
          target: `http://127.0.0.1:${global.baseConfig.clientServerPort}`,
          // pathRewrite: {
          //   '^/': '', // 重写路径
          // },
          changeOrigin: true,
          secure: false,
          ws: true,
        }),
      )
      .forRoutes({
        path: `${devStaticPath}/{*splat}`,
        method: RequestMethod.ALL,
      });
  }
}
