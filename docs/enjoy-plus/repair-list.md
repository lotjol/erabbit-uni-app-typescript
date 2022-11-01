# 报修列表

本节的任务是查询用户在线填写的报修列表，直接调用接口即可。

- 接口路径：/repair
- 请求方法: GET
- 请求参数：
  - current 当前请求数据的页码
  - pageSize 每页请求获得的数据条数
- Headers：
  - Authorization
- 响应数据：[见文档](https://www.apifox.cn/apidoc/shared-8d66c345-7a9a-4844-9a5a-1201852f6faa/api-41400755)

```javascript
// repair_pkg/pages/form/index.wxml
Page({
  onShow() {
    // 获取报修列表
    this.getRepairList()
  },
  async getRepairList() {
    // 请求数据接口
    const { code, data: { rows: repairList } } = await wx.http.get('/repair', { current: 1, pageSize: 10 })
    // 检测接口调用的结果
    if (code !== 10000) return wx.utils.toast('获取报修列表失败!')
    // 渲染报修列表
    this.setData({
      repairList,
      isEnpty: repairList.length === 0
    })
  },
  // ...
})
```

返回的数据当中 `status` 表示当前报修项目进行的状态：

- 值为 1 表示受理中，对应的样式类名 `info`
- 值为 2 表示上门中，对应的样式类名 `success`
- 值为 3 表示已完成，对应的样式类名 `complete`
- 值为 0 表示已取消，对应的样式类名 `cancel`

在模板中来渲染获取到的房屋列表数据

```xml{8-19}
<!-- repair_pkg/pages/list/index.wxml -->
<authorization>
  <block wx:if="{{isEmpty}}">
    <scroll-view show-scrollbar="{{false}}" enhanced scroll-y>
      <view class="repairs">
        <view class="repairs-title">我的报修</view>
        <view class="repairs-list">
          <van-cell-group wx:for="{{repairList}}" wx:key="id" border="{{false}}" bind:tap="goDetail">
            <van-cell size="large" title="{{item.houseInfo}}">
              <text class="tag info" wx:if="{{item.status === 1}}">受理中</text>
              <text class="tag success" wx:if="{{item.status === 2}}">上门中</text>
              <text class="tag complete" wx:if="{{item.status === 3}}">已完成</text>
              <text class="tag cancel" wx:if="{{item.status === 0}}">已取消</text>
            </van-cell>
            <van-cell title="报修项目" border="{{false}}" value="{{item.repairItemName}}" />
            <van-cell title="预约时间" border="{{false}}" value="{{item.appointment}}" />
            <van-cell title="电话号码" border="{{false}}" value="{{item.mobile}}" />
          </van-cell-group>
        </view>
      </view>
    </scroll-view>
    <view class="toolbar" bind:tap="addRepair">
      <text class="enjoy-icon icon-repair"></text>
      <text class="button-text">在线报修</text>
    </view>
  </block>
  <view wx:else class="blank">
    您还没有报修记录，请点击
    <navigator hover-class="none" class="link" url="/repair_pkg/pages/form/index">添加</navigator>
  </view>
</authorization>
```

为了方便开发测试，后端提供了一个接口专门用来修改报修项目状态的[接口](https://www.apifox.cn/apidoc/shared-8d66c345-7a9a-4844-9a5a-1201852f6faa/api-42672273)，直接在 apifox 在线调用接口即可。

提交代码:

```bash
# 查看当前被修改的文件
git status
# 暂存文件
git add .
# 提交到本地
git commit -m 'feat(repair): 完成查询报修列表的功能'
```