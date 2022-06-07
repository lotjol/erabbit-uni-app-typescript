<template>
  <view class="navbar" :style="{ paddingTop: safeArea?.top + 'px' }">
    <view class="wrap">
      <view class="back icon-left" @click="goBack"></view>
      <view :class="['title', platform]">订单详情</view>
    </view>
  </view>

  <scroll-view
    class="viewport"
    id="scrollView"
    enhanced
    scroll-y
    :show-scrollbar="false"
  >
    <!-- 订单状态 -->
    <view class="overview" :style="{ paddingTop: safeArea!.top + 40 + 'px' }">
      <view class="status icon-clock">等待付款</view>
      <view class="tips">
        <text>应付金额: ¥90:00</text>
        <text class="countdown">支付剩余23时57分42秒</text>
      </view>
      <view class="button">去支付</view>
    </view>

    <!-- 配送状态 -->
    <view class="shipment">
      <!-- 物流信息 -->
      <navigator
        class="logistics"
        hover-class="none"
        url="/pages/order/logistics/index"
      >
        <view class="message"
          >您已在北京顺义后沙峪智慧城7号楼店完成取件，感谢使用菜鸟驿站，期待再次为您服务。</view
        >
        <view class="date">2020-11-21 09:15:09</view>
      </navigator>
      <!-- 收货地址 -->
      <view class="locate">
        <view class="user">张无忌 13824686868</view>
        <view class="address">北京市顺义区后沙峪地区安平北街6号院</view>
      </view>
    </view>

    <!-- 商品信息 -->
    <view class="goods">
      <view class="item">
        <navigator hover-class="none">
          <image
            class="cover"
            src="http://static.botue.com/erabbit/static/uploads/goods_big_7.jpg"
          ></image>
          <view class="meta">
            <view class="name ellipsis"
              >康尔贝 非接触式红外体温仪 领券立减30元 婴儿级材质 测温 康尔贝
              非接触式红外体温仪</view
            >
            <view class="type">白色 全自动充电</view>
            <view class="price">
              <view class="original">
                <text class="symbol">¥</text>
                <text>129</text>
                <text>.04</text>
              </view>
              <view class="actual">
                <text class="text">实付: </text>
                <text class="symbol">¥</text>
                <text>129</text>
                <text>.04</text>
              </view>
            </view>
            <view class="quantity">x1</view>
          </view>
        </navigator>
        <view class="action">
          <view class="button primary">申请售后</view>
          <navigator url="/pages/comments/publish/index" class="button"
            >去评价</navigator
          >
        </view>
      </view>
      <view class="item">
        <navigator hover-class="none">
          <image
            class="cover"
            src="http://static.botue.com/erabbit/static/uploads/goods_big_6.jpg"
          ></image>
          <view class="meta">
            <view class="name ellipsis"
              >康尔贝 非接触式红外体温仪 领券立减30元 婴儿级材质 测温 康尔贝
              非接触式红外体温仪</view
            >
            <view class="type">白色 全自动充电</view>
            <view class="price">
              <view class="original">
                <text class="symbol">¥</text>
                <text>129</text>
                <text>.04</text>
              </view>
              <view class="actual">
                <text class="text">实付: </text>
                <text class="symbol">¥</text>
                <text>129</text>
                <text>.04</text>
              </view>
            </view>
            <view class="quantity">x1</view>
          </view>
        </navigator>
      </view>
      <view class="item">
        <navigator hover-class="none">
          <image
            class="cover"
            src="http://static.botue.com/erabbit/static/uploads/goods_big_5.jpg"
          ></image>
          <view class="meta">
            <view class="name ellipsis"
              >康尔贝 非接触式红外体温仪 领券立减30元 婴儿级材质 测温 康尔贝
              非接触式红外体温仪</view
            >
            <view class="type">白色 全自动充电</view>
            <view class="price">
              <view class="original">
                <text class="symbol">¥</text>
                <text>129</text>
                <text>.04</text>
              </view>
              <view class="actual">
                <text class="text">实付: </text>
                <text class="symbol">¥</text>
                <text>129</text>
                <text>.04</text>
              </view>
            </view>
            <view class="quantity">x1</view>
          </view>
        </navigator>
        <view class="action">
          <view class="button primary">申请售后</view>
          <navigator
            class="button"
            hover-class="none"
            url="/pages/comments/publish/index"
            >去评价</navigator
          >
        </view>
      </view>
      <!-- 合计 -->
      <view class="total">
        <view class="row">
          <view class="text">商品总价: </view>
          <view class="symbol">129.04</view>
        </view>
        <view class="row">
          <view class="text">运费: </view>
          <view class="symbol">10.00</view>
        </view>
        <view class="row paid">
          <view class="text">实付: </view>
          <view class="symbol primary">139.04</view>
        </view>
      </view>
    </view>

    <!-- 订单信息 -->
    <view class="detail">
      <view class="title">订单信息</view>
      <view class="row">
        <view>订单编号: 838558731208</view>
        <view>下单时间: 2020-12-12 23:59:59</view>
        <view>支付方式: 在线支付</view>
        <view>支付渠道: 微信支付</view>
      </view>
    </view>

    <!-- 猜你喜欢 -->
    <guess :source="[]"></guess>
  </scroll-view>

  <div class="buttons">
    <view class="primary">去支付</view>
    <view class="default" @click="cancelOrder">取消订单</view>
  </div>

  <mp-half-screen-dialog
    extClass="half-dialog"
    :show="showHalfDialog"
    closabled="{{false}}"
  >
    <template v-slot:title>
      <view class="title">订单取消</view>
    </template>
    <template v-slot:desc>
      <view class="description">
        <view class="tips">请选择取消订单的原因:</view>
        <view class="cell">
          <text class="text">商品无货</text>
          <text class="icon-checked"></text>
        </view>
        <view class="cell">
          <text class="text">不想要了</text>
          <text class="icon-ring"></text>
        </view>
        <view class="cell">
          <text class="text">商品信息填错了</text>
          <text class="icon-ring"></text>
        </view>
        <view class="cell">
          <text class="text">地址信息填写错误</text>
          <text class="icon-ring"></text>
        </view>
        <view class="cell">
          <text class="text">商品降价</text>
          <text class="icon-ring"></text>
        </view>
        <view class="cell">
          <text class="text">其它</text>
          <text class="icon-ring"></text>
        </view>
      </view>
    </template>
    <template v-slot:footer>
      <view class="footer">
        <view class="button" @click="cancelHalfDialog">取消</view>
        <view class="button primary">确认</view>
      </view>
    </template>
  </mp-half-screen-dialog>
