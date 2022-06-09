import { defineStore } from "pinia";
import { ref } from "vue";

import { getGoodsDetail } from "@/api/goods";
import type { DetailType } from "@/api/goods";

export const useGoodsStore = defineStore("goods", () => {
  let goodsDetail = ref<DetailType>({} as DetailType);
  // 获取商品详情信息
  const getDetail = async (id: string) => {
    goodsDetail.value = await getGoodsDetail(id);
  };

  return { goodsDetail, getDetail };
});

export default useGoodsStore;
