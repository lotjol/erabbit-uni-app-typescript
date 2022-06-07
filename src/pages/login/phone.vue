<template>
  <view class="viewport">
    <view class="profile">
      <image
        class="avatar"
        src="http://static.botue.com/erabbit/static/uploads/avatar_2.jpg"
      ></image>
      <text class="nickname">牛仔很忙</text>
    </view>
    <view class="tips">
      <text>你还没有绑定手机，</text>
      <text>这将会影响部分功能的使用</text>
    </view>
    <button
      open-type="getPhoneNumber"
      @getphonenumber="getPhoneNumber"
      class="button"
    >
      <text class="icon-phone"></text>
      一键绑定手机号
    </button>
  </view>
</template>

<script setup lang="ts">
  const getPhoneNumber = () => {};
</script>

<style>
  .viewport {
    padding: 0 40rpx;
  }

  .profile {
    text-align: center;
    padding-top: 140rpx;
  }

  .profile .avatar {
    width: 160rpx;
    height: 160rpx;
    border-radius: 50%;
  }

  .profile .nickname {
    display: block;
    margin-top: 20rpx;
    font-size: 32rpx;
    color: #333;
  }

  .tips {
    line-height: 1.4;
    margin: 70rpx 0 20rpx;
    text-align: center;
    font-size: 28rpx;
    color: #999;
  }

  .tips text {
    display: block;
  }

  .button {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 80rpx;
    line-height: 80rpx;
    color: #fff;
    font-size: 28rpx;
    background-color: #06c05f;
    border-radius: 80rpx;
  }

  .button .icon-phone {
    display: block;
    font-size: 40rpx;
    margin-right: 6rpx;
  }
</style>
