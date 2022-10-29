# 个人资料

享+社区的个人资料包括用户昵称和头像两个部分，关于昵称和头像的获取在前面基础知识部分已经介绍过了，咱们把这部分知识应用到实际的项目当中。

个人资料页面必须在用户登录的情况才允许被访问，需要使用前面封装好的 `Authorization` 组件将**整个页面**包起来：

```xml
<Authorization>
  <view class="profile">
    <van-cell center title="头像">
      <van-icon slot="right-icon" name="arrow" size="16" color="#c3c3c5" />
      <button class="button" size="mini" hover-class="none" open-type="chooseAvatar">
        <image src="/static/images/avatar_1.jpg" class="avatar" ></image>
      </button>
    </van-cell>
    <van-field type="nickname" center label="昵称" input-align="right"  placeholder="请输入昵称" />
  </view>
</Authorization>
```

## 3.1 用户昵称

### 3.1.1 获取昵称

监听表单 `input` 的 `blur` 事件：

```xml{8}
<view class="profile">
  <van-cell center title="头像">
    <van-icon slot="right-icon" name="arrow" size="16" color="#c3c3c5" />
    <button class="button" size="mini" hover-class="none" open-type="chooseAvatar">
      <image src="/static/images/avatar_1.jpg" class="avatar"></image>
    </button>
  </van-cell>
  <van-field bind:blur="getUserNickName" type="nickname" center label="昵称" input-align="right" placeholder="请输入昵称" />
</view>
```

::: warning 提示:
在开发者工具中获取用户昵称监听表单的 blur 事件获取用户昵称时会有不稳定的现象（不能立即获取表单中的值），发布到真机时问题会自动修复。
:::

在事件回调中获取用户的昵称：

```javascript
Page({
  getUserNickName(ev) {
    // 获取用户的昵称内容
    console.log(ev.detail.value)
  },
})
```

### 3.1.2 调用接口

- 接口路径：/userInfo
- 请求方法: PUT
- 请求参数：
  - nickName 用户昵称
- Headers：
  - Authorization
