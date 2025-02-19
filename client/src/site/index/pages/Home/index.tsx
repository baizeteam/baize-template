import { Button } from 'antd';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import userStore from '@index/store/userStore';
import { observer } from 'mobx-react';
import TestComponent from '@common/components/TestComponent';
import './index.module.less';

function Home() {
  const navigator = useNavigate();

  const gotoAbout = () => {
    navigator('/about');
  };
  return (
    <div>
      <div styleName="home">Home</div>
      <div>
        {userStore.userInfo?.name}
        <TestComponent />
      </div>
      <Button onClick={gotoAbout}>go to about</Button>
    </div>
  );
}

export default observer(Home);
