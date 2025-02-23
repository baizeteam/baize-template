import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: {
      name: 'xiaoyu',
      team: 'baize',
    },
  }),
  actions: {
    setUserInfo(userInfo: any) {
      this.userInfo = userInfo;
    },
  },
  getters: {
    getUserInfo: (state) => state.userInfo,
  },
});

export default useUserStore;
