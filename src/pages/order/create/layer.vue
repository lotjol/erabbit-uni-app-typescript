<template>
  <uni-popup :ref="popup" type="bottom" background-color="#fff" safe-area is-mask-click>
    <view class="popup-root">
      <view class="title">{{ title }}</view>
      <view class="list">
        <view class="item" @click="onChange(index)" v-for="(item, index) in source" :key="item.id">
          <view class="text">{{ item.text }}</view>
          <text class="icon" :class="[currentIndex === index ? 'icon-checked' : 'icon-ring']"></text>
        </view>
      </view>
      <view class="footer">
        <view @click="confirm" class="button primary">确认</view>
      </view>
    </view>
  </uni-popup>
</template>

<script setup lang="ts">
  interface listType {
    id: number
    text: string
  }

  const { source } = defineProps<{
    title: string
    source: listType[]
    popup: object
  }>()

  const emit = defineEmits<{
    (e: 'confirm', info: listType): void
  }>()

  let currentIndex = $ref(0)

  const onChange = (index: number) => {
    // 切换选中状态
    currentIndex = index
  }

  const confirm = () => {
    emit('confirm', source[currentIndex])
  }
</script>

<script lang="ts">
  export default {
    options: {
      styleIsolation: 'shared',
    },
  }
</script>

<style>
  .list {
    padding: 20rpx 0 40rpx 10rpx !important;
  }

  .list .item {
    padding: 30rpx 60rpx 30rpx 10rpx;
    position: relative;
  }

  .list .item .icon {
    color: #999;
    font-size: 40rpx;
    transform: translateY(-50%);
    position: absolute;
    top: 50%;
    right: 10rpx;
  }

  .list .item .icon-checked {
    color: #27ba9b;
  }

  .list .item .text {
    font-size: 28rpx;
    color: #444;
  }
</style>
