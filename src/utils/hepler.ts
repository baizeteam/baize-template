export const DEFAUTL_NAME = 'baize-chrome-tool';

declare global {
  interface Window {
    Image: any;
    XMLHttpRequest: any;
    fetch: any;
    baize_interceptConfig: InterceptConfig;
  }
}

export interface InterceptConfig {
  user?: string;
  team?: string;
}

export const defaultConfig: InterceptConfig = {
  user: 'xiaoyu',
  team: 'baize',
};

export function getUrlParams(search: string, name: string): string {
  const reg = new RegExp(`${name}=([^&]+)+(&|$)`);
  const result = reg.exec(search);
  return result ? result[1] : '';
}

export const getChromeLocal = (key): Promise<any> => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(key, (storage: any) => {
      resolve(storage[key]);
    });
  });
};

export const setChromeLocal = (key, value) => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.set({ [`${DEFAUTL_NAME}_${key}`]: value }, () => {
      resolve(true);
    });
  });
};

export const getChromeLocalInterceptConfig =
  async (): Promise<InterceptConfig> => {
    return (
      (await getChromeLocal(`${DEFAUTL_NAME}_interceptConfig`)) || defaultConfig
    );
  };
