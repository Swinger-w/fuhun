// components/navigator/navigator.js
const app = getApp()

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    active: {
      type: String
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    menus: [{
        activeAvatar: './images/menu1_active.svg',
        blurAvatar: './images/menu1_blur.svg',
        text: '布灵星球',
        value: 'ground'
      },
      {
        activeAvatar: './images/menu2_active.svg',
        blurAvatar: './images/menu2_blur.svg',
        text: '个人中心',
        value: 'mine'
      }
    ]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    jump(e) {
      console.log('e', e)
      let target = e.target.dataset.value
      console.log('target', target)
      wx.navigateTo({
        url: `../../pages/${target}/${target}`,
      })
    },
    getUserInfo(e) {
      console.log('(((((', e)
      if (app.getDecryptedFromStorage() !== true) {

        wx.getUserProfile({
          desc: '获取你的个人信息',
          success: (res) => {
            console.log('777777', res)
            e.detail = {
              ...e.detail,
              ...res,
            }
            this.triggerEvent('getuserinfo', e)
          }
        })
      } else {
        e.detail = {
          ...e.detail,
          'iv': 'default'
        }
        this.triggerEvent('getuserinfo', e)
      }
    }
  }
})