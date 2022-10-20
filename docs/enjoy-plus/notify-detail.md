# 公告详情

上一节中完成了公告列表功能的开发，这一节来实现公告详情的功能。

## 2.1 调用接口

- 接口路径：/announcement/:id
- 请求方法: GET
- 请求参数：无（参数拼凑在请求路径上）
- 响应数据：[见文档](https://www.apifox.cn/apidoc/shared-8d66c345-7a9a-4844-9a5a-1201852f6faa/api-42249556)

调用接口分成为三个步骤实现：

1. 获取地址上的 `id` 参数
2. 定义请求数据接口的方法
3. 页面加载时调用方法获取数据

```javascript
Page({
  onLoad({ id }) {
    // 1. 获取地址上的 id 参数
    // console.log(id)
    // 3. 页面加载时调用方法获取数据
    this.getNotifyDetail(id)
  },
  // 2. 定义请求数据接口的方法
  async getNotifyDetail(id) {
    if (!id) return
    // 请求数据接口
    const { code, data: notifyDetail } = await wx.http.get('/announcement/' + id)
    // 检测接口调用的结果
    if (code !== 10000) return wx.utils.toast()
    // 更新数据
    this.setData({ notifyDetail })
  },
})
```

## 2.2 模板渲染

在调用工具 AppData 中查看本地是否已经存在数据，再到模板中将数据渲染出来：

```xml
<scroll-view enhanced show-scrollbar="{{false}}" scroll-y>
  <view class="notify-meta">
    <view class="title">{{notifyDetail.title}}</view>
    <view class="extra">
      <view class="author">{{notifyDetail.creatorName}}</view>
      <view class="datetime">{{notifyDetail.createdAt}}</view>
    </view>
  </view>
  <view class="notify-content">
    <rich-text nodes="社区定于8月3日中午喷洒灭蚊药..."></rich-text>
  </view>
</scroll-view>
```

## 2.3 富文本处理

小程序中无法直接解析 html 的标签，然而一般的富文本编辑器生成的内容都是由 html 标签构成的，为了在小程序中解析富文件的内容，特别提供了 `rich-text` 组件。

基本的用法如下：

```xml
<rich-text nodes="<h1>你好，世界!</h1>"></rich-text>
```
将 html 标签（富文本内容）赋值给 `nodes` 属性即可。

了解这 `rich-text` 的用法后来把公告的内容渲染出来：

```xml{10}
<scroll-view enhanced show-scrollbar="{{false}}" scroll-y>
  <view class="notify-meta">
    <view class="title">{{notifyDetail.title}}</view>
    <view class="extra">
      <view class="author">{{notifyDetail.creatorName}}</view>
      <view class="datetime">{{notifyDetail.createdAt}}</view>
    </view>
  </view>
  <view class="notify-content">
    <rich-text nodes="{{notifyDetail.content}}"></rich-text>
  </view>
</scroll-view>
```

提交代码:

```bash
# 检查待提交的文件
git status
# 暂存文件
git add .
# 提交到本地
git commit -m 'feat(notify): 完成了公告详情'

# 推送到远程或合并到本地 main
git checkout main
git merge feat-notify
```