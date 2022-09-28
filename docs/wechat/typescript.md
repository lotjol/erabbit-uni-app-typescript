# TypeScript

小程序既支持使用 Javascript 开发，也支持使用 TypeScript 开发，有两种方式创建 TypeScript 版本的小程序。

## 1.1 启用 TypeScript

在使用 TypeScript 来开发微信小程序时需要安装声明文件，创建项目时选择 TypeScript 版本，小程序开发者工具会自动安装声明文件并在 `tsconfig.json` 中提供了初始的配置。

```json
{
  "compilerOptions": {
    // 省略了一些其它配置
    "typeRoots": ["./typings"]
  },
  "include": ["./**/*.ts"],
  "exclude": ["node_modules"]
}
```

::: tip
配置文件中要注意 `typeRoots` 指向的目录是 `./typings`，默认为 `node_modules/@types`。
:::

声明文件也可以单独安装，后面基于 uni-app 框架开发时采用这种方式安装。

```bash
npm install @types/wechat-miniprogram
# 或者
npm install miniprogram-api-typings
```

## 1.2 泛型

默认情况 TypeScript 能自动推断`data`中初始数据的类型

```typescript
// page/index/index.ts
Page({
  data: {
    // string 类型
    msg: '大家好，这是我的第一个小程序！',
    // number 类型
    number: 1,
  },
})
```

1.  Page 函数

有很多时候需要开发者事先对类理进行定义，比如调用接口获取的数据列表，这样可以更好的利用 `TypeScript` 的提示功能，此时就需要为 `Page` 函数指定**泛型参数**来实现，总共需要 2 个泛型参数：

- 第 1 个泛型参数用来约束 `data` 初始数据的类型

```typescript{2-5,11,8}
// data 的类型
interface TData {
  msg?: string
  number?: number
}

// 除 data 以外的类型
interface TCustom {}

// 调用 Page 函数
Page<TData, TCustom>({
  data: {
    msg: '大家好，这是我的第一个小程序！',
    number: 1
  },
})
```

- 第 2 个泛型参数用来约束除 `data` 以外部分数据的类型，如事件回调、公共方法等

```typescript{8-10,20-22}
// data 的类型
interface TData {
  msg?: string
  number?: number
}

// 除 data 以外的类型
interface TCustom {
  sayHi(name: string): void
}

// 调用 Page 函数
Page<TData, TCustom>({
  data: {
    msg: '大家好，这是我的第一个小程序！',
    number: 1
  },

  // 方法
  sayHi(name = '小明') {
    console.log('你好' + name)
  },
})
```

上述代码中定义的类型是暴露在全局当中的，为了避免引起冲突我们在文件结尾添加 `export {}` 来解决：

```typescript{17}
// data 的类型
interface TData {
  /* 省略部分代码... */
}

// 除 data 以外的类型
interface TCustom {
  /* 省略部分代码... */
}

// 调用 Page 函数
Page<TData, TCustom>({
  // ... 省略部分代码
})

// 新增的代码
export {}
```

2. App 函数

App 函数只需要一个泛型参数，如下所示：

```typescript
// app.ts
interface IAppOption {
  someGlobalData?: {
    version?: string
    author?: string
  }
  foo(arg: number): number
}

// App 函数
App<IAppOption>({
  someGlobalData: {
    version: 'v1.0',
    author: 'botue',
  },

  foo(arg) {
    return arg
  },
})
```

在 App 函数中定义的数据可以任何页面通过 getApp 方法全局获取：

```typescript{3-4}
// pages/inddex/index.ts
// 获取 App 中定义的属性或方法
const app: IAppOption = getApp()
console.log(app)

// data 的类型
interface TData {
  /* 省略部分代码 */
}
// 除 data 以外的类型
interface TCustom {
  /* 省略部分代码 */
}
// 调用 Page 函数
Page<TData, TCustom>({
  /* 省略部分代码 */
})

export {}
```
