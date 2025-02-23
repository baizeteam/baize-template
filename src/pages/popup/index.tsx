import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import '@ant-design/v5-patch-for-react-19';
import { ConfigProvider, Switch } from 'antd';
import './index.less';
import {
  getChromeLocalInterceptConfig,
  InterceptConfig,
  DEFAUTL_NAME,
} from '@/utils/hepler';

function Popup() {
  const [config, setConfig] = useState<InterceptConfig>({});

  useEffect(() => {
    getChromeLocalInterceptConfig().then((res) => {
      setConfig(res);
    });
  }, []);
  return (
    <div className="popup">
      <ConfigProvider
        theme={{
          token: {
            // Seed Token，影响范围大
            colorPrimary: '#00c881',
          },
        }}
      >
        <div className="title">baize-小工具</div>
        <div className="user-info">
          <div>用户:{config.user}</div>
          <div>团队:{config.team}</div>
        </div>
      </ConfigProvider>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<Popup />);
