import { makeAutoObservable, runInAction } from 'mobx';

class UserStore {
  constructor() {
    makeAutoObservable(this);
  }

  // 用户信息
  userInfo;

  // 修改用户信息
  changeUserInfo = (userInfo) => {
    runInAction(() => {
      this.userInfo = userInfo;
    });
  };

  // 初始化数据
  initData = async () => {
    this.changeUserInfo({
      name: 'xiaoyu',
      team: 'baize',
    });
  };
}

const userStore = new UserStore();
export default userStore;
