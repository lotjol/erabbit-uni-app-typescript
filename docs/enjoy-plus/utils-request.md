# 网络请求

小程序中绝大部分的 API 都支持[返回 Promise](https://developers.weixin.qq.com/miniprogram/dev/framework/app-service/api.html#API)，也有几个 API 不支持返回 Promise，其中就包含  `wx.request`，开发中需要自行对 `wx.request` 进行封装也可以使用第三方的封装好的模块。

```bash
# 检查有没有未提交的代码
git status
```

## 2.1 安装 wechat-http

本项目推荐使用咱们老师封装的一个 npm 模块 `wechat-http`，我们先来安装，然后介绍它的使用方法：

```bash
npm install wechat-http
```

::: warning 注意:
安装完毕后还要记得必须要构建后才可以使用 npm 的模块。
:::

接下来介绍 `wechat-http` 模块的使用，其用法与 `axios` 类似：

```javascript
// 导入 http 模块
import http from 'wechat-http'
```

- `http.baseURL` 配置接口基础路径
- `http.get` 以 `GET` 方法发起请求
- `http.post` 以 `POST` 方法发起请求
- `http.put` 以 `PUT` 方法发起请求
- `http.delete` 以 `DELETE` 方法发起请求
- `http.intercept` 配置请求和响应拦截器
- `http` 本身做为函数调用也能用于发起网络请求

## 2.2 公共配置

新建 `utils/http.js` 文件，

```javascript
// 导入 http 模块
import http from 'wechat-http'
/**
 * 配置接口基础路径
 */
http.baseURL = 'https://live-api.itheima.net'
/**
 * 挂载方法到全局
 */
wx.http = http
/**
 * 模块导出
 */
export default http
```

## 2.3 全局加载

项目启动入口 `app.js` 中加载 `utils/http.js`:

```javascript{4}
// 加载 utils/uitls.js
import './utils/utils'
// 加载 utils/http.js
import './utils/http'

App({
  globalData: {},
})
```

这样我们就中在项目全局调用 `wx.http` 发起网络请求了，我们在首页面来进行测试：

```javascript
// pages/index/index.js
Page({
  data: {},
  async onLoad() {
    // 测试网络请求
    const res = await wx.http({
      url: '/announcement',
    })
    console.log(res)
  },
})
```

::: tip 提示:
不要忘了在小程序管理后台request 合法域名列表中添加接口服务器域名，切记切记！
:::

## 2.4 配置拦截器

返回的数据中有一些冗余的数据，通过响应拦截器进行优化：

```javascript{12-15}
// 导入 http 模块
import http from 'wechat-http'
/**
 * 接口基础路径
 */
http.baseURL = 'https://live-api.itheima.net'
/**
 * 配置响应拦截器
 */
http.intercept.response = (res) => {
  // 过滤接口返回的数据
  return res.data
}
/**
 * 挂载到wx全局对象
 */
wx.http = http
```

优化后调用接口时代码就会变更简洁：

```javascript
// pages/index/index
Page({
  data: {},
  async onLoad() {
    // 测试网络请求
    const { code, data } = await wx.http({
      url: '/announcement',
    })
    // 检测接口调用的结果
    if (code !== 10000) return wx.utils.toast()
    // 接口返回数据
    console.log(data)
  },
})
```

提交代码:

```bash
# 查看当前被修改的文件
git status
# 暂存文件
git add .
# 提交到本地
git commit -m 'feat(utils): 配置网络请求'

# 推送到远程或合并到本地 main
git checkout main
git merge feat-utils
```