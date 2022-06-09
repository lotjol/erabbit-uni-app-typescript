import { defineStore } from "pinia";

import { getGoodsDetail } from "@/api/goods";
import type { DetailType } from "@/api/goods";

export const useGoodsStore = defineStore("goods", {
  state: () => {
    return {
      goodsDetail: {} as DetailType,
    };
  },
  getters: {
    skus: (state) => state.goodsDetail.skus,
    specs: (state) => state.goodsDetail.specs,
  },
  actions: {
    async getGoodsDetail(id: string) {
      this.goodsDetail = await getGoodsDetail(id);
    },
  },
});
