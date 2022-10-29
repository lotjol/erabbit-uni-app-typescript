# 在线报修

在线报修用户在线填写报修信息的功能，所涉及的功能主要是文件上传、表单验证等技术点。

## 1.1 用户交互

本页面共有3个交互，分别用到了 `van-action-sheet` 、 `van-datetime-picker` 以及 `van-popup` 组件，使用 3 个数据控制是否展示组件的内容：

- houseLayerVisible 是否展示房屋列表
- repairLayerVisible 是否展示维修项目
- dateLayerVisible 是否显示日期选择

通过改变这3个数据的值来切换组件的显示/隐藏。

接下来我们要做的是获取用户在房屋列表中选择的房屋、在维修项目列表中选择的维修项目以及预约上门维修的日期。

首先来看选择房屋列表：

`van-action-sheet` 组件在用户选择了一个列表项后会触发 `select` 事件，在事件回调函数中获取用户所选择的列表项的内容

```xml{7}
...
<!-- 房屋列表 -->
<!-- repair_pkg/pages/form/index.wxml -->
<van-action-sheet
  bind:close="closeHouseLayer"
  bind:cancel="closeHouseLayer"
  bind:select="selectHouse"
  round
  show="{{ houseLayerVisible }}"
  actions="{{ houseList }}"
  cancel-text="取消"
  title="选择报修房屋"
/>
...
```

```javascript
// repair_pkg/pages/form/index.js
Page({
  data: {
    houseInfo: '请选择报修房屋',
  },
  // ...
  selectHouse(ev) {
    // 获取用户选择房屋的 id 和名称
    const { id: houseId, name: houseInfo } = ev.detail
    // 页面中渲染
    this.setData({ houseId, houseInfo })
  },
  // ...
})
```
用户在房屋列表中选择了某个房屋项后需要高亮显示，只要添加 `active-cell` 类名即可：

```xml{4-5}
<!-- repair_pkg/pages/form/index.wxml -->
<van-cell-group border="{{false}}" title="报修房屋">
  <van-cell
    value="{{houseInfo}}"
    value-class="{{houseInfo !== '请选择报修房屋' && 'active-cell'}}"
    bind:click="openHouseLayer"
    is-link
    border="{{false}}"
  />
</van-cell-group>
```

其次来看选择维修项目：

维修项目同样用到了 `van-action-sheet` 组件，其处理的步骤和上一小节房屋列表选择一样：

```xml{5}
<!-- repair_pkg/pages/form/index.wxml -->
<van-action-sheet
  bind:close="closeRepairLayer"
  bind:cancel="closeRepairLayer"
  bind:select="selectRepairItem"
  round
  show="{{ repairLayerVisible }}"
  actions="{{ repairItem }}"
  cancel-text="取消"
  title="选择维修项目"
/>
```
```javascript
// repair_pkg/pages/form/index.js
Page({
  data: {
    repairItemName: '请选择维修项目',
  },
  // ...
  selectRepairItem(ev) {
    // 获取用户选择的维修项目及 id
    const { id: repairItemId, name: repairItemName } = ev.detail
    // 页面中渲染
    this.setData({ repairItemId, repairItemName })
  }
  // ...
})
```

用户在维修项目列表中选择了某个维修项后需要高亮显示，只要添加 `active-cell` 类名即可：

```xml{5,6}
<!-- repair_pkg/pages/form/index.wxml -->
<van-cell
  title-width="100"
  title="维修项目"
  bind:click="openRepairLayer"
  value-class="{{houseInfo !== '请选择维修项目' && 'active-cell'}}"
  value="{{repairItemName}}"
  is-link
/>
```

最后来获取用户选择的日期，日期用到的组件为 `van-datetime-picker`，当用户选择了时间后会触发 `confirm` 事件：

```xml{7-8}
<!-- repair_pkg/pages/form/index.wxml -->
<van-popup bind:close="closeDateLayer" round show="{{dateLayerVisible}}" position="bottom">
  <van-datetime-picker
    type="date"
    value="{{currentDate}}"
    min-date="{{minDate}}"
    bind:cancel="closeDateLayer"
    bind:confirm="selectDate"
  />
</van-popup>
```

```javascript
// repair_pkg/pages/form/index.js
Page({
  data: {
    repairItemName: '请选择维修项目',
  },
  // ...
  selectDate(ev:) {
    this.setData({
      dateLayerVisible: false,
      appointment: wx.utils.formatDate(ev.detail),
    })
  },
  // ...
})
```

将选择好的时间以高这的方式显示：

```xml
<!-- repair_pkg/pages/form/index.wxml -->
<van-cell
  title-width="100"
  title="预约日期"
  value="{{appointment}}"
  value-class="{{appointment !== '请选择上门维修日期' ? 'active-cell' : ''}}"
  bind:click="openDateLayer"
  is-link
/>
```

到此我们将页面中涉及到交互的部分就处理完毕了。

提交代码

```bash
# 查看当前被修改的文件
git status
# 暂存文件
git add .
# 提交到本地
git commit -m 'feat(repair): 完成在线报修的交互处理'
```