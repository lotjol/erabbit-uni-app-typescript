# 修改信息

修改报修信息要先根据报修项目的 `id` 将原来的报修信息查询出来，然后在对原数据进行修改后再调用接口来更新数据。

修改报修信息和填写报修信息的逻辑是相似的并且共用了相同的页面，即 `repair_pkg/pages/form/index`

在报修详情页面中跳转到修改报修页面时通过地址传递报修项目的 `id` 参数：

```xml{5}
<!-- repair_pkg/pages/detail/index.wxml -->
...
<!-- 只能受理中状态是才允许取消报修或修改报修 -->
<view class="toolbar" wx:if="{{status === 1}}">
  <view class="button-text active" bind:tap="editRepair">修改信息</view>
  <view class="button-text" bind:tap="openDialogLayer">取消报修</view>
</view>
...
```

```javascript
// repair_pkg/pages/detail/index.js
Page({
  // ...
  editRepair() {
    wx.navigateTo({
      // repair_id 是全局变量，在前面已经定义
      url: '/repair_pkg/pages/form/index?id=' + repair_id,
    })
  }
})
```

## 5.1 设置页面标题

修改报修信息和添加报修信息共用了相同的页面，可是即使是在修改报修信息时页面的标题也是 【填写报修信息】与实际用户执行的操作不符，我们可以调用 API 来动态修改页面的标题。

如果页面地址中包含 id 参数则表明当前的操作为修改报修信息：

```javascript
// repair_pkg/pages/form/index.js
Page({
  // ...
  onLoad({id}) {
    // 获取房屋列表
    this.getHouseList()
    // 获取维修项目
    this.getRepairItem()
    if (id) {
      // 更新标题
      wx.setNavigationBarTitle({ title: '修改报修信息' })
    }
  },
  // ...
})
```

## 5.2 查询报修详情

- 接口路径：/repair/:id
- 请求方法: GET
- 请求参数：
  - id 报修项目的id
- Headers：
  - Authorization
- 响应数据：[见文档](https://www.apifox.cn/apidoc/shared-8d66c345-7a9a-4844-9a5a-1201852f6faa/api-41400757)

```javascript{9-12,15-23}
// repair_pkg/pages/form/index.js
Page({
  // ...
  onLoad({ id }) {
    // 获取房屋列表
    this.getHouseList()
    // 获取维修项目
    this.getRepairItem()
    if (id) {
      // 更新标题
      wx.setNavigationBarTitle({ title: '修改报修信息' })
      this.getRepairDetail(id)
    }
  },
  async getRepairDetail(id) {
    if (!id) return
    // 请求数据接口
    const { code, data: repairDetail } = await wx.http.get('/repair/' + id)
    // 检测接口调用结果
    if (code !== 10000) return wx.utils.toast('获取报修信息失败!')
    // 渲染报修信息
    this.setData({ ...repairDetail })
  },
})
```

## 5.3 更新报修信息

填写报修信息和修改房屋信息调用的是同一个接口，后端会动判断传递参数时有没有 `id`，如果有 `id` 则表示是编辑操作否则是添加操作。

```javascript{12,15}
// repair_pkg/pages/form/index.js
Page({
  // ...
  async submitForm() {
    // 逐个验证表单数据
    if (!this.verifyHouse()) return
    if (!this.verifyRepair()) return
    if (!this.verifyMobile()) return
    if (!this.verifyDate()) return
    if (!this.verifyDescription()) return
    // 解构获取接口需要的参数
    const { id, houseId, repairItemId, appointment, mobile, description, attachment } = this.data
    // 请求数据接口
    const { code } = await wx.http.post('/repair', {
      id,
      houseId,
      repairItemId,
      appointment,
      mobile,
      description,
      attachment
    })
    // 检测接口请求的结果
    if (code !== 10000) return wx.showToast({ title: '在线报修失败!', icon: 'none' })
    // 跳转到表单列表页面
    wx.redirectTo({
      url: '/repair_pkg/pages/list/index',
    })
  },
  // ...
})
```

提交代码

```bash
# 查看当前被修改的文件
git status
# 暂存文件
git add .
# 提交到本地
git commit -m 'feat(repair): 完成修改报修信息的功能'

# 推送到远程或合并到本地 main
git checkout main
git merge feat-house
```