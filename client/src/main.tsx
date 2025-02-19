import { createRoot } from 'react-dom/client';
import { ConfigProvider, App, theme } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import './index.module.less';
import '@ant-design/v5-patch-for-react-19';

const BaseApp = () => {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {},
      }}
      locale={zhCN}
    >
      <App>
        <div>this is a react vsc extension</div>
      </App>
    </ConfigProvider>
  );
};

createRoot(document.getElementById('root')!).render(<BaseApp />);
