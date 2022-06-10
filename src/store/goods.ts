import { defineStore } from "pinia";
import { ref, computed } from "vue";

import { getGoodsDetail } from "@/api/goods";
import type { DetailType } from "@/api/goods";

export const useGoodsStore = defineStore("goods", () => {
  // states
  const goodsDetail = ref<DetailType>({} as DetailType);
  const skuLabel = ref("请选择规格型号");
  const number = ref(1);
  // actions
  // 获取商品详情信息
  const getDetail = async (id: string) => {
    goodsDetail.value = await getGoodsDetail(id);
  };

  const getSkuLabel = () => {
    skuLabel.value = goodsDetail.value.specs
      ?.map((spec) => spec.name)
      .join("/");
  };

  return { goodsDetail, skuLabel, number, getSkuLabel, getDetail };
});

export default useGoodsStore;
