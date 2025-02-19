import { resolve } from 'path';

export const isDev = process.env.NODE_ENV === 'development';
export const devStaticBase = '/client/static/';
export const clientBuildPath = resolve(__dirname, 'dist/build');
export const clientProdPath = resolve(__dirname, 'build');
export const clientServerPort = 6688;
export const nestServerPort = 6689;
export const isUseCDN = false;
export const assetsBaseUrl = {
  development: '/client/static/',
  production: '/dist/build/',
};

export const serverConfig = {
  serverPort: nestServerPort,
  clientBuildPath,
  devStaticBase,
  clientServerPort,
};
