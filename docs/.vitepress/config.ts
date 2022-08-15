import { defineConfig } from 'vitepress'

export default defineConfig({
  title: '小兔鲜儿',
  titleTemplate: '新鲜、亲民、快捷',
  description: '小兔鲜儿, 电商, 商城,小程序, uni-app',
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
          text: '微信小程序',
          items: [
            { text: '开发准备', link: '/wechat/' },
            { text: '基础知识', link: '/wechat/development' },
            { text: '开发调试', link: '/wechat/debug' },
            { text: '发布上线', link: '/wechat/publish' },
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
  markdown: {},
})
