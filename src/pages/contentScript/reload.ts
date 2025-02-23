// contentScript 需要热更新的话，则需要将光标置于chrome 的 tab 上。
// 不能更新所有页面，因为如果你开启的 tab 过多，会导致瞬间卡死。

import { DEFAUTL_NAME } from '@/utils/hepler';
chrome.runtime.onMessage.addListener(
  ({ from, action }, sender, sendResponse) => {
    if (from === 'background' && action === `${DEFAUTL_NAME}_reload`) {
      sendResponse({ from: 'contentScript', action: `${DEFAUTL_NAME}_reload` });
      setTimeout(() => {
        window.location.reload();
      }, 200);
    }
  }
);
