<template>
  <view class="header">
    <image
      class="thumb"
      src="http://static.botue.com/erabbit/static/uploads/goods_preview_1.jpg"
    ></image>
    <view class="wrap">
      <view class="price">
        <view class="discount">
          <text class="symbol">¥</text>
          <text class="number">129</text>
          <text class="decimal">.00</text>
        </view>
        <view class="original">
          <text class="symbol">¥</text>
          <text class="number">199</text>
          <text class="decimal">.00</text>
        </view>
      </view>
      <view class="extra">
        <text class="text">重量: 0.2kg</text>
        <text class="text">编号: 676587698</text>
      </view>
    </view>
  </view>

  <view class="body">
    <view class="specs">
      <view class="label">颜色</view>
      <view class="section">
        <view class="item checked">白色</view>
        <view class="item">黑色</view>
        <view class="item">灰色</view>
        <view class="item">卡其色</view>
      </view>
      <view class="label">类型</view>
      <view class="section">
        <view class="item">红外体温计</view>
        <view class="item disabled">双模</view>
        <view class="item">灵敏</view>
        <view class="item">便携式</view>
      </view>
    </view>
    <view class="number">
      <view class="label">数量</view>
      <view class="counter">
        <text class="text disabled">-</text>
        <input type="text" class="input" value="1" />
        <text class="text">+</text>
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
<script setup lang="ts">
  import { defineProps } from "vue";

  defineProps<{ buttonType: string }>();

  const goCart = () => {
    uni.navigateTo({
      url: "/pages/cart/default/index",
    });
  };

  const goOrder = () => {
    uni.navigateTo({
      url: "/pages/order/create/index",
    });
  };
</script>
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
