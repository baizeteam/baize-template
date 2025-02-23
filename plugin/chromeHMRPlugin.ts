import { Plugin } from 'vite';
import express from 'express';
import SSEstream from 'ssestream';

const isDev = process.env.NODE_TYPE === 'development';

let sseStream = null;
if (isDev) {
  const app = express();
  app.get('/reload', (req, res, next) => {
    sseStream = new (SSEstream as any).default(req);
    sseStream.pipe(res);

    res.on('close', () => {
      sseStream?.unpipe(res);
      sseStream = null;
    });
    next();
  });

  app.listen(3000, function () {
    console.log('SSE server is running on post: 3000');
  });
}

export function chromeHMRPlugin(): Plugin {
  return {
    name: 'chrome-hmr-plugin',
    buildEnd() {
      console.log('构建已完成！');
      if (sseStream) {
        const data = {
          event: 'reload',
          data: 'reload plugin',
        };
        setTimeout(() => {
          sseStream.write(data, 'utf-8', (err) => {
            if (err) {
              console.log(err);
            }
          });
        }, 50);
      }
    },
  };
}
