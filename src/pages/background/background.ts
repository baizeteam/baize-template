import {
  InterceptConfig,
  defaultConfig,
  getChromeLocalInterceptConfig,
} from '../../utils/hepler';
import { DEFAUTL_NAME } from '@/utils/hepler';

class Background {
  currentConfig: InterceptConfig = defaultConfig;

  constructor() {
    try {
      this.initMessage();
      this.initContentScriptReload();
      // 清除本地存储(新增参数的时候需要)
      // chrome.storage.local.clear();
      getChromeLocalInterceptConfig().then((res) => {
        this.currentConfig = res;
      });
    } catch (e) {
      console.log(e);
    }
  }

  initMessage() {
    try {
      chrome.runtime?.onMessage?.addListener(
        ({ from, action, data }, sender, sendResponse) => {
          if (from === 'popup' && action === `${DEFAUTL_NAME}_config_change`) {
            const config: InterceptConfig = data;
            this.currentConfig = config;
            sendResponse();
          }
        }
      );

      chrome.tabs?.onUpdated?.addListener((tabId, changeInfo) => {
        console.log(tabId, changeInfo);
        if (changeInfo.status === 'complete') {
          chrome.tabs.sendMessage(tabId, {
            action: `${DEFAUTL_NAME}_url_change`,
            from: 'background',
          });
        }
      });
    } catch (e) {
      console.log(e);
    }
  }

  initContentScriptReload() {
    const eventSource = new EventSource('http://localhost:3000/reload');

    eventSource.addEventListener('reload', async () => {
      console.log('reload');
      chrome?.tabs?.query({ active: true, currentWindow: true }, ([tab]) => {
        if (!tab || tab.url.indexOf('chrome') === 0) return;

        // 给当前页面发送刷新信号
        const actionName = `${DEFAUTL_NAME}_reload`;
        const message = { from: 'background', action: actionName };
        chrome.tabs.sendMessage(tab.id, message, ({ from, action }) => {
          // contentScript响应回调
          // 确定页面接收到reload信号后，重启插件，加载最新代码
          if (from === 'contentScript' && action === actionName) {
            console.log('background reload');
            // eventSource.close();
            // chrome.runtime.reload();
          }
        });
      });
    });
  }
}

new Background();
