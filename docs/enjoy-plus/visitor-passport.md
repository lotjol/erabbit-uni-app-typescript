# 访客通行证

所谓的通行证是由后端生成的一个二维码，该二维码具有时效时（不超过72小时），本节的任务是调用接口获取通行证并展示给用户。

## 3.1 数据渲染

- 接口路径：/visitor/:id
- 请求方法: GET
- 请求参数：
  - id 访客邀请id
- Headers：
  - Authorization
- 响应数据：[见文档](https://www.apifox.cn/apidoc/shared-8d66c345-7a9a-4844-9a5a-1201852f6faa/api-42635315)

```javascript
// visitor_pkg/pages/passport/index.js
Page({
  onLoad({ id }) {
    // 获取通行证
    this.getPassport(id)
  },
  async getPassport(id) {
    if (!id) return
    // 请求数据接口
    const { code, data: passport } = await wx.http.get('/visitor/' + id)
    // 检测接口调用的结果
    if (code !== 10000) return wx.utils.toast('获取通行证失败!')
    // 渲染通行证
    this.setData({ ...passport })
  }
})
```

将数据渲染到模板当中

```xml
<!-- visitor_pkg/pages/passport/index.wxml -->
<view class="passport">
  <view class="countdown">
    <block wx:if="{{validTime > 0}}">
      <van-count-down time="{{ validTime * 1000 }}" />
      <view class="label">通行证有效时间</view>
    </block>
    <block wx:else>
      <view class="van-count-down">00:00:00</view>
      <view class="label">通行证已失效!</view>
    </block>
  </view>
  <view class="qrcode">
    <image src="{{url}}"></image>
  </view>
  <view class="description">
    <view class="house">{{houseInfo}}</view>
    <view class="tips">将此二维码分享给访客，访客扫码即可开门</view>
  </view>
</view>
<view class="toolbar" wx:if="{{validTime > 0}}">
  <button class="button-share" open-type="share">
    <text class="enjoy-icon icon-share"></text>
    <text class="text">分享给朋友</text>
  </button>
  <button class="button-save">
    <text class="enjoy-icon icon-save"></text>
    <text class="text">保存到本地</text>
  </button>
</view>
```

通行证失效后将不再允许分享和保存二维码到本地。

## 3.2 分享给朋友

小程序中提供了[自定义分享](https://developers.weixin.qq.com/miniprogram/dev/reference/api/Page.html#onShareAppMessage-Object-object)内容的方法，需要满足两个条件：

1. 用户点击 `button` 组件，且 `open-type` 的值设置为 `share`
2. 在页面中监听事件回调 `onShareAppMessage`

```javascript
Page({
  // ...
  onShareAppMessage() {
    return {
      title: '查看通行证',
      path: '/visitor_pkg/pages/passport/index',
      imageUrl: 'https://enjoy-plus.oss-cn-beijing.aliyuncs.com/images/share_poster.png',
    }
  },
  // ...
})
```

## 3.3 保存图片到本地

