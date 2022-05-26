<template>
  <!-- 导航条 -->
  <view class="navbar" :style="{ paddingTop: safeArea.top + 'px' }">
    <!-- 文字logo -->
    <view class="logo">
      <image src="/static/images/logo.png"></image>
      <text>新鲜 · 亲民 · 快捷</text>
    </view>
    <!-- 搜索条 -->
    <view class="search" @click="goSearch">
      <text class="icon-search">搜索商品</text>
      <text class="icon-scan" @click="scanCode"></text>
    </view>
  </view>

  <scroll-view
    class="viewport"
    scroll-y
    refresher-enabled
    enable-back-to-top
    enhanced
    refresher-background="#f7f7f8"
    :show-scrollbar="false"
  >
    <!-- 焦点图 -->
    <carousel style="height: 280rpx" :source="bannerData"></carousel>
    <!-- 前台类目 -->
    <entries :source="[]"></entries>
    <!-- 推荐专区 -->
    <view class="panel recommend">
      <view class="item">
        <view class="title">特惠推荐<text>精选全攻略</text></view>
        <navigator
          hover-class="none"
          url="/pages/recommend/index?type=1"
          class="cards"
        >
          <image
            mode="aspectFit"
            src="/static/uploads/goods_small_1.jpg"
          ></image>
          <image
            mode="aspectFit"
            src="/static/uploads/goods_small_2.jpg"
          ></image>
        </navigator>
      </view>
      <view class="item">
        <view class="title">爆款推荐<text>最受欢迎</text></view>
        <navigator
          hover-class="none"
          url="/pages/recommend/index?type=2"
          class="cards"
        >
          <image
            mode="aspectFit"
            src="/static/uploads/goods_small_3.jpg"
          ></image>
          <image
            mode="aspectFit"
            src="/static/uploads/goods_small_4.jpg"
          ></image>
        </navigator>
      </view>
      <view class="item">
        <view class="title">一站买全 <text>精选优选</text></view>
        <navigator
          hover-class="none"
          url="/pages/recommend/index?type=1"
          class="cards"
        >
          <image
            mode="aspectFit"
            src="/static/uploads/goods_small_5.jpg"
          ></image>
          <image
            mode="aspectFit"
            src="/static/uploads/goods_small_6.jpg"
          ></image>
        </navigator>
      </view>
      <view class="item" @click="nextVersion">
        <view class="title"> 领券中心 <text>超值优惠券</text> </view>
        <navigator hover-class="none" class="cards">
          <image
            mode="aspectFit"
            src="/static/uploads/goods_small_7.jpg"
          ></image>
          <image
            mode="aspectFit"
            src="/static/uploads/goods_small_8.jpg"
          ></image>
        </navigator>
      </view>
    </view>
    <!-- 新鲜好物 -->
    <view class="panel fresh">
      <view class="title">
        新鲜好物
        <navigator
          hover-class="none"
          class="more"
          url="/pages/recommend/index?type=5"
          >更多</navigator
        >
      </view>
      <view class="cards">
        <navigator hover-class="none" url="/pages/goods/index">
          <image
            mode="aspectFit"
            src="/static/uploads/goods_small_9.jpg"
          ></image>
          <view class="name">香水小样</view>
          <view class="price"> <text class="small">¥</text>299 </view>
        </navigator>
        <navigator hover-class="none" url="/pages/goods/index">
          <image
            mode="aspectFit"
            src="/static/uploads/goods_small_10.jpg"
          ></image>
          <view class="name">红外体温仪</view>
          <view class="price"> <text class="small">¥</text>266 </view>
        </navigator>
        <navigator hover-class="none" url="/pages/goods/index">
          <image
            mode="aspectFit"
            src="/static/uploads/goods_small_11.jpg"
          ></image>
          <view class="name">美的电饭煲美的电饭煲</view>
          <view class="price"> <text class="small">¥</text>199 </view>
        </navigator>
        <navigator hover-class="none" url="/pages/goods/index">
          <image
            mode="aspectFit"
            src="/static/uploads/goods_small_12.jpg"
          ></image>
          <view class="name">过滤水壶</view>
          <view class="price"> <text class="small">¥</text>99 </view>
        </navigator>
      </view>
    </view>
    <!-- 热门品牌 -->
    <view class="panel brands">
      <view class="title">
        热门品牌
        <navigator hover-class="none" class="more" url="/pages/list/index"
          >更多</navigator
        >
      </view>
      <view class="cards">
        <navigator hover-class="none" url="/pages/goods/index">
          <image
            mode="aspectFit"
            src="/static/uploads/brand_logo_1.jpg"
          ></image>
          <view class="name">小米</view>
          <view class="price">99元起</view>
        </navigator>
        <navigator hover-class="none" url="/pages/goods/index">
          <image
            mode="aspectFit"
            src="/static/uploads/brand_logo_2.jpg"
          ></image>
          <view class="name">TCL</view>
          <view class="price">199起</view>
        </navigator>
        <navigator hover-class="none" url="/pages/goods/index">
          <image
            mode="aspectFit"
            src="/static/uploads/brand_logo_3.jpg"
          ></image>
          <view class="name">饭小宝</view>
          <view class="price">9.9起</view>
        </navigator>
        <navigator hover-class="none" url="/pages/goods/index">
          <image
            mode="aspectFit"
            src="/static/uploads/brand_logo_4.jpg"
          ></image>
          <view class="name">鳄鱼</view>
          <view class="price">299起</view>
        </navigator>
      </view>
    </view>
    <!-- 专题 -->
    <view class="panel topic">
      <view class="title">
        专题
        <navigator hover-class="none" class="more" url="">更多</navigator>
      </view>
      <div class="cards">
        <navigator hover-class="none" url="">
          <image src="/static/uploads/topic_1.jpg"></image>
          <view class="name">忙里忙外，回家吃饭忙里忙外，回家吃饭</view>
          <view class="price"> <text>19.9元</text>起 </view>
          <view class="extra">
            <text space="ensp" class="icon-heart">1220</text>
            <text space="ensp" class="icon-preview">1000</text>
          </view>
        </navigator>
        <navigator hover-class="none" url="">
          <image src="/static/uploads/topic_2.jpg"></image>
          <view class="name">忙里忙外，回家吃饭</view>
          <view class="price"> <text>19.9元</text>起 </view>
          <view class="extra">
            <text space="ensp" class="icon-heart">1220</text>
            <text space="ensp" class="icon-preview">1000</text>
          </view>
        </navigator>
      </div>
    </view>
    <!-- 猜你喜欢 -->
    <guess :source="[]"></guess>
    <view class="loading" v-if="hasMore">正在加载...</view>
  </scroll-view>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import { useStore } from "vuex";

