let vscode;
if (process.env.NODE_ENV === 'development') {
  vscode = {
    postMessage: (data) => {
      parent.window.postMessage(
        {
          message: 'vscodePostMessage',
          data,
        },
        '*'
      );
    },
    setState: (data) => {
      parent.window.postMessage(
        {
          message: 'vscodeSetState',
          data,
        },
        '*'
      );
    },
    getState: (data) => {
      parent.window.postMessage(
        {
          message: 'vscodeGetState',
          data,
        },
        '*'
      );
    },
  };
} else {
  vscode = acquireVsCodeApi();
}

const asyncPostMessage = (data): Promise<any> => {
  return new Promise((resolve, reject) => {
    vscode.postMessage(data);
    const handleListenMessage = (e) => {
      const { message } = e.data;
      if (
        message === 'vscodeWebviewPostMessage' &&
        e.data.command === data.command
      ) {
        resolve(e.data);
        window.removeEventListener('message', handleListenMessage);
      }
    };
    window.addEventListener('message', handleListenMessage);
  });
};

export { asyncPostMessage };
