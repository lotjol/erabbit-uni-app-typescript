<template>
  <mp-half-screen-dialog
    extClass="half-dialog"
    :show="show"
    :closabled="false"
    :maskClosable="false"
  >
    <view slot="desc" class="description">
      <view class="title">{{ title }}</view>
      <view class="list">
        <view
          class="item"
          @click="onChange(index)"
          v-for="(item, index) in source"
          :key="item.id"
        >
          <view class="text">{{ item.text }}</view>
          <text
            class="icon"
            :class="[currentIndex === index ? 'icon-checked' : 'icon-ring']"
          ></text>
        </view>
      </view>
      <view class="footer">
        <view @click="confirm" class="button primary">确认</view>
      </view>
    </view>
  </mp-half-screen-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";

interface listType {
  id: number;
  text: string;
}

const { source } = defineProps<{
  title: string;
  source: listType[];
  show: boolean;
}>();

const emit = defineEmits<{
  (e: "confirm", info: listType): void;
}>();

const currentIndex = ref(0);
const onChange = (index: number) => {
  // 切换选中状态
  currentIndex.value = index;
};

const confirm = () => {
  emit("confirm", source[currentIndex.value]);
};
</script>

<script lang="ts">
export default {
  options: {
    styleIsolation: "shared",
  },
};
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
