<template>
  <!-- 搜索结果 -->
  <view class="result">
    <view class="tabs">
      <view :class="{ active: tabIndex === 0 }" class="item" @click="doSelect">
        <text class="label">{{ optionValue }}</text>
        <text :class="[selecting ? 'icon-up' : 'icon-down']"></text>
      </view>
      <view :class="{ active: tabIndex === 1 }" class="item" @click="byPrice">
        <text class="label">价格</text>
        <text :class="sortIcon"></text>
      </view>
      <view :class="{ active: tabIndex === 2 }" class="item" @click="bySales">
        <text class="label">销量</text>
      </view>
      <view class="item" @click="goFilter">
        <text class="label">筛选</text>
        <text class="icon-filter"></text>
      </view>
    </view>
    <scroll-view enhanced scroll-y :show-scrollbar="false">
      <!-- 商品列表 -->
      <view class="cards" v-if="true">
        <navigator
          hover-class="none"
          class="navigator"
          url="/pages/goods/index"
          :key="item.id"
          v-for="item in goods"
        >
          <image class="image" mode="aspectFit" :src="item.path"></image>
          <view class="name">{{ item.name }}</view>
          <view class="wish">{{ item.wish }}人已拼</view>
          <view class="extra">
            <view class="present">
              <text class="small">¥</text>{{ item.present
              }}<text class="small">.00</text>
            </view>
            <view class="original">
              <text class="small">¥</text>{{ item.original
              }}<text class="small">.00</text>
            </view>
            <view class="label">包邮</view>
          </view>
        </navigator>
      </view>
      <!-- 无搜索结果 -->
      <view class="blank" v-if="false">
        <image
          class="image"
          mode="widthFix"
          src="http://static.botue.com/erabbit/static/images/blank.png"
        ></image>
        <text class="text">亲, 暂无搜索结果</text>
      </view>
    </scroll-view>

    <!-- 下拉框 -->
    <view class="mask" v-show="selecting" @click="changeOption">
      <view class="select">
        <view
          class="option"
          data-option="最新"
          data-index="1"
          :class="{ active: optionIndex === 1 }"
          >最新上架</view
        >
        <view
          class="option"
          data-index="2"
          data-option="评价"
          :class="{ active: optionIndex === 2 }"
          >评价最多</view
        >
        <view
          class="option"
          data-index="3"
          data-option="折扣"
          :class="{ active: optionIndex === 3 }"
          >折扣优先</view
        >
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
  import { ref } from "vue";

  const selecting = ref(false);
  const optionIndex = ref(0);
  const optionValue = ref("综合");
  const tabIndex = ref(0);
  const sortIcon = ref("icon-sort");

  const goods = [
    {
      id: 1,
      path: "http://static.botue.com/erabbit/static/uploads/goods_big_2.jpg",
      name: "荣耀Play3 6.39英寸魅眼全视屏 4000mAh大电池 全新机型",
      wish: 2146,
      present: 899,
      original: 999,
    },
    {
      id: 2,
      path: "http://static.botue.com/erabbit/static/uploads/goods_big_2.jpg",
      name: "荣耀Play3 6.39英寸魅眼全视屏 4000mAh大电池 全新机型",
      wish: 2146,
      present: 899,
      original: 999,
    },
    {
      id: 3,
      path: "http://static.botue.com/erabbit/static/uploads/goods_big_3.jpg",
      name: "荣耀Play3 6.39英寸魅眼全视屏 4000mAh大电池 全新机型",
      wish: 2146,
      present: 899,
      original: 999,
    },
    {
      id: 4,
      path: "http://static.botue.com/erabbit/static/uploads/goods_big_4.jpg",
      name: "荣耀Play3 6.39英寸魅眼全视屏 4000mAh大电池 全新机型",
      wish: 2146,
      present: 899,
      original: 999,
    },
    {
      id: 5,
      path: "http://static.botue.com/erabbit/static/uploads/goods_big_2.jpg",
      name: "荣耀Play3 6.39英寸魅眼全视屏 4000mAh大电池 全新机型",
      wish: 2146,
      present: 899,
      original: 999,
    },
    {
      id: 6,
      path: "http://static.botue.com/erabbit/static/uploads/goods_big_2.jpg",
      name: "荣耀Play3 6.39英寸魅眼全视屏 4000mAh大电池 全新机型",
      wish: 2146,
      present: 899,
      original: 999,
    },
  ];

  const goFilter = () => {
    uni.navigateTo({
      url: "/pages/goods/filter/index",
    });
  };

  // 综合筛选
  const changeOption = (ev: MouseEvent) => {
    const { index = "0", option = "" } = (ev.target as HTMLElement).dataset;

    selecting.value = false;
    optionValue.value = option;
    optionIndex.value = parseInt(index);
  };

  // 综合下拉选择
  const doSelect = () => {
    selecting.value = !selecting.value;
    tabIndex.value = 0;
    sortIcon.value = "icon-sort";
  };

  // 按价格
  const byPrice = () => {
    tabIndex.value = 1;
    selecting.value = false;
    // 字体图标
    sortIcon.value = sortIcon.value === "icon-up" ? "icon-down" : "icon-up";
  };

  // 按销量
  const bySales = () => {
    tabIndex.value = 2;
    selecting.value = false;
    sortIcon.value = "icon-sort";
  };
