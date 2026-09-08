import { resolve } from 'path';
import clientConfig from './client.config.json';

const serverRoot = resolve(__dirname, '../..');

export const isDev = process.env.NODE_ENV === 'development';
export const {
  devStaticBase,
  clientServerPort,
  nestServerPort,
  isUseCDN,
  assetsBaseUrl,
} = clientConfig;
export const clientBuildPath = resolve(serverRoot, 'dist/build');
export const clientProdPath = clientBuildPath;

export const serverConfig = {
  ...clientConfig,
  serverPort: Number(process.env.PORT) || nestServerPort,
  clientBuildPath,
  clientProdPath,
};