</template>

<script setup lang="ts">
  import { ref, getCurrentInstance } from "vue";
  import { onReady } from "@dcloudio/uni-app";

  import { useAppStore } from "@/store";

  import guess from "@/components/guess/index.vue";

  const appStore = useAppStore();
  // 不需要响应式变化
  const { safeArea, platform } = appStore;

  const showHalfDialog = ref(false);

  const pageInstance: any = getCurrentInstance();

  const cancelOrder = () => {
    showHalfDialog.value = true;
  };

  const cancelHalfDialog = () => {
    showHalfDialog.value = false;
  };

  const goBack = () => {
    uni.navigateBack({});
  };

  onReady(() => {
    pageInstance.ctx.$scope.animate(
      ".navbar .title",
      [{ opacity: 0 }, { opacity: 1 }],
      600,
      {
        scrollSource: "#scrollView",
        timeRange: 600,
        startScrollOffset: 0,
        endScrollOffset: 120,
      }
    );
  });
</script>

<style>
  page {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
  }

  .navbar {
    width: 750rpx;
    color: #fff;
    background-image: url(http://static.botue.com/erabbit/static/images/order_bg.png);
    background-size: cover;

    position: fixed;
    top: 0;
    left: 0;
    z-index: 9;
  }

  .navbar .title {
    height: 40px;
    line-height: 30px;
    text-align: center;
    font-size: 17px;
    font-weight: 500;
    opacity: 0;
  }

  .navbar .android {
    text-align: left;
    padding-left: 42px;
  }

  .navbar .wrap {
    position: relative;
  }

  .navbar .back {
    position: absolute;
    left: 10px;
    top: 4px;
    line-height: 1;
    font-size: 23px;
    z-index: 9;
  }

  .viewport {
    background-color: #f7f7f8;
  }

  .overview {
    display: flex;
    flex-direction: column;
    align-items: center;

    line-height: 1;
    padding-bottom: 30rpx;
    color: #fff;
    background-image: url(http://static.botue.com/erabbit/static/images/order_bg.png);
    background-size: cover;
  }

  .overview .status {
    font-size: 36rpx;
  }

  .overview .status::before {
    margin-right: 6rpx;
    font-weight: 500;
  }

  .overview .tips {
    margin-top: 30rpx;
    font-size: 24rpx;
  }

  .overview .tips .countdown {
    margin-left: 10rpx;
  }

  .overview .button {
    width: 260rpx;
    height: 64rpx;
    text-align: center;
    line-height: 64rpx;
    margin-top: 30rpx;
    font-size: 28rpx;
    color: #27ba9b;
    border-radius: 68rpx;
    background-color: #fff;
  }

  .shipment {
    line-height: 1.4;
    padding: 0 20rpx;
    margin: 20rpx 20rpx 0;
    border-radius: 10rpx;
    background-color: #fff;
  }

  .shipment .locate,
  .shipment .logistics {
    min-height: 120rpx;
    padding: 30rpx 30rpx 25rpx 75rpx;
    background-size: 50rpx;
    background-repeat: no-repeat;
    background-position: 6rpx center;
  }

  .shipment .locate {
    background-image: url(http://static.botue.com/erabbit/static/images/locate.png);
  }

  .shipment .locate .user {
    font-size: 26rpx;
    color: #444;
  }

  .shipment .locate .address {
    font-size: 24rpx;
    color: #666;
  }

  .shipment .logistics {
    background-image: url(http://static.botue.com/erabbit/static/images/car.png);
    border-bottom: 1rpx solid #eee;
    position: relative;
  }

  .shipment .logistics::after {
    position: absolute;
    right: 10rpx;
    top: 50%;

    transform: translateY(-50%);
    content: "\e6c2";
    font-family: "erabbit" !important;
    font-size: 32rpx;
    color: #666;
  }

  .shipment .logistics .message {
    font-size: 26rpx;
    color: #444;
  }

  .shipment .logistics .date {
    font-size: 24rpx;
    color: #666;
  }

  .goods {
    margin: 20rpx 20rpx 0;
    padding: 0 20rpx;
    border-radius: 10rpx;
    background-color: #fff;
  }

  .goods .item {
    padding: 30rpx 0;
    border-bottom: 1rpx solid #eee;
  }

  .goods .item navigator {
    display: flex;
  }

  .goods .item .cover {
    width: 170rpx;
    height: 170rpx;
    border-radius: 10rpx;
    margin-right: 20rpx;
  }

  .goods .item .meta {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: relative;
  }

  .goods .item .name {
    height: 80rpx;
    font-size: 26rpx;
    color: #444;
  }

  .goods .item .type {
    line-height: 1.8;
    padding: 0 15rpx;
    margin-top: 6rpx;
    font-size: 24rpx;
    align-self: flex-start;
    border-radius: 4rpx;
    color: #888;
    background-color: #f7f7f8;
  }

  .goods .item .price {
    display: flex;
    margin-top: 6rpx;
    font-size: 24rpx;
  }

  .goods .item .symbol {
    font-size: 20rpx;
  }

  .goods .item .original {
    color: #999;
    text-decoration: line-through;
  }

  .goods .item .actual {
    margin-left: 10rpx;
    color: #444;
  }

  .goods .item .text {
    font-size: 22rpx;
  }

  .goods .item .quantity {
    position: absolute;
    bottom: 0;
    right: 0;
    font-size: 24rpx;
    color: #444;
  }

  .goods .item .action {
    display: flex;
    flex-direction: row-reverse;
    justify-content: flex-start;
    padding: 30rpx 0 0;
  }

  .goods .action .button {
    width: 200rpx;
    height: 60rpx;
    text-align: center;
    line-height: 60rpx;
    margin-left: 20rpx;
    border-radius: 60rpx;
    border: 1rpx solid #ccc;
    font-size: 26rpx;
    color: #444;
  }

  .goods .action .primary {
    color: #27ba9b;
    border-color: #27ba9b;
  }

  .goods .total {
    line-height: 1;
    font-size: 26rpx;
    padding: 20rpx 0;
    color: #666;
  }

  .goods .total .row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10rpx 0;
  }

  .goods .total .symbol::before {
    content: "¥";
    font-size: 20rpx;
  }

  .goods .total .paid {
    font-size: 30rpx;
    color: #444;
  }

  .goods .total .primary {
    color: #cf4444;
  }

  .detail {
    line-height: 1;
    padding: 30rpx 20rpx 0;
    margin: 20rpx 20rpx 0;
    font-size: 26rpx;
    color: #666;
    border-radius: 10rpx;
    background-color: #fff;
  }

  .detail .title {
    font-size: 30rpx;
    color: #444;
  }

  .detail .row {
    padding: 20rpx 0;
  }

  .detail .row > view {
    display: block;
    padding: 10rpx 0;
  }

  .buttons {
    display: flex;
    flex-direction: row-reverse;
    justify-content: flex-start;
    padding: 30rpx 20rpx;
    background-color: #fff;
    box-shadow: 0 -4rpx 6rpx rgba(240, 240, 240, 0.6);
    position: relative;
    z-index: 9;
  }

  .buttons > view {
    width: 200rpx;
    height: 72rpx;
    text-align: center;
    line-height: 72rpx;
    margin-left: 15rpx;
    font-size: 26rpx;
    border-radius: 72rpx;
  }

  .buttons .default {
    color: #444;
    border: 1rpx solid #ccc;
  }

  .buttons .primary {
    color: #fff;
    background-color: #27ba9b;
  }

  .half-dialog .title {
    border-bottom: none;
  }

  .half-dialog .description {
    font-size: 28rpx;
  }

  .half-dialog .description .tips {
    color: #444;
    margin-bottom: 12rpx;
  }

  .half-dialog .description .cell {
    display: flex;
    justify-content: space-between;
    align-items: center;

    line-height: 1;
    padding: 15rpx 0;
    margin-bottom: 4rpx;
    color: #666;
  }

  .half-dialog .description .icon-ring {
    font-size: 38rpx;
    color: #999;
  }

  .half-dialog .description .icon-checked {
    font-size: 38rpx;
    color: #27ba9b;
  }
</style>
