import { Module, Global } from '@nestjs/common';
import { WxbotModule } from '@/modules/global/wxbot/wxbot.module';

@Global()
@Module({
  imports: [WxbotModule],
  providers: [],
  exports: [WxbotModule],
  controllers: [],
})
export class GlobalModule {}
