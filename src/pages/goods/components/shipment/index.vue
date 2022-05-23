<template>
  <view class="title">配送至</view>
  <view class="shipment">
    <view class="item">
      <view class="user">李明 13824686868</view>
      <view class="address">北京市顺义区后沙峪地区安平北街6号院</view>
      <text class="icon icon-checked"></text>
    </view>
    <view class="item">
      <view class="user">王东 13824686868</view>
      <view class="address">北京市顺义区后沙峪地区安平北街6号院</view>
      <text class="icon icon-ring"></text>
    </view>
    <view class="item">
      <view class="user">张三 13824686868</view>
      <view class="address">北京市朝阳区孙河安平北街6号院</view>
      <text class="icon icon-ring"></text>
    </view>
  </view>
  <view class="footer">
    <view
      bind:tap="navigateTo"
      mark:url="/pages/my/address/form/index"
      class="button primary"
      >新建地址</view
    >
    <view bind:tap="confirm" wx:if="{{false}}" class="button primary"
      >确定</view
    >
  </view>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  options: {
    styleIsolation: "shared",
  },
});
</script>

<style>
.shipment {
  min-height: 300rpx;
  max-height: 540rpx;
  overflow: auto;
  padding: 20rpx 10rpx !important;
}

.shipment .item {
  padding: 30rpx 50rpx 30rpx 60rpx;
  background-size: 40rpx;
  background-repeat: no-repeat;
  background-position: 0 center;
  background-image: url(http://static.botue.com/erabbit/static/images/locate.png);
  position: relative;
}

.shipment .item .icon {
  color: #999;
  font-size: 40rpx;
  transform: translateY(-50%);
  position: absolute;
  top: 50%;
  right: 0;
}

.shipment .item .icon-checked {
  color: #27ba9b;
}

.shipment .item .icon-ring {
  color: #444;
}

.shipment .item .user {
  font-size: 28rpx;
  color: #444;
  font-weight: 500;
}

.shipment .item .address {
  font-size: 26rpx;
  color: #666;
}
</style>
