
# 公告列表

公告是由物业向业主发出的一系列的通知，功能分成两部分，分别是公告列表和公告的详情，本节要完成的是公告列表。

```bash
# 查看当前分支，要求在 main 分支
git branch
# 创建新功能分支
git checkout -b feat-notify
```

公告列表不需要检测用户的登录状态，因此直接调用后端数据接口获取数据，然后渲染出来就可以了。

## 1.1 接口调用

- 接口路径：/announcement
- 请求方法: GET
- 请求参数：无
- 响应数据：[见文档](https://www.apifox.cn/apidoc/shared-8d66c345-7a9a-4844-9a5a-1201852f6faa/api-41839039)

调用接口分成为两个步骤实现：

1. 定义请求数据接口的方法
2. 页面加载时调用方法获取数据

```javascript
Page({
  data: {},
  onLoad() {
    // 2. 页面加载时调用接口获取数据
    this.getNotifyList()
  },
  // 1. 定义方法请求数据接口
  async getNotifyList() {
    // 请求数据接口
    const { code, data: notifyList } = await wx.http.get('/announcement')
    // 检测接口调用的结果
    if (code !== 10000) return wx.utils.toast()
    // 更新数据
    this.setData({ notifyList })
  },
})
```

## 1.2 模板渲染

首先在调用工具 AppData 中查看本地是否已经存在数据，然后再到模板中将数据渲染出来：

```xml
<view class="notices">
  <view class="notices-head">社区<text>公告</text></view>
  <view class="notices-body">
    <navigator
      wx:for="{{notifyList}}"
      wx:key="id"
      hover-class="none"
      url="{{'/pages/notify/index?id=' + item.id}}"
      class="notice"
    >
      <view class="notice-title">{{item.title}}</view>
      <view class="notice-brief">{{item.content}}</view>
      <view class="notice-date">{{item.createdAt}}</view>
    </navigator>
  </view>
</view>
```

**在对数据渲染时要注意地址跳转上拼凑上 `id` 参数，根据这个参数获取公告的详情。**

提交代码:

```bash
# 检查待提交的文件
git status
# 暂存文件
git add .
# 提交到本地
git commit -m 'feat(notify): 完成了公告列表'
```
