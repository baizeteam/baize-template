declare interface Window {
  sentryUrl: string;
  insertData: {
    env?: string;
    sentryUrl?: string;
    ppanel?: boolean;
  };
  env: string;
  loginSuccessCallback: () => void;
}
