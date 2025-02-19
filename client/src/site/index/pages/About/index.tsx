import { Button } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './index.module.less';

export default function About() {
  const navigator = useNavigate();

  const gotoHome = () => {
    navigator('/');
  };
  return (
    <div>
      <div>About</div>
      <Button type="primary" onClick={gotoHome}>
        go to home
      </Button>
    </div>
  );
}
