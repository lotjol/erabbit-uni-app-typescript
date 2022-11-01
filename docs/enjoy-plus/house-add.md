# 添加房屋

添加房屋是为登录用户提供的一个创建房屋信息的功能，在添加了房屋的基础之上才能实现在线报修和访客通知证的功能。

```bash
# 查看当前分支，要求在 main 分支
git branch
# 查看当前是否存在未提交的代码
git status
# 创建新功能分支
git checkout -b feat-house
```

## 1.1 地理定位

根据用户所在的位置定位到周围的小区或者根据用户指定的一个位置定位到周围小区，要实这个功能需要用到小程序的两个 API 分别为：

- `getLocation` 获取用户所在位置的经纬度
- `chooseLocation` 用户指定位置的经纬度

在小程序中调用这两个接口时必须要在 `app.json` 中申请调用权限：

```json
{
  "requiredPrivateInfos": [
    "getLocation",
    "chooseLocation"
  ],
  "permission": {
    "scope.userLocation": {
      "desc": "你的位置信息将用于小程序位置接口的效果展示"
    }
  },
}
```

### 1.1.1 用户所在位置经纬度

在页面加载时调用 `wx.getLocation` 获取用户所在位置的经纬度：

```javascript
Page({
  onLoad() {
    // 获取用户所在位置周围小区
    this.getLocation()
  },
  async getLocation() {
    // 用户所在位置经纬度
    const { latitude, longitude } = await wx.getLocation()
    // 查看经纬度
    console.log(latitude, longitude)
  },
})
```

### 1.1.2 用户指定位置经纬度

用户点击【重新定位】按钮时调用 `wx.chooseLocation` 获取用户指定位置的经纬度：

```xml{6}
<!-- house_pkg/pages/locate/index.wxml -->
<authorization>
  <view class="locate">
    <van-cell-group border="{{false}}" title="当前地点">
      <van-cell title="建材城西路9号" border="{{false}}">
        <text class="enjoy-icon icon-locate">重新定位</text>
      </van-cell>
    </van-cell-group>
    <van-cell-group border="{{false}}" title="附近社区">
      <van-cell title="建材城西路9号" link-type="navigateTo" url="/house_pkg/pages/building/index" is-link />
      <van-cell title="建材城西路9号" link-type="navigateTo" url="/house_pkg/pages/building/index" is-link />
      <van-cell title="建材城西路9号" link-type="navigateTo" url="/house_pkg/pages/building/index" is-link />
    </van-cell-group>
  </view>
</authorization>
```

在事件回调函数 `chooseLocation` 中调用 API：

```javascript{13-18}
// house_pkg/pages/locate/index.js
Page({
  onLoad() {
    // 获取用户所在位置周围小区
    this.getLocation()
  },
  async getLocation() {
    // 用户所在位置经纬度
    const { latitude, longitude } = await wx.getLocation()
    // 查看经纬度
    console.log(latitude, longitude)
  },
  async chooseLocation() {
    // 用户所在位置经纬度
    const { latitude, longitude } = await wx.chooseLocation()
    // 查看经纬度
    console.log(latitude, longitude)
  },
})
```

## 1.2 腾讯位置服务

