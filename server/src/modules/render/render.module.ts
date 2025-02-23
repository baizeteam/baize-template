import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { RenderIndexModule } from '@render/index/index.module';
import { RenderMobileModule } from '@render/mobile/mobile.module';
import { insertConfMiddleware } from '@/middlewares/insertConf.middleware';

@Module({
  imports: [RenderMobileModule, RenderIndexModule],
  providers: [],
  exports: [],
  controllers: [],
})
export class RenderModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(insertConfMiddleware).exclude('adapter.json').forRoutes('*');
  }
}
