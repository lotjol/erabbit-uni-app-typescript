import { defineStore } from "pinia";

export const useAppStore = defineStore("app", {
  state: () => {
    return {
      systemInfo: uni.getSystemInfoSync() as UniApp.GetSystemInfoResult,
    };
  },
  getters: {
    safeArea: (state) => state.systemInfo.safeArea,
    platform: (state) => state.systemInfo.platform,
  },
});
