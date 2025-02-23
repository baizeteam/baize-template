import { Module, Global } from '@nestjs/common';
import { WxbotService } from './wxbot.service';

@Global()
@Module({
  imports: [],
  providers: [WxbotService],
  exports: [WxbotService],
  controllers: [],
})
export class WxbotModule {}
