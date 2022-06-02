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
          >
            <image class="icon" src="/static/images/nav_icon_1.png"></image>
            <text class="text">美食</text>
          </navigator>
          <navigator
            class="navigator"
            hover-class="none"
            url="/pages/goods/list/index"
          >
            <image class="icon" src="/static/images/nav_icon_2.png"></image>
            <text class="text">餐厨</text>
          </navigator>
          <navigator
            class="navigator"
            hover-class="none"
            url="/pages/goods/list/index"
          >
            <image class="icon" src="/static/images/nav_icon_3.png"></image>
            <text class="text">电器</text>
          </navigator>
          <navigator
            class="navigator"
            hover-class="none"
            url="/pages/goods/list/index"
          >
            <image class="icon" src="/static/images/nav_icon_4.png"></image>
            <text class="text">居家</text>
          </navigator>
          <navigator
            class="navigator"
            hover-class="none"
            url="/pages/goods/list/index"
          >
            <image class="icon" src="/static/images/nav_icon_5.png"></image>
            <text class="text">洗护</text>
          </navigator>
          <navigator
            class="navigator"
            hover-class="none"
            url="/pages/goods/list/index"
          >
            <image class="icon" src="/static/images/nav_icon_6.png"></image>
            <text class="text">汽车</text>
          </navigator>
          <navigator
            class="navigator"
            hover-class="none"
            url="/pages/goods/list/index"
          >
            <image class="icon" src="/static/images/nav_icon_7.png"></image>
            <text class="text">旅行</text>
          </navigator>
          <navigator
            class="navigator"
            hover-class="none"
            url="/pages/goods/list/index"
          >
            <image class="icon" src="/static/images/nav_icon_8.png"></image>
            <text class="text">母婴</text>
          </navigator>
          <navigator
            class="navigator"
            hover-class="none"
            url="/pages/goods/list/index"
          >
            <image class="icon" src="/static/images/nav_icon_9.png"></image>
            <text class="text">专题</text>
          </navigator>
          <navigator
            class="navigator"
            hover-class="none"
            url="/pages/goods/list/index"
          >
            <image class="icon" src="/static/images/nav_icon_10.png"></image>
            <text class="text">品牌</text>
          </navigator>
        </view>
        <view class="navs-item">
          <navigator
            class="navigator"
            hover-class="none"
            url="/pages/goods/list/index"
          >
            <image class="icon" src="/static/images/nav_icon_1.png"></image>
            <text class="text">美食</text>
          </navigator>
          <navigator
            class="navigator"
            hover-class="none"
            url="/pages/goods/list/index"
          >
            <image class="icon" src="/static/images/nav_icon_2.png"></image>
            <text class="text">餐厨</text>
          </navigator>
          <navigator
            class="navigator"
            hover-class="none"
            url="/pages/goods/list/index"
          >
            <image class="icon" src="/static/images/nav_icon_3.png"></image>
            <text class="text">电器</text>
          </navigator>
          <navigator
            class="navigator"
            hover-class="none"
            url="/pages/goods/list/index"
          >
            <image class="icon" src="/static/images/nav_icon_4.png"></image>
            <text class="text">居家</text>
          </navigator>
          <navigator
            class="navigator"
            hover-class="none"
            url="/pages/goods/list/index"
          >
            <image class="icon" src="/static/images/nav_icon_5.png"></image>
            <text class="text">洗护</text>
          </navigator>
          <navigator
            class="navigator"
            hover-class="none"
            url="/pages/goods/list/index"
          >
            <image class="icon" src="/static/images/nav_icon_6.png"></image>
            <text class="text">汽车</text>
          </navigator>
          <navigator
            class="navigator"
            hover-class="none"
            url="/pages/goods/list/index"
          >
            <image class="icon" src="/static/images/nav_icon_7.png"></image>
            <text class="text">旅行</text>
          </navigator>
          <navigator
            class="navigator"
            hover-class="none"
            url="/pages/goods/list/index"
          >
            <image class="icon" src="/static/images/nav_icon_8.png"></image>
            <text class="text">母婴</text>
          </navigator>
          <navigator
            class="navigator"
            hover-class="none"
            url="/pages/goods/list/index"
          >
            <image class="icon" src="/static/images/nav_icon_9.png"></image>
            <text class="text">专题</text>
          </navigator>
          <navigator
            class="navigator"
            hover-class="none"
            url="/pages/goods/list/index"
          >
            <image class="icon" src="/static/images/nav_icon_10.png"></image>
            <text class="text">品牌</text>
          </navigator>
        </view>
      </view>
    </scroll-view>
    <!-- 滚动条 -->
    <view class="scroll-bar">
      <view
        class="cursor"
        :style="{
          left: cursorLeft,
        }"
      ></view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from "vue";

// 响应数据
let cursorLeft = ref("0%");

// 组件属性
const props = defineProps<{
  source: [];
}>();

// 滚动事件
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
