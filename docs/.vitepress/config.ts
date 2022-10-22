import { defineConfig } from 'vitepress'

export default defineConfig({
  title: '小兔鲜儿',
  titleTemplate: '新鲜、亲民、快捷',
  description: '小兔鲜儿, 电商, 商城,小程序, uni-app',
  base: '/erabbit-uni-app-typescript/',
  head: [
    [
      'link',
      {
        rel: 'icon',
        href: '/erabbit-uni-app-typescript/favicon.ico',
      },
    ],
  ],
  themeConfig: {
    logo: '/logo.png',
    siteTitle: '小兔鲜儿',
    nav: [
      { text: '微信小程序', link: '/wechat/' },
      { text: '享+社区', link: '/enjoy-plus/' },
      { text: 'uni-app', link: '/uni-app/' },
      { text: '小兔鲜儿', link: '/erabbit/' },
    ],
    sidebar: {
      '/wechat/': [
        {
          text: '一、认识环境',
          collapsible: true,
          items: [
            { text: '1. 学习准备', link: '/wechat/' },
            { text: '2. 基础知识', link: '/wechat/basic' },
            { text: '3. 开发调试', link: '/wechat/debug' },
            { text: '4. 发布上线', link: '/wechat/publish' },
          ],
        },
        {
          text: '二、小程序进阶',
          collapsible: true,
          items: [
            // { text: '1. TypeScript', link: '/wechat/typescript' },
            { text: '1. 模板语法', link: '/wechat/template' },
            { text: '2. 生命周期', link: '/wechat/lifetimes' },
            { text: '3. 内置API', link: '/wechat/api' },
            { text: '4. npm支持', link: '/wechat/npm' },
            { text: '5. 自定义组件', link: '/wechat/component' },
            { text: '6. 分包加载', link: '/wechat/subpackage' },
            { text: '7. 框架接口', link: '/wechat/interface' },
          ],
        },
        {
          text: '三、每日作业',
          items: [
            { text: '查看作业', link: '/wechat/homework' },
            { text: '参考答案', link: '/wechat/answer' },
          ],
        },
      ],
      '/enjoy-plus/': [
        {
          text: '一、开发准备',
          collapsible: true,
          collapsed: true,
          items: [
            { text: '1. 项目介绍', link: '/enjoy-plus/' },
            { text: '2. 启动项目', link: '/enjoy-plus/bootstrap' },
          ],
        },
        {
          text: '二、工具方法',
          collapsible: true,
          collapsed: true,
          items: [
            { text: '1. 消息反馈', link: '/enjoy-plus/utils-toast' },
            { text: '2. 网络请求', link: '/enjoy-plus/utils-request' },
          ],
        },
        {
          text: '三、公告管理',
          collapsible: true,
          collapsed: true,
          items: [
            { text: '1. 公告列表', link: '/enjoy-plus/notify-list' },
            { text: '2. 公告详情', link: '/enjoy-plus/notify-detail' },
          ],
        },
        {
          text: '四、用户管理',
          collapsible: true,
          collapsed: true,
          items: [
            { text: '1. 登录检测', link: '/enjoy-plus/user-check' },
            { text: '2. 用户登录', link: '/enjoy-plus/user-login' },
            { text: '3. 个人资料', link: '/enjoy-plus/user-profile' },
          ],
        },
        {
          text: '五、房屋管理',
          collapsible: true,
          collapsed: true,
          items: [
            { text: '1. 添加房屋', link: '' },
            { text: '2. 房屋列表', link: '' },
            { text: '3. 删除房屋', link: '' },
            { text: '4. 编辑房屋', link: '' },
          ],
        },
        {
          text: '六、报修管理',
          collapsible: true,
          collapsed: true,
          items: [
            { text: '1. 在线报修', link: '' },
            { text: '2. 报修列表', link: '' },
            { text: '3. 报修详情', link: '' },
            { text: '4. 报修详情', link: '' },
          ],
        },
        {
          text: '七、访客管理',
          collapsible: true,
          collapsed: true,
          items: [
            { text: '1. 邀请访客', link: '' },
            { text: '2. 访客通知证', link: '' },
            { text: '3. 访客列表', link: '' },
          ],
        },
      ],
      '/uni-app/': [
        {
          text: 'uni-app',
          items: [{ text: '介绍', link: '/uni-app/' }],
        },
      ],
      '/erabbit/': [
        {
          text: '小兔鲜儿',
          items: [{ text: '介绍', link: '/erabbit/' }],
        },
      ],
    },
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2019-2022 黑马程序员',
    },
  },
  markdown: {
    lineNumbers: true,
  },
})
