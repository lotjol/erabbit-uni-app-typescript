# 框架接口

框架接口指的是小程序提供的一些全局函数，如之前学习到的 `App`、`Page`、`Component` 函数，本节再来学习另外几个有用的函数。

## 7.1 getApp

`getApp` 是一个全局的函数，调用该函数可以获取小程序应用实例，通过小程序应用实例可实现数据或方法的共享。

```javascript
// app.js
App({
  // 读取本地存储的token数据
  token: wx.getStorageSync('token'),
  onLaunch() {
    // 生命周期
  },
  http(params) {
    // 举例封装网络请求
    wx.request({
      ...params,
      header: {},
    })
  }
})
```

在任意页面和组件中调用 `getApp` 就可以获取小程序的实例（即上述代码）：

```javascript
// pages/index/index.js
// 获取小程序实例
const app = getApp()

Page({
  onLoad() {
    // 能够读取到全局实全名定义的 token 数据
    console.log(app.token)

    // 调用全局实例中定义的方法
    app.http({
      url: '',
      method: 'GET'
    })
  },
})
```

::: tip 提示:
小程序启动时会执行 app.js 为不了影响小程序的打开速度，不建议在 app.js 中处理复杂耗时的数据。
:::

## 7.2 getCurrentPages

`getCurrentPages` 获取当前页面栈，页面栈中包含的是页面的实例，数组中第一个元素为首页，最后一个元素为当前页面。

::: warning 注意:
不要在 App.onLaunch 的时候调用 getCurrentPages()，此时 page 还没有生成。
:::

```javascript
// pages/index/index.js
Page({
  onLoad() {
    // 获取页面历史栈
    const pageStack = getCurrentPages()
    // 获取前一个页面的页面实例
    const prevPage = pageStack[pageStack.length - 1]
  }
})
```

获取到页面栈后根据数组的索引值可以获取到页面实例，通过页面实例可以获取页面中的数据或执行页面的某些逻辑。


## 7.3 Behavior（视情况扩展）

类似 Vue 的 `mixin` 的功能，能够将一些公共的逻辑抽离到单独的模块当中。

```javascript
// pages/index/my-behavior.js
// 注册一个 behavior
export default Behavior({
  // 定义初始数据：与 Page 中定义的 data 含义一致
  data: {
    version: 'v1.0.0'
  },
  // 定义方法：与 Page 中定义方法含义一致
  methods: {
    getVersion() {
      return this.data.version
    }
  }
})
```
上述代码在 `data` 中初始了一个数据 `version`，在 `methods` 中定义了一个方法 `getVersion`，接下来**将这个 `Behavior` 对象注入到页面中**，在页面中就能够调用 `this.getVersion()` 就可以获取 `version` 对应的数据了：

```javascript
// pages/index/index.js
import myBehavior from './my-behavior'
Page({
  // 将 myBehavior 注入到页面当中
  behaviors: [myBehavior],
  onLoad() {    
    // 该方法来自于 myBehavior 当中
    this.getVersion()
    // 可以访问到在 myBehavior 中初始的数据
    console.log(this.data.version)
  }
})
```

在 `Page` 中通过 `behaviors` 来注入 `Behavior` 对象，这样 `Behavior` 中定义的数据就可以在页面中使用了。