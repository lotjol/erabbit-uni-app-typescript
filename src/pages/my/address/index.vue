<template>
  <view class="viewport">
    <!-- 地址列表 -->
    <scroll-view enhanced scroll-y>
      <view class="address">
        <mp-slideview :buttons="slideButtons">
          <view class="item">
            <view class="user">
              王东
              <text>13824686868</text>
              <text class="badge">默认</text>
            </view>
            <view class="locate">北京市顺义区后沙峪地区安平北街6号院</view>
            <navigator url="./form?id=1" class="edit" hover-class="none"
              >修改</navigator
            >
          </view>
        </mp-slideview>
        <mp-slideview :buttons="slideButtons">
          <view class="item">
            <view class="user"> 寒冰 <text>13824686868</text> </view>
            <view class="locate">北京市顺义区后沙峪地区安平北街6号院</view>
            <navigator url="./form?id=2" class="edit" hover-class="none"
              >修改</navigator
            >
          </view>
        </mp-slideview>
        <mp-slideview :buttons="slideButtons">
          <view class="item">
            <view class="user"> 寒冰 <text>13824686868</text> </view>
            <view class="locate default"
              >北京市顺义区后沙峪地区安平北街6号院北京市顺义区后沙峪地区安平北街6号院</view
            >
            <navigator url="./form?id=3" class="edit" hover-class="none"
              >修改</navigator
            >
          </view>
        </mp-slideview>
      </view>
      <view v-if="false" class="blank">收货地址为空~</view>
    </scroll-view>
    <!-- 添加按钮 -->
    <view class="button">
      <navigator hover-class="none" url="./form">新建地址</navigator>
    </view>
  </view>
</template>

<script setup lang="ts">
const slideButtons = [
  {
    text: "删除",
    extClass: "slideview-delete-button",
  },
];
</script>

<style>
page {
  height: 100%;
  overflow: hidden;
}

.viewport {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #f4f4f4;
}

.viewport scroll-view {
  padding-top: 20rpx;
}

.address {
  padding: 0 20rpx;
  margin: 0 20rpx;
  border-radius: 10rpx;
  background-color: #fff;
}

.address .item {
  line-height: 1;
  padding: 40rpx 10rpx 38rpx;
  border-bottom: 1rpx solid #ddd;
  position: relative;
}

.address mp-slideview:last-child .item {
  border: none;
}

.address .item .user {
  font-size: 28rpx;
  margin-bottom: 20rpx;
  color: #333;
}

.address .item .user text {
  color: #666;
}

.address .item .user .badge {
  display: inline-block;
  padding: 4rpx 10rpx 2rpx 14rpx;
  margin: 2rpx 0 0 10rpx;
  font-size: 26rpx;
  color: #27ba9b;
  border-radius: 6rpx;
  border: 1rpx solid #27ba9b;
}

.address .item .locate {
  line-height: 1.6;
  font-size: 26rpx;
  color: #333;
}

.slideview-delete-button > view {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  font-size: 28rpx;
  background-color: #cf4444 !important;
}

.address .item .edit {
  position: absolute;
  top: 36rpx;
  right: 30rpx;

  padding: 2rpx 0 2rpx 20rpx;
  border-left: 1rpx solid #666;
  font-size: 26rpx;
  color: #666;
  line-height: 1;
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

.blank {
  margin-top: 300rpx;
  text-align: center;
  font-size: 32rpx;
  color: #888;
}
</style>
