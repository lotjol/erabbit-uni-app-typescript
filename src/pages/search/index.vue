<template>
  <view class="viewport">
    <!-- 搜索条 -->
    <view class="search icon-search">
      <input
        type="search"
        @input="getSuggestion"
        @click="startInput"
        @confirm="execQuery"
        :focus="focused"
      />
      <text
        class="clear icon-clear"
        @click.prevent="clearInput"
        v-show="currentKey"
      ></text>
      <text @click="execQuery" class="button">搜索</text>
    </view>

    <!-- 热词 -->
    <view class="hots">
      <view class="title">热门搜索</view>
      <view class="keywords" @click="execQuery">
        <text :data-keywords="item" v-for="item in hotKeys" :key="item">{{
          item
        }}</text>
      </view>
    </view>

    <!-- 搜索历史 -->
    <view class="history">
      <view class="title">历史搜索</view>
      <view class="keywords" @click="execQuery">
        <text :data-keywords="item" v-for="item in historyKeys" key="item">{{
          item
        }}</text>
      </view>
    </view>

    <!-- 查询结果 -->
    <result class="list" v-if="!entering"></result>

    <!-- 搜索建议 -->
    <view class="suggestion" v-show="entering && suggestions.length">
      <scroll-view scroll-y>
        <view class="item" v-for="item in suggestions" :key="item.match">
          <view
            :data-keywords="currentKey + item.match"
            @click="execQuery"
            class="match"
          >
            <text class="mark">{{ currentKey }}</text
            >{{ item.match }}
          </view>
          <view class="related">
            <text
              @click="execQuery"
              v-for="text in item.related"
              :data-keywords="text"
              :key="text"
              >{{ text }}</text
            >
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";

import result from "@/components/result/index.vue";

interface suggestType {
  match: string;
  related: string[];
}

interface goodsType {
  id: number;
  path: string;
  name: string;
  wish: number;
  present: number;
  original: number;
}

const entering = ref(true);
const focused = ref(true);
const currentKey = ref("手机");
const hotKeys = reactive(["华为手机", "苹果", "戴森", "变形金刚"]);
const historyKeys = reactive([
  "施华洛世奇",
  "手机膜",
  "大米",
  "直饮水机",
  "笔记本",
  "戴维贝拉",
  "鼠标垫",
  "饮料",
  "矿泉水",
]);

const suggestions = ref<suggestType[]>([]);
const goods = ref<goodsType[]>();

const startInput = () => {
  entering.value = true;
};

const clearInput = () => {
  // 重置搜索状态
  currentKey.value = "";
  suggestions.value = [];
  entering.value = true;
};

// 获得搜索建议
const getSuggestion = (ev: any) => {
  if (!ev.detail.value) {
    return (suggestions.value = []);
  }

  // 模拟一些数据
  suggestions.value = [
    {
      match: "支架",
      related: ["懒人支架", "电动车", "汽车"],
    },
    {
      match: "华为",
      related: ["mate30", "5G", "nova6"],
    },
    {
      match: "壳",
      related: ["iPhone11", "iPhoneX", "mate30"],
    },
    {
      match: "贴膜",
      related: ["小米10", "苹果11", "钢化膜"],
    },
    {
      match: "卡",
      related: ["无限流量", "流量卡", "中国移动"],
    },
  ];

  console.log("发送请求...");
};

// // 执行搜索
const execQuery = (ev: any) => {
  // 更新查询关键字
  let { keywords } = ev.target.dataset;

  if (keywords) currentKey.value = keywords;

  // 更改查询状态
  entering.value = false;

  if (!currentKey) return;

  goods.value = [
    {
      id: 1,
      path: "/static/uploads/goods_big_2.jpg",
      name: "荣耀Play3 6.39英寸魅眼全视屏 4000mAh大电池 全新机型",
      wish: 2146,
      present: 899,
      original: 999,
    },
    {
      id: 2,
      path: "/static/uploads/goods_big_2.jpg",
      name: "荣耀Play3 6.39英寸魅眼全视屏 4000mAh大电池 全新机型",
      wish: 2146,
      present: 899,
      original: 999,
    },
    {
      id: 3,
      path: "/static/uploads/goods_big_3.jpg",
      name: "荣耀Play3 6.39英寸魅眼全视屏 4000mAh大电池 全新机型",
      wish: 2146,
      present: 899,
      original: 999,
    },
    {
      id: 4,
      path: "/static/uploads/goods_big_4.jpg",
      name: "荣耀Play3 6.39英寸魅眼全视屏 4000mAh大电池 全新机型",
      wish: 2146,
      present: 899,
      original: 999,
    },
  ];

  console.log("发送请求...");
};
</script>

<style>
page {
  height: 100%;
  overflow: hidden;
}

.viewport {
  padding: 0 30rpx;
}

.search {
  display: flex;
  margin-bottom: 20rpx;
  position: relative;
}

.search::before {
  position: absolute;
  left: 26rpx;
  top: 50%;

  line-height: 1;
  color: #b7b7b7;
  font-size: 28rpx;
  margin-top: 1rpx;
  transform: translateY(-50%);
}

.search input {
  flex: 1;
  height: 64rpx;
  padding: 4rpx 70rpx 0 64rpx;
  border-radius: 60rpx;
  font-size: 26rpx;
  color: #8b8b8b;
  background-color: #f3f4f4;
}

.search .clear {
  position: absolute;
  top: 0;
  left: 535rpx;
  padding: 9rpx 20rpx;
  color: #b7b7b7;
  font-size: 30rpx;
}

.search .button {
  text-align: center;
  margin-left: 20rpx;
  font-size: 30rpx;
  color: #353535;
  align-self: center;
}

/* 搜索关键字 */
.hots,
.history {
  width: 100%;
}

.title {
  line-height: 1;
  padding: 20rpx 0;
  font-size: 32rpx;
  color: #343434;
}

.keywords {
  padding: 20rpx 0 0;
  display: flex;
  flex-wrap: wrap;
}

.keywords text {
  line-height: 2;
  padding: 0 24rpx;
  margin: 0 24rpx 24rpx 0;
  font-size: 26rpx;
  color: #666;
  border-radius: 44rpx;
  background-color: #f3f4f4;
}

/* 联想关键词 */
.suggestion {
  position: absolute;
  left: 0;
  right: 0;
  top: 64rpx;
  bottom: 0;
  background-color: #fff;
  padding: 20rpx 0 20rpx 30rpx;
}

.suggestion .item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 88rpx;
  padding: 0 20rpx 0 8rpx;
  border-bottom: 1rpx solid #dfdfdf;
}

.suggestion .match {
  color: #343434;
  font-size: 26rpx;
}

.suggestion .mark {
  color: #999;
}

.suggestion .related {
  display: flex;
  line-height: 1;
}

.suggestion .related text {
  padding: 10rpx 20rpx;
  margin: 0 8rpx;
  color: #666;
  font-size: 24rpx;
  border-radius: 44rpx;
  background-color: #f3f4f4;
}

.list {
  position: absolute;
  left: 0;
  right: 0;
  top: 84rpx;
  bottom: 0;
}
</style>
