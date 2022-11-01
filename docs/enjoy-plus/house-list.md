# 房屋列表

本节的任务是查询用户添加的房屋列表，直接调用接口即可。

- 接口路径：/room
- 请求方法: GET
- 请求参数：无
- Headers：
  - Authorization
- 响应数据：[见文档](https://www.apifox.cn/apidoc/shared-8d66c345-7a9a-4844-9a5a-1201852f6faa/api-41400750)

```javascript
// house_pkg/pages/list/index.js
Page({
  data: {
    dialogVisible: false,
  },
  onShow() {
    // 获取房屋列表
    this.getHouseList()
  },
  async getHouseList() {
    // 请求数据接口
    const { code, data: houseList } = await wx.http.get('/room')
    // 检测接口返回的结果
    if (code !== 10000) return wx.utils.toast()
    // 渲染数据
    this.setData({ houseList })
  },
})
```

返回的数据当中 `status` 表示当前房屋的审核状态：

- 值为 1 表示正在审核
- 值为 2 表示审核成功
- 值为 3 表示审核失败

在模板中来渲染获取到的房屋列表数据

```xml{8-19}
<!-- house_pkg/pages/list/index.wxml -->
<authorization>
  <block wx:if="{{true}}">
    <scroll-view show-scrollbar="{{false}}" enhanced scroll-y>
      <view class="houses">
        <view class="houses-title">房屋信息</view>
        <view class="houses-list">
          <van-swipe-cell wx:for="{{houseList}}" wx:key="id" async-close bind:close="deleteHouse" right-width="{{ 70 }}">
            <van-cell-group bind:tap="goDetail" border="{{false}}">
              <van-cell size="large" title="{{item.point}}">
                <text class="tag info" wx:if="{{item.status === 1}}">正在审核</text>
                <text class="tag success" wx:if="{{item.status === 2}}">审核通过</text>
                <text class="tag fail" wx:if="{{item.status === 3}}">审核失败</text>
              </van-cell>
              <van-cell title="房间号" border="{{false}}" value="{{item.building}}{{item.room}}" />
              <van-cell title="业主" border="{{false}}" value="{{item.name}}" />
            </van-cell-group>
            <view slot="right">删除</view>
          </van-swipe-cell>
        </view>
      </view>
    </scroll-view>
    ...
  </block>
  ...
</authorization>
```

为了方便开发测试，后端提供了一个接口专门用来修改房屋审核状态的[接口](https://www.apifox.cn/apidoc/shared-8d66c345-7a9a-4844-9a5a-1201852f6faa/api-42672273)，直接在 apifox 在线调用接口即可。

提交代码:

```bash
# 查看当前被修改的文件
git status
# 暂存文件
git add .
# 提交到本地
git commit -m 'feat(house): 完成查询房到列表'
```