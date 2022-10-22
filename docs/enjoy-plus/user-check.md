# 登录检测

享+社区项目只有3个页面是不需要用户登录就能访问的，其它的页面要求用户必须是登录状态的，这一节我们来封装一些逻辑来检测用户是否是登录状态，如果不是则重定向到登录页，等用户完成登录后再跳转到用户本来要访问的页面。

```bash
# 查看当前在哪个分支
git branch
# 创建并切换分支
git checkout -b feat-user
```

我们通过本地存储的 `token` 来判断用户的登录状态，在小程序启动时读取本地存储并记录到应用实例当中，方便其它页面全局访问：

```javascript
// app.js
App({
  onLaunch() {
    // 读取 token
    this.getToken()
  },
  getToken() {
    // 异步方式不会阻塞
    wx.getStorage({
      key: 'token',
      success: ({ data }) => {
        // this 指向应用实例
        this.token = data
      },
      fail() {},
    })
  }
})
```

::: tip 提示:
我们并未在本存储过 `token` 数据，所以读取的数据会是一个空字符串。
:::

小程序中不支持路由拦截，需要开发者自行封装路由拦截的功能，实践有许多的实现思路，本项目采用封装组件的方式实现。

主要的步骤：

1. 封装名称为 `authorization` 的组件
2. 在生命周期函数中读取全局中记录的 `token` 数据
3. 获取当前页面的路径，在未登陆的情况下通过地址参数传给登录页面

## 1.1 封装组件

在根目录创建 `components/authorization` 目录，然后在 `app.json` 中全局注册该组件：

```json
{
  ...
  "usingComponents": {
    "authorization": "/components/authorization/index"
  }
  ...
}
```

接下来在【房屋列表】页面应用 `authorization` 组件：

```xml
<!-- house_pkg/pages/list/index.wxml -->
<authorization>
  <block wx:if="{{true}}">
    ...
  </block>
  <view wx:else class="blank">
    您还没有认证房屋，请点击 <navigator hover-class="none" class="link" url=" ">添加</navigator>
  </view>
</authorization>
```

当前 `authorization` 组件是没有执行任何逻辑的，接下来咱们去组件中添加插槽 `slot`:

```xml
<!-- 用户未登录就不显示页面的内容 -->
<slot wx:if="{{isLogin}}"></slot>
```
此时跳转到【房屋列表】时会出现空白的内容，原因是 `isLogin` 的值当前为 `undefined` 即为 `false` 假值。

## 1.2 读取登录状态

上一小节中 `isLogin` 的数并未进行初始化且为假值，接下来咱们在生命周期函数 `attached` 中读取一个用户的登录状态：

```javascript
// components/authorization/index.js
Component({
  data: {
    isLogin: false,
  },
  // 生命周期函数
  lifetimes: {
    attached() {
      // 登录状态
      const isLogin = !!getApp().token
      // 记录登录状态
      this.setData({ isLogin })
      // 未登录重定向到登录页
      if (!isLogin) {
        // 引导用户到登录页面
        wx.redirectTo({
          url: `/pages/login/index`,
        })
      }
    },
  },
})
```

## 1.3 获取页面路径

在用户完成登录后页面要回到用户原本要访问的页面，要实现这个功能需要咱们先获取**用户正在访问的页面路径**，然后把这个路径传给登录页面，这样在登录成功后便可以再跳转到回这个页面了，获取页面路径的方法如下：

```javascript{15-25}
// components/authorization/index.js
Component({
  data: {
    isLogin: false,
  },
  // 生命周期函数
  lifetimes: {
    attached() {
      // 登录状态
      const isLogin = !!getApp().token
      // 记录登录状态
      this.setData({ isLogin })
      // 未登录重定向到登录页
      if (!isLogin) {
        // 读取当前历史栈
        const pageStack = getCurrentPages()
        // 取出当前页面路径，登录成功能跳转到该页面
        const currentPage = pageStack[pageStack.length - 1]
        // 取出当前页面路径，登录成功能跳转到该页面
        const redirectURL = currentPage.route
        // 引导用户到登录页面
        wx.redirectTo({
          url: `/pages/login/index?redirectURL=/${redirectURL}`,
        })
      }
    },
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
git commit -m 'feat(user): 完成用户登录状态检测'
```