// pages/detail.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item: {
      type: Object,
      value: {
        url: './images/default.png',
        text: '每个人心里都有一座长安城',
        like: 1,
        like2: 2,
        like3: 3,
      }
    }
  },

  ready() {
    console.log('this', this.properties.item)
    this.triggerEvent('operate', {
      type: 0,
      value: {
        fileId: this.properties.item.fileId
      }
    })
  },

  /**
   * 组件的初始数据
   */
  data: {
    
  },

  /**
   * 组件的方法列表
   */
  methods: {
    close() {
      this.triggerEvent('closedetail')
    },
    operate(e) {
      console.log('e.target', e.target.dataset)
      this.triggerEvent('operate', e.target.dataset)
    }
  }
})
