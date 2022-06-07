<template>
  <view class="viewport">
    <view class="navbar" :style="{ paddingTop: safeArea?.top + 'px' }">
      <view class="back icon-left" @click="goBack"></view>
      <view class="title">个人信息</view>
    </view>
    <scroll-view scroll-y>
      <!-- 头像 -->
      <view class="avatar">
        <image
          @click="chooseImage"
          src="http://static.botue.com/erabbit/static/uploads/avatar_3.jpg"
        />
        <text>点击修改头像</text>
      </view>
      <!-- 用户信息 -->
      <view class="form">
        <view class="form-item">
          <text class="label">账号</text>
          <input value="26219453547" />
        </view>
        <view class="form-item">
          <text class="label">昵称</text>
          <input value="张三" />
        </view>
        <view class="form-item">
          <text class="label">性别</text>
          <radio-group>
            <label class="radio">
              <radio value="1" color="#27ba9b" :checked="true" /> 男
            </label>
            <label class="radio">
              <radio value="0" color="#27ba9b" /> 女
            </label>
          </radio-group>
        </view>
        <view class="form-item">
          <text class="label">出生日期</text>
          <picker mode="date" start="2015-09-01" end="2017-09-01">
            <view>2021-01-02</view>
          </picker>
        </view>
        <view class="form-item">
          <text class="label">城市</text>
          <picker mode="region">
            <view>北京</view>
          </picker>
        </view>
        <view class="form-item">
          <text class="label">职业</text>
          <input value="伙夫" />
        </view>
      </view>
      <!-- 提交按钮 -->
      <view class="button">保 存</view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
  import { useAppStore } from "@/store";

  const appStore = useAppStore();
  const safeArea = appStore.safeArea;

  const goBack = () => {
    uni.navigateBack({});
  };

  const chooseImage = () => {
    uni.chooseImage({});
  };
</script>

<style>
  page {
    height: 100%;
    overflow: hidden;
    background-color: #f4f4f4;
  }

  .viewport {
    display: flex;
    flex-direction: column;
    height: 100%;
    background-image: url(http://static.botue.com/erabbit/static/images/order_bg.png);
    background-size: auto 392rpx;
    background-repeat: no-repeat;
  }

  .navbar .title {
    height: 40px;
    line-height: 32px;
    text-align: center;
    font-size: 17px;
    font-weight: 500;
    color: #fff;
  }

  .navbar .back {
    position: absolute;
    left: 20rpx;
    top: 22px;
    font-size: 23px;
    z-index: 9;
    color: #fff;
  }

  .avatar {
    text-align: center;
    padding: 20rpx 0 40rpx;
  }

  .avatar image {
    width: 160rpx;
    height: 160rpx;
    border-radius: 50%;
  }

  .avatar text {
    display: block;
    padding-top: 20rpx;
    line-height: 1;
    font-size: 26rpx;
    color: #fff;
  }

  .form {
    margin: 20rpx 20rpx 0;
    padding: 0 20rpx;
    border-radius: 10rpx;
    background-color: #fff;
  }

  .form .form-item {
    display: flex;
    height: 96rpx;
    line-height: 46rpx;
    padding: 25rpx 10rpx;
    background-color: #fff;
    font-size: 28rpx;
    border-bottom: 1rpx solid #ddd;
  }

  .form .form-item:last-child {
    border: none;
  }

  .form .form-item .label {
    width: 180rpx;
    color: #333;
  }

  .form .form-item input {
    flex: 1;
    display: block;
    height: 46rpx;
  }

  .form .form-item .radio {
    display: inline-block;
    height: 46rpx;
    margin-right: 20rpx;
    vertical-align: middle;
  }

  .form .form-item radio {
    transform: scale(0.7) translateY(-2px);
  }

  .form .form-item picker {
    flex: 1;
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