腾讯位置服务为微信小程序提供了基础的标点能力、线和圆的绘制接口等地图组件和位置展示、地图选点等地图API位置服务能力支持，使得开发者可以自由地实现自己的微信小程序产品。 在此基础上，腾讯位置服务微信小程序 [JavaScript SDK](https://lbs.qq.com/miniProgram/jsSdk/jsSdkGuide/jsSdkOverview) 是专为小程序开发者提供的LBS数据服务工具包，可以在小程序中调用腾讯位置服务的POI检索、关键词输入提示、地址解析、逆地址解析、行政区划和距离计算等数据服务，让您的小程序更强大！

::: tip 提示:
腾讯位置服务必须要注册账号申请密钥并且在小程序管理后台设置 request 合法域名: https://apis.map.qq.com 后才可以使用。
:::

### 1.2.1 逆地址解析

根据经纬度查询周围小区用到的是**逆地址解析**的功能，所谓的逆地址解析是指根据经纬度获取位置的相关描述，在申请完密钥后下载微信小程序 [Javascript SDK](https://mapapi.qq.com/web/miniprogram/JSSDK/qqmap-wx-jssdk1.2.zip) 调用其提供的方法即可实现查询周围小区的功能。

下载并解压后将 Javascript SDK 放到 `libs` 目录下，然后到 `utils/qqmap.js` 中配置腾讯位置服务的密钥。

```javascript
import QQMapWX from '../libs/qqmap-wx-jssdk.min'

// 获取用户当前所在位置
export default new QQMapWX({
  // 填写自已在腾讯地图创建应用的 key
  key: '填写自已申请的密钥',
})
```

然后在调用 SDK 提供的 `reverseGeocoder` 方法获取位置描述：

```javascript{11-12,17-18,21-32}
// 导入腾讯位置服务提供的 Javascript SDK
import qqMap from '../../../utils/qqmap'
Page({
  onLoad() {
    // 获取用户所在位置周围小区
    this.getLocation()
  },
  async getLocation() {
    // 用户所在位置经纬度
    const { latitude, longitude } = await wx.getLocation()
    // 调用 SDK 提共的方法
    this.getPoint(latitude, longitude)
  },
  async chooseLocation() {
    // 用户所在位置经纬度
    const { latitude, longitude } = await wx.chooseLocation()
    // 调用 SDK 提共的方法
    this.getPoint(latitude, longitude)
  },

  getPoint(latitude, longitude) {
    // 显示加载状态
    wx.showLoading({ title: '正在加载...', mask: true })
    // 逆地址解析（根据经纬度查询位置相关描述）
    qqMap.reverseGeocoder({
      location: [latitude, longitude].join(','),
      success: ({ result: { address } }) => {
        // 结果为当前所在的地址
        this.setData({ address })
      },
    })
  },
})
```

将获取的的位置描述展示到页面当中：

```xml{6}
<!-- house_pkg/pages/locate/index -->
<authorization>
  <view class="locate">
    <van-cell-group border="{{false}}" title="当前地点">
      <van-cell title="{{address}}" border="{{false}}">
        <text bind:tap="chooseLocation" class="enjoy-icon icon-locate">重新定位</text>
      </van-cell>
    </van-cell-group>
    <van-cell-group border="{{false}}" title="附近社区">
      <van-cell title="建材城西路9号" link-type="navigateTo" url="/house_pkg/pages/building/index" is-link />
      <van-cell title="建材城西路9号" link-type="navigateTo" url="/house_pkg/pages/building/index" is-link />
      <van-cell title="建材城西路9号" link-type="navigateTo" url="/house_pkg/pages/building/index" is-link />
    </van-cell-group>
  </view>
</authorization>
```

### 1.2.2 地点搜索

地点搜索，搜索周边poi，比如：“酒店” “餐饮” “娱乐” “学校” 等等，调用 SDK 提供的 `search` 方法：

```javascript{33-58}
// 导入腾讯位置服务提供的 Javascript SDK
import qqMap from '../../../utils/qqmap'
Page({
  onLoad() {
    // 获取用户所在位置周围小区
    this.getLocation()
  },
  async getLocation() {
    // 用户所在位置经纬度
    const { latitude, longitude } = await wx.getLocation()
    // 调用 SDK 提共的方法
    this.getPoint(latitude, longitude)
  },
  async chooseLocation() {
    // 用户所在位置经纬度
    const { latitude, longitude } = await wx.chooseLocation()
    // 调用 SDK 提共的方法
    this.getPoint(latitude, longitude)
  },

  getPoint(latitude, longitude) {
    // 显示加载状态
    wx.showLoading({ title: '正在加载...', mask: true })
    // 逆地址解析（根据经纬度查询位置相关信息）
    qqMap.reverseGeocoder({
      location: [latitude, longitude].join(','),
      success: ({ result: { address } }) => {
        // 更新数据，重新渲染
        this.setData({ address })
      },
    })

    // 搜索周边
    qqMap.search({
      // 搜索关键字（查询周边的小区）
      keyword: '住宅小区',
      // 指定经纬度
      location: [latitude, longitude].join(','),
      // 查询数据条数
      page_size: 5,
      success: (res) => {
        // 处理得到的地点信息（过滤掉多余数据）
        const points = []
        res.data.forEach(({ id, title, _distance }) => {
          points.push({ id, title, _distance })
        })

        // 更新数据，重新渲染
        this.setData({ points })
      },
      fail() {
        wx.utils.toast('没有找附近的小区!')
      },
      complete: () => {
        // 隐藏加载状态
        wx.hideLoading()
      },
    })
  },
})
```

获取到数据后将周边的小区渲染到页面当中：

```xml{10}
<!-- house_pkg/pages/locate/index -->
<authorization>
  <view class="locate">
    <van-cell-group border="{{false}}" title="当前地点">
      <van-cell title="{{address}}" border="{{false}}">
        <text bind:tap="chooseLocation" class="enjoy-icon icon-locate">重新定位</text>
      </van-cell>
    </van-cell-group>
    <van-cell-group border="{{false}}" title="附近社区">
      <van-cell wx:for="{{points}}" wx:key="id" title="{{item.title}}" link-type="navigateTo" url="/house_pkg/pages/building/index" is-link />
    </van-cell-group>
  </view>
</authorization>
```

提交代码

```bash
# 查看当前被修改的文件
git status
# 暂存文件
git add .
# 提交到本地
git commit -m 'feat(house): 查询周边小区' 
```

## 1.3 选择楼栋

在用户确定了某个小区后再选择该小区对应的楼栋信息，但是由于楼栋信息不易自动获取，只能伪造一些数据，利用随机数来生成一个楼号即可。

第一步先跳转到选择楼栋页面

```xml{14}
<!-- house_pkg/pages/locate/index -->
<authorization>
  <view class="locate">
    <van-cell-group border="{{false}}" title="当前地点">
      <van-cell title="{{address}}" border="{{false}}">
        <text bind:tap="chooseLocation" class="enjoy-icon icon-locate">重新定位</text>
      </van-cell>
    </van-cell-group>
    <van-cell-group border="{{false}}" title="附近社区">
      <van-cell
        wx:for="{{points}}"
        wx:key="id"
        title="{{item.title}}"
        bind:tap="goBuilding"
        mark:point="{{item.title}}"
        is-link
      />
    </van-cell-group>
  </view>
</authorization>
```

::: tip 提示:
van-cell 组件本身支持页面跳转，为其指定一个 url 属性即可，但是本节中咱们监听点击事件通过 wx.navigateTo 实现跳转，这样做的目的是讲解一个 mark:*="xxx" 的应用。
:::

上述代码中 `mark:*="xxx"` 是用来向事件回调传递参数的一种方式，它的功能有点类似于自定义属性 `data-*`。

```javascript{6-10}
// house_pkg/pages/locate/index.js
Page({
  async getLocation() {/***/},
  async chooseLocation() {/***/},
  getPoint(latitude, longitude) {/***/},
  goBuilding(ev) {
    wx.navigateTo({
      url: '/house_pkg/pages/building/index?point=' + ev.mark.point,
    })
  },
})
```

第二步随机伪造楼栋信息

```javascript
// house_pkg/pages/building/index.js
Page({
  data: {
    point: '',
    size: 0,
    type: '',
  },
  onLoad({ point }) {
    // 伪造数进行渲染
    this.fake(point)
  },

  fake(point) {
    // 伪造楼栋/号数据（仅用于授课）
    const size = Math.floor(Math.random() * 4) + 3
    const type = size > 4 ? '号楼' : '栋'
    // 更新数据，重新渲染
    this.setData({ point, size, type })
  }
})
```

伪造的数据没有特别的要求，只要产生一系列的随机数即可，另外小程序中 `wx:for` 支持以纯数字方式重复执行：

```xml
<view wx:for="{{5}}">我会重复5次</view>
```

将生成的随机数渲染页面当中

```xml{5-12}
<!-- house_pkg/pages/building/index -->
<authorization>
  <view class="building">
    <van-cell-group border="{{false}}">
      <van-cell
        wx:for="{{size}}"
        wx:key="*this"
        title="{{point}} {{item + 1}}{{type}}"
        mark:building="{{item + 1}}{{type}}"
        bind:tap="goRoom"
        is-link
      />
    </van-cell-group>
  </view>
</authorization>
```

## 1.4 选择房间

在用户确定了某个小区的楼栋信息后，再伪造一些数据，利用随机数来生成房间号。

第一步先跳转到选择楼房间页面

```xml{10}
<!-- house_pkg/pages/building/index -->
<authorization>
  <view class="building">
    <van-cell-group border="{{false}}">
      <van-cell
        wx:for="{{size}}"
        wx:key="*this"
        title="{{point}} {{item + 1}}{{type}}"
        mark:building="{{item + 1}}{{type}}"
        bind:tap="goRoom"
        is-link
      />
    </van-cell-group>
  </view>
</authorization>
```

::: tip 提示:
van-cell 组件本身支持页面跳转，为其指定一个 url 属性即可，但是本节中咱们监听点击事件通过 wx.navigateTo 实现跳转，这样做的目的是讲解一个 mark:*="xxx" 的应用。
:::

```javascript{14-19}
// house_pkg/pages/building/index.js
Page({
  onLoad({ point }) {
    // 伪造数进行渲染
    this.fake(point)
  },
  fake(point) {
    // 伪造楼栋/号数据（仅用于授课）
    const size = Math.floor(Math.random() * 4) + 3
    const type = size > 4 ? '号楼' : '栋'
    // 更新数据，重新渲染
    this.setData({ point, size, type })
  },
  goRoom(ev) {
    // 跳转到选择房间页面
    wx.navigateTo({
      url: `/house_pkg/pages/room/index?point=${this.data.point}&building=${ev.mark.building}`,
    })
  },
})
```

伪造的数据没有特别的要求，只要产生一系列的随机数即可。

```javascript
// house_pkg/pages/room/index.js
Page({
  onLoad({ point, building }) {
    // 伪造房间数据
    this.fake(point, building)
  },

  fake(point, building) {
    // 伪造房间号数据（仅用于授课）
    const size = Math.floor(Math.random() * 5) + 4
    const rooms = []

    // 随生生成若干个房间号
    for (let i = 0; i < size; i++) {
      // 随机楼层号
      const floor = Math.floor(Math.random() * 20) + 1
      // 随机房间号
      const No = Math.floor(Math.random() * 3) + 1
      // 组合楼层和房间号
      const room = [floor, 0, No].join('')
      // 不允许重复的房间号
      if (rooms.includes(room)) continue
      // 记录房间号
      rooms.push(room)
    }

    // 更新数据，重新渲染
    this.setData({ rooms, point, building })
  },
})
```
渲染随机生成的数据到页面当中：

```xml{5-12}
<!-- house_pkg/pages/room/index.wxml -->
<authorization>
  <view class="room">
    <van-cell-group border="{{false}}">
      <van-cell
        wx:for="{{rooms}}"
        wx:key="*this"
        title="{{point}}{{building}} {{item}}"
        mark:room="{{item}}"
        bind:tap="goForm"
        is-link
      />
    </van-cell-group>
  </view>
</authorization>
```

至此咱们就完整的选择了用户的小区、楼栋、房间号，接下来将这些信息做为地址参数传递到下一个表单页面来完善房屋的具体信息，如业主姓名、手机号等。

```javascript{11-17}
// house_pkg/pages/room/index.js
Page({
  onLoad({ point, building }) {
    // 伪造房间数据
    this.fake(point, building)
  },

  fake(point, building) {
    // ...
  },
  goForm(ev) {
    // 获取小区和楼栋信息
    const { point, building } = this.data
    wx.navigateTo({
      url: `/house_pkg/pages/form/index?point=${point}&building=${building}&room=${ev.mark.room}`,
    })
  },
})
```

## 1.5 添加房屋信息

### 1.5.1 获取地址参数

通过地址参数传递了小区名、楼栋号和房间号等信息，这些信息不仅要展示在页面当中，在提交数据时也需要发送到服务端。

```javascript
// house_pkg/pages/form/index.js
Page({
  data: {},
  onLoad({ point, building, room }) {
    // 获取并记录地址参数
    this.setData({ point, building, room })
  },
})
```
将获取的小区名、楼栋号和房间号等信息展示到页面当中：

```xml{6}
<!-- house_pkg/pages/from/index.wxml -->
<authorization>
  <scroll-view enhanced show-scrollbar="{{false}}" scroll-y>
    <view class="form">
      <van-cell-group border="{{false}}" title="房屋信息">
        <van-cell title="{{point}}{{building}} {{room}}" border="{{false}}" />
      </van-cell-group>
      <van-cell-group border="{{false}}" title="业主信息">
        <van-field label="姓名" placeholder="请填写您的真实姓名" />
        ...
      </van-cell-group>
      ...
    </view>
  </scroll-view>
  ...
</authorization>
```

### 1.5.2 表单数据校验

在 `house_pkg/pages/form/index.wxml` 中用 `model:value` 分别获取业主姓名、业主性别、业主手机号数据，在获取数据时为业主性别指定默认值为男，`gender` 的初值 `1` 为数值类型。

在获取到业主姓名、业主性别、业主手机号后对这些进行验证：

```javascript{14-41}
// house_pkg/pages/form/index.js
Page({
  data: {
    gender: 1,
    name: '',
    mobile: '',
    idcardFrontUrl: '',
    idcardBackUrl: '',
  },
  onLoad({ point, building, room }) {
    // 获取并记录地址参数
    this.setData({ point, building, room })
  },
  // 验证业主姓名
  verifyName() {
    // 验证业主姓名（必须为汉字）
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
  verifyPicture() {
    // 图片地址不能为空
    const valid = !!this.data.idcardBackUrl && !!this.data.idcardFrontUrl
    // 验证结果提示
    if (!valid) wx.utils.toast('请上传身份证照片!')
    // 返回验证结果
    return valid
  },
})
```

点击提交审核按钮后验证表单的数据

```xml{6}
<!-- house_pkg/pages/form/index.wxml -->
<authorization>
  <scroll-view enhanced show-scrollbar="{{false}}" scroll-y>
    ...
  </scroll-view>
  <view class="toolbar" bind:tap="submitForm">
    <text class="enjoy-icon icon-check"></text>
    <text class="button-text">提交审核</text>
  </view>
</authorization>
```

```javascript{51-56}
// house_pkg/pages/form/index.js
Page({
  data: {
    gender: 1,
    name: '',
    mobile: '',
    idcardFrontUrl: '',
    idcardBackUrl: '',
  },
  onLoad({ point, building, room }) {
    // 获取并记录地址参数
    this.setData({ point, building, room })
  },
  // 验证业主姓名
  verifyName() {
    // 验证业主姓名（必须为汉字）
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
  verifyMobile() {
    // 验证手机号
    const reg = /^[1][3-8][0-9]{9}$/
    const valid = reg.test(this.data.mobile)
    // 验证结果提示
    if (!valid) wx.utils.toast('请填写正确的手机号码!')
    // 返回验证结果
    return valid
  },
  verifyPicture() {
    // 图片地址不能为空
    const valid = !!this.data.idcardBackUrl && !!this.data.idcardFrontUrl
    // 验证结果提示
    if (!valid) wx.utils.toast('请上传身份证照片!')
    // 返回验证结果
    return valid
  },
  async submitForm() {
    // 逐个验证表单的数据
    if (!this.verifyName()) return
    if (!this.verifyMobile()) return
    if (!this.verifyPicture()) return
  }
})
```

### 1.5.3 上传身份证照片

为了验证业主的真实身份需要将身份证正反面照片上传，本页中有个交互需要跟大家交待一下：

```xml{6-10,13-17}
<!-- house_pkg/pages/form/index.wxml -->
...
<view class="id-card-upload">
  <van-cell title="本人身份证照片" label="请拍摄证件原件，并使照片中证件边缘完整，文字清晰，光线均匀。" />
  <view class="id-card-front">
    <view class="image-preview" wx:if="{{idcardFrontUrl}}">
      <view class="image-remove" mark:type="idcardFrontUrl" bind:tap="removePicture">x</view>
      <image src="{{idcardFrontUrl}}"></image>
    </view>
    <view class="upload-button" wx:else><text class="enjoy-icon icon-add"></text>上传人像面照片</view>
  </view>
  <view class="id-card-back">
    <view class="image-preview" wx:if="{{idcardBackUrl}}">
      <view class="image-remove" mark:type="idcardBackUrl" bind:tap="removePicture">x</view>
      <image src="{{idcardBackUrl}}"></image>
    </view>
    <view class="upload-button" wx:else><text class="enjoy-icon icon-add"></text>上传国徽面照片</view>
  </view>
</view>
...
```

根据身份证正反面图片的路径来判断是否要展示图片，如果不存在的情况下刚展示一个按钮，用户点击这个按钮再进行身份证照片的上传。

在身份证图片右上角位置还有个关闭的按钮，用户点击这个按钮会将身份证照片的路径删除，由于图片路径不存在了图片也不再显示，而是显示了一个上传按钮：

```javascript
// house_pkg/pages/form/index.js
Page({
  // ...
  removePicture(ev) {
    // 移除图片的类型（身份证正面或反面）
    const type = ev.mark.type
    this.setData({ [type]: '' })
  },
})
```

接下来为上传按钮添加点击事件：

```xml{12-13,26-27}
<!-- house_pkg/pages/from/index.wxml -->
<view class="id-card-upload">
  <van-cell title="本人身份证照片" label="请拍摄证件原件，并使照片中证件边缘完整，文字清晰，光线均匀。" />
  <view class="id-card-front">
    <view class="image-preview" wx:if="{{idcardFrontUrl}}">
      <view class="image-remove" mark:type="idcardFrontUrl" bind:tap="removePicture">x</view>
      <image src="{{idcardFrontUrl}}"></image>
    </view>
    <view
      wx:else
      class="upload-button"
      bind:tap="uploadPicture"
      mark:type="idcardFrontUrl"
    >
      <text class="enjoy-icon icon-add"></text>上传人像面照片
    </view>
  </view>
  <view class="id-card-back">
    <view class="image-preview" wx:if="{{idcardBackUrl}}">
      <view class="image-remove" mark:type="idcardBackUrl" bind:tap="removePicture">x</view>
      <image src="{{idcardBackUrl}}"></image>
    </view>
    <view
      wx:else
      class="upload-button"
      bind:tap="uploadPicture"
      mark:type="idcardBackUrl"
    >
      <text class="enjoy-icon icon-add"></text>上传国徽面照片
    </view>
  </view>
</view>
```

上述代码中添加了 `mark:type="idcardFrontUrl"` 和 `mark:type="idcardBackUrl"` 用来区分用户点击的是上传身份证正面还是身份证的反面，其中：

- `idcardFrontUrl` 表示身份证的正面
- `idcardBackUrl` 表示身份证的反面

在上传图片之前再来介绍小程序的一个 API [wx.chooseMedia](https://developers.weixin.qq.com/miniprogram/dev/api/media/video/wx.chooseMedia.html) 通过这个 API 用户可以打开相机拍照或从机册中选择图片，其语法格式如下所示：

```javascript
wx.chooseMedia({
  count: 1, // 只能选择1张图片
  mediaType: ['image'], // 只能选择图片类型
  sizeType: ['compressed'], // 默认为压缩模式
})
```

用户拍照或从机册中选择一张图片后将这张照片上传到服务器，接口信息如下所示：

- 接口路径：/upload
- 请求方法: POST
- 请求参数：
  - file 后端接收上传文件的名称
  - type 只有上传头像时才需要传该参数
- Headers：
  - Authorization
- 响应数据：[见文档](https://www.apifox.cn/apidoc/shared-8d66c345-7a9a-4844-9a5a-1201852f6faa/api-42672275)

```javascript
// house_pkg/pages/form/index.js
Page({
  // ...
  async uploadPicture(ev) {
    // 上传身份证照片的类别
    const type = ev.mark.type
    // 选择图片
    const media = await wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sizeType: ['compressed'],
    })

    // 调用接口上传图片
    wx.uploadFile({
      url: wx.http.baseURL + '/upload',
      filePath: media.tempFiles[0].tempFilePath,
      name: 'file',
      header: {
        Authorization: getApp().token,
      },
      success: (res) => {
        // 转换 json 数据
        const data = JSON.parse(res.data)
        // 检测接口调用结果
        if (data.code !== 10000) return wx.utils.toast('上传图片失败!')

        // 保存并预览图片地址
        this.setData({
          [type]: data.data.url,
        })
      },
    })
  }
})
```

### 1.6 提交表单

用户填写完全部信息后，调用接口将表单数据提交给服务端，接口的信息如下所示：

- 接口路径：/room
- 请求方法: POST
- 请求参数：
  - point 小区的名称，如育新花园
  - building 楼栋号，如 5号楼
  - room 房间号，如 302
  - name 业主姓名
  - gender 性别，0 表示女，1 表示男
  - mobile 业主手机号
  - idcardFrontUrl 身份证正面
  - idcardBackUrl 身份证反面
- Headers：
  - Authorization
- 响应数据：[见文档](https://www.apifox.cn/apidoc/shared-8d66c345-7a9a-4844-9a5a-1201852f6faa/api-41400753)

```javascript
// house_pkg/pages/form/index.wxml
Page({
  // ...
  async submitForm() {
    // 逐个验证表单的数据
    if (!this.verifyName()) return
    if (!this.verifyMobile()) return
    if (!this.verifyPicture()) return

    // 删除一些数据
    delete this.data.__webviewId__

    // 请求数据接口
    const { code } = await wx.http.post('/room', this.data)
    // 检测接口调用的结果
    if (code !== 10000) return wx.utils.toast('添加房屋失败!')

    // 成功后跳转至房屋列表
    wx.navigateBack({
      delta: 4,
    })
  },
})
```

::: tip 提示:
在提交表单据时 AppData 中包含有一个接口不需要的数据，使用 delete 将这个属性删除。
:::

提交代码:

```bash
# 查看当前被修改的文件
git status
# 暂存文件
git add .
# 提交到本地
git commit -m 'feat(house): 完成了房屋添加的功能'
```