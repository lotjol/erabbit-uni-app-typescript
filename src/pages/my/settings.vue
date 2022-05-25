<template>
  <view class="viewport">
    <!-- 个人资料 -->
    <!-- <navigator
    url="./profile"
    hover-class="none"
    class="profile arrow">
    <image
      class="avatar"
      src="/static/uploads/avatar_3.jpg"></image>
    <view class="meta">
      <text class="nickname">花开了</text>
      <text class="level">等级: 钻石</text>
    </view>
  </navigator> -->

    <!-- 操作列表 -->
    <view class="list">
      <navigator url="./address/index" hover-class="none" class="item arrow"
        >我的收货地址</navigator
      >
      <!-- <navigator
      hover-class="none"
      class="item arrow">我的尺码</navigator>
    <navigator
      hover-class="none"
      class="item arrow">我的兴趣</navigator> -->
    </view>
    <view class="list">
      <!-- <navigator
      hover-class="none"
      class="item arrow">会员中心</navigator> -->
      <navigator url="./account" hover-class="none" class="item arrow"
        >账户与安全</navigator
      >
    </view>
    <view class="list">
      <button hover-class="none" class="item arrow" open-type="feedback">
        问题反馈
      </button>
      <button hover-class="none" class="item arrow" open-type="contact">
        联系我们
      </button>
      <navigator hover-class="none" url=" " class="item arrow"
        >关于小兔鲜儿</navigator
      >
    </view>
  </view>
</template>

<script setup lang="ts"></script>

<style>
page {
  background-color: #f4f4f4;
}

button {
  text-align: left;
  border-radius: 0;
  background-color: #fff;
}

button::after {
  width: auto;
  height: auto;
  left: auto;
  border: none;
}

.viewport {
  padding: 20rpx;
}

.arrow::after {
  position: absolute;
  top: 50%;

  content: "\e6c2";
  color: #ccc;
  font-family: "erabbit" !important;
  font-size: 32rpx;
  transform: translateY(-50%);
}

/* .profile {
  height: 180rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  border-radius: 10rpx;
  background-color: #fff;
  position: relative;
}

.profile::after {
  right: 25rpx;
}

.profile .avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  float: left;
}

.profile .meta {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  margin-left: 140rpx;
}

.profile .meta .nickname {
  font-size: 30rpx;
  color: #333;
}

.profile .meta .level {
  font-size: 27rpx;
  color: #666;
} */

.list {
  padding: 0 20rpx;
  background-color: #fff;
  margin-bottom: 20rpx;
  border-radius: 10rpx;
}

.list .item {
  line-height: 90rpx;
  padding-left: 10rpx;
  font-size: 30rpx;
  color: #333;
  border-top: 1rpx solid #ddd;
  position: relative;
}

.list .item:first-child {
  border: none;
}

.item::after {
  right: 5rpx;
}
</style>
