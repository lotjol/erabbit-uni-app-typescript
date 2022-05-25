<template>
  <view class="viewport">
    <scroll-view scroll-y>
      <view class="caption">选择兴趣爱好</view>
      <view class="tips">建议多选几个您感兴趣的分类</view>
      <view class="interest">
        <view class="title">您感兴趣的分类是</view>
        <view class="item">
          <image class="cover" src="/static/uploads/interest_1.jpg" />
          <switch type="checkbox" />
        </view>
        <view class="item">
          <image class="cover" src="/static/uploads/interest_2.jpg" />
          <switch type="checkbox" />
        </view>
        <view class="item">
          <image class="cover" src="/static/uploads/interest_3.jpg" />
          <switch type="checkbox" />
        </view>
        <view class="item">
          <image class="cover" src="/static/uploads/interest_4.jpg" />
          <switch type="checkbox" />
        </view>
        <view class="item">
          <image class="cover" src="/static/uploads/interest_5.jpg" />
          <switch type="checkbox" />
        </view>
        <view class="item">
          <image class="cover" src="/static/uploads/interest_6.jpg" />
          <switch type="checkbox" />
        </view>
        <view class="item">
          <image class="cover" src="/static/uploads/interest_2.jpg" />
          <switch type="checkbox" />
        </view>
        <view class="item">
          <image class="cover" src="/static/uploads/interest_3.jpg" />
          <switch type="checkbox" />
        </view>
        <view class="item">
          <image class="cover" src="/static/uploads/interest_4.jpg" />
          <switch type="checkbox" />
        </view>
      </view>
    </scroll-view>
    <!-- 添加按钮 -->
    <!-- <view class="button">保存</view> -->
  </view>
</template>

<script setup lang="ts"></script>

<style>
page {
  height: 100%;
  overflow: hidden;
}

.viewport {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 20rpx;
  background-color: #f4f4f4;
}

.viewport scroll-view {
  border-radius: 10rpx;
  background-color: #fff;
}

.viewport .caption {
  padding: 30rpx 20rpx 0;
  font-size: 30rpx;
  color: #333;
}

.viewport .tips {
  margin: 0 20rpx;
  font-size: 26rpx;
  color: #666;
}

.interest {
  padding: 70rpx 55rpx 0;
  overflow: hidden;
}

.interest .title {
  text-align: center;
  font-size: 30rpx;
  color: #333;
}

.interest .item {
  text-align: center;
  margin: 50rpx 20rpx 0;
  float: left;
}

.interest .item .cover {
  width: 160rpx;
  height: 160rpx;
  display: block;
  border-radius: 10rpx;
}

.interest .item switch {
  margin-top: 10rpx;
  transform: scale(0.7);
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
