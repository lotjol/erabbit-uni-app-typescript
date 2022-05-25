<template>
  <scroll-view class="viewport" scroll-y>
    <view class="range" style="border: none">
      <view class="title">价格区间(元)</view>
      <view class="section">
        <input
          type="digit"
          @blur="byPriceRange"
          placeholder-style="color: #999"
          placeholder="最低价"
        />
        <text class="line">-</text>
        <input
          type="digit"
          @blur="byPriceRange"
          placeholder-style="color: #aaa"
          placeholder="最低价"
        />
      </view>
    </view>
    <!-- 筛选条件 -->
    <block v-for="item in filters" :key="item.title">
      <panel
        :title="item.title"
        :source="item.source"
        :collapsed="item.collapsed"
      ></panel>
    </block>
  </scroll-view>

  <view class="action">
    <view class="reset">重置</view>
    <view class="confirm">
      确认(1000个商品)
      <view class="door"></view>
      <view class="door"></view>
    </view>
  </view>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import panel from "./components/panel/index.vue";

export default defineComponent({
  data() {
    return {
      filters: [
        {
          title: "品类",
          source: [
            "男下装",
            "男上装",
            "手表",
            "运动服",
            "服饰配件",
            "中大童装",
          ],
          collapsed: true,
        },
        {
          title: "款式",
          source: ["假两件", "开衫", "连帽", "日常便服", "双面穿", "套头"],
          collapsed: true,
        },
        {
          title: "颜色",
          source: [
            "黑色",
            "白色",
            "灰色",
            "米色",
            "杏色",
            "卡其色",
            "棕色",
            "驼色",
          ],
          collapsed: true,
        },
        {
          title: "版型",
          source: ["紧身", "修身", "常规", "直筒", "宽松", "收腰"],
          collapsed: true,
        },
      ],
    };
  },

  components: {
    panel,
  },

  methods: {
    byPriceRange() {
      // this.animate(
      //   ".door",
      //   [
      //     { width: "50%", height: "100%", ease: "ease-out", offset: 0 },
      //     { width: "50%", height: "99%", ease: "ease-out", offset: 0.3 },
      //     { width: "0%", height: "100%", ease: "ease-in", offset: 1 },
      //   ],
      //   800
      // );
    },
  },
});
</script>

<style>
page {
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.viewport {
  padding: 0;
  border-top: 1rpx solid #ddd;
}

.range {
  margin: 0 30rpx;
}

.range .title {
  height: 100rpx;
  line-height: 60rpx;
  padding: 20rpx 0;
  font-size: 30rpx;
  color: #262626;
  font-weight: 400;
}

.range .section {
  display: flex;
  align-items: center;
  padding-bottom: 40rpx;
}

.range .section input {
  flex: 1;
  height: 72rpx;
  text-align: center;
  padding: 0 40rpx;
  border-radius: 10rpx;
  font-size: 26rpx;
  color: #262626;
  background-color: #f3f4f4;
}

.range .section .line {
  margin: 0 30rpx;
  color: #222;
}

.action {
  display: flex;
  justify-content: space-between;
  height: 140rpx;
  padding: 30rpx;
  text-align: center;
  border-top: 1rpx solid #ddd;
}

.action > view {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 44rpx;
  font-size: 28rpx;
}

.action .reset {
  width: 240rpx;
  color: #666;
  border: 1rpx solid #999;
}

.action .confirm {
  width: 420rpx;
  color: #fff;
  overflow: hidden;
  background-color: #27ba9b;
  position: relative;
}

.action .confirm .door {
  position: absolute;
  top: 0;

  width: 0%;
  height: 100%;
  background-color: #27ba9b;
}

.action .confirm .door:last-child {
  right: 0;
}

.action .confirm .door:nth-last-child(2) {
  left: 0;
}
</style>
