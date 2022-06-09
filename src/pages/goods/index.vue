<script setup lang="ts">
  import { ref, computed } from "vue";
  import { onLoad } from "@dcloudio/uni-app";

  import { getRelationGoods } from "@/api/goods";
  import type { RelationType } from "@/api/goods";
  import { useGoodsStore } from "@/store/goods";
  import { useAppStore } from "@/store";

  const appStore = useAppStore();
  const goodsStore = useGoodsStore();

  const safeArea = computed(() => appStore.safeArea);
  const goodsDetail = computed(() => goodsStore.goodsDetail);

  // 同类商品推荐
  const relationGoods = ref<RelationType>([]);

  onLoad(async ({ id }) => {
    if (id) {
      goodsStore.getGoodsDetail(id);
      // 同类商品推荐
      relationGoods.value = await getRelationGoods(id);
    }
  });

  // 返回上一页
  const goBack = () => {
    uni.navigateBack({});
  };

  // 跳转到购物车页面
  const goCart = () => {
    uni.navigateTo({ url: "/pages/cart/default" });
  };
</script>

<script lang="ts">
  import { getCurrentInstance } from "vue";

  import clause from "./components/clause/index.vue";
  import help from "./components/help/index.vue";
  import shipment from "./components/shipment/index.vue";
  import sku from "./components/sku/index.vue";

  let observer: WechatMiniprogram.IntersectionObserver;
  let navBarHeight = 0;
  let imageCount = 0;

  export default {
    data() {
      return {
        tabs: [
          { text: "商品", offset: 0 },
          { text: "评价", offset: 0 },
          { text: "详情", offset: 0 },
          { text: "推荐", offset: 0 },
        ],
        tabIndex: 0,
        anchorIndex: 0,
        scrollTop: 0,
        layer: "sku",
        halfDialogVisible: false,
        swiperCurrentIndex: 0,
        buttonType: "",
      };
    },

    onReady: function () {
      // 获取页面实例
      const pageInstance: any = getCurrentInstance();

      // 页面相交状态监听器
      observer = pageInstance.ctx.$scope.createIntersectionObserver({
        observeAll: true,
      });

      // 监听元素间相关状态
      this.intersectionObserver();

      // 动画时间线
      const scrollTimeline = {
        scrollSource: "#scrollView",
        timeRange: 500,
        startScrollOffset: 0,
        endScrollOffset: 85,
      };

      // 创建帧动画
      pageInstance.ctx.$scope.animate(
        ".navbar",
        [{ backgroundColor: "#fff0" }, { backgroundColor: "#fff" }],
        500,
        scrollTimeline
      );

      pageInstance.ctx.$scope.animate(
        ".back",
        [
          {
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            left: "10px",
            color: "#fff",
            offset: 0,
          },
          {
            backgroundColor: "rgba(0, 0, 0, 0.12)",
            left: "7px",
            color: "#fff",
            offset: 0.7,
          },
          {
            backgroundColor: "rgba(0, 0, 0, 0)",
            left: "6px",
            color: "#191919",
            offset: 1,
          },
        ],
        500,
        scrollTimeline
      );

      pageInstance.ctx.$scope.animate(
        ".tabs, .search",
        [{ opacity: 0 }, { opacity: 1 }],
        500,
        scrollTimeline
      );
    },

    // 页面卸载停止相交状态监听
    onUnload: function () {
      observer.disconnect();
    },

    methods: {
      // 快速返回顶部更新状态
      scrollToUpper() {
        this.anchorIndex = 0;
      },

      swiperChanged(ev: WechatMiniprogram.SwiperChange) {
        this.swiperCurrentIndex = ev.detail.current;
      },

      // 点击 Tab 切换实现页内跳转
      scrollTo(ev: WechatMiniprogram.BaseEvent) {
        // 停止监听相交状态
        observer.disconnect();
        // // 获取滚动位置及索引值
        let { anchorOffset, anchorIndex } = ev.target.dataset;
        // 调整滚动距离
        this.scrollTop = anchorOffset - navBarHeight;
        // 更新 Tab 的状态
        this.anchorIndex = anchorIndex;
      },

      // 显示弹层
      showHalfDialog(ev: WechatMiniprogram.BaseEvent) {
        const { layer, buttonType } = ev.currentTarget.dataset;
        // 动态获取 halfDialog 展示的内容
        this.layer = layer;
        this.halfDialogVisible = true;
        // console.log(this.halfDialogVisible);

        // 是否为加入购物车
        if (buttonType) this.buttonType = buttonType;
      },

      // 关闭弹层
      hideHalfDialog() {
        this.halfDialogVisible = false;
      },

      // 用户滑动手势
      dragEnd() {
        observer.disconnect();
        this.intersectionObserver();
      },

      // 监测元素相交状态
      intersectionObserver() {
        observer
          .relativeTo(".navbar")
          .observe(
            ".anchor",
            ({ dataset: { anchorIndex }, boundingClientRect: { top } }) => {
              if (top < 0) return;
              if (anchorIndex) this.anchorIndex = parseInt(anchorIndex);
            }
          );
      },

      imageLoad(size: number) {
        if (++imageCount >= size) this.selectWXML();
      },

      //
      selectWXML() {
        // 页面节点查询器
        const query = uni.createSelectorQuery();
        // 计算节点相对于窗口的位置
        query
          .selectAll(".anchor")
          .boundingClientRect((rects) => {
            (rects as { top: number }[]).forEach((rect, index) => {
              this.tabs[index].offset = rect.top;
            });
          })
          .exec();

        // 计算自定义导航栏的高度
        query
          .select(".navbar")
          .boundingClientRect((rect) => {
            if (rect.height) navBarHeight = rect.height;
          })
          .exec();
      },
    },
  };
