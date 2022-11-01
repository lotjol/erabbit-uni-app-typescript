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
    houseInfo: '',
  },
  // ...
  selectHouse(ev) {
    // 获取用户选择房屋的名称
    const { name: houseInfo } = ev.detail
    // 页面中渲染
    this.setData({ houseInfo })
  },
  // ...
})
```
用户在房屋列表中选择了某个房屋项后需要高亮显示，只要添加 `active-cell` 类名即可：

```xml{4-5}
<!-- repair_pkg/pages/form/index.wxml -->
<van-cell-group border="{{false}}" title="报修房屋">
  <van-cell
    value="{{houseInfo || '请选择报修房屋'}}"
    value-class="{{houseInfo && 'active-cell'}}"
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
    repairItemName: '',
  },
  // ...
  selectRepairItem(ev) {
    // 获取用户选择的维修项目名称
    const { name: repairItemName } = ev.detail
    // 页面中渲染
    this.setData({ repairItemName })
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
  value-class="{{repairItemName && 'active-cell'}}"
  value="{{repairItemName || '请选择维修项目'}}"
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
    appointment: '',
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
  value="{{appointment || '请选择上门维修日期'}}"
  value-class="{{appointment && 'active-cell'}}"
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

## 1.3 维修项目

报修信息中的维修项目也是需要调接口来获取的。

- 接口路径：/repairItem
- 请求方法: GET
- 请求参数：无
- Headers：
  - Authorization
- 响应数据：[见文档](https://www.apifox.cn/apidoc/shared-8d66c345-7a9a-4844-9a5a-1201852f6faa/api-41400758)

```javascript{5,10-11,21-28}
// repair_pkg/pages/form/index.js
Page({
  data: {
    houseList: [],
    repairItem: [],
  },
  onLoad() {
    // 获取房屋列表
    this.getHouseList(),
    // 获取维修项目
    this.getRepairItem()
  },
  async getHouseList() {
    // 请求数据接口
    const { code, data: houseList } = await wx.http.get('/house')
    // 检测接口返回的结果
    if (code !== 10000) return wx.utils.toast('获取房屋列表失败!')
    // 数据渲染
    this.setData({ houseList })
  },
  async getRepairItem() {
    // 请求数据接口
    const { code, data: repairItem } = await wx.http.get('/repairItem')
    // 检测接口返回的数据
    if (code !== 10000) return wx.utils.toast('获取维修项目失败!')
    // 数据渲染
    this.setData({ repairItem })
  },
})
```

## 1.4 上传图片

本页中上传图片用了 `van-uploader` 组件，该组件有一个事件 `after-read` 当用户选择了一张图片后会触发该事件，在该事件执行文件上传的逻辑。

```xml{6}
<!-- repair_pkg/pages/form/index.wxml -->
<van-cell use-label-slot custom-style="padding-bottom: 0" title="问题附件" border="{{false}}">
  <view class="uploader" slot="label" style="margin-top: 20rpx;">
    <van-uploader
      preview-size="100"
      bind:after-read="afterRead"
      file-list="{{ fileList }}"
    />
  </view>
</van-cell>
```
```javascript
// repair_pkg/pages/form/index.js
Page({
  // ...
  afterRead(ev) {
    // console.log(ev.detail.file)
    // 临时文件
    const { file } = ev.detail
  },
})
```

在获取到临时图片路径后调用接口将其上传到服务器。

```javascript{4-6,13-30}
// repair_pkg/pages/form/index.js
Page({
  data: {
    attachment: [],
    // 这个数据不需要了，可以删除
    // fileList: []
  },
  // ...
  afterRead(ev) {
    // console.log(ev.detail.file)
    // 临时文件
    const { file } = ev.detail
    // 调用接口上传至服务器
    wx.uploadFile({
      url: wx.http.baseURL + '/upload',
      filePath: file.url,
      name: 'file',
      header: {
        Authorization: getApp().token,
      },
      success: (res) => {
        // 转换 json 数据
        const data = JSON.parse(res.data)
        // 上传完成需要更新
        const { attachment = [] } = this.data
        attachment.push({ ...data.data })
        // 渲染数据
        this.setData({ attachment })
      },
    })
  },
})
```

::: warning 注意:
在写静态页面时存图片路径使用的是 `fileList` 数据，实际咱们改成了 `attchment` 原因是跟后端接口的需要对应起来。
:::

`van-uploader` 支持上文件的数量，通过 `max-count` 属性进行设置。

```xml{7-8}
<!-- repair_pkg/pages/form/index.wxml -->
<van-cell use-label-slot custom-style="padding-bottom: 0" title="问题附件" border="{{false}}">
  <view class="uploader" slot="label" style="margin-top: 20rpx;">
    <van-uploader
      preview-size="100"
      bind:after-read="afterRead"
      max-count="6"
      file-list="{{attachment}}"
    />
  </view>
</van-cell>
```

提交代码:

```bash
# 查看当前被修改的文件
git status
# 暂存文件
git add .
# 提交到本地
git commit -m 'feat(repair): 完成报修信息的数据处理'
```

## 1.5 提交表单

- 接口路径：/repair
- 请求方法: POST
- 请求参数：
  - houseId 报修房屋的id
  - repairItemId 报修项目的id
  - mobile 报修人电话号码
  - appointment 预约上门维修时间
  - description 维修问题描述
  - attachment 维修问题照片
- Headers：
  - Authorization
- 响应数据：[见文档](https://www.apifox.cn/apidoc/shared-8d66c345-7a9a-4844-9a5a-1201852f6faa/api-41400754)

### 1.5.1 获取表单数据

先来获取接口文档所需要的全部参数：

首先补充获取维修房屋的 `id` 和 维修项目的 `id`，上一小节写交互逻辑时只获取到了维修房屋的名称和维修项目的名称。

```javascript{5-8,11-14}
// repair_pkg/pages/form/index.js
Page({
  // ...
  selectHouse(ev) {
    // 获取用户选择房屋的 id 和名称
    const { id: houseId, name: houseInfo } = ev.detail
    // 页面中渲染
    this.setData({ houseId, houseInfo })
  },
  selectRepairItem(ev) {
    // 获取用户选择的维修项目及 id
    const { id: repairItemId, name: repairItemName } = ev.detail
    // 页面中渲染
    this.setData({ repairItemId, repairItemName })
  },
})
```
然后再来获取报修人手机号码和报修问题描述，使用 `model:value` 双向数据绑定即可。

```xml{6,15}
<!-- repair_pkg/pages/form/index.wxml -->
...
<van-field
  title-width="88"
  label="手机号码"
  model:value="{{mobile}}"
  type="number"
  placeholder="请输入联系电话号码"
/>
<van-cell title-width="100" title="预约日期" value="{{appointment || '请选择上门维修日期'}}" value-class="{{appointment && 'active-cell'}}" bind:click="openDateLayer" is-link />
<van-cell use-label-slot title="问题描述">
  <van-field
    slot="label"
    border="{{false}}"
    model:value="{{description}}"
    autosize
    custom-style="padding: 0; font-size: 28rpx; min-height: 60rpx"
    type="textarea"
    placeholder-style="color: #c3c3c5;"
    placeholder="请填写报修内容，工作人员将快速帮您解决问题。"
  />
</van-cell>
...
```
### 1.5.2 验证表单数据

在调用接口提交表单数据前必须要对用户填写数据的合法性进行验证，本小节的内容课堂就不写代码了，要求大家能读懂就可以。

```javascript
// repair_pkg/pages/form/index.js
Page({
  // ...
  verifyHouse() {
    const valid = this.data.houseId !== ''
    // 验证结果提示
    if (!valid) wx.utils.toast('请选择房屋信息!')
    // 返回验证结果
    return valid
  },
  verifyRepair() {
    const valid = this.data.repairItemId !== ''
    // 验证结果提示
    if (!valid) wx.utils.toast('请选择维修项目!')
    // 返回验证结果
    return valid
  },
  verifyMobile() {
    // 验证手机号
    const reg = /^[1][3-8][0-9]{9}$/
    const valid = reg.test(this.data.mobile.trim())
    // 验证结果提示
    if (!valid) wx.utils.toast('请填写正确的手机号码!')
    // 返回验证结果
    return valid
  },
  verifyDate() {
    // 验证日期格式
    const reg = /^\d{4}\/\d{2}\/\d{2}$/
    const valid = reg.test(this.data.appointment)
    // 验证结果提示
    if (!valid) wx.utils.toast('请选择预约日期!')
    // 返回验证结果
    return valid
  },
  verifyDescription() {
    // 验证报修项目描述
    const valid = this.data.description.trim() !== ''
    // 验证结果提示
    if (!valid) wx.utils.toast('请填写问题描述!')
    // 返回验证结果
    return valid
  },
  // ...
})
```

### 1.5.3 调用接口

监听用户提交报修按钮的点击事件：

```xml{3}
<!-- repari_pkg/pages/form/index.wxml -->
...
<view class="toolbar" bind:tap="submitForm">
  <text class="enjoy-icon icon-repair"></text>
  <text class="button-text">提交报修</text>
</view>
...
```
获取并验证表单数据后调用后端数据据接口：

```javascript
Page({
  //...
  async submitForm() {
    // 逐个验证表单数据
    if (!this.verifyHouse()) return
    if (!this.verifyRepair()) return
    if (!this.verifyMobile()) return
    if (!this.verifyDate()) return
    if (!this.verifyDescription()) return
    // 解构获取接口需要的参数
    const { houseId, repairItemId, appointment, mobile, description, attachment } = this.data
    // 请求数据接口
    const { code } = await wx.http.post('/repair', {
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
  //...
})
```

提交代码

```bash
# 查看当前被修改的文件
git status
# 暂存文件
git add .
# 提交到本地
git commit -m 'feat(repair): 完成在线填写报修信息的功能'
```