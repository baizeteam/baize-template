import * as vscode from 'vscode';

export const handleReceiveMessage = async (data, panel) => {
  const vscConfig = vscode.workspace.getConfiguration('baize');
  const { command, ...rest } = data;
  const commandFuncMap = {
    vscodeCopyText: () => {
      try {
        vscode.env.clipboard.writeText(rest.data);
        panel.webview.postMessage({
          message: 'vscodeWebviewPostMessage',
          command,
          data: '复制成功',
        });
      } catch (e) {
        panel.webview.postMessage({
          message: 'vscodeWebviewPostMessage',
          command,
          data: '复制失败',
        });
      }
    }
  };
  if (commandFuncMap[command]) {
    commandFuncMap[command]();
  } else {
    console.error('未找到对应的命令处理函数');
  }
};
