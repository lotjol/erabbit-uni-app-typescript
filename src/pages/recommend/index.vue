<template>
  <view class="viewport">
    <!-- 推荐封面图 -->
    <view class="cover">
      <image :src="meta.coverPath"></image>
    </view>
    <view class="tabs">
      <text
        class="text"
        v-for="(item, index) in meta.tabs"
        :key="item"
        :class="{ active: index === 0 }"
        >{{ item }}</text
      >
    </view>
    <scroll-view scroll-y enhanced :show-scrollbar="false" class="scroll-view">
      <view class="goods">
        <navigator
          hover-class="none"
          url="/pages/goods/index"
          class="navigator"
        >
          <image
            class="thumb"
            src="http://static.botue.com/erabbit/static/uploads/goods_big_2.jpg"
          ></image>
          <view class="name ellipsis">肖勒超薄防水手表精钢材质 放水水功能</view>
          <view class="price">
            <text class="symbol">¥</text>
            <text class="number">199</text>
            <text class="decimal">.00</text>
          </view>
        </navigator>
        <navigator
          hover-class="none"
          url="/pages/goods/index"
          class="navigator"
        >
          <image
            class="thumb"
            src="http://static.botue.com/erabbit/static/uploads/goods_big_6.jpg"
          ></image>
          <view class="name ellipsis">肖勒超薄防水手表精钢材质 放水水功能</view>
          <view class="price">
            <text class="symbol">¥</text>
            <text class="number">199</text>
            <text class="decimal">.00</text>
          </view>
        </navigator>
        <navigator
          hover-class="none"
          url="/pages/goods/index"
          class="navigator"
        >
          <image
            class="thumb"
            src="http://static.botue.com/erabbit/static/uploads/goods_big_4.jpg"
          ></image>
          <view class="name ellipsis">肖勒超薄防水手表精钢材质 放水水功能</view>
          <view class="price">
            <text class="symbol">¥</text>
            <text class="number">199</text>
            <text class="decimal">.00</text>
          </view>
        </navigator>
        <navigator
          hover-class="none"
          url="/pages/goods/index"
          class="navigator"
        >
          <image
            class="thumb"
            src="http://static.botue.com/erabbit/static/uploads/goods_big_5.jpg"
          ></image>
          <view class="name ellipsis">肖勒超薄防水手表精钢材质 放水水功能</view>
          <view class="price">
            <text class="symbol">¥</text>
            <text class="number">199</text>
            <text class="decimal">.00</text>
          </view>
        </navigator>
        <navigator
          hover-class="none"
          url="/pages/goods/index"
          class="navigator"
        >
          <image
            class="thumb"
            src="http://static.botue.com/erabbit/static/uploads/goods_big_2.jpg"
          ></image>
          <view class="name ellipsis">肖勒超薄防水手表精钢材质 放水水功能</view>
          <view class="price">
            <text class="symbol">¥</text>
            <text class="number">199</text>
            <text class="decimal">.00</text>
          </view>
        </navigator>
        <navigator
          hover-class="none"
          url="/pages/goods/index"
          class="navigator"
        >
          <image
            class="thumb"
            src="http://static.botue.com/erabbit/static/uploads/goods_big_6.jpg"
          ></image>
          <view class="name ellipsis">肖勒超薄防水手表精钢材质 放水水功能</view>
          <view class="price">
            <text class="symbol">¥</text>
            <text class="number">199</text>
            <text class="decimal">.00</text>
          </view>
        </navigator>
        <navigator
          hover-class="none"
          url="/pages/goods/index"
          class="navigator"
        >
          <image
            class="thumb"
            src="http://static.botue.com/erabbit/static/uploads/goods_big_7.jpg"
          ></image>
          <view class="name ellipsis">肖勒超薄防水手表精钢材质 放水水功能</view>
          <view class="price">
            <text class="symbol">¥</text>
            <text class="number">199</text>
            <text class="decimal">.00</text>
          </view>
        </navigator>
        <navigator
          hover-class="none"
          url="/pages/goods/index"
          class="navigator"
        >
          <image
            class="thumb"
            src="http://static.botue.com/erabbit/static/uploads/goods_big_3.jpg"
          ></image>
          <view class="name ellipsis">肖勒超薄防水手表精钢材质 放水水功能</view>
          <view class="price">
            <text class="symbol">¥</text>
            <text class="number">199</text>
            <text class="decimal">.00</text>
          </view>
        </navigator>
      </view>
      <view class="loading">正在加载...</view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
  import { reactive, ref } from "vue";

  import { onLoad } from "@dcloudio/uni-app";

  interface metaType {
    title: string;
    coverPath: string;
    tabs: string[];
  }

  const metaMap = reactive<{ [key: string]: metaType }>({
    1: {
      title: "特惠推荐",
      coverPath:
        "http://static.botue.com/erabbit/static/uploads/recommend_1.jpg",
      tabs: ["价格", "折扣", "筛选"],
    },
    2: {
      title: "爆款推荐",
      coverPath:
        "http://static.botue.com/erabbit/static/uploads/recommend_2.jpg",
      tabs: ["24小时热搜", "热销总榜", "人气周榜"],
    },
    3: {
      title: "一站买全",
      coverPath:
        "http://static.botue.com/erabbit/static/uploads/recommend_3.jpg",
      tabs: ["搞定熊孩子", "家里不凌乱", "让音质更出众"],
    },
    5: {
      title: "新鲜好物",
      coverPath:
        "http://static.botue.com/erabbit/static/uploads/recommend_4.jpg",
      tabs: ["抢先尝新", "新品预告"],
    },
  });
  const type = ref("1");
  const meta = ref(metaMap[type.value]);

  onLoad(({ type }) => {
    if (type) meta.value = metaMap[type];
  });

  // 动态更新导航栏标题
  uni.setNavigationBarTitle({
    title: meta.value.title,
  });
</script>

<style>
  page {
    height: 100%;
    background-color: #f4f4f4;
  }

  .viewport {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 180rpx 0 0;
    position: relative;
  }

  .cover {
    width: 750rpx;
    height: 225rpx;
    border-radius: 0 0 40rpx 40rpx;
    overflow: hidden;

    position: absolute;
    left: 0;
    top: 0;
  }

  .tabs {
    display: flex;
    justify-content: space-evenly;
    height: 100rpx;
    line-height: 90rpx;
    margin: 0 20rpx;
    font-size: 28rpx;
    border-radius: 10rpx;
    box-shadow: 0 4rpx 5rpx rgba(200, 200, 200, 0.3);
    color: #333;
    background-color: #fff;
    position: relative;
    z-index: 9;
  }

  .tabs .text {
    margin: 0 20rpx;
    position: relative;
  }

  .tabs .active::after {
    content: "";
    width: 40rpx;
    height: 4rpx;
    transform: translate(-50%);
    background-color: #27ba9b;
    position: absolute;
    left: 50%;
    bottom: 24rpx;
  }

  .scroll-view {
    flex: 1;
  }

  .goods {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 0 20rpx 20rpx;
  }

  .goods .navigator {
    width: 345rpx;
    padding: 20rpx;
    margin-top: 20rpx;
    border-radius: 10rpx;
    background-color: #fff;
  }

  .goods .thumb {
    width: 305rpx;
    height: 305rpx;
  }

  .goods .name {
    height: 88rpx;
    font-size: 26rpx;
  }

  .goods .price {
    line-height: 1;
    color: #cf4444;
    font-size: 30rpx;
  }

  .goods .symbol,
  .goods .decimal {
    font-size: 70%;
  }
</style>
