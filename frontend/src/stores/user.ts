import { defineStore } from "pinia";

export const useUserStore = defineStore({
  id: "user",
  state: () => ({
    login: false,
    data: {
      id: "",
      nickname: "",
      win: 0,
      lose: 0,
      ladder_win: 0,
      ladder_lose: 0,
      admin: false,
      avatarPath: "",
      twoFactorAuthenticationSecret: "",
      isTwoFactorAuthenticationEnabled: false,
      lating: 0,
      status: 0,
    },
  }),
  getters: {
    getLogin: (state) => state.login,
  },
  actions: {
    // increment() {},
  },
});
