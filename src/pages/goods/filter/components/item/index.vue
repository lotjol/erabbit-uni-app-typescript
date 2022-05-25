<template>
  <view class="item" :class="{ checked: checked }" @click="toggleChecked">
    {{ text }}
  </view>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  options: {
    virtualHost: true,
  },
  props: {
    text: String,
  },
  data() {
    return {
      checked: false,
    };
  },
  methods: {
    toggleChecked() {
      this.checked = !this.checked;
    },
  },
});
</script>

<style>
.item {
  width: 210rpx;
  height: 62rpx;
  text-align: center;
  line-height: 60rpx;
  margin: 0 30rpx 30rpx 0;
  border: 1rpx solid #f3f4f4;
  font-size: 24rpx;
  color: #444;
  background-color: #f3f4f4;
  border-radius: 58rpx;
  float: left;
}

.item:nth-child(3n) {
  margin-right: 0;
}

.checked {
  color: rgba(39, 186, 155, 0.8);
  border: 1rpx solid rgba(39, 186, 155, 0.3);
  background-color: rgba(39, 186, 155, 0.1);
}
</style>
