import { Store } from "vuex";

declare module "@vue/runtime-core" {
  // Declare your own store states.
  interface State {
    systemInfo: object;
  }

  interface ComponentCustomProperties {
    $store: Store<State>;
  }
}
