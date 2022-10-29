# 用户登录

享+社区的登录和注册功能是合并在一起的，首先检测用户填写的手机号是否已经注册，如果未注册则会自动注册用户并登录，相反如果已注册用户则直接登录。

## 2.1 倒计时

Vant 组件库中的 `van-field` 是一个输入框组件：

```xml
<van-field
  placeholder="请输入手机号码"
  type="number"
  placeholder-style="color: #979797"
>
</van-field>
```

`van-field` 组件支持插槽，插槽的内容我们放入一个倒计时组件 `van-count-down`:

```xml{4,7-9}
<van-field
  placeholder="请输入手机号码"
  type="number"
  use-button-slot
  placeholder-style="color: #979797"
>
  <view class="button-slot" slot="button">
    <van-count-down time="{{ 60000 }}"></van-count-down>
  </view>
</van-field>
```

自定义倒计时内容显示，需要用到 `van-count-down` 组件的插槽：

```xml
<van-field
  placeholder="请输入手机号码"
  type="number"
  use-button-slot
  placeholder-style="color: #979797"
>
  <view class="button-slot" slot="button">
    <van-count-down
      use-slot
      time="{{ 60000 }}"
      bind:change="countDownChange"
    >
      <text>{{ timeData.seconds }}秒后重新获取</text>
    </van-count-down>
  </view>
</van-field>
```

监听 `van-count-down` `change` 事件获取倒计时的时间变化信息：

```javascript
// pages/login/index.js
Page({
  // 获取倒计时信息
  countDownChange(ev) {
    this.setData({
      timeData: ev.detail
    })
  },
})
```

最后一步倒计时结束时隐藏倒计时组件：

```javascript
// pages/login/index.js
Page({
  data: {
    countDownVisible: false,
  },
  // 获取倒计时信息
  countDownChange(ev) {
    this.setData({
      timeData: ev.detail,
      countDownVisible: ev.detail.minutes === 1 || ev.detail.seconds > 0,
    })
  },
})
```

上述代码中定义了数据 `countDownVisible` 根据这个数据值判断是否要显示倒计时组件：

```xml{8,10}
  <van-field
    placeholder="请输入手机号码"
    type="number"
    use-button-slot
    placeholder-style="color: #979797"
  >
    <view class="button-slot" slot="button">
      <text wx:if="{{!countDownVisible}}">获取验证码</text>
      <van-count-down
        wx:else
        use-slot
        time="{{ 60000 }}"
        bind:change="countDownChange"
      >
        <text>{{ timeData.seconds }}秒后重新获取</text>
      </van-count-down>
    </view>
  </van-field>
```

## 2.2 获取验证码

用户填写手机号获取短信验证码验证用户的身份，我们分成 3 步来实现该功能：

1. 获取表单数据，即用户填写的手机号码
2. 验证手机号码的格式
3. 请求接口，获取短信验证码

### 2.2.1 获取表单数据

通过小程序的简易双向数据绑定获取表单的数据：

```xml{2}
  <van-field
    model:value="{{mobile}}"
    placeholder="请输入手机号码"
    type="number"
    use-button-slot
    placeholder-style="color: #979797"
  >
    <view class="button-slot" slot="button">
      <text wx:if="{{!countDownVisible}}">获取验证码</text>
      <van-count-down wx:else use-slot time="{{ 60000 }}" bind:change="countDownChange">
        <text>{{ timeData.seconds }}秒后重新获取</text>
      </van-count-down>
    </view>
  </van-field>
```

### 2.2.2 验证手机号码

用户填写的手机号码要求符合中国大陆手机号规则（长度11位以数字1开头），参考代码如下所示：

```javascript{3,11-27}
Page({
  data: {
    mobile: '',
    countDownVisible: false,
  },
  // 倒计时
  countDownChange(ev) {
    // ...
  },

  // 验证手机号格式
  verifyMobile() {
    // 宽松的验证规则
    const reg = /^[1][3-8][0-9]{9}$/
    // 正则验证（去除两端空格）
    const valid = reg.test(this.data.mobile.trim())
    // 验证结果提示
    if (!valid) wx.utils.toast('请填写正确的手机号码!')
    // 返回验证结果
    return valid
  },

  // 获取短信验证码
  getCode() {
    // 验证手机号码格式是否正确
    if (!this.verifyMobile()) return
  },
})

```

