<template>
  <view class="viewport">
    <!-- 地址信息 -->
    <view class="form">
      <view class="form-item">
        <text class="label">姓名</text>
        <input placeholder-style="color: #888" placeholder="请填写收货人姓名" />
      </view>
      <view class="form-item">
        <text class="label">手机号码</text>
        <input
          placeholder-style="color: #888"
          placeholder="请填写收货人手机号码"
        />
      </view>
      <view class="form-item">
        <text class="label">省/市/县 (区)</text>
        <picker mode="region">
          <!-- <view class="region"></view> -->
          <view class="placeholder">请填写收货人所在城市</view>
        </picker>
      </view>
      <view class="form-item">
        <text class="label">详细地址</text>
        <input placeholder-style="color: #888" placeholder="街道、楼牌号信息" />
      </view>
      <view class="form-item">
        <text class="label">设置默认地址</text>
        <switch color="#27ba9b" />
      </view>
    </view>
    <!-- 提交按钮 -->
    <view class="button">保 存</view>
  </view>
</template>

<script setup lang="ts">
import { onLoad } from "@dcloudio/uni-app";

onLoad(({ id }) => {
  uni.setNavigationBarTitle({
    title: id ? "修改地址" : "新建地址",
  });
});
</script>

<style>
page {
  background-color: #f4f4f4;
}

.form {
  margin: 20rpx 20rpx 0;
  padding: 0 20rpx;
  border-radius: 10rpx;
  background-color: #fff;
}

.form .form-item {
  display: flex;
  min-height: 96rpx;
  line-height: 46rpx;
  padding: 25rpx 10rpx;
  background-color: #fff;
  font-size: 28rpx;
  border-bottom: 1rpx solid #ddd;
  position: relative;
}

.form .form-item:last-child {
  border: none;
}

.form .form-item .label {
  width: 200rpx;
  color: #333;
}

.form .form-item input {
  flex: 1;
  display: block;
  height: 46rpx;
}

.form .form-item switch {
  position: absolute;
  right: -10rpx;
  transform: scale(0.7) translateY(-8px);
}

.form .form-item picker {
  flex: 1;
}

.form .form-item .region {
  color: #333;
}

.form .form-item .placeholder {
  color: #888;
}

.button {
  height: 80rpx;
  text-align: center;
  line-height: 80rpx;
  margin: 30rpx 20rpx;
  color: #fff;
  border-radius: 80rpx;
  font-size: 30rpx;
  background-color: #27ba9b;
}
</style>
