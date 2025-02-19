import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class WxbotService {
  baseUrl;
  constructor() {
    this.baseUrl = 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=';
  }

  // 发送企业微信消息
  sendWxMessage(data, key = global.baseConfig.wxBotKey) {
    axios
      .post(this.baseUrl + key, data)
      .then((response) => {
        console.log('发送成功');
      })
      .catch((error) => {
        console.error('发送失败', error);
      });
  }
}
