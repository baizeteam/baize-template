import { Module } from '@nestjs/common';
import { RenderIndexController } from './index.controller';

@Module({
  imports: [],
  providers: [],
  controllers: [RenderIndexController],
})
export class RenderIndexModule {}
