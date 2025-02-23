import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class insertConfMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    // 注入 debug 组件
    const insertData = {
      env: process.env.START_ENV,
      sentryUrl: global.baseConfig.sentryUrl,
      ppanel: global.baseConfig.ppanel,
      configEnv: global.baseConfig.configEnv,
    };

    const configData = {};
    const stringifyData = JSON.stringify(insertData);
    res.locals.insertData = `<script>window.insertData = ${stringifyData}</script>`;
    res.locals.configData = configData;
    next();
  }
}
