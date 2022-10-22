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

### 2.3.2 重定向路由

还记得前面我们检测了用户的登录状态，未登录的情况会跳转到登录页面，同时将页面的路径做为参数传到了登录页面，现在我们来获取这个参数然后重定向到这个页面路径，获取地址参数需要在 `onLoad` 生命周期中：

```javascript
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

  countDownChange(ev) {
    // ...
  },

  // 验证手机号格式
  verifyMobile() {
    // ...
  },

  // 验证验证码
  verifyCode() {
    // ...
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

## 2.5 refresh_token