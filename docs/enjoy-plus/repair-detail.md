# 报修详情

## 3.1 数据渲染

根据报修项目的 id 查询报修项目的详细信息并展示到页面当中，在报修项目列表页面中跳转到报修项目详情页面时通过地址传递报修项目的 `id` 参数：

```javascript
// repair_pkg/pages/list/index.js
Page({
  // ...
  goDetail(ev) {
    wx.navigateTo({
      url: '/repair_pkg/pages/detail/index?id=' + ev.mark.id,
    })
  },
})
```

- 接口路径：/repair/:id
- 请求方法: GET
- 请求参数：
  - id 报修项目的id
- Headers：
  - Authorization
- 响应数据：[见文档](https://www.apifox.cn/apidoc/shared-8d66c345-7a9a-4844-9a5a-1201852f6faa/api-41400757)

```javascript{3-15}
// repair_pkg/pages/detail/index.js
Page({
  // ...
  onLoad({ id }) {
    // 获取维修详情
    this.getRepairDetail((repair_id = id))
  },
  async getRepairDetail(id) {
    // id 不存在就不必发请求了
    if (!id) return
    // 请求数据接口
    const { code, data: repairDetail } = await wx.http.get('/repair/' + id)
    // 校验接口调用结果
    if (code !== 10000) return wx.utils.toast('获取报修详情失败!')
    // 渲染报修详情
    this.setData({ ...repairDetail })
  },
  // ...
})
```

渲染数据到模板中

```xml{5-8,31-35}
<!-- repair_pkg/pages/detail/index.wxml -->
<authorization>
  <scroll-view scroll-y enhanced show-scrollbar="{{false}}">
    <view class="repair-detail">
      <!-- 地图组件，只有处于上门中状态才显示 -->
      <view class="polyline" wx:if="{{status === 2}}">
        <map style="width: 100%; height: 100%;" scale="16" latitude="{{latitude}}" longitude="{{longitude}}"></map>
      </view>
      <van-cell-group border="{{false}}" title="房屋信息">
        <van-cell title="{{houseInfo}}">
          <text class="tag info" wx:if="{{status === 1}}">受理中</text>
          <text class="tag success" wx:if="{{status === 2}}">上门中</text>
          <text class="tag complete" wx:if="{{status === 3}}">已完成</text>
          <text class="tag cancel" wx:if="{{status === 0}}">已取消</text>
        </van-cell>
      </van-cell-group>
      <van-cell-group title="报修信息" border="{{false}}">
        <van-cell title-width="200rpx" title="维修项目" value="{{repairItemName}}" />
        <van-cell title-width="200rpx" title="手机号码" value="{{mobile}}" />
        <van-cell title-width="200rpx" title="预约日期" value="{{appointment}}" />
        <van-cell title="问题描述" label="{{description}}" />
      </van-cell-group>
      <view class="attachment">
        <view class="title">问题附件</view>
        <scroll-view scroll-x>
          <image wx:for="{{attachment}}" wx:key="id" src="{{item.url}}"></image>
        </scroll-view>
      </view>
    </view>
  </scroll-view>
  <!-- 只能受理中状态是才允许取消报修或修改报修 -->
  <view class="toolbar" wx:if="{{status === 1}}">
    <view class="button-text active">修改信息</view>
    <view bind:tap="test" class="button-text">取消报修</view>
  </view>
</authorization>
```

提交代码:

```bash
# 查看当前被修改的文件
git status
# 暂存文件
git add .
# 提交到本地
git commit -m 'feat(repair): 完成查询报修项目详情的功能'
```

## 3.2 上门路线规划

小程序中有一个专门展示地址的组件[map](https://developers.weixin.qq.com/miniprogram/dev/component/map.html)，直接将组件写到页面当中就会展示地图。

一些常用的组件属性：

- latitude 地图中心的经度
- longitude 地图中心的纬度
- scale 地图初始的缩放比例
- markers 地图上的标记
- polyline 地图路线


```javascript
// repair_pkg/pages/detail/index.js
Page({
  data: {
    markers: [
      {
        id: 1,
        latitude: 40.086757,
        longitude: 116.328634,
        width: 24,
        height: 30,
      },
      {
        id: 2,
        latitude: 40.08346500000002,
        longitude: 116.33293800000011,
        iconPath: '/static/images/marker.png',
        width: 40,
        height: 40,
      },
    ],
  }
})
```

上述代码中的经纬度是我挑选的学校附近的两个点，大家可以自由指定（两点距离不要相差太远）。

通过微信小程序的地图服务 sdk 生成路线规划的坐标点。

```javascript
Page({
  // ...
  createPolyLine() {
    //调用距离计算接口
    qqMap.direction({
      mode: 'bicycling',
      //from参数不填默认当前地址
      from: '40.060539,116.343847', // 传智播客
      to: '40.086757,116.328634', // （示例）云趣园1区
      success: (res) => {
        const coords = res.result.routes[0].polyline
        const points = []
        //坐标解压（返回的点串坐标，通过前向差分进行压缩）
        for (let i = 2; i < coords.length; i++) {
          coords[i] = Number(coords[i - 2]) + Number(coords[i]) / 1000000
        }
        //将解压后的坐标放入点串数组pl中
        for (let i = 0; i < coords.length; i += 2) {
          points.push({ latitude: coords[i], longitude: coords[i + 1] })
        }
        //设置polyline属性，将路线显示出来,将解压坐标第一个数据作为起点
        this.setData({
          polyline: [
            {
              points,
              color: '#5591af',
              width: 4,
            },
          ],
        })
      },
      fail: function (error) {
        console.error(error)
      },
    })
  },
})
```