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
      { text: 'uni-app', link: '/uni-app/' },
      { text: '黑马优购', link: '/hm-ugo/' },
    ],
    sidebar: {
      '/wechat/': [
        {
          text: '一、小程序基础',
          collapsible: true,
          items: [
            { text: '1. 开发准备', link: '/wechat/' },
            { text: '2. 基础知识', link: '/wechat/basic' },
            { text: '3. 开发调试', link: '/wechat/debug' },
            { text: '4. 发布上线', link: '/wechat/publish' },
          ],
        },
        {
          text: '二、小程序进阶',
          collapsible: true,
          items: [
            { text: '1. TypeScript', link: '/wechat/typescript' },
            { text: '2. 模板语法', link: '/wechat/template' },
            { text: '3. 生命周期', link: '/wechat/lifetimes' },
            { text: '4. 内置API', link: '/wechat/api' },
            { text: '5. 自定义组件', link: '/wechat/component' },
            { text: '6. 配置分包', link: '/wechat/subpackage' },
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
      '/uni-app/': [
        {
          text: 'uni-app',
          items: [{ text: '介绍', link: '/uni-app/' }],
        },
      ],
      '/hm-ugo/': [
        {
          text: '黑马优购',
          items: [{ text: '初始化', link: '/hm-ugo/' }],
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
