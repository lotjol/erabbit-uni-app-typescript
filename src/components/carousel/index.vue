<template>
  <view class="carousel">
    <swiper circular autoplay interval="3000" @change="swiperChanged">
      <swiper-item v-for="(item, index) in source" :key="index">
        <navigator hover-class="none" class="navigator">
          <image class="image" :src="item.imgUrl"></image>
        </navigator>
      </swiper-item>
    </swiper>
    <view class="indicator">
      <text
        class="dot"
        :class="{ active: index === activeIndex }"
        v-for="(item, index) in source"
        :key="item.id"
      ></text>
    </view>
  </view>
</template>

<script setup lang="ts">
  interface bannerType {
    [index: number]: { id: string; type: string; imgUrl: string };
  }

  defineProps<{
    source: bannerType;
  }>();

  let activeIndex = $ref(0);

  // 更新指示器状态
  const swiperChanged = (ev: WechatMiniprogram.SwiperChange) => {
    activeIndex = ev.detail.current;
  };
</script>

<style>
  :host {
    display: block;
  }

  /* 焦点图 */
  .carousel {
    height: 100%;
    position: relative;

    border-radius: 10rpx;
    overflow: hidden;
    transform: translateY(0);
  }

  .carousel .navigator,
  .carousel .image {
    width: 100%;
    height: 100%;
  }

  .carousel .indicator {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 16rpx;

    display: flex;
    justify-content: center;
  }

  .carousel .indicator .dot {
    width: 30rpx;
    height: 6rpx;
    margin: 0 8rpx;
    border-radius: 6rpx;
    background-color: rgba(255, 255, 255, 0.4);
  }

  .carousel .indicator .active {
    background-color: #fff;
  }
</style>
