/// <reference types="vite/client" />

declare module "*.vue" {
  import { DefineComponent } from "vue";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

interface Event {
  detail: {
    scrollLeft: number;
    scrollTop: number;
    scrollWidth: number;
    current: number;
  };
}

declare namespace UniApp {
  interface ObserveResult {
    dataset: {
      [key: string]: string | undefined;
    };
    id?: string;
  }
}
