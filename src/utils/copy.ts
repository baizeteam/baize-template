import { message } from 'antd';

export const copyText = (text: string) => {
  try {
    navigator.clipboard.writeText(text);
    message.success('复制成功');
  } catch (error) {
    message.error('复制失败');
  }
};
