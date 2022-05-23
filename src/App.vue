<script setup lang="ts">
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";
onLaunch(() => {
  // console.log("App Launch");
});
onShow(() => {
  // console.log("App Show");
});
onHide(() => {
  // console.log("App Hide");
});
</script>

<style lang="scss">
@import "./static/fonts.scss";

view,
navigator,
input,
scroll-view {
  box-sizing: border-box;
}

button::after {
  border: none;
}

swiper,
scroll-view {
  flex: 1;
  height: 100%;
  overflow: hidden;
}

image {
  width: 100%;
  height: 100%;
  vertical-align: middle;
}

.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

/* 加载提示 */
.loading {
  text-align: center;
  font-size: 28rpx;
  color: #666;
  padding-bottom: 16rpx;
}

.half-dialog {
  padding: 0 30rpx;
  border-radius: 10rpx 10rpx 0 0;
}

.half-dialog view {
  height: auto;
  padding: 0;
}

.half-dialog .title {
  line-height: 1;
  padding: 40rpx 0;
  text-align: center;
  font-size: 32rpx;
  font-weight: normal;
  border-bottom: 1rpx solid #ddd;
  color: #444;
}

.half-dialog .description {
  position: relative;
}

.half-dialog .description .close {
  position: absolute;
  right: 0;
  top: 24rpx;
}

.half-dialog .footer {
  display: flex;
  justify-content: space-between;
  padding: 20rpx 0 40rpx;
  font-size: 28rpx;
  color: #444;
}

.half-dialog .footer .button {
  flex: 1;
  height: 72rpx;
  text-align: center;
  line-height: 72rpx;
  margin: 0 20rpx;
  color: #fff;
  border-radius: 72rpx;
}

.half-dialog .footer .primary {
  color: #fff;
  background-color: #27ba9b;
}

.half-dialog .footer .secondary {
  background-color: #ffa868;
}
</style>