import carousel from "@/components/carousel/index.vue";
import guess from "@/components/guess/index.vue";
import entries from "./components/entries/index.vue";
// vuex
const store = useStore();
const safeArea = computed(() => store.getters.safeArea);

// 初始数据
let hasMore = ref(true);
const bannerData = reactive([
  {
    path: "/static/uploads/slider_1.jpg",
  },
  {
    path: "/static/uploads/slider_2.jpg",
  },
  {
    path: "/static/uploads/slider_3.jpg",
  },
  {
    path: "/static/uploads/slider_4.jpg",
  },
  {
    path: "/static/uploads/slider_5.jpg",
  },
]);

// 跳转到搜索页面
const goSearch = () => {
  uni.navigateTo({ url: "/pages/search/index" });
};

// 扫描二维码
const scanCode = () => {
  uni.scanCode({ scanType: ["qrCode"] });
};

// 消息提示
const nextVersion = () => {
  uni.showToast({ title: "等待下一个版本哦~", icon: "none" });
};
</script>

<style>
page {
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* 自定义导航条 */
.navbar {
  background-image: url(/static/images/navigator_bg.png);
  background-size: cover;
  position: relative;
}

.navbar .logo {
  display: flex;
  align-items: center;
  height: 64rpx;
  padding-left: 30rpx;
}

.navbar .logo image {
  width: 166rpx;
  height: 39rpx;
}

.navbar .logo text {
  flex: 1;
  line-height: 28rpx;
  color: #fff;
  margin: 2rpx 0 0 20rpx;
  padding-left: 20rpx;
  border-left: 1rpx solid #fff;
  font-size: 26rpx;
}

.navbar .search {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10rpx 0 26rpx;
  height: 64rpx;
  margin: 16rpx 20rpx;
  color: #fff;
  font-size: 28rpx;
  border-radius: 32rpx;
  background-color: rgba(255, 255, 255, 0.5);
}

.navbar .icon-search::before {
  margin-right: 10rpx;
}

.navbar .icon-scan {
  font-size: 30rpx;
  padding: 15rpx;
}

.viewport {
  background-color: #f7f7f8;
}

/* 焦点图 */
.banner {
  height: 280rpx;
  margin: 20rpx 20rpx 0;
}

/* 公共面板 */
.panel {
  margin: 20rpx 20rpx 0;
  border-radius: 10rpx;
  background-color: #fff;
}

.panel .title {
  display: flex;
  align-items: center;
  padding: 24rpx 24rpx 0;
  font-size: 32rpx;
  color: #262626;
  position: relative;
}

.panel .title text {
  font-size: 24rpx;
  color: #7f7f7f;
  margin-left: 18rpx;
}

.panel .more {
  position: absolute;
  right: 24rpx;
  font-size: 26rpx;
  color: #7f7f7f;
}

.panel .cards {
  display: flex;
}

.panel .name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 推荐专区 */
.recommend {
  display: flex;
  flex-wrap: wrap;
  min-height: 508rpx;
}

.recommend .item {
  display: flex;
  flex-direction: column;

  width: 50%;
  height: 254rpx;
}

.recommend .item {
  border-right: 1rpx solid #eee;
  border-top: 1rpx solid #eee;
}

.recommend .item:nth-child(2n) {
  border-right: 0 none;
}

.recommend .item:nth-child(-n + 2) {
  border-top: 0 none;
}

.recommend .cards {
  flex: 1;
  padding: 15rpx 20rpx;
}

.recommend .cards navigator {
  width: 50%;
}

/* 新鲜好物 & 热门品牌 */
.fresh {
  min-height: 320rpx;
}

.fresh .cards navigator,
.brands .cards navigator {
  width: 25%;
  padding: 15rpx 20rpx 20rpx;
  line-height: 1;
  text-align: center;
}

.fresh image,
.brands image {
  width: 126rpx;
  height: 126rpx;
}

.fresh .name,
.brands .name {
  margin: 20rpx 0 16rpx;
  font-size: 24rpx;
  color: #262626;
}

.fresh .price {
  line-height: 1;
  text-align: left;
  font-size: 26rpx;
  color: #cf4444;
}

.fresh .small {
  font-size: 80%;
}

.brands .price {
  font-size: 24rpx;
  color: #999;
}

/* 专题 */
.topic .cards {
  justify-content: space-between;
  padding: 15rpx 20rpx 20rpx;
}

.topic .cards navigator {
  width: 325rpx;
  line-height: 1;
  flex: 0;
}

.topic image {
  width: 325rpx;
  height: 164rpx;
  border-radius: 4rpx;
}

.topic navigator > view {
  margin-top: 16rpx;
}

.topic .name {
  font-size: 26rpx;
  color: #262626;
}

.topic .price {
  font-size: 24rpx;
  color: #999;
}

.topic .price text {
  color: #cf4444;
}

.topic .extra {
  font-size: 22rpx;
  color: #666;
}

.topic .extra text {
  margin-right: 20rpx;
}

.topic .extra text::before {
  margin-right: 4rpx;
}

.topic .extra .icon-preview:before {
  font-size: 25rpx;
}
</style>
