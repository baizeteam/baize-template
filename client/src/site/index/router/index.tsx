import React, { Suspense, lazy, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import userStore from '@index/store/userStore';

const Home = lazy(() => import('@index/pages/Home'));
const About = lazy(() => import('@index/pages/About'));

function MainRouter() {
  useEffect(() => {
    userStore.initData();
  }, []);
  return (
    <ConfigProvider
      theme={{
        token: {
          // Seed Token，影响范围大
          colorPrimary: '45ae89',

          // 派生变量，影响范围小
          // colorBgContainer: '#f6ffed',
        },
      }}
    >
      <Suspense fallback={<div>loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/about" element={<About />}></Route>
        </Routes>
      </Suspense>
    </ConfigProvider>
  );
}

export default MainRouter;
