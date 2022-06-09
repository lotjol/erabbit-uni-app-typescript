import { defineStore } from "pinia";

import useGoodsStore from "./goods";

const useAppStore = defineStore("app", () => {
  // 获取系统信息
  const systemInfo = uni.getSystemInfoSync() as UniApp.GetSystemInfoResult;
  // 获取安全区域和平台信息
  const { safeArea, platform } = systemInfo;

  return { safeArea, platform };
});

export default useAppStore;

export { useGoodsStore };
