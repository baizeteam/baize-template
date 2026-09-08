import { Controller, Get, Render, Res } from '@nestjs/common';
import { getJsAssets, getCssAssets } from '@helper/context';
import { Response } from 'express';
const htmlPath = 'src/site/index/index.html';

@Controller()
export class RenderIndexController {
  @Get('{*splat}')
  @Render('index')
  async root(@Res() res: Response) {
    const _configData = {
      ...res.locals.configData,
    };
    res.locals.configData = _configData;

    const jsAssets = await getJsAssets(htmlPath);
    const cssAssets = await getCssAssets(htmlPath);
    return {
      config: global.baseConfig,
      jsAssets,
      cssAssets,
    };
  }
}
