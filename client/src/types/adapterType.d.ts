declare namespace AdapterType {
  export interface IConfig {
    /**
     * @description Node Api 链接
     */
    url?: string;
    /**
     * @description 请求头部通用
     */
    header?: {
      [key: string]: any;
    };
    /**
     * @description 特殊的通信异常状态码
     */
    specialErrorCode?: number[];
    /**
     * @description 请求错误弹窗配置
     */
    toast?: {
      showToast?: boolean;
      /**
       * @description 显示时长，默认3
       */
      timeout?: number;
    };
  }
  export interface IOptions {
    config: IConfig;
    /**
     * @description 通信器-请求前钩子
     */
    beforeRequest?: () => void;
    /**
     * @description 通信器-请求完成钩子
     */
    finishRequest?: (result: any, actionName: string) => void;
    /**
     * @description 通信器-请求错误处理钩子
     */
    errorRequest?: (result: any, actionName: string) => void;
  }
}
