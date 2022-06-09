<template>
  <view class="panel">
    <view class="title">
      {{ title }}
      <view class="more" @click="toggleMore">
        更多<text class="icon-{{collapsed ? 'up' : 'down'}}"></text>
      </view>
    </view>
    <view class="section" v-show="collapsed">
      <item @click="selected" v-for="item in source" :key="item" :text="item" />
    </view>
  </view>
</template>

<script setup lang="ts">
  import item from "../item/index.vue";

  defineProps<{
    source: string[];
    collapsed: boolean;
    title: string;
  }>();

  let collapsed = $ref(false);

  const toggleMore = () => {
    collapsed = !collapsed;
  };
  const selected = () => {};
</script>

<script lang="ts">
  export default {
    options: {
      addGlobalClass: true,
      virtualHost: true,
    },
    externalClasses: ["class"],
  };
</script>

<style>
  .panel {
    margin: 0 30rpx;
    border-top: 1rpx solid #ddd;
  }

  .panel .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100rpx;
    padding: 20rpx 0;
    font-size: 30rpx;
    color: #262626;
    font-weight: 400;
  }

  .panel .title .more {
    display: flex;
    align-items: center;
    padding: 13rpx 0 13rpx 13rpx;
    font-size: 26rpx;
    color: #8f9196;
  }

  .panel .title .icon-up,
  .panel .title .icon-down {
    display: block;
    font-size: 30rpx;
    position: relative;
    top: -1rpx;
  }

  .panel .title .collapsed {
    transform: rotate(180deg);
  }

  .panel .section {
    overflow: hidden;
    padding-bottom: 10rpx;
  }
</style>
