
Component({
  options: {
    virtualHost: true
  },
  
  // 外部传入的数据
  properties: {
    source: {
      type: Array,
      value: []
    }
  },
  
  // 组件私有数据
  data: {

  },

  // 生命周期
  lifetimes: {
    attached () {
      // 创建 wxml 节点查找器
      var query = this.createSelectorQuery().in(this);

      // 获得节点并读取节点信息
      query.select('.navs').boundingClientRect();
      query.select('.scroll-view').boundingClientRect();

      // 
      query.exec(res => {
        // 动态设置滚动条的宽度
        let width = res[1].width / res[0].width * 100 + '%' || '50%';
        this.setData({ width })
      })
    }
  },
})