# 房屋详情

根据房屋的 id 查询房屋的详细信息并展示到页面当中，在房屋列表页面中跳转到房屋详情页面时通过地址传递房屋 `id` 参数：

```javascript
// house_pkg/pages/list/index.js
Page({
  // ...
  goDetail(ev) {
    wx.navigateTo({
      url: '/house_pkg/pages/detail/index?id=' + ev.mark.id,
    })
  },
})
```

- 接口路径：/room/:id
- 请求方法: GET
- 请求参数：
  - id 房屋id
- Headers：
  - Authorization
- 响应数据：[见文档](https://www.apifox.cn/apidoc/shared-8d66c345-7a9a-4844-9a5a-1201852f6faa/api-41400751)

```javascript{3-15}
// house_pkg/pages/detail/index.js
Page({
  onLoad({ id }) {
    // 获取房屋详情
    this.getHouseDetail(id)
  },
  async getHouseDetail(id) {
    if (!id) return
    // 请求数据接口
    const { code, data: houseDetail } = await wx.http.get('/room/' + id)
    // 检测接口返回的结果
    if (code !== 10000) return wx.utils.toast()
    // 渲染数据
    this.setData({ ...houseDetail })
  },
  editHouse() {
    wx.navigateTo({
      url: '/house_pkg/pages/form/index',
    })
  },
})
```

渲染数据到模板中

```xml
<!-- house_pkg/pages/detail/index.wxml -->
<scroll-view scroll-y enhanced show-scrollbar="{{false}}">
  <view class="house-detail">
    <van-cell-group border="{{false}}" title="房屋信息">
      <van-cell title="{{point}}">
        <text class="tag info" wx:if="{{status === 1}}">正在审核</text>
        <text class="tag success" wx:if="{{status === 2}}">审核成功</text>
        <text class="tag fail" wx:if="{{status === 3}}">审核失败</text>
      </van-cell>
    </van-cell-group>
    <van-cell-group title="业主信息" border="{{false}}">
      <van-cell title-width="200rpx" title="房间号" value="{{building}}{{room}}" />
      <van-cell title-width="200rpx" title="业主" value="{{name}}" />
      <van-cell title-width="200rpx" border="{{false}}" title="手机号" value="{{mobile}}" />
    </van-cell-group>
    <view class="id-card">
      <van-cell title="本人身份证照片" />
      <view class="id-card-front">
        <image src="{{idcardFrontUrl}}" />
      </view>
      <view class="id-card-back">
        <image src="{{idcardFrontUrl}}" />
      </view>
    </view>
  </view>
</scroll-view>
...
```

提交代码:

```bash
# 查看当前被修改的文件
git status
# 暂存文件
git add .
# 提交到本地
git commit -m 'feat(house): 完成查询房屋详情的功能'
```