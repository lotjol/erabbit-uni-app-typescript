<script setup lang="ts">
  import { toRef } from "vue";
  import { onLoad } from "@dcloudio/uni-app";
  import useAppStore from "@/store/index";

  import { debounce } from "lodash";

  import EraCarousel from "@/components/carousel/index.vue";
  import EraGuess from "@/components/guess/index.vue";

  import { getBanner } from "@/api/banner";
  import { getEntry } from "@/api/category";
  import { getRecommend, getGuess, getFresh } from "@/api/goods";

  import type { BannerType } from "@/api/banner";
  import type { EntryType } from "@/api/category";
  import type { RecommendType, GuessType, FreshType } from "@/api/goods";

  // Pinia
  const appStore = useAppStore();
  const safeArea = toRef(appStore, "safeArea");

  // 初始数据
  let hasMore = $ref(true);
  let triggered = $ref(false);
  // 获取广告数据
  let bannerData = $ref<BannerType>([]);
  // 获取前台类目数据
  let entryData = $ref<EntryType>([]);
  // 获取人气推幕数据
  let recommendData = $ref<RecommendType>([]);
  // 获取新鲜好物数据
  let freshData = $ref<FreshType>([]);
  let guessData = $ref<GuessType>({} as GuessType);

  // 调用首页面所需要的数据接口
  const getAll = async () => {
    // 并发调用接口
    [bannerData, entryData, recommendData, freshData] = await Promise.all([
      getBanner(),
      getEntry(),
      getRecommend(),
      getFresh(),
    ]);
  };

  // 获取首页数据
  onLoad(async () => {
    // 获取除猜你喜欢外的接品数据
    getAll();
    // 获取猜你喜欢数据
    guessData = await getGuess();
  });

  // 下拉刷新
  const refresh = debounce(async () => {
    // 开户下拉状态
    triggered = true;
    await getAll();
    // 关闭下拉状态
    triggered = false;
  }, 300);

  // 滚动分页
  let page = 1;
  let pageSize = 10;
  const getMore = async () => {
    // 检测是否还有更多的数据
    hasMore = page++ < guessData.pages;
    // 没有更多数据时不再发起请求
    if (!hasMore) return;

    // 缓存上一页的商品数据
    const { items } = guessData;
    const nextPageData = await getGuess(page, pageSize);
    // 将上一页获取的商品数据与下一页商品数据进行合并并
    nextPageData.items = items.concat(nextPageData.items);
    guessData = nextPageData;
  };

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

<template>
  <!-- 导航条 -->
  <view class="navbar" :style="{ paddingTop: safeArea?.top + 'px' }">
    <!-- 文字logo -->
    <view class="logo">
      <image src="https://static.botue.com/erabbit/static/images/logo.png"></image>
      <text>新鲜 · 亲民 · 快捷</text>
    </view>
    <!-- 搜索条 -->
    <view class="search" @click="goSearch">
      <text class="icon-search">搜索商品</text>
      <text class="icon-scan" @click="scanCode"></text>
    </view>
  </view>

  <scroll-view class="viewport" scroll-y refresher-enabled enable-back-to-top enhanced refresher-background="#f7f7f8"
    :show-scrollbar="false" :refresher-triggered="triggered" @refresherrefresh="refresh" @scrolltolower="getMore">
    <!-- 焦点图 -->
    <era-carousel style="height: 280rpx" :source="bannerData"></era-carousel>
    <!-- 前台类目 -->
    <era-entries :source="entryData"></era-entries>
    <!-- 推荐专区 -->
    <view class="panel recommend">
      <template v-for="item in recommendData" :key="item.id">
        <view class="item" v-if="item.type !== 4">
          <view class="title">{{ item.title }}<text>{{ item.alt }}</text></view>
          <navigator hover-class="none" :url="`/pages/recommend/index?type=${item.type}`" class="cards">
            <image mode="aspectFit" v-for="picture in item.pictures" :key="picture" :src="picture"></image>
          </navigator>
        </view>
        <view class="item" v-else @click="nextVersion">
          <view class="title">{{ item.title }}<text>{{ item.alt }}</text></view>
          <navigator hover-class="none" url=" " class="cards">
            <image mode="aspectFit" v-for="picture in item.pictures" :key="picture" :src="picture"></image>
          </navigator>
        </view>
      </template>
    </view>
    <!-- 新鲜好物 -->
    <view class="panel fresh">
      <view class="title">
        新鲜好物
        <navigator hover-class="none" class="more" url="/pages/recommend/index?type=5">更多</navigator>
      </view>
      <view class="cards">
        <navigator hover-class="none" v-for="item in freshData" :key="item.id"
          :url="`/pages/goods/index?id=${item.id}`">
          <image mode="aspectFit" :src="item.picture"></image>
          <view class="name">{{ item.name }}</view>
          <view class="price">
            <text class="small">¥</text>{{ item.price }}
          </view>
        </navigator>
      </view>
    </view>
    <!-- 热门品牌 -->
    <view class="panel brands">
      <view class="title">
        热门品牌
        <navigator hover-class="none" class="more" url=" ">更多</navigator>
      </view>
      <view class="cards">
        <navigator hover-class="none" url=" ">
          <image mode="aspectFit" src="http://static.botue.com/erabbit/static/uploads/brand_logo_1.jpg"></image>
          <view class="name">小米</view>
          <view class="price">99元起</view>
        </navigator>
        <navigator hover-class="none" url=" ">
          <image mode="aspectFit" src="http://static.botue.com/erabbit/static/uploads/brand_logo_2.jpg"></image>
          <view class="name">TCL</view>
          <view class="price">199起</view>
        </navigator>
        <navigator hover-class="none" url=" ">
          <image mode="aspectFit" src="http://static.botue.com/erabbit/static/uploads/brand_logo_3.jpg"></image>
          <view class="name">饭小宝</view>
          <view class="price">9.9起</view>
        </navigator>
        <navigator hover-class="none" url=" ">
          <image mode="aspectFit" src="http://static.botue.com/erabbit/static/uploads/brand_logo_4.jpg"></image>
          <view class="name">鳄鱼</view>
          <view class="price">299起</view>
        </navigator>
      </view>
    </view>
    <!-- 专题 -->
    <view class="panel topic">
      <view class="title">
        专题
        <navigator hover-class="none" class="more" url=" ">更多</navigator>
      </view>
      <div class="cards">
        <navigator hover-class="none" url=" ">
          <image src="http://static.botue.com/erabbit/static/uploads/topic_1.jpg"></image>
          <view class="name">忙里忙外，回家吃饭忙里忙外，回家吃饭</view>
          <view class="price"> <text>19.9元</text>起 </view>
          <view class="extra">
            <text space="ensp" class="icon-heart">1220</text>
            <text space="ensp" class="icon-preview">1000</text>
          </view>
        </navigator>
        <navigator hover-class="none" url=" ">
          <image src="http://static.botue.com/erabbit/static/uploads/topic_2.jpg"></image>
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
    <era-guess v-if="guessData.items" :source="guessData.items"></era-guess>
    <view class="loading" v-if="hasMore">正在加载...</view>
  </scroll-view>
</template>

<style>
  page {
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  /* 自定义导航条 */
  .navbar {
    background-image: url(https://static.botue.com/erabbit/static/images/navigator_bg.png);
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
