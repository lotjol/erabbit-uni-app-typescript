# 取消报修

## 4.1 用户交互

当报修项目的状态处于受理中时，用户可以详情页面主动取消本次报修。

在用户点击取消报修时给用户弹出一个确认提示框：

```xml
<!-- repair_pkg/pages/detail/index.wxml -->
<van-dialog
  message="是否要取消本次报修？"
  showCancelButton
  show="{{dialogVisible}}"
  cancel-button-color="#848484"
  confirm-button-color="#5591af"
  bind:close="dialogClose"
/>
```
使用 `dialogVisible` 数据控制确认框是否显示

```javascript
Page({
  data: {
    dialogVisible: false
  },
  dialogClose() {
    // ...
  }
})
```

在用户点【取消报修】按钮后显示确认框

```xml{5}
...
<!-- 只能受理中状态是才允许取消报修或修改报修 -->
<view class="toolbar" wx:if="{{status === 1}}">
  <view class="button-text active">修改信息</view>
  <view  bind:tap="openDialogLayer" class="button-text">取消报修</view>
</view>
...
```

```javascript
Page({
  // ...
  // 打开确认框
  openDialogLayer() {
    this.setData({ dialogVisible: true })
  },
  // ...
})
```

## 4.2 调用接口

- 接口路径：/cancel/repaire/:id
- 请求方法: PUT
- 请求参数：
  - id 报修项目的id
- Headers：
  - Authorization
- 响应数据：[见文档](https://www.apifox.cn/apidoc/shared-8d66c345-7a9a-4844-9a5a-1201852f6faa/api-41400752)

```javascript
Page({
  // ...
  async cancelRepair() {
    // 请求数据接口
    const { code } = await wx.http.put('/cancel/repaire/' + repair_id)
    // 检测接口的调用结果
    if (code !== 10000) return wx.utils.toast('取消报修失败!')
    // 跳转到报修列表页面
    wx.navigateBack()
  },

  dialogClose(ev) {
    // 选择了确认后取消报修
    if (ev.detail === 'confirm') this.cancelRepair()
  },
  // ...
})
```

提交代码:

```bash
# 查看当前被修改的文件
git status
# 暂存文件
git add .
# 提交到本地
git commit -m 'feat(repair): 完成取消报修项目的功能'
```