</script>

<template>
  <view class="navbar" :style="{ paddingTop: safeArea!.top + 5 + 'px' }">
    <view class="wrap">
      <!-- 返回按钮 -->
      <view class="back icon-left" @click="goBack"></view>
      <!-- 搜索栏 -->
      <view class="search">
        <view class="input icon-search"></view>
      </view>
    </view>
    <!-- 锚链接 -->
    <view class="tabs">
      <text
        v-for="(item, index) in tabs"
        :key="item.offset"
        :data-anchor-offset="item.offset"
        :data-anchor-index="index"
        :class="{ active: anchorIndex === index }"
        @tap="scrollTo"
        >{{ item.text }}</text
      >
    </view>
  </view>

  <scroll-view
    scroll-y
    enhanced
    scroll-with-animation
    class="viewport"
    id="scrollView"
    :bounces="false"
    :show-scrollbar="false"
    :scroll-top="scrollTop"
    @scrolltoupper="scrollToUpper"
    @dragend="dragEnd"
  >
    <!-- 商品信息 -->
    <view class="goods anchor" data-anchor-index="0">
      <view class="preview">
        <swiper circular :current="swiperCurrentIndex" @change="swiperChanged">
          <swiper-item
            v-for="picture in goodsDetail.mainPictures"
            :key="picture"
          >
            <image :src="picture" />
          </swiper-item>
        </swiper>
        <view class="indicator">
          <text class="current">{{ swiperCurrentIndex + 1 }}</text>
          <text class="split">/</text>
          <text class="total">{{ goodsDetail.mainPictures?.length }}</text>
        </view>
      </view>

      <view class="meta">
        <view class="price">
          <text class="symbol">¥</text>
          <text class="number">{{ goodsDetail.price }}</text>
          <text class="decimal">.00</text>
        </view>
        <view class="brand">
          <image :src="goodsDetail.brand?.picture" />
        </view>
        <view class="name ellipsis">
          {{ goodsDetail.name }}
        </view>
        <view class="remarks">{{ goodsDetail.desc }}</view>
      </view>
      <view class="related">
        <view @tap="showHalfDialog" data-layer="sku" class="item arrow">
          <text class="label">选择</text>
          <text class="text ellipsis">白色 红外体温计 1件</text>
        </view>
        <view @tap="showHalfDialog" data-layer="shipment" class="item arrow">
          <text class="label">送至</text>
          <text class="text ellipsis">北京市顺义区京顺路9号黑马程序员</text>
        </view>
        <view @tap="showHalfDialog" data-layer="clause" class="item arrow">
          <text class="label">服务</text>
          <text class="text ellipsis">无忧退 快速退款 免费包邮</text>
        </view>
      </view>
    </view>
    <!-- 商品评价 -->
    <view class="comments panel anchor" data-anchor-index="1">
      <view class="title arrow">
        <text>评价</text>
        <navigator url="/pages/comments/index" hover-class="none" class="more"
          >好评度 70%</navigator
        >
      </view>
      <view class="comment">
        <view class="caption">
          <view class="user">
            <image
              class="avatar"
              src="http://static.botue.com/erabbit/static/uploads/avatar_2.jpg"
            />
            <text>白月初</text>
          </view>
          <view class="rating">
            <view class="rank" style="width: 80%"></view>
          </view>
        </view>
        <view class="content">
          <view class="text"> 质量不错，灵敏度高，结构巧妙，款式也好看 </view>
          <view class="pictures">
            <view class="picture">
              <image
                src="http://static.botue.com/erabbit/static/uploads/comment_1.jpg"
              />
            </view>
            <view class="picture">
              <image
                src="http://static.botue.com/erabbit/static/uploads/comment_2.jpg"
              />
            </view>
            <view class="picture">
              <image
                src="http://static.botue.com/erabbit/static/uploads/comment_2.jpg"
              />
            </view>
          </view>
          <view class="extra">
            <text class="date">购买时间: 2020-11-11</text>
            <text class="type">黑色 公开版 128G</text>
          </view>
        </view>
      </view>
      <view class="comment">
        <view class="caption">
          <view class="user">
            <image
              class="avatar"
              src="http://static.botue.com/erabbit/static/uploads/avatar_3.jpg"
            />
            <text>白月初</text>
          </view>
          <view class="rating">
            <view class="rank" style="width: 60%"></view>
          </view>
        </view>
        <view class="content">
          <view class="text"> 质量不错，灵敏度高，结构巧妙，款式也好看 </view>
          <view class="pictures">
            <view class="picture">
              <image
                src="http://static.botue.com/erabbit/static/uploads/comment_1.jpg"
              />
            </view>
            <view class="picture">
              <image
                src="http://static.botue.com/erabbit/static/uploads/comment_2.jpg"
              />
            </view>
            <view class="picture">
              <image
                src="http://static.botue.com/erabbit/static/uploads/comment_2.jpg"
              />
            </view>
            <view class="picture">
              <image
                src="http://static.botue.com/erabbit/static/uploads/comment_1.jpg"
              />
            </view>
          </view>
          <view class="extra">
            <text class="date">购买时间: 2020-11-11</text>
            <text class="type">黑色 公开版 128G</text>
          </view>
        </view>
      </view>
    </view>
    <!-- 同类商品 -->
    <view class="similar">
      <view class="bar">
        <text @tap="tabIndex = 0" :class="{ active: tabIndex === 0 }"
          >同类商品</text
        >
        <text @tap="tabIndex = 1" :class="{ active: tabIndex === 1 }"
          >24小时热销</text
        >
      </view>
      <scroll-view
        v-show="tabIndex === 0"
        scroll-x
        enhanced
        :show-scrollbar="false"
      >
        <view class="content">
          <navigator
            hover-class="none"
            v-for="goods in goodsDetail.similarProducts"
            :key="goods.id"
          >
            <image :src="goods.picture" />
            <view class="name ellipsis">{{ goods.name }}</view>
            <view class="price">
              <text class="symbol">¥</text>
              <text class="number">{{ goods.price }}</text>
              <text class="decimal">.00</text>
            </view>
          </navigator>
        </view>
      </scroll-view>
      <scroll-view
        v-show="tabIndex === 1"
        scroll-x
        enhanced
        :show-scrollbar="false"
      >
        <view class="content">
          <navigator
            hover-class="none"
            v-for="goods in goodsDetail.hotByDay"
            :key="goods.id"
          >
            <image :src="goods.picture" />
            <view class="name ellipsis">{{ goods.name }}</view>
            <view class="price">
              <text class="symbol">¥</text>
              <text class="number">{{ goods.price }}</text>
              <text class="decimal">.00</text>
            </view>
          </navigator>
        </view>
      </scroll-view>
      <scroll-view
        v-show="tabIndex === 1"
        scroll-x
        enhanced
        show-scrollbar="{{false}}"
      >
        <view class="content">
          <navigator hover-class="none">
            <image
              src="http://static.botue.com/erabbit/static/uploads/goods_preview_6.jpg"
            />
            <view class="name ellipsis">非接触体外红外仪</view>
            <view class="price">
              <text class="symbol">¥</text>
              <text class="number">899</text>
              <text class="decimal">.00</text>
            </view>
          </navigator>
          <navigator hover-class="none">
            <image
              src="http://static.botue.com/erabbit/static/uploads/goods_preview_2.jpg"
            />
            <view class="name ellipsis">非接触体外红外仪</view>
            <view class="price">
              <text class="symbol">¥</text>
              <text class="number">899</text>
              <text class="decimal">.00</text>
            </view>
          </navigator>
          <navigator hover-class="none">
            <image
              src="http://static.botue.com/erabbit/static/uploads/goods_preview_5.jpg"
            />
            <view class="name ellipsis">非接触体外红外仪</view>
            <view class="price">
              <text class="symbol">¥</text>
              <text class="number">899</text>
              <text class="decimal">.00</text>
            </view>
          </navigator>
          <navigator hover-class="none">
            <image
              src="http://static.botue.com/erabbit/static/uploads/goods_preview_3.jpg"
            />
            <view class="name ellipsis">非接触体外红外仪</view>
            <view class="price">
              <text class="symbol">¥</text>
              <text class="number">899</text>
              <text class="decimal">.00</text>
            </view>
          </navigator>
        </view>
      </scroll-view>
    </view>
    <!-- 商品详情 -->
    <view class="detail panel anchor" data-anchor-index="2">
      <view class="title">
        <text>详情</text>
      </view>
      <view class="content">
        <view class="properties">
          <view
            class="item"
            v-for="property in goodsDetail.details?.properties"
            :key="property.name"
          >
            <text class="label">{{ property.name }}</text>
            <text class="value">{{ property.value }}</text>
          </view>
        </view>

        <image
          mode="widthFix"
          v-for="picture in goodsDetail.details?.pictures"
          :key="picture"
          :src="picture"
          @load="imageLoad(goodsDetail.details?.pictures.length)"
        ></image>
      </view>
    </view>
    <!-- 常见问题 -->
    <view class="help arrow" @tap="showHalfDialog" data-layer="help">
      <text class="icon-help"></text>
      <navigator hover-class="none">常见问题</navigator>
    </view>
    <!-- 推荐 -->
    <view class="recommend panel anchor" data-anchor-index="3">
      <view class="title">
        <text>推荐</text>
      </view>
      <view class="content">
        <navigator
          url="/pages/goods/index"
          hover-class="none"
          v-for="goods in relationGoods"
          :key="goods.id"
        >
          <image class="image" mode="aspectFit" :src="goods.picture"></image>
          <view class="name ellipsis">{{ goods.name }}</view>
          <view class="price">
            <text class="symbol">¥</text>
            <text class="number">{{ goods.price }}</text>
            <text class="decimal">.00</text>
          </view>
        </navigator>
      </view>
    </view>
  </scroll-view>

  <!-- 用户操作 -->
  <view class="toolbar">
    <view class="icons">
      <button class="collect"><text class="icon-heart"></text>收藏</button>
      <button class="contact" open-type="contact">
        <text class="icon-handset"></text>客服
      </button>
      <button class="cart" @click="goCart">
        <text class="icon-cart"></text>购物车
      </button>
    </view>
    <view class="buttons">
      <view
        @tap="showHalfDialog"
        data-button-type="cart"
        data-layer="sku"
        class="addcart"
        >加入购物车</view
      >
      <view
        @tap="showHalfDialog"
        data-button-type="payment"
        data-layer="sku"
        class="payment"
        >立即购买</view
      >
    </view>
  </view>

  <van-popup
    :show="halfDialogVisible"
    position="bottom"
    close-on-click-overlay
    @close="hideHalfDialog"
  >
    <view class="popup-root">
      <text @click="hideHalfDialog" class="close icon-close"></text>
      <sku :buttonType="buttonType" v-if="layer === 'sku'"></sku>
      <shipment v-if="layer === 'shipment'"></shipment>
      <clause v-if="layer === 'clause'"></clause>
      <help v-if="layer === 'help'"></help>
    </view>
  </van-popup>