- 响应数据：[见文档](https://www.apifox.cn/apidoc/shared-8d66c345-7a9a-4844-9a5a-1201852f6faa/api-42037730)


```javascript
Page({
  getUserNickName(ev) {
    // console.log(ev.detail.value)
    // 更新用户昵称
    this.updateNickName(ev.detail.value)
  },
  async updateNickName(nickName) {
    // 请求数据接口
    const { code } = await wx.http.put('/userInfo', { nickName })
    // 检测接口调用的结果
    if (code !== 10000) return wx.utils.toast('更新用户信息失败!')

    // 保存用户昵称
    this.setData({'userInfo.nickName': nickName})
  },
})
```

当用户未设置昵称时给用户指定一个默认的名称

```xml{8}
<view class="profile">
  <van-cell center title="头像">
    <van-icon slot="right-icon" name="arrow" size="16" color="#c3c3c5" />
    <button class="button" size="mini" hover-class="none" open-type="chooseAvatar">
      <image src="/static/images/avatar_1.jpg" class="avatar"></image>
    </button>
  </van-cell>
  <van-field bind:blur="getUserNickName" type="nickname" value="{{userInfo.nickName || '微信用户'}}" center label="昵称" input-align="right" placeholder="请输入昵称" />
</view>
```

## 3.2 用户头像

### 3.2.1 获取头像地址

监听表单的 `chooseavatar` 事件：

```xml{4}
<view class="profile">
  <van-cell center title="头像">
    <van-icon slot="right-icon" name="arrow" size="16" color="#c3c3c5" />
    <button open-type="chooseAvatar" bind:chooseavatar="getUserAvatar" class="button" size="mini" hover-class="none">
      <image src="/static/images/avatar_1.jpg" class="avatar"></image>
    </button>
  </van-cell>
  <van-field bind:blur="getUserNickName" type="nickname" value="{{userInfo.nickName || '微信用户'}}" center label="昵称" input-align="right"  placeholder="请输入昵称" />
</view>
```

在事件回调函数 `getUserAvatar` 中获取用户头像地址

```javascript{15-18}
Page({
  getUserNickName(ev) {
    // console.log(ev.detail.value)
    // 更新用户昵称
    this.updateNickName(ev.detail.value)
  },

  async updateNickName(nickName) {
    // 请求数据接口
    const { code } = await wx.http.put('/userInfo', { nickName })
    // 检测接口调用的结果
    if (code !== 10000) return wx.utils.toast('更新用户信息失败!')
  },

  getUserAvatar(ev) {
    // 用户头像地址
    console.log(ev.detail.avatarUrl)
  },
})
```

### 3.2.2 调用接口

- 接口路径：/upload
- 请求方法: POST
- 请求参数：
  - file 后端接收上传文件的名称
  - type 上传头像是传 avatar
- Headers：
  - Authorization
- 响应数据：[见文档](https://www.apifox.cn/apidoc/shared-8d66c345-7a9a-4844-9a5a-1201852f6faa/api-42672275)


```javascript
Page({
  // ...

  getUserAvatar(ev) {
    // 用户头像地址
    // console.log(ev.detail.avatarUrl)
    this.updateUserAvatar(ev.detail.avatarUrl)
  },

  updateUserAvatar(avatarUrl) {
    // 调用接口上传图片
    wx.uploadFile({
      url: wx.http.baseURL + '/upload',
      filePath: avatarUrl,
      name: 'file',
      header: {
        Authorization: getApp().token,
      },
      formData: {
        type: 'avatar',
      },
      success: (res) => {
        // 转换 json 数据
        const data = JSON.parse(res.data)
        // 检测接口调用结果
        if (data.code !== 10000) return wx.utils.toast('更新头像失败!')

        // 保存并预览图片地址
        this.setData({ 'userInfo.avatar': data.data.url })
      },
    })
  },
})
```

在页面预览上传成功后的用户头像


```xml{5}
<view class="profile">
  <van-cell center title="头像">
    <van-icon slot="right-icon" name="arrow" size="16" color="#c3c3c5" />
    <button open-type="chooseAvatar" bind:chooseavatar="getUserAvatar" class="button" size="mini" hover-class="none">
      <image src="{{userInfo.avatar || '/static/images/avatar_1.jpg'}}" class="avatar"></image>
    </button>
  </van-cell>
  <van-field bind:blur="getUserNickName" center label="昵称" input-align="right" type="nickname" placeholder="请输入昵称" />
</view>
```

::: tip 提示:
wx.uploadFile 文件上传时需要在小程序管理后台添加接口对应的域名。
:::

```bash
# 查看当前被修改的文件
git status
# 暂存文件
git add .
# 提交到本地
git commit -m 'feat(user): 完成用户昵称和头像填写功能'
```

## 3.3 获取用户资料

### 3.3.1 调用接口

获取用户资料是指在**我的** tabBar页面中调用接口获取用户的头像和昵称，上一小节我们已经为用户设置了昵称和头像，这一节只需要调用接口来获取这些数据即可：

- 接口路径：/userInfo
- 请求方法: GET
- 请求参数：无
- Headers：
  - Authorization
- 响应数据：[见文档](https://www.apifox.cn/apidoc/shared-8d66c345-7a9a-4844-9a5a-1201852f6faa/api-42037729)

```javascript
Page({
  onShow() {
    // 获取登录用户信息
    this.getUserInfo()
  },

  // 用户信息接口
  async getUserInfo() {
    // 请求数据接口
    const { code, data: userInfo } = await wx.http.get('/userInfo')
    // 校验数据是否合法
    if (code !== 10000) return wx.utils.toast('数据加载失败, 请稍后重试!')
    // 设置数据，更新渲染
    this.setData({ userInfo })
  },
})
```

::: tip 提示:
上述代码中调用接口是在 onShow 生命周期中完成的，原因是从个人资料页面返回时能立即发起请求获取最新的用户信息。
:::

将接口请求来的数据渲染到页面当中，如下代码所示：

```xml
<view class="profile">
  <view class="profile-base">
    <image class="avatar" src="/static/images/avatar_1.jpg"></image>
    <text bind:tap="goLogin" class="nickname">熊可爱</text>
    <navigator hover-class="none" class="link" url="/pages/profile/index">
      去完善信息<text class="enjoy-icon icon-arrow"></text>
    </navigator>
  </view>
  <view class="profile-extra">
    <navigator class="item house" url="/house_pkg/pages/list/index" hover-class="none">我的房屋</navigator>
    <navigator class="item repair" url="/repair_pkg/pages/list/index" hover-class="none">我的报修</navigator>
    <navigator class="item visitor" hover-class="none" url="/visitor_pkg/pages/list/index">访客记录</navigator>
  </view>
</view>
```


我的这个 `tabBar` 页面在用户未登录的情况下不需要跳转到登录页面，但在调用接口时会返回 401 ，此时由于是未登录的所以本地并没有 `refresh_token` 那么刷新 `token` 也自然就是没有必要的了，不仅不能刷新在调用 `/refreshToken` 时还会报 500 的错误，优化的方法也非常简单，在响应拦截器中加一个判断条件，如果 `refresh_token` 不存在的话就不用发起请求了，代码如下所示：

```javascript{19-20}
// utils/http.js
http.intercept.response = async ({ statusCode, data, config }) => {
  // statusCode 为状态码
  if (statusCode === 401) {
    // config 是调用接口的参数
    // refreshToken 过期的情形
    if (config.url.includes('/refreshToken')) {
      // 读取当前历史栈
      const pageStack = getCurrentPages()
      // 取出当前页面路径，登录成功能跳转到该页面
      const lastPage = pageStack[pageStack.length - 1]
      // 取出当前页面路径，登录成功能跳转到该页面
      const redirectURL = lastPage.route
      // 引导用户到登录页面
      return wx.redirectTo({
        url: `/pages/login/index?redirectURL=/${redirectURL}`,
      })
    }
    // 如果本地没有 refresh_token 没有必要刷新 token
    if (!app.refresh_token) return
    // 获取全局应用实例
    const app = getApp()
    // 使用 refreshToken 更新 token
    const res = await http({
      url: '/refreshToken',
      method: 'POST',
      header: {
        // 这时要注意使用的是 refresh_token
        Authorization: app.refresh_token,
      },
    })
    // 更新 token 和 refresh_token
    app.setToken(res.data.token, res.data.refreshToken)
  }
```

### 3.3.2 其它

最后来处理个人资料页面中用户昵称和头像默值的情况，在**我的**获取到用户信息后除了正常渲染外再用数据存储在本地，然后在个人资料页面直接进行读取。

先在**我的**页面存储数：

```javascript{15-16}
// pages/my/index.js
Page({
  onShow() {
    // 获取登录用户信息
    this.getUserInfo()
  },
  // 用户信息接口
  async getUserInfo() {
    // 请求数据接口
    const { code, data: userInfo } = await wx.http.get('/userInfo')
    // 校验数据是否合法
    if (code !== 10000) return wx.utils.toast('数据加载失败, 请稍后重试!')
    // 设置数据，更新渲染
    this.setData({ userInfo })
    // 将用户信息存入本地
    wx.setStorageSync('userInfo', userInfo)
  },
})
```

然后再到个人资料页面进行读取：

```javascript{2-5}
Page({
  onLoad() {
    // 从本地获取用户信息
    this.setData({ userInfo: wx.getStorageSync('userInfo') })
  },
  getUserNickName(ev) {/***/},
  async updateNickName(nickName) {/***/},
  getUserAvatar(ev) {/***/},
  updateUserAvatar(avatarUrl) {/***/},
})
```

提交代码

```bash
# 查看当前被修改的文件
git status
# 暂存文件
git add .
# 提交到本地
git commit -m 'feat(user): 完成个资料的读取和完善'

# 推送到远程或合并到本地 main
git checkout main
git merge feat-user
```