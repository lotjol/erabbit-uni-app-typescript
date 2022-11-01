# 邀请访客

提供一个表单由用户主动填写访客信息。

## 1.1 用户交互

该页中的交互与在线报修相似都需要从 `van-action-sheet` 组件和 `van-datetime-picker` 获取用户选择的内容：

先来看 `van-action-sheet` 组件，监听 `close` 事件：

```xml{5}
<!-- visitor_pkg/pages/form/index.wxml -->
<van-action-sheet
  bind:close="closeHouseLayer"
  bind:cancel="closeHouseLayer"
  bind:select="selectHouse"
  round
  show="{{ houseLayerVisible }}"
  actions="{{ houseList }}"
  cancel-text="取消"
  title="选择房屋信息"
/>
```
`selectHouse` 回调方法中获取用户选择的房屋信息

```javascript
// visitor_pkg/pages/form/index.js
Page({
  // ...
  selectHouse(ev) {
    // 获取房到的信息数据
    const { id: houseId, name: houseInfo } = ev.detail
    // 页面中渲染
    this.setData({ houseId, houseInfo })
  },
  // ...
})
```

将用户选择的房屋信息渲染到页面中

```xml{5-6}
<!-- visitor_pkg/pages/form/index.wxml -->
...
<van-cell-group border="{{false}}" title="房屋信息">
  <van-cell
    value="{{houseInfo || '请选择房屋信息'}}"
    value-class="{{houseInfo && 'active-cell'}}" 
    border="{{false}}"
    bind:click="openHouseLayer"
    is-link
  />
</van-cell-group>
...
```

再来看 `van-datetime-picker` 组件，监听 `confirm` 事件：

```xml{4}
<!-- visitor_pkg/pages/form/index.wxml -->
<van-popup bind:close="closeDateLayer" round show="{{ dateLayerVisible }}" position="bottom">
  <van-datetime-picker
    bind:confirm="selectDate"
    value="{{ currentDate }}"
    type="date"
  />
</van-popup>
```
`selectDate` 回调方法中获取用户选择的日期

```javascript{4-5,8-15}
// visitor_pkg/pages/form/index.js
Page({
  data: {
    // 指定 `van-datetime-picker` 组件的起始日期
    currentDate: Date.now()
  },
  // ...
  selectDate(ev) {
    // 获取访客来访的时间
    this.setData({
      // 隐藏时间弹层
      dateLayerVisible: false,
      visitDate: wx.utils.formatDate(ev.detail)
    })
  },
  // ..
})
```

将用户选择的日期渲染到页面中

```xml{7-8}
<!-- visitor_pkg/pages/form/index.wxml -->
...
<van-cell
  title-width="200rpx"
  title="访问日期"
  border="{{false}}"
  value="{{visitDate || '请选择访问日期'}}"
  value-class="{{visitDate && 'active-cell'}}"
  bind:click="openDateLayer"
  is-link
/>
...
```

## 1.2 房屋列表

在线填写报修信息时用户需要选择自已账号下的房屋信息，需要调用一个接口来获取当前用户的房屋列表，然后用户再进行选择。

- 接口路径：/house
- 请求方法: GET
- 请求参数：无
- Headers：
  - Authorization
- 响应数据：[见文档](https://www.apifox.cn/apidoc/shared-8d66c345-7a9a-4844-9a5a-1201852f6faa/api-42635315)

```javascript
// repair_pkg/pages/form/index.js
Page({
  data: {
    houseList: [],
  },
  onLoad() {
    // 获取房屋列表
    this.getHouseList()
  },
  async getHouseList() {
    // 请求数据接口
    const { code, data: houseList } = await wx.http.get('/house')
    // 检测接口返回的结果
    if (code !== 10000) return wx.utils.toast('获取房屋列表失败!')
    // 数据渲染
    this.setData({ houseList })
  },
})
```

::: tip 提示:
这里只能查询到通过审核通过的房屋信息。
:::

## 1.3 表单验证

使用 `model:value` 分别获取访客姓名、访客性别、访客手机号3个数据。

```xml{4,10,15,21,29}
<!-- visitor_pkg/pages/form/index.wxml -->
<van-field
  label="姓名"
  model:value="{{name}}"
  placeholder="请输入访客真实姓名"
/>
...
<van-radio-group
  direction="horizontal"
  model:value="{{gender}}"
>
  <van-radio
    icon-size="36rpx"
    checked-color="#5591AF"
    name="{{1}}"
  >男
  </van-radio>
  <van-radio
    icon-size="36rpx"
    checked-color="#5591AF"
    name="{{0}}"
  >女
  </van-radio>  
</van-radio-group>
...
<van-field
  label="手机号"
  type="number"
  model:value="{{mobile}}"
  placeholder="请输入访客联系电话号码"
/>
```

本小节的内容课堂就不写代码了，要求大家能读懂就可以。

```javascript
// visitor_pkg/pages/form/index.js
Page({
  data: {
    gender: 1,
    name: '',
    mobile: ''
  },
  // ...
  verifyHouse() {
    const valid = this.data.houseId !== ''
    // 验证结果提示
    if (!valid) wx.utils.toast('请选择房屋信息!')
    // 返回验证结果
    return valid
  },
  // 验证业主姓名（必须为汉字）
  verifyName() {
    // 正则表达式
    const reg = /^[\u4e00-\u9fa5]{2,5}$/
    // 验证业主姓名
    const valid = reg.test(this.data.name.trim())
    // 验证结果提示
    if (!valid) wx.utils.toast('请填写真实中文姓名!')
    // 返回验证结果
    return valid
  },

  verifyMobile() {
    // 验证手机号
    const reg = /^[1][3-8][0-9]{9}$/
    const valid = reg.test(this.data.mobile)
    // 验证结果提示
    if (!valid) wx.utils.toast('请填写正确的手机号码!')
    // 返回验证结果
    return valid
  },
  // ...
})
```

### 1.4 调用接口

- 接口路径：/visitor
- 请求方法: POST
- 请求参数：
  - houseId 房屋id
  - name 访客姓名
  - gender 访客性别
  - mobile 访客手机号
  - visitDate 访客访问时间
- Headers：
  - Authorization
- 响应数据：[见文档](https://www.apifox.cn/apidoc/shared-8d66c345-7a9a-4844-9a5a-1201852f6faa/api-41400760)

监听用户【确认】按钮的点击事件：

```xml{3}
<!-- repair_pkg/pages/form/index.wxml -->
...
<view class="toolbar" bind:tap="submitForm">
  <text class="enjoy-icon icon-confirm"></text>
  <text class="button-text">确认</text>
</view>
...
```

获取并验证表单数据后调用后端数据据接口：

```javascript
Page({
  // ...
  async submitForm() {
    // 逐个验证表单的数据
    if (!this.verifyHouse()) return
    if (!this.verifyName()) return
    if (!this.verifyMobile()) return
    // 待提交的数据
    const { houseId, name, gender, mobile, visitDate } = this.data
    // 请求接口
    const { code, data } = await wx.http.post('/visitor', { houseId, name, gender, mobile, visitDate })
    // 检测接口调用结果
    if (code !== 10000) return wx.utils.toast('添加访客失败!')
    // 查看通行证
    wx.navigateTo({
      url: '/visitor_pkg/pages/passport/index?id=' + data.id,
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
git commit -m 'feat(repair): 完成访客邀请的功能'
```