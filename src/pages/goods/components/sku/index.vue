<script setup lang="ts">
  import { useGoodsStore } from "@/store";
  import type { DetailType } from "@/api/goods";
  import powerSet from "@/utils/bwPowerSet";

  // sku 类型
  type skuType = Omit<DetailType["skus"][number], "specs">;

  // 组件属性
  defineProps<{
    buttonType: string;
  }>();

  // 自定义事件
  const emit = defineEmits<{
    (e: "confirm"): void;
  }>();

  // Pinia
  const goodsStore = useGoodsStore();

  // 初始数据
  let { skus, specs, ...goods } = goodsStore.goodsDetail;
  let price = $ref(goods.price);
  let oldPrice = $ref(goods.oldPrice);
  let inventory = $ref(goods.inventory);
  let mainPicture = $ref(goods.mainPictures[0]);
  let sku = $ref<skuType>({} as skuType);

  // 用户选中的规格型号名称
  const checkedNames = $computed(() => {
    return specs.reduce((names, spec) => {
      spec.values.forEach((value) => {
        if (value.checked) names.push(value.name);
      });
      return names;
    }, [] as string[]);
  });

  // 用户未选中的规格类别名称
  const unCheckedNames = $computed(() => {
    return specs
      .filter((spec) => {
        return spec.values.filter((value) => value.checked)?.length === 0;
      })
      .map(({ name }) => name);
  });

  // 格式化处理sku信息
  const formatSku = skus.reduce((skuCache, item) => {
    // 将 sku 规格整理成数组，方便计算其幂集
    const { specs, ...sku } = item;
    if (sku.inventory === 0) return skuCache;
    // 计算 sku 规格的幂集
    const subset = powerSet(specs.map((spec) => spec.valueName));

    // 缓存幂集对应 sku 的数据
    subset.forEach((arr) => {
      if (arr.length === 0) return;
      // 将幂集集合拼凑成对象的 key
      const key = arr.sort().join("|");
      // 根据规格记录 sku 信息
      skuCache[key] ? skuCache[key].push(sku) : (skuCache[key] = [sku]);
    });

    return skuCache;
  }, {} as { [key: string]: skuType[] });

  // 检测库信息中是否有符合用户选择的规格型号
  const checkSku = (checked: string[]) => {
    // 检查规格/型号是否可选
    specs.forEach((spec) => {
      // 设置默认的选中状态并取出规格/型号的名称
      const names = spec.values.map((value) => {
        if (checked.includes(value.name)) {
          value.checked = true;
        }
        return value.name;
      });

      // 过滤全部待组合的规格/型号
      const diffChecked = checked.filter((item) => {
        return !names.some((name) => item === name);
      });

      spec.values.forEach((value) => {
        // 组合规格型号
        const key = [...diffChecked, value.name].sort().join("|");

        // 是否可选标识
        value.disabled = true;

        // 去超集中进行检测
        if (formatSku[key]) value.disabled = false;
      });
    });
  };

  // 切换选中规格型号选中状态
  const toggleChecked = (index: number, key: number) => {
    // 读取当前选择的是哪个规格类别
    const values = specs[index].values;

    // 设置或更新被选择规格类别的状态
    if (values[key].checked) {
      values[key].checked = false;
    } else {
      values.forEach((value) => (value.checked = false));
      values[key].checked = true;
    }

    // 检测库存信息
    checkSku(checkedNames);

    // 展示选择结果
    goodsStore.skuLabel = unCheckedNames.join("/") || checkedNames.join("/");

    // 更新显示结果
    [sku] = formatSku[checkedNames.sort().join("|")] || [];

    if (sku) {
      price = sku.price;
      oldPrice = sku.oldPrice;
      inventory = sku.inventory;
      mainPicture = values[key].picture || mainPicture;
    }
  };

  // 修改购买数量
  const changeNumber = (step: number) => {
    if (goodsStore.number <= 1) return;
    if (goodsStore.number >= sku.inventory) return;
    goodsStore.number += step;
  };

  const goCart = () => {
    if (unCheckedNames.length !== 0) {
      return uni.showToast({
        title: unCheckedNames.join("/"),
        icon: "none",
      });
    }

    emit("confirm");

    uni.navigateTo({
      url: "/pages/cart/default",
    });
  };

  const goOrder = () => {
    if (unCheckedNames.length !== 0) {
      return uni.showToast({
        title: unCheckedNames.join("/"),
        icon: "none",
      });
    }

    emit("confirm");

    uni.navigateTo({
      url: "/pages/order/create/index",
    });
  };
</script>

<template>
  <view class="header">
    <image class="thumb" :src="mainPicture"></image>
    <view class="wrap">
      <view class="price">
        <view class="discount">
          <text class="symbol">¥</text>
          <text class="number">{{ price }}</text>
        </view>
        <view class="original">
          <text class="symbol">¥</text>
          <text class="number">{{ oldPrice }}</text>
        </view>
      </view>
      <view class="extra">
        <text class="text">库存: {{ inventory }}</text>
      </view>
    </view>
  </view>

  <view class="body">
    <view class="specs">
      <template v-for="(spec, index) in specs" :key="spec.id">
        <view class="label">{{ spec.name }}</view>
        <view class="section">
          <view
            v-for="(value, key) in spec.values"
            :key="value.name"
            :class="[
              'item',
              { checked: value.checked, disabled: value.disabled },
            ]"
            @tap="toggleChecked(index, key)"
            >{{ value.name }}</view
          >
        </view>
      </template>
    </view>
    <view class="number">
      <view class="label">数量</view>
      <view class="counter">
        <text class="text" @tap="changeNumber(-1)">-</text>
        <input type="text" class="input" :value="goodsStore.number" />
        <text class="text" @tap="changeNumber(1)">+</text>
      </view>
    </view>
  </view>
  <view class="footer">
    <view @click="goCart" v-if="buttonType === 'cart'" class="button secondary"
      >加入购物车</view
    >
    <view v-else @click="goOrder" class="button primary">立即购买</view>
  </view>
</template>

<script lang="ts">
  export default {
    options: {
      styleIsolation: "apply-shared",
    },
  };
</script>

<style>
  .header {
    display: flex;
    padding: 30rpx 0 !important;
  }

  .header .thumb {
    width: 180rpx;
    height: 180rpx;
    margin-right: 20rpx;
    border-radius: 8rpx;
  }

  .header .wrap {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
  }

  .header .price {
    display: flex;
    align-items: baseline;
  }

  .header .price .discount {
    font-size: 40rpx;
    color: #cf4444;
  }

  .header .price .original {
    font-size: 28rpx;
    margin-left: 20rpx;
    color: #999;
    text-decoration: line-through;
  }

  .header .symbol,
  .header .decimal {
    font-size: 70%;
  }

  .header .extra {
    margin-bottom: 10rpx;
    font-size: 22rpx;
    color: #666;
  }

  .header .extra .text {
    margin-right: 10rpx;
  }

  .body {
    height: 540rpx !important;
    overflow: auto;
  }

  .body .label {
    margin: 10rpx 0 20rpx;
    color: #333;
    font-weight: 500;
    font-size: 26rpx;
  }

  .body .specs .section {
    overflow: hidden;
  }

  .body .specs .item {
    min-width: 100rpx;
    text-align: center;
    line-height: 1;
    padding: 10rpx 30rpx;
    margin: 0 20rpx 20rpx 0;
    border-radius: 50rpx;
    color: #444;
    font-size: 26rpx;
    border: 1rpx solid #f3f4f4;
    background-color: #f3f4f4;
    float: left;
  }

  .body .specs .checked {
    color: rgba(39, 186, 155, 0.8);
    border: 1rpx solid rgba(39, 186, 155, 0.3);
    background-color: rgba(39, 186, 155, 0.1);
  }

  .body .specs .disabled {
    opacity: 0.6;
    border: 1rpx dashed #999;
  }

  .body .number {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 80rpx;
    margin-top: 30rpx;
  }

  .body .number .counter {
    display: flex;
  }

  .body .counter .input {
    display: block;
    width: 100rpx;
    height: 48rpx;
    text-align: center;
    border-radius: 4rpx;
    font-size: 24rpx;
    color: #444;
    background-color: #f6f6f6;
  }

  .body .counter .text {
    display: block;
    width: 48rpx;
    height: 48rpx;
    text-align: center;
    line-height: 48rpx;
    font-size: 32rpx;
  }

  .body .counter .disabled {
    color: #999;
  }
</style>
