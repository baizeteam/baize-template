import { Controller } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Controller('app')
export class AppController {
  @Cron(CronExpression.EVERY_MINUTE)
  async autoUpdate() {
    // 每分钟自动更新
  }
}
