import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

export function getWebViewContent(context, templatePath, panel) {
  console.log('context----->', context);
  const resourcePath = path.join(context.extensionPath, templatePath);
  const dirPath = path.dirname(resourcePath);
  let htmlIndexPath = fs.readFileSync(resourcePath, 'utf-8');
  const html = htmlIndexPath.replace(
    /(<link.+?href="|<script.+?src="|<img.+?src=")(.+?)"/g,
    (m, $1, $2) => {
      const absLocalPath = path.resolve(dirPath, $2);
      const webviewUri = panel.webview.asWebviewUri(
        vscode.Uri.file(absLocalPath)
      );
      const replaceHref = $1 + webviewUri.toString() + '"';
      return replaceHref;
    }
  );
  return html;
}

export const loadWebViewHtml = (context, panel) => {
  // 判断是否在开发环境下
  const isDev = process.env.NODE_ENV === 'development';
  if (isDev) {
    // 开发环境：加载本地的 5173 端口
    panel.webview.html = `<html>
<body style="overflow: hidden;">
<iframe id="iframe" src="http://localhost:5173" sandbox="allow-scripts allow-same-origin allow-popups allow-forms" allow="clipboard-read;clipboard-write;" style="width: 100%; height: 100vh; border: none;"></iframe>
<script>
  const vscode = acquireVsCodeApi();
  console.log('vscode', vscode);
  window.addEventListener('message', event => {
    const data = event.data.data;
    const iframe = document.getElementById('iframe').contentWindow;
    // 接收来自 iframe 的消息
    if(event.data.message === 'vscodePostMessage') {
      vscode.postMessage(data);
    }else if(event.data.message === 'vscodeSetState'){
      vscode.setState(data);
    }else if(event.data.message === 'vscodeGetState'){
      vscode.getState(data);
    }
    // 接收来自 vscode 的消息
    if(['vscodeWebviewPostMessage', 'vscodeWebviewSetState', 'vscodeWebviewGetState'].includes(event.data.message)){
      iframe.postMessage(event.data, '*');
    }
  });
</script>
</body>
</html>
`;
  } else {
    // 生产环境：加载编译后的 HTML 文件
    const htmlDoc = getWebViewContent(context, 'client/dist/index.html', panel);
    panel.webview.html = htmlDoc;
  }
};