</script>

<script lang="ts">
  export default {
    options: {
      addGlobalClass: true,
    },
  };
</script>

<style>
  :host {
    display: block;
  }

  /* 搜索结果 */
  .result {
    height: 100%;
    display: flex;
    flex-direction: column;
    background-color: #f7f7f8;
  }

  .result .tabs {
    display: flex;
    justify-content: space-between;
    padding-bottom: 20rpx;
    border-bottom: 1rpx solid #e7e7e7;
    background-color: #fff;
  }

  .result .tabs .item {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 60rpx;
    margin: 0 20rpx;
    text-align: center;
  }

  .result .tabs .label {
    font-size: 28rpx;
    color: #262626;
    position: relative;
  }

  .result .tabs .active .label::after {
    position: absolute;
    left: 50%;
    bottom: -8rpx;

    content: "";
    width: 40rpx;
    height: 4rpx;
    border-radius: 4rpx;
    transform: translate(-50%);
    background-color: #27ba9b;
  }

  .result .mask {
    position: absolute;
    top: 81rpx;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 9;
    background-color: rgba(0, 0, 0, 0.5);
  }

  .result .mask .select {
    position: absolute;
    top: 0;

    width: 100%;
    padding: 15rpx 45rpx;
    background-color: #fff;
  }

  .result .select .option {
    line-height: 2;
    margin: 12rpx 0;
    font-size: 26rpx;
    color: #2f2f2f;
  }

  .result .select .active {
    color: #27ba9b;
    position: relative;
  }

  .result .select .active::after {
    content: "\e6ca";
    font-family: "erabbit" !important;
    transform: translateY(-50%);
    font-size: 40rpx;

    position: absolute;
    right: 0;
    top: 50%;
  }

  /* 商品信息 */
  .result .cards {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 20rpx 20rpx 0;
  }

  .result .cards .navigator {
    width: 345rpx;
    height: 510rpx;
    padding: 20rpx 15rpx;
    margin-bottom: 20rpx;
    background-color: #fff;
    border-radius: 10rpx;
  }

  .result .cards .image {
    width: 315rpx;
    height: 315rpx;
  }

  .result .cards .name {
    height: 75rpx;
    font-size: 26rpx;
    color: #262626;

    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .result .cards .wish {
    margin: 8rpx 0 2rpx;
    font-size: 22rpx;
    color: #7f7f7f;
  }

  .result .cards .extra {
    display: flex;
    font-size: 26rpx;
    color: #cf4444;
    position: relative;
  }

  .result .extra .small {
    font-size: 22rpx;
    margin-right: 5rpx;
  }

  .result .extra .original {
    margin-left: 10rpx;
    color: #c8c8c8;
    text-decoration: line-through;
  }

  .result .extra .label {
    position: absolute;
    right: 0;
    bottom: 3rpx;

    line-height: 1;
    color: #fff;
    font-size: 24rpx;
    padding: 8rpx 16rpx;
    border-radius: 40rpx;
    background-color: #27ba9b;
  }

  /* 无搜索结果 */
  .result .blank {
    width: 100%;
    height: 100%;
    text-align: center;
    padding-top: 200rpx;
    background-color: #fff;
  }

  .result .blank .image {
    width: 200rpx;
  }

  .result .blank .text {
    font-size: 26rpx;
    color: #a5aeb4;
    margin-top: 10rpx;
    display: block;
  }
</style>