</template>

<style>
  page {
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  /* 自定义导航栏 */
  .navbar {
    width: 750rpx;
    background-color: #fff;

    position: fixed;
    top: 0;
    left: 0;
    z-index: 9;
  }

  .navbar .search {
    height: 40px;
    padding: 1px 110px 0 50px;
  }

  .navbar .search .input {
    height: 62rpx;
    border-radius: 60rpx;
    font-size: 26rpx;
    color: #8b8b8b;
    background-color: #f3f4f4;
    position: relative;
  }

  .navbar .search .input::before {
    position: absolute;
    left: 24rpx;
    top: 50%;

    color: #b7b7b7;
    font-size: 28rpx;
    transform: translateY(-50%);
  }

  .navbar .wrap {
    position: relative;
  }

  .navbar .back {
    position: absolute;
    left: 10px;
    top: 2px;
    z-index: 9;

    display: flex;
    justify-content: center;
    align-items: center;
    width: 60rpx;
    height: 60rpx;
    border-radius: 50%;
    font-size: 23px;
    color: #191919;
    /* color: #fff; */
    /* background-color: rgba(0, 0, 0, 0.4); */
  }

  .navbar .tabs {
    display: flex;
    justify-content: space-evenly;
    border-bottom: 1rpx solid #eaeaea;
  }

  .navbar .tabs text {
    display: block;
    padding: 10rpx 10rpx 16rpx;
    font-size: 28rpx;
    position: relative;
  }

  .navbar .tabs .active {
    color: #27ba9b;
    font-weight: 500;
  }

  .navbar .tabs .active::after {
    content: "";
    position: absolute;
    left: 18rpx;
    right: 20rpx;
    bottom: 14rpx;
    height: 4rpx;
    background-color: #27ba9b;
  }

  .viewport {
    background-color: #f4f4f4;
  }

  .panel {
    margin-top: 20rpx;
    background-color: #fff;
  }

  .panel .title {
    display: flex;
    justify-content: space-between;
    align-items: center;

    height: 90rpx;
    line-height: 1;
    padding: 30rpx 60rpx 30rpx 6rpx;
    position: relative;
  }

  .panel .title text {
    padding-left: 10rpx;
    font-size: 28rpx;
    color: #333;
    font-weight: 600;
    border-left: 4rpx solid #27ba9b;
  }

  .panel .title navigator {
    font-size: 24rpx;
    color: #666;
  }

  .arrow::after {
    position: absolute;
    top: 50%;
    right: 30rpx;

    content: "\e6c2";
    color: #ccc;
    font-family: "erabbit" !important;
    font-size: 32rpx;
    transform: translateY(-50%);
  }

  /* 商品信息 */
  .goods {
    background-color: #fff;
  }

  .goods .preview {
    height: 750rpx;
    position: relative;
  }

  .goods .preview .indicator {
    height: 40rpx;
    padding: 0 24rpx;
    line-height: 40rpx;
    border-radius: 30rpx;
    color: #fff;
    font-family: Arial, Helvetica, sans-serif;
    background-color: rgba(0, 0, 0, 0.3);

    position: absolute;
    bottom: 30rpx;
    right: 30rpx;
  }

  .goods .indicator .current {
    font-size: 26rpx;
  }

  .goods .indicator .split {
    font-size: 24rpx;
    margin: 0 1rpx 0 2rpx;
  }

  .goods .indicator .total {
    font-size: 24rpx;
  }

  .goods .meta {
    position: relative;
    border-bottom: 1rpx solid #eaeaea;
  }

  .goods .meta .price {
    height: 130rpx;
    padding: 25rpx 30rpx 0;
    color: #fff;
    font-size: 34rpx;
    box-sizing: border-box;
    background-color: #35c8a9;
  }

  .goods .meta .number {
    font-size: 56rpx;
  }

  .goods .meta .brand {
    width: 160rpx;
    height: 80rpx;
    overflow: hidden;

    position: absolute;
    top: 26rpx;
    right: 30rpx;
  }

  .goods .meta .name {
    max-height: 88rpx;
    line-height: 1.4;
    margin: 20rpx;
    font-size: 32rpx;
    color: #333;
  }

  .goods .meta .remarks {
    line-height: 1;
    padding: 0 20rpx 30rpx;
    font-size: 24rpx;
    color: #cf4444;
  }

  .goods .related {
    padding-left: 20rpx;
  }

  .goods .related .item {
    height: 90rpx;
    padding-right: 60rpx;
    border-bottom: 1rpx solid #eaeaea;
    font-size: 26rpx;
    color: #333;
    position: relative;
    display: flex;
    align-items: center;
  }

  .goods .related .item:last-child {
    border-bottom: 0 none;
  }

  .goods .related .label {
    width: 60rpx;
    color: #898b94;
    margin: 0 16rpx 0 10rpx;
  }

  .goods .related .text {
    flex: 1;
    -webkit-line-clamp: 1;
  }

  /* 商品评论 */
  .comments {
    padding-left: 20rpx;
  }

  .comments .comment {
    padding: 24rpx 40rpx 24rpx 10rpx;
    border-top: 1rpx solid #eaeaea;
  }

  .comments .caption {
    height: 60rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .comments .user {
    font-size: 26rpx;
    color: #333;
    display: flex;
    align-items: center;
  }

  .comments .caption .avatar {
    width: 60rpx;
    height: 60rpx;
    margin-right: 20rpx;
    border-radius: 50%;
  }

  .comments .rating {
    width: 144rpx;
    height: 24rpx;
    background-image: url(http://static.botue.com/erabbit/static/images/rating_off.png);
    background-size: contain;
  }

  .comments .rating .rank {
    height: 100%;
    background-image: url(http://static.botue.com/erabbit/static/images/rating_on.png);
    background-size: 144rpx 24rpx;
  }

  .comments .content .text {
    line-height: 1.4;
    margin-top: 24rpx;
    font-size: 24rpx;
    color: #333;
  }

  .comments .pictures {
    display: flex;
    flex-wrap: wrap;
    margin: 20rpx 0 0 1rpx;
  }

  .comments .picture {
    width: 150rpx;
    height: 150rpx;
    margin-right: 27rpx;
  }

  .comments .picture:last-child {
    margin-right: 0;
  }

  .comments .content .extra {
    display: flex;
    justify-content: space-between;
    margin: 20rpx 1rpx 0 0;
    font-size: 22rpx;
    color: #666;
  }

  /* 类似商品 */
  .similar {
    margin-top: 20rpx;
  }

  .similar .bar {
    display: flex;
    align-items: center;
    height: 90rpx;
    font-size: 28rpx;
    color: #333;
    background-color: #fff;
  }

  .similar .bar text {
    flex: 1;
    text-align: center;
    position: relative;
  }

  .similar .bar .active::after {
    content: "";
    display: block;
    width: 60rpx;
    height: 4rpx;
    background-color: #27ba9b;
    transform: translateX(-50%);
    position: absolute;
    left: 50%;
    bottom: -5rpx;
  }

  .similar .content {
    padding-top: 20rpx;
    background-color: #f4f4f4;
    white-space: nowrap;
  }

  .similar .content navigator {
    display: inline-block;
    width: 200rpx;
    height: 270rpx;
    padding: 15rpx 15rpx 0;
    margin-right: 15rpx;
    background-color: #fff;
    border-radius: 6rpx;
  }

  .similar .content navigator:first-child {
    margin-left: 15rpx;
  }

  .similar .content image {
    height: 172rpx;
  }

  .similar .content .name {
    max-height: 64rpx;
    line-height: 1.2;
    margin-top: 10rpx;
    font-size: 24rpx;
    color: #333;
    -webkit-line-clamp: 1;
  }

  .similar .content .price {
    font-size: 18rpx;
    color: #cf4444;
  }

  .similar .content .number {
    font-size: 24rpx;
    margin-left: 2rpx;
  }

  /* 商品详情 */
  .detail {
    padding-left: 20rpx;
  }

  .detail .content {
    margin-left: -20rpx;
  }

  .detail .properties {
    padding: 0 20rpx;
    margin-bottom: 30rpx;
  }

  .detail .properties .item {
    display: flex;
    line-height: 2;
    padding: 10rpx;
    font-size: 26rpx;
    color: #333;
    border-bottom: 1rpx dashed #ccc;
  }

  .detail .properties .label {
    width: 200rpx;
  }

  .detail .properties .value {
    flex: 1;
  }

  /* 常见问题 */
  .help {
    display: flex;
    align-items: center;
    padding: 20rpx 0 20rpx 20rpx;
    margin-top: 20rpx;
    font-size: 28rpx;
    color: #333;
    background-color: #fff;
    position: relative;
  }

  .help .icon-help {
    font-size: 34rpx;
    margin-right: 6rpx;
    color: #ffa868;
  }

  /* 商品推荐 */
  .recommend {
    padding-left: 20rpx;
  }

  .recommend .content {
    padding: 0 20rpx 20rpx;
    margin-left: -20rpx;
    background-color: #f4f4f4;
    overflow: hidden;
  }

  .recommend .content navigator {
    width: 345rpx;
    padding: 24rpx 20rpx 20rpx;
    margin: 20rpx 20rpx 0 0;
    border-radius: 10rpx;
    background-color: #fff;
    float: left;
  }

  .recommend navigator:nth-child(even) {
    margin-right: 0;
  }

  .recommend .content .image {
    height: 260rpx;
  }

  .recommend .content .name {
    height: 80rpx;
    margin: 10rpx 0;
    font-size: 26rpx;
    color: #262626;
  }

  .recommend .content .price {
    line-height: 1;
    font-size: 20rpx;
    color: #cf4444;
  }

  .recommend .content .number {
    font-size: 26rpx;
    margin-left: 2rpx;
  }

  /* 底部工具栏 */
  .toolbar {
    height: 120rpx;
    padding: 0 20rpx;
    border-top: 1rpx solid #eaeaea;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .toolbar .buttons {
    display: flex;
  }

  .toolbar .buttons > view {
    width: 220rpx;
    text-align: center;
    line-height: 72rpx;
    font-size: 26rpx;
    color: #fff;
    border-radius: 72rpx;
  }

  .toolbar .buttons .addcart {
    background-color: #ffa868;
  }

  .toolbar .buttons .payment {
    background-color: #27ba9b;
    margin-left: 20rpx;
  }

  .toolbar .icons {
    padding-right: 10rpx;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    flex: 1;
  }

  .toolbar .icons button {
    text-align: center;
    line-height: 1.4;
    padding: 0;
    border-radius: 0;
    font-size: 20rpx;
    color: #333;
    background-color: #fff;
  }

  .toolbar .icons text {
    display: block;
    font-size: 34rpx;
  }
</style>
