import React from 'react';
import ReactDOM from 'react-dom/client';
import MainRouter from './router/index';
import { BrowserRouter } from 'react-router-dom';
import { startPPanel } from 'ppanel';
import '@ant-design/v5-patch-for-react-19';
import '@/assets/styles/base.less';
import './index.module.less';
import '@common/utils/sentry';

if (window.insertData.env === 'dev' && window.insertData.ppanel) {
  startPPanel();
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <BrowserRouter>
    <MainRouter />
  </BrowserRouter>
);
