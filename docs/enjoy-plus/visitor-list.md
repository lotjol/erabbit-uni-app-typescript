# 访客列表

查询历史访客记录。

- 接口路径：/visitor
- 请求方法: GET
- 请求参数：
  - id 访客邀请id
- Headers：
  - Authorization
- 响应数据：[见文档](https://www.apifox.cn/apidoc/shared-8d66c345-7a9a-4844-9a5a-1201852f6faa/api-41400761)

```javascript
Page({
  onLoad() {
    // 获取访客列表
    this.getVistorList()
  },
  async getVistorList() {
    // 请求数据接口
    const { code, data: { rows: visitorList } } = await wx.http.get('/visitor')
    // 检测接口调用结果
    if (code !== 10000) return wx.utils.toast('获取访客列表失败!')
    // 渲染访客列表
    this.setData({ visitorList })
  },
  goPassport(ev) {
    wx.navigateTo({
      url: '/visitor_pkg/pages/passport/index?id=' + ev.mark.id,
    })
  },
})
```

将获取到的数据渲染到模板当中

```xml
<authorization>
  <block wx:if="{{true}}">
    <scroll-view show-scrollbar="{{false}}" enhanced scroll-y>
      <view class="visitor">
        <view class="visitor-title">我的访客</view>
        <view class="visitor-list">
          <van-cell-group
            wx:for="{{visitorList}}"
            wx:key="id"
            border="{{false}}"
            mark:id="{{item.id}}"
            bind:tap="goPassport"
          >
            <van-cell size="large" title="{{item.houseInfo}}">
              <text class="tag success" wx:if="{{item.status === 1}}">生效中</text>
              <text class="tag cancel" wx:if="{{item.status === 0}}">已失效</text>
            </van-cell>
            <van-cell title=" 访客姓名" border="{{false}}" value="{{item.name}}" />
            <van-cell title="手机号码" border="{{false}}" value="{{item.mobile}}" />
            <van-cell title="访问日期" border="{{false}}" value="{{item.visitDate}}" />
          </van-cell-group>
        </view>
      </view>
    </scroll-view>
  </block>
  <view wx:else class="blank">
    您还没有访客记录，请点击
    <navigator hover-class="none" class="link" url="/visitor_pkg/pages/form/index">添加</navigator>
  </view>
</authorization>
```