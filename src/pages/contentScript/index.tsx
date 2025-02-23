import { DEFAUTL_NAME } from "@/utils/hepler";
import { createApp } from "vue";
import App from "./App.vue";
import "./index.less";
import "./reload";

console.log("contentScript");

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
      const toolBar = document.createElement("div");
      toolBar.setAttribute("id", `${DEFAUTL_NAME}-tool-bar`);
      toolBar.setAttribute("class", `${DEFAUTL_NAME}-tool-bar`);
      panelView.appendChild(toolBar);
      // 创建新的 React root 并渲染
      createApp(App).mount(`#${DEFAUTL_NAME}-tool-bar`);
    }
  });
};

insertToolBar();

chrome.runtime.onMessage.addListener(
  async ({ from, action, data }, sender, sendResponse) => {
    console.log("contentScript", from, action, data);
    if (from === "popup" && action === `${DEFAUTL_NAME}_config_change`) {
      postMessage({
        action: `${DEFAUTL_NAME}_config_change`,
        to: "pageScript",
        data,
      });
      sendResponse();
    }
  }
);
