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

```xml{4}
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
```

在事件回调函数 `chooseLocation` 中调用 API：

```javascript{12-17}
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

```xml{3}
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

```xml{8}
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

在用户确定了某个区后再选择该小区对应的楼栋信息，但是由于楼栋信息不易自动获取，只能伪造一些数据，利用随机数来生成一个楼号即可。

第一步先跳转页面到选择楼栋页面

```xml{12-13}
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
```

上述代码中 `mark:*="xxx"` 是用来向事件回调传递参数的一种方式，它的功能有点类似于自定义属性 `data-*`。

```javascript{5-9}
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

## 1.4 选择房间

## 1.5 添加房屋信息