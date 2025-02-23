import React from 'react';
import ReactDOM from 'react-dom/client';
import { App, Button } from 'antd';
import '@ant-design/v5-patch-for-react-19';
import { DEFAUTL_NAME } from '@/utils/hepler';
import './index.less';
import './reload';

console.log('contentScript');

const MainApp = () => {
  const { message } = App.useApp();
  return (
    <>
      <div>baize chorme 工具栏</div>
      <Button
        onClick={() => {
          message.success('click');
        }}
      >
        click
      </Button>
    </>
  );
};

const insertToolBar = () => {
  // 动态插入工具栏
  requestIdleCallback(() => {
    let panelView = document.body;
    if (panelView) {
      const existingToolBar = document.querySelector(
        `#${DEFAUTL_NAME}-tool-bar`
      );
      // 如果工具栏已存在，先删除它
      if (existingToolBar) {
        existingToolBar.remove();
      }
      const toolBar = document.createElement('div');
      toolBar.setAttribute('id', `${DEFAUTL_NAME}-tool-bar`);
      toolBar.setAttribute('class', `${DEFAUTL_NAME}-tool-bar`);
      panelView.appendChild(toolBar);
      // 创建新的 React root 并渲染
      ReactDOM.createRoot(
        document.querySelector(`#${DEFAUTL_NAME}-tool-bar`)
      ).render(
        <App>
          <MainApp />
        </App>
      );
    }
  });
};

insertToolBar();

chrome.runtime.onMessage.addListener(
  async ({ from, action, data }, sender, sendResponse) => {
    console.log('contentScript', from, action, data);
    if (from === 'popup' && action === `${DEFAUTL_NAME}_config_change`) {
      postMessage({
        action: `${DEFAUTL_NAME}_config_change`,
        to: 'pageScript',
        data,
      });
      sendResponse();
    }
  }
);
