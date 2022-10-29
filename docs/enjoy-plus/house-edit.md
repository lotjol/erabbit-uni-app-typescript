# 编辑房屋

编辑房屋需要先根据房屋的 `id` 将房屋原来的数据查询出来，然后在对原数据进行修改后再调用接口对房屋数据进行更新。

编辑房屋和添加房屋的逻辑是相似的并且共用了相同的页面，即 `house_pkg/pages/form/index`

在房屋详情页面中跳转到房屋编辑页面时通过地址传递房屋 `id` 参数：

```javascript
// house_pkg/pages/list/index.js
Page({
  // ...
  editHouse() {
    wx.navigateTo({
      url: '/house_pkg/pages/form/index?id=' + this.data.id,
    })
  },
})
```

## 5.1 设置页面标题

添加房屋和编辑房屋共用了相同的页面，可是即使是在编辑房屋时页面的标题也是 【添加房屋信息】与实际用户执行的操作不符，我们可以调用 API 来动态修改页面的标题。

如果页面地址中包含 id 参数则表明当前的操作为编辑房屋信息：

```javascript
Page({
  // ...
  onLoad({ point, building, room, id }) {
    if (id) {
      wx.setNavigationBarTitle({ title: '编辑房屋信息' })
    } else {
      // 获取并记录地址参数
      this.setData({ point, building, room })
    }
  },
  // ...
})
```

## 5.2 查询房屋详情

- 接口路径：/room/{id}
- 请求方法: GET
- 请求参数：
  - id 房屋id
- Headers：
  - Authorization
- 响应数据：[见文档](https://www.apifox.cn/apidoc/shared-8d66c345-7a9a-4844-9a5a-1201852f6faa/api-41400751)

```javascript{6-7,13-21}
// house_pkg/pages/form/index.js
Page({
  onLoad({ point, building, room, id }) {
    if (id) {
      wx.setNavigationBarTitle({ title: '编辑房屋信息' })
      // 获取房屋信息
      this.getHouseDetail(id)
    } else {
      // 获取并记录地址参数
      this.setData({ point, building, room })
    }
  },
  async getHouseDetail(id) {
    if (!id) return
    // 请求数据接口
    const { code, data: houseDetail } = await wx.http.get('/room/' + id)
    // 检测接口返回的结果
    if (code !== 10000) return wx.utils.toast()
    // 渲染数据
    this.setData({ ...houseDetail })
  },
})
```

## 5.3 更新房屋信息

添加房屋和更新房屋信息调用的是同一个接口，后端会动判断传递参数时有没有 `id`，如果有 `id` 则表示是编辑操作否则是添加操作，除此之外要注意接口参数中并不包含 `status` 这个参数，这个数据是标识房屋的审核状态的，在调用接口前我们把这个参数删除，还要注意接口调用成功后的返回操作也需要做一些调整。

```javascript{12,21}
// house_pkg/pages/form/index.js
Page({
  // ...
  async submitForm() {
    // 逐个验证表单的数据
    if (!this.verifyName()) return
    if (!this.verifyMobile()) return
    if (!this.verifyPicture()) return

    // 删除一些数据
    delete this.data.__webviewId__
    delete this.data.status

    // 请求数据接口
    const { code } = await wx.http.post('/room', this.data)
    // 检测接口调用的结果
    if (code !== 10000) return wx.utils.toast('添加房屋失败!')

    // 成功后跳转至房屋列表
    wx.navigateBack({
      delta: this.data.id ? 2 : 4,
    })
  },
  // ...
})
```

提交代码

```bash
# 查看当前被修改的文件
git status
# 暂存文件
git add .
# 提交到本地
git commit -m 'feat(house): 完成房屋编辑的功能'

# 推送到远程或合并到本地 main
git checkout main
git merge feat-house
```