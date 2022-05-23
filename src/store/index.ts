import { createStore } from "vuex";

// Create a new store instance.
export default createStore({
  state: {
    systemInfo: uni.getSystemInfoSync(),
  },
  getters: {
    safeArea: (state) => {
      return state.systemInfo.safeArea;
    },
    platform: (state) => {
      return state.systemInfo.platform;
    },
  },
});
