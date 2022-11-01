# 删除房屋

## 3.1 用户交互

用户可以在房屋列表中将某个房到信息删除，在删除房到时用到 `van-dialog` 确认框组件，该组件使用数据 `dialogVisible` 控制其显示或掩藏：

```xml
<!-- house_pkg/pages/list.wxml -->
<van-dialog
  message="是否删除已绑定房屋？"
  showCancelButton
  show="{{dialogVisible}}"
  cancel-button-color="#848484"
  confirm-button-color="#5591af"
  bind:close="dialogClose"
/>
```
用户滑动 `van-swipe-cell` 组件后点击了【删除】按钮后会调用 `swipeClose` 方法，然后显示 `van-dialog` 确认框组件，然后用户点击了 `van-dialog` 确认框组件中的【确认】按钮后会调用 `dialogClose` 方法：

```javascript
// house_pkg/pages/list/index.js
Page({
  // ...
  swipeClose(ev) {
    const { position, instance } = ev.detail
    if (position === 'right') {
      // 显示 Dialog 对话框
      this.setData({
        dialogVisible: true,
      })
      // swiper-cell 滑块关闭
      instance.close()
    }
  },
  dialogClose(ev) {
    console.log(ev.detail)
  },
})
```

## 3.2 调用接口

- 接口路径：room/:id
- 请求方法: DELETE
- 请求参数：
  - id 待删除的房到 id
- Headers：
  - Authorization
- 响应数据：[见文档](https://www.apifox.cn/apidoc/shared-8d66c345-7a9a-4844-9a5a-1201852f6faa/api-41400746)

在调用删除房屋之前必须先获取待删除房屋的 `id`，可以在用户在执行侧滑操作时通过 `mark` 来传递：

```xml{6-7}
<!-- house_pkg/pages/list/index.wxml -->
...
<van-swipe-cell
  wx:for="{{houseList}}"
  wx:key="id"
  mark:index="{{index}}"
  mark:id="{{item.id}}"
  async-close
  bind:close="swipeClose"
  right-width="{{70}}"
>
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
...
```
在 `swipeClose` 方法中获取 `id` 和 `index` 的值，其中 `id` 用来发送给服务端接口，`index` 用来删除本地 AppData 中的数据

```javascript{2-3,10-12}
// house_pkg/pages/list/index.js
let house_id = 0
let house_index = 0
Page({
  swipeClose(ev) {
    const { position, instance } = ev.detail
    if (position === 'right') {
      // 显示 Dialog 对话框
      this.setData({ dialogVisible: true })
      // 待删除的房屋id和索引
      house_id = ev.mark.id
      house_index = ev.mark.index
      // swiper-cell 滑块关闭
      instance.close()
    }
  },
})
```

封装方法来调用接口删除房屋数据：

```javascript
// house_pkg/pages/list/index.js
Page({
  // ...
  async deleteHouse() {
    // 请求数据接口
    const { code } = await wx.http.delete('/room/' + house_id)
    // 检测接口调用结果
    if (code !== 10000) return wx.utils.toast('删除房屋失败!')

    // 更新房屋列表
    this.data.houseList.splice(house_index, 1)
    this.setData({
      houseList: this.data.houseList,
    })
  },
  swipeClose(ev) {/***/},
  dialogClose(ev) {
    // 选择了确认后删除房屋
    ev.detail === 'confirm' && this.deleteHouse()
  },
})
```

最后再做一点点完善，当所有的房屋都被删除了后，在页面中给用户一个空提示：

```xml
<authorization>
  <block wx:if="{{!isEmpty}}">
    ...
  </block>
  <view wx:else class="blank">
    您还没有认证房屋，请点击 <navigator hover-class="none" class="link" url="/house_pkg/pages/form/index">添加</navigator>
  </view>
</authorization>
```

```javascript{14}
// house_pkg/pages/list/index.js
Page({
  // ...
  async deleteHouse() {
    // 请求数据接口
    const { code } = await wx.http.delete('/room/' + house_id)
    // 检测接口调用结果
    if (code !== 10000) return wx.utils.toast('删除房屋失败!')

    // 更新房屋列表
    this.data.houseList.splice(house_index, 1)
    this.setData({
      houseList: this.data.houseList,
      isEmpty: this.data.houseList.length === 0
    })
  },
  swipeClose(ev) {/***/},
  dialogClose(ev) {
    // 选择了确认后删除房屋
    ev.detail === 'confirm' && this.deleteHouse()
  },
})
```


提交代码

```bash
# 查看当前被修改的文件
git status
# 暂存文件
git add .
# 提交到本地
git commit -m 'feat(house): 完成删除房屋的功能'
```