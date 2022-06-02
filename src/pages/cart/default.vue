<template>
  <scroll-view scroll-y enhanced :show-scrollbar="false" class="viewport">
    <!-- 顶部工具栏 -->
    <view class="topbar" v-if="false">
      <view class="locate">顺义区后沙峪地区</view>
      <view class="extra">
        <text class="edit">编辑</text>
        <text class="menu"></text>
      </view>
    </view>

    <block v-if="true">
      <!-- 优惠提示 -->
      <view class="tips">
        <text class="label">满减</text>
        <text class="desc">满1件, 即可享受9折优惠</text>
      </view>

      <!-- 购物车商品 -->
      <view class="carts">
        <mp-slideview
          v-for="(item, index) in carts"
          :key="index"
          class="slideview"
          :buttons="slideButtons"
        >
          <view class="card">
            <text
              @click="checkToggle(index)"
              :class="['checkbox', `icon-${item.checked ? 'checked' : 'ring'}`]"
            ></text>
            <!-- 商品缩略图 -->
            <image class="thumb" :src="item.thumb"></image>
            <div class="meta">
              <!-- 商品名称 -->
              <view class="name ellipsis">{{ item.name }}</view>
              <!-- 商品类型 -->
              <view class="type">{{ item.type }}</view>
              <!-- 价格 -->
              <view class="price"> ¥{{ item.price }} </view>
              <!-- 商品数量 -->
              <view class="quantity">
                <text class="text" bind:tap="changeQuantity">-</text>
                <input class="input" type="text" :value="item.quantity" />
                <text class="text" bind:tap="changeQuantity">+</text>
              </view>
            </div>
          </view>
        </mp-slideview>
      </view>
    </block>

    <!-- 状态提示 -->
    <view class="blank" v-if="false">
      <text>登后后可查看购物车中的商品</text>
      <button class="button">去登录</button>
    </view>

    <!-- 猜你喜欢 -->
    <guess :source="[]"></guess>
  </scroll-view>

  <!-- 吸底工具栏 -->
  <view class="toolbar" v-if="true">
    <text class="all" @click="checkAll">全选</text>
    <text class="text">合计:</text>
    <text class="amount">266.00</text>
    <!-- 操作按钮 -->
    <view class="buttons">
      <view class="button payment" @click="goPay">去结算</view>
      <view class="button collect">移入收藏</view>
      <view class="button delete">删除</view>
    </view>
  </view>

  <!-- 对话框 -->
  <view class="mask" v-if="false">
    <view class="dialog">
      <text class="text">是否确认将此商品移入收藏?</text>
      <div class="buttons">
        <view class="button cancel">取消</view>
        <view class="button confirm">确认</view>
      </div>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from "vue";
import guess from "@/components/guess/index.vue";

const slideButtons = [
  {
    text: "移入收藏",
    extClass: "slideview-collect-button",
  },
  {
    text: "删除",
    extClass: "slideview-delete-button",
  },
];

const carts = ref([
  {
    thumb: "/static/uploads/goods_big_5.jpg",
    name: "康尔贝 非接触式红外体温仪 领券立减30元 婴儿级材质 测温",
    type: "粉色 红外体温计",
    price: 266,
    quantity: 1,
    checked: true,
  },
  {
    thumb: "/static/uploads/goods_big_6.jpg",
    name: "康尔贝 非接触式红外体温仪 领券立减30元 婴儿级材质 测温",
    type: "粉色 红外体温计",
    price: 266,
    quantity: 1,
    checked: false,
  },
  {
    thumb: "/static/uploads/goods_big_7.jpg",
    name: "康尔贝 非接触式红外体温仪 领券立减30元 婴儿级材质 测温",
    type: "粉色 红外体温计",
    price: 266,
    quantity: 1,
    checked: true,
  },
]);

const goPay = () => {
  uni.navigateTo({
    url: "/pages/order/index",
  });
};

const checkToggle = (index: number) => {
  carts.value[index].checked = !carts.value[index].checked;
};

const checkAll = () => {};
</script>

<script lang="ts">
export default {
  options: {
    // virtualHost: true,
    styleIsolation: "shared",
  },
};
</script>

<style>
:host {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.viewport {
  min-height: 400rpx;
  /* padding-bottom: 120rpx; */
}

/* 顶部工具栏 */
.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;

  height: 88rpx;
  padding: 0 30rpx;
  font-size: 26rpx;
  color: #262626;
  background-color: #fff;
}

.topbar .extra {
  display: flex;
  align-items: center;
  height: 24rpx;
  border-left: 1rpx solid #bfbfbf;
}

.topbar .extra .edit {
  padding: 0 30rpx;
}

.topbar .extra .menu {
  width: 9rpx;
  height: 9rpx;
  padding: 14rpx;
  border-radius: 50%;
  background-color: #262626;
  background-clip: content-box;
  position: relative;
}

.topbar .extra .menu::before,
.topbar .extra .menu::after {
  position: absolute;
  top: 50%;

  content: "";
  width: 6rpx;
  height: 4rpx;
  background-color: #8c8c8c;
  transform: translateY(-50%);
  border-radius: 4rpx;
}

.topbar .extra .menu::before {
  left: 0;
}

.topbar .extra .menu::after {
  right: 0;
}

/* 优惠提示 */
.tips {
  display: flex;
  align-items: center;
  line-height: 1;
  padding: 30rpx;
  font-size: 26rpx;
  color: #666;
}

.tips .label {
  color: #fff;
  padding: 7rpx 15rpx 5rpx;
  border-radius: 4rpx;
  font-size: 24rpx;
  background-color: #27ba9b;
  margin-right: 10rpx;
}

.carts {
  padding: 0 20rpx;
}

/* 购物车商品 */
.carts .card {
  display: flex;
  padding: 20rpx 20rpx 20rpx 80rpx;
  border-radius: 10rpx;
  background-color: #fff;
  position: relative;
}

.carts .slideview {
  display: block;
  margin-top: 20rpx;
}

.carts .slideview:first-child {
  margin-top: 0;
}

.carts .card .checkbox {
  position: absolute;
  top: 0;
  left: 0;

  display: flex;
  align-items: center;
  justify-content: center;
  width: 80rpx;
  height: 100%;
  font-size: 40rpx;
  color: #444;
}

.carts .card .icon-checked {
  color: #27ba9b;
}

.carts .card .thumb {
  width: 170rpx;
  height: 170rpx;
}

.carts .card .meta {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-left: 20rpx;
}

.carts .card .name {
  height: 72rpx;
  font-size: 26rpx;
  color: #444;
}

.carts .card .type {
  line-height: 1.8;
  padding: 0 15rpx;
  font-size: 24rpx;
  align-self: flex-start;
  border-radius: 4rpx;
  color: #888;
  background-color: #f7f7f8;
}

.carts .card .price {
  line-height: 1;
  font-size: 26rpx;
  color: #444;
  margin-bottom: 2rpx;
}

.carts .card .warning {
  color: #cf4444;
  font-size: 24rpx;
}

.carts .card .quantity {
  position: absolute;
  bottom: 20rpx;
  right: 5rpx;

  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 220rpx;
  height: 48rpx;
}

.carts .card .quantity .text {
  height: 100%;
  padding: 0 20rpx;
  font-size: 32rpx;
  color: #444;
}

.carts .card .quantity .input {
  height: 100%;
  text-align: center;
  border-radius: 4rpx;
  font-size: 24rpx;
  color: #444;
  background-color: #f6f6f6;
}

/* 购物车状态提示 */
.blank {
  padding: 100rpx 0 60rpx;
  text-align: center;
  color: #444;
  font-size: 26rpx;
}

.blank .button {
  width: 240rpx !important;
  height: 60rpx;
  line-height: 60rpx;
  margin-top: 25rpx;
  font-size: 26rpx;
  border-radius: 60rpx;
  color: #fff;
  background-color: #27ba9b;
}

.blank .button::after {
  display: none;
}

/* 吸底工具栏 */
.toolbar {
  position: relative;
  padding: 32rpx 20rpx 28rpx;
  border-top: 1rpx solid #ededed;
  border-bottom: 1rpx solid #ededed;
  background-color: #fff;
}

.toolbar .all {
  margin-left: 25rpx;
  font-size: 14px;
  color: #444;
}

.toolbar .all::before {
  font-family: "erabbit" !important;
  content: "\e6cd";
  font-size: 36rpx;
  margin-right: 8rpx;
  vertical-align: -4rpx;
}

.toolbar .checked::before {
  content: "\e6cc";
  color: #27ba9b;
}

.toolbar .text {
  margin-right: 8rpx;
  margin-left: 32rpx;
  color: #444;
  font-size: 14px;
}

.toolbar .amount {
  font-size: 20px;
  color: #cf4444;
  vertical-align: -1px;
}

.toolbar .amount::before {
  content: "￥";
  font-size: 12px;
}

.toolbar .amount .decimal {
  font-size: 12px;
}

.toolbar .buttons {
  position: absolute;
  right: 10rpx;
  top: 50%;

  display: flex;
  justify-content: space-between;
  text-align: center;
  line-height: 72rpx;
  font-size: 13px;
  color: #fff;
  transform: translateY(-50%);
}

.toolbar .buttons .button {
  width: 240rpx;
  margin: 0 10rpx;
  border-radius: 72rpx;
}

.toolbar .payment {
  /*display: none;*/
  background-color: #27ba9b;
}

.toolbar .disabled {
  opacity: 0.6;
}

.toolbar .delete {
  display: none;
  background-color: #27ba9b;
}

.toolbar .collect {
  display: none;
  background-color: #ffa868;
}

/* 对话框 */
.mask {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 99;
  background-color: rgba(0, 0, 0, 0.5);
}

.mask .dialog {
  width: 575rpx;
  text-align: center;
  padding: 60rpx 30rpx;
  border-radius: 10rpx;
  transform: translate(-50%, -70%);
  background-color: #fff;

  position: absolute;
  left: 50%;
  top: 50%;
}

.mask .dialog .text {
  font-size: 32rpx;
  color: #444;
}

.mask .dialog .buttons {
  display: flex;
  justify-content: space-around;
  height: 66rpx;
  line-height: 66rpx;
  margin-top: 40rpx;
  font-size: 26rpx;
}

.mask .buttons .button {
  width: 190rpx;
  border-radius: 6rpx;
}

.mask .buttons .cancel {
  color: #999;
  border: 1rpx solid #999;
}

.mask .buttons .confirm {
  color: #fff;
  background-color: #27ba9b;
}

.slideview-collect-button,
.slideview-delete-button {
  color: #fff;
  font-size: 26rpx;
}

.slideview-collect-button {
  background-color: #ffa868 !important;
}

.slideview-delete-button {
  background-color: #cf4444 !important;
}

.slideview-delete-button::before {
  display: none;
}
</style>