### 2.2.3 调用接口

验证用户填写手机号码格式正确后请求后端接口获取短信验证码：

- 接口路径：/code
- 请求方法: GET
- 请求参数：
  - mobile 用户填写的手机号
- 响应数据：[见文档](https://www.apifox.cn/apidoc/shared-8d66c345-7a9a-4844-9a5a-1201852f6faa/api-42672274)

```javascript{27-34}
Page({
  data: {
    mobile: '',
    countDownVisible: false,
  },
  // 倒计时
  countDownChange(ev) {
    // ...
  },

  // 验证手机号格式
  verifyMobile() {
    // 宽松的验证规则
    const reg = /^[1][3-8][0-9]{9}$/
    // 正则验证（去除两端空格）
    const valid = reg.test(this.data.mobile.trim())
    // 验证结果提示
    if (!valid) wx.utils.toast('请填写正确的手机号码!')
    // 返回验证结果
    return valid
  },

  // 获取短信验证码
  getCode() {
    // 验证手机号码格式是否正确
    if (!this.verifyMobile()) return
    // 请求数据接口
    const { code, data } = await wx.http.get('/code', { mobile: this.data.mobile.trim() })
    // 验证接口返回结果
    if (code !== 10000) return wx.uitls.toast('发送失败, 请稍后重试!')
    // 发送验证码成功
    wx.utils.toast('发送成功, 请查收短信!')
    // 开始倒计时
    this.setData({ countDownVisible: true })
  },
})
```

### 2.2.4 后门测试

在开发环境中方便测试咱们把短信验证码偷偷的保存在粘贴板中，顺便也多学习一个小程序的 API：

```javascript{1-2,30-31,33-36}
// 定义变量保存验证码
let secret_code = ''
Page({
  data: {
    mobile: '',
    countDownVisible: false,
  },
  // 倒计时
  countDownChange(ev) {
    // ...
  },

  // 验证手机号格式
  verifyMobile() {
    // ...
  },

  // 获取短信验证码
  getCode() {
    // 验证手机号码格式是否正确
    if (!this.verifyMobile()) return
    // 请求数据接口
    const { code, data } = await wx.http.get('/code', { mobile: this.data.mobile.trim() })
    // 验证接口返回结果
    if (code !== 10000) return wx.uitls.toast('发送失败, 请稍后重试!')
    // 发送验证码成功
    wx.utils.toast('发送成功, 请查收短信!')
    // 开始倒计时
    this.setData({ countDownVisible: true })
    // 记录验证码等待复制到粘贴板（仅用于测试环境）
    secret_code = data.code
  },
  // 复制验证码到粘贴板
  copyCode() {
    wx.setClipboardData({ data: secret_code })
  },
})
```

::: warning 注意:
现实开发过程中接口并不会把短信验证码返回前端而是直接发送到用户的手机上，上述的作法只适用于开发环境或上课环境。
:::

提交代码

```bash
# 查看当前被修改的文件
git status
# 暂存文件
git add .
# 提交到本地
git commit -m 'feat(user): 完成获取短信验证码的功能'
```

## 2.3 登录/注册

提交用户的手机号和短信验证码，分成 3 步来实现该功能：

1. 验证手机号码和验证码
2. 请求接口完成登录/注册
3. 重定向登录前原本要访问的页面

用户获取并填写验证码后，检测验证码格式是否正确（6位数字），然后调用接口完成登录/注册的功能。

### 2.3.1 验证表单数据

先来通过双向绑定获取短信验证码：

```xml
<van-field
  model:value="{{code}}"
  placeholder="请输入6位验证码"
  placeholder-style="color: #979797"
/>
```

然后验证短信验证码格式是否正确：

```javascript{6,19-29,41-46}
// 定义变量保存验证码
let secret_code = ''
Page({
  data: {
    mobile: '',
    code: '',
    countDownVisible: false,
  },

  countDownChange(ev) {
    // ...
  },

  // 验证手机号格式
  verifyMobile() {
    // ...
  },

  // 验证验证码
  verifyCode() {
    // 验证码为6位数字
    const reg = /^\d{6}$/
    // 验证验证码
    const valid = reg.test(this.data.code.trim())
    // 验证结果提示
    if (!valid) wx.utils.toast('请检查验证码是否正确!')
    // 返回验证结果
    return valid
  },

  // 获取短信验证码
  async getCode() {
    // ...
  },

  // 复制验证码到粘贴板
  copyCode() {
    wx.setClipboardData({ data: secret_code })
  },

  // 提交数据完成登录
  submitForm() {
    // 逐个验证表单数据
    if(!this.verifyMobile()) return
    if(!this.verifyCode()) return
  },
})

```

### 2.3.2 调用接口

验证用户填写手机号码和验证码格式正确后请求后端接口进行登录/注册：

- 接口路径：/login
- 请求方法: POST
- 请求参数：
  - mobile 用户填写的手机号
  - code 短信验证码
- 响应数据：[见文档](https://www.apifox.cn/apidoc/shared-8d66c345-7a9a-4844-9a5a-1201852f6faa/api-42672276)

```javascript{3-4,48-60}
// 定义变量保存验证码
let secret_code = ''
// 获取应用实例
const app = getApp()
Page({
  data: {
    mobile: '',
    code: '',
    countDownVisible: false,
  },

  countDownChange(ev) {
    // ...
  },

  // 验证手机号格式
  verifyMobile() {
    // ...
  },

  // 验证验证码
  verifyCode() {
    // 验证码为6位数字
    const reg = /^\d{6}$/
    // 验证验证码
    const valid = reg.test(this.data.code.trim())
    // 验证结果提示
    if (!valid) wx.utils.toast('请检查验证码是否正确!')
    // 返回验证结果
    return valid
  },

  // 获取短信验证码
  async getCode() {
    // ...
  },

  // 复制验证码到粘贴板
  copyCode() {
    wx.setClipboardData({ data: secret_code })
  },

  // 提交数据完成登录
  submitForm() {
    // 逐个验证表单数据
    if(!this.verifyMobile()) return
    if(!this.verifyCode()) return

    // 用户填写的手机号和验证码
    const { mobile, code } = this.data
    // 调用接口登录/注册
    const res = await wx.http.post('/login', { mobile, code })
    // 校验数据是否合法
    if (res.code !== 10000) return wx.utils.toast('请检查验证码是否正确!')
    // 拼凑完整 token 
    const token = 'Bearer ' + res.data.token
    // 本地存储 token 和 refresh_token
    wx.setStorageSync('token', token)
    // 更新全局 token 和 refresh_token
    app.token = token
  },
})
```

后续在 `refresh_token` 小节还会再次处理在本地存储 `token` 的逻辑，为了将来能够复用，咱们可以将存储 `token` 的逻辑封装到 `app.js` 中：

```javascript
App({
  // ...
  setToken(token) {
    // 拼凑合法token格式
    token = 'Bearer ' + token
    // 本地存储 token 和 refresh_token
    wx.setStorageSync('token', token)
    // 更新全局 token 和 refresh_token
    this.token = token
  },
})
```

然后调用封装好的方法来存储 `token`，代码也会变更简洁许多：

```javascript{21-22}
// 定义变量保存验证码
let secret_code = ''
// 获取应用实例
const app = getApp()
Page({
  // ...
  // 提交数据完成登录
  submitForm() {
    // 逐个验证表单数据
    if(!this.verifyMobile()) return
    if(!this.verifyCode()) return

    // 用户填写的手机号和验证码
    const { mobile, code } = this.data
    
    // 调用接口登录/注册
    const res = await wx.http.post('/login', { mobile, code })
    // 校验数据是否合法
    if (res.code !== 10000) return wx.utils.toast('请检查验证码是否正确!')
    
    // 存储记录token
    app.setToken(data.token)
  },
})
```

### 2.3.2 重定向路由

还记得前面我们检测了用户的登录状态，未登录的情况会跳转到登录页面，同时将页面的路径做为参数传到了登录页面，现在我们来获取这个参数然后重定向到这个页面路径，获取地址参数需要在 `onLoad` 生命周期中：

```javascript{12-15,39-42}
// 定义变量保存验证码
let secret_code = ''
// 获取应用实例
const app = getApp()
Page({
  data: {
    mobile: '',
    code: '',
    countDownVisible: false,
  },

  onLoad({redirectURL}) {
    // 获取地址参数
    this.setData({ redirectURL })
  },

  // ...

  // 提交数据完成登录
  async submitForm() {
    // 逐个验证表单数据
    if (!this.verifyMobile()) return
    if (!this.verifyCode()) return

    // 用户填写的手机号和验证码
    const { mobile, code } = this.data

    // 调用接口登录/注册
    const res = await wx.http.post('/login', { mobile, code })
    // 校验数据是否合法
    if (res.code !== 10000) return wx.utils.toast('请检查验证码是否正确!')

    const token = 'Bearer ' + res.data.token
    // 本地存储 token 和 refresh_token
    wx.setStorageSync('token', token)
    // 更新全局 token 和 refresh_token
    app.token = token

    // 重定向至登录前的页面
    wx.redirectTo({
      url: this.data.redirectURL,
    })
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
git commit -m 'feat(user): 完成用户登录/注册功能'
```

## 2.4 请求拦截器

完成用户登录后需要登录权限的接口必须将登录状态信息（token）发送给服务端，通过配置请求拦截器来进行统一的设置。

我们找到前面封装的 `utils/http.js` 来对它做进一步的完善，即添加请求拦截的功能逻辑。

### 2.4.1 基本用法

```javascript
/**
 * 配置响应拦截器
 */
http.intercept.request = (params) => {
  // 这里必须要有返回
  return params
}
```

在 `house_pkg/pages/list` 中调用接口 `/room` 这个接口是要求登录状态才可以正常访问：

```javascript
Page({
  onLoad() {
    // 目前该段代码只用于测试登录
    wx.http.get('/room')
  }
})
```

在调用上述接口时并未成返回数据，原因在于虽然完成了登录的功能，但是当再次调用接口时未将登录的状态即 `token` 发给服务端。

### 2.4.2 设置头信息

```javascript
/**
 * 配置响应拦截器
 */
http.intercept.request = (params) => {
  // 读取全局实例中的 token
  const { token } = getApp()
  // 指定一个公共的头信息
  // 初始为空对象后续可以扩展
  const defaultHeader = {}
  // 追加 token 头信息
  if (token) defaultHeader.Authorization = token
  // 合并自定义头信息和公共头信息
  params.header = Object.assign(defaultHeader, params.header)
  // 处理后的请求参数
  return params
}
```

上述代码中统一处理了 `token` 以头信息的方式传递给后接口 其中 `defaultHeader` 初始为一个空的对象目的是将来可以扩展更多的公共头信息，另外要注意调用 `Object.assigin` 时参数的顺序，我们希望的是用户指定的头信息能够覆盖掉默认的头信息。

提交代码

```bash
# 查看当前被修改的文件
git status
# 暂存文件
git add .
# 提交到本地
git commit -m 'feat(user): 请求拦截器统一处理token'
```

## 2.5 refresh_token

从安全角度来看 `token` 必须要具有一定的时效性，享+社区约定了 `token` 的时效为8个小时，失效后的 `token` 不再能标识用是登录状态。

另外也要考虑用户的体验，例如用户在 `token` 失效的前 1 分钟打开小程序，用户浏览小程序 1 分钟后 `token` 失效，用户不得不再次去登录，这样的用户体验是极差的。

为了既能保证安全性又兼顾用户体验，咱们需要能够自动延长 `token` 时效的方法，即 `refresh_token`，它的作工作制是这样的：

1. 用户在首次完成登录时会分别得到 `token` 和 `refresh_token`
2. 当 `token` 失效后，调用接口会返回 `401` 状态码（这是与后端约定好的规则）
3. 检测状态码是否为 `401`，如果是则调用延长 `token` 时效的接口并**传递 `refresh_token`**
4. 调用延长 `token` 时效的接口后会返回新的 `token` 和 `refresh_token`

### 2.5.1 存储 refresh_token

根据上述的步骤咱们先要将 `refresh_token` 存储在本地及全局实例中，方便后续读取，回到登录页面和 `app.js` 逻辑中。

先来完善 `setToken` 的方法，增加 `refresh_token` 的存储：

```javascript{3,6,10,13}
App({
  // ...
  setToken(token, refresh_token) {
  // 拼凑合法token格式
  token = 'Bearer ' + token
  refresh_token = 'Bearer ' + refresh_token

  // 本地存储 token 和 refresh_token
  wx.setStorageSync('token', token)
  wx.setStorageSync('refresh_token', refresh_token)
  // 更新全局 token 和 refresh_token
  this.token = token
  this.refresh_token = refresh_token
  },
})

```

然后在 `pages/login/index.js` 中调用 `setToken` 并传入 `refresh_token`：

```javascript{17-18}
// pages/login/index
Page({
  // 之前代码省略...
  // 提交数据完成登录
  async submitForm() {
    // 逐个验证表单数据
    if (!this.verifyMobile()) return
    if (!this.verifyCode()) return
    // 用户填写的手机号和验证码
    const { mobile, code } = this.data
    
    // 调用接口登录/注册
    const res = await wx.http.post('/login', { mobile, code })
    // 校验数据是否合法
    if (res.code !== 10000) return wx.utils.toast('请检查验证码是否正确!')
    
    // 存储记录token
    app.setToken(res.data.token, res.data.refreshToken)

    // 重定向至登录前的页面
    wx.redirectTo({
      url: this.data.redirectURL,
    })
  },
})
```

### 2.5.2 调用接口

享+社区 `token` 的时效有 **8 个小时**，在开发调试阶段可以故意修改 `token` 的内容来主动让 `token` 失效。

::: tip 提示:
在小程序开发者工具的 `Storage` 中去手动修改 `token` 的数据。
:::

- 接口路径：/refreshToken
- 请求方法: POST
- 请求参数：无
- Headers：
  - Authorization
- 响应数据：[见文档](https://www.apifox.cn/apidoc/shared-8d66c345-7a9a-4844-9a5a-1201852f6faa/api-44946311)

人为修改了 `token` 后后端就会认为 `token` 是失效的，因此调用接口时会状态码返回值为 `401`，在响应拦截器中检测 `401` 的情况，代码在 `utils/http.js` 中：

```javascript
// ...
http.intercept.response = async ({ statusCode, data }) => {
  // statusCode 为状态码
  if (statusCode === 401) {
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

  // 过滤接口返回的数据
  return data
}
// ...
```

在调用刷新 `token` 接口时要注意头信息 `header.Authorization` 使用的是 `refresh_token`。

在对 `token` 刷新时有一个问题大家思考一下，`refresh_token` 有没有可能也会过期？
其实是会的，用户长期未使用小程序的情况下 `refresh_token` 也会失效，享+社区设置的时间为 **3天**，如果 `refresh_token` 也失效的情况下重定向到登录页面。

再次手动修改 `refresh_token` 让它处于失效状态，然后调用接口后会出现列循环的情况（接口不断的请求），要解决这个问题需要判断当前是否调用的是 `/refreshToken` 接口，如果是且状态码返回的是 `401` 则重定页到登录页面。

```javascript{4-18}
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

  // 过滤接口返回的数据
  return data
}
```

### 2.5.4 无感请求

用户在请求某个接口是检测 `token` 失效，咱们去刷新了 `token` 当刷新成功后应该要继续去请求原来的接口，给用户的感知是一直处于登录状态的。

```javascript{35-43}
http.intercept.response = async ({ statusCode, data, config }) => {
  // statusCode 为状态码
  if (statusCode === 401) {
    // config 是调用接口的参数
    // refreshToken 过期的情形
    if (config.url.includes('/refreshToken')) {
      // 读取当前历史栈
      const pageStack = getCurrentPages()
      // 取出当前页面路径，登录成功能跳转到该页面
      const currentPage = pageStack[pageStack.length - 1]
      // 取出当前页面路径，登录成功能跳转到该页面
      const redirectURL = currentPage.route

      // 引导用户到登录页面
      return wx.redirectTo({
        url: `/pages/login/index?redirectURL=/${redirectURL}`,
      })
    }

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

    // 重新发起请求
    return http(
      Object.assign(config, {
        // 传递新的 token
        header: {
          Authorization: app.token,
        },
      })
    )
  }

  // 过滤接口返回的数据
  return data
```

上述代码中 `config` 是用户原本要请求的接口的参数，根据这些参数请求发起请求并传入刷新后的 `token`。

提交代码

```bash
# 查看当前被修改的文件
git status
# 暂存文件
git add .
# 提交到本地
git commit -m 'feat(user): 完成refresh_token的功能'
```