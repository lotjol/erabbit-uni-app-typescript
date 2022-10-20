# 消息反馈

在开发过程中需要向用户反馈消息的场景有很多，如检验接口调用的结果，表单验证的提示消息等，为此我们来对API `wx.showToast` 进行简单的封装，方便开发中调用：

```bash
# 创建分支
git checkout -b feat-utils
```

## 1.1 基础封装

新建 `utils/utils.js` 文件，然后在这里完成具体的封装逻辑：

```javascript
/**
 * 工具方法
 */
const utils = {
  /**
   * 封装 wx.showToast
   * @param {string} title 消息提示的内容
   */
  toast(title = '数据加载失败...') {
    wx.showToast({
      title,
      mask: true,
      icon: 'none',
    })
  },
}
/**
 * 扩展 wx 全局对象，切记不要与原用 api 重名
 */
wx.utils = utils
/**
 * 模块化导出
 */
export default utils
```

上述代码中将定义了一个对象 `utils`，在这个对象下可以扩展开发中经常用到的方法，然后将 `utils` 挂载到全局对象 `wx` 上，方便全局调用 `uitls` 中的方法。

::: tip 提示:
上述代码中 `export default utils` 的作用是除了通过 `wx` 全局可引用外，也可以当模块导入使用。
:::

## 1.2 全局加载

接下来在入口文件 `app.js` 中加载 `uitls/utils` 工具库：

```javascript
// 加载 utils/uitls.js
import './utils/utils'
App({
  globalData: {},
})
```

最后在页面中调用 `wx.utils.toast` 进行测试：

```javascript
Page({
  data: {},
  async onLoad() {
    // 不传参的方式
    wx.utils.toast()
    // 传入提示文字
    wx.utils.toast('用户名只能中文字符！')
  },
})
```

## 1.3 局部加载

在需要使用 `utils` 的场景下导入 `utils/utils` 模块：

```javascript
// 导入 utils/utils 模块
import uitls from '../../utils/utils'
Page({
  data: {},
  async onLoad() {
    // 不传参的方式
    utils.toast()
    // 传入提示文字
    utils.toast('用户名只能中文字符！')
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
git commit -m 'feat(utils): 封装工具方法'
```