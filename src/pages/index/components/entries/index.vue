<template>
  <view class="entries">
    <scroll-view
      class="scroll-view"
      scroll-x
      enhanced
      :show-scrollbar="false"
      @scroll="scrolled"
    >
      <view class="navs">
        <view class="navs-item">
          <navigator
            class="navigator"
            hover-class="none"
            url="/pages/goods/list/index"
            v-for="item in source"
            :key="item.id"
          >
            <image class="icon" :src="item.icon"></image>
            <text class="text">{{ item.name }}</text>
          </navigator>
        </view>
        <view class="navs-item">
          <navigator
            class="navigator"
            hover-class="none"
            url="/pages/goods/list/index"
            v-for="item in source"
            :key="item.id"
          >
            <image class="icon" :src="item.icon"></image>
            <text class="text">{{ item.name }}</text>
          </navigator>
        </view>
      </view>
    </scroll-view>
    <!-- 滚动条 -->
    <view class="scroll-bar">
      <view class="cursor" :style="{ left: cursorLeft }"></view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { EntryType } from "@/api/category";

// 响应数据
let cursorLeft = ref("0%");

// 组件属性
defineProps<{
  source: EntryType;
}>();

// 滚动动画
const scrolled = (ev: WechatMiniprogram.ScrollViewScroll) => {
  cursorLeft.value = (ev.detail.scrollLeft / ev.detail.scrollWidth) * 100 + "%";
};
</script>

<style>
.entries {
  margin: 20rpx 0 0;
  padding: 10rpx 0;
}

.entries .navs {
  display: flex;
  width: 200%;
}

.entries .navs-item {
  display: flex;
  flex-wrap: wrap;
  width: 50%;
  text-align: center;
  min-height: 328rpx;
  box-sizing: border-box;
}

.entries .navigator {
  width: 150rpx;
  margin-bottom: 28rpx;
  float: left;
}

.entries .navigator .icon {
  width: 100rpx;
  height: 100rpx;
}

.entries .navigator .text {
  display: block;
  font-size: 26rpx;
  color: #666;
}

.entries .scroll-bar {
  width: 100rpx;
  height: 6rpx;
  margin: auto;
  border-radius: 6rpx;
  background-color: #e2e2e2;
  position: relative;
}

.entries .scroll-bar .cursor {
  width: 50%;
  height: 100%;
  background-color: #28bb9c;
  border-radius: 6rpx;

  position: absolute;
  left: 0;
}
</style>
