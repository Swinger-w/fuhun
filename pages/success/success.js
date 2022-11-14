// pages/success.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  goA() {
    wx.navigateTo({
      url: '../index/index',
    })
  },

  uploadAgain() {
    wx.navigateTo({
      url: '../index/index',
    })
  },

  upload() {
    console.log('@@@', JSON.stringify(app.globalData.userInfo))
    if (!app.globalData.userInfo) {
      return
    }
    const fileId = app.globalData.fileId
    console.log('file id!!', fileId)
    app.getAccesstoken(() => {
      wx.request({
        url: app.globalData.baseUrl + '/model-api/fh/v4/syncSoulPlaza',
        header: {
          'content-type': 'application/json'
        },
        method: 'POST',
        header: {
          AccessToken: app.getTokenFromStorage(),
          'USER_SYSTEM': '2'
        },
        data: {
          fileId: fileId
        },
        success: ({ data: data }) => {
          if (data.code === 9530) {
            app.reset()
            return
          }
          if (data.code === 200) {
            console.log('upload success')
            this.toGround()
            return
          }
          if (data.code === -105) {
            console.log('upload success')
            this.toGround()
            return
          }
          this.toGround()
        }
      })
    })

  },
  toGround() {
    wx.navigateTo({
      url: '../ground/ground',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      navHeight: app.globalData.navHeight,
      navTop: app.globalData.navTop,
      imgUrl: app.globalData.imgUrl || 'https://qiniu.cuiqingcai.com/czhf8.png',
      des: app.globalData.des || '真是张有趣的图呢',
      fileId: app.globalData.fileId,
      windowWidth: app.globalData.windowWidth,
      windowHeight: app.globalData.windowHeight,
    })
    if (app.globalData.userInfo) {
      // console.log('app', app.globalData)
      console.log('has userinfo!!!')
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
      // this.decryptInfo()
    } else if (this.data.canIUse) {
      console.log('ttttt')
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        console.log('app777777', res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        app.globalData.userInfo = res.userInfo
        app.globalData.hasUserInfo = true
        console.log('set global data', app.globalData.userInfo)
        this.decryptInfo(res)
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserProfile({
        desc: '申请获取你的个人信息',
        success: res => {
          app.globalData.userInfo = res.userInfo
          app.globalData.hasUserInfo = true
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        },
        error: res => {
          console.log('error', res)
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  imgLoadFunc(e) {
    var width = e.detail.width
    var height = e.detail.height
    var wrapperWidth = this.data.windowWidth
    if (height / width > 4 / 3) {
      var imageWidth = wrapperWidth
      var imageHeight = imageWidth * height / width
      var wrapperHeight = 4 * wrapperWidth / 3
      var wrapperTop = 0.2 * this.data.windowHeight
      var wrapperBottom = wrapperTop + wrapperHeight
      var titleOffset = wrapperBottom + 0.07 * this.data.windowHeight
      var smTitleOffset = wrapperBottom + 0.12 * this.data.windowHeight
      var smTitle2Offset = wrapperBottom + 0.15 * this.data.windowHeight
      this.setData({
        'displayMode': 'widthFix',
        'textColor': 'white',
      })
    } else if (height / width > 1) {
      var imageWidth = wrapperWidth
      var imageHeight = imageWidth * height / width
      var wrapperHeight = wrapperWidth
      var wrapperTop = 0.2 * this.data.windowHeight
      var wrapperBottom = wrapperTop + wrapperHeight
      var titleOffset = wrapperBottom + 0.10 * this.data.windowHeight
      var smTitleOffset = wrapperBottom + 0.15 * this.data.windowHeight
      var smTitle2Offset = wrapperBottom + 0.18 * this.data.windowHeight
      this.setData({
        'displayMode': 'widthFix',
        'textColor': 'white',
      })
    } else {
      var imageHeight = wrapperWidth
      var imageWidth = imageHeight * width / height
      var wrapperHeight = wrapperWidth
      var wrapperTop = 0.2 * this.data.windowHeight
      var wrapperBottom = wrapperTop + wrapperHeight
      var titleOffset = wrapperBottom + 0.1 * this.data.windowHeight
      var smTitleOffset = wrapperBottom + 0.15 * this.data.windowHeight
      var smTitle2Offset = wrapperBottom + 0.18 * this.data.windowHeight
      this.setData({
        'displayMode': 'heightFix',
        'textColor': 'black',
      })
      // var imageWidth = wrapperWidth
      // var imageHeight = imageWidth * height / width
      // var wrapperHeight = 4 * wrapperWidth / 3
      // var wrapperTop = 0.2 * this.data.windowHeight
      // var wrapperBottom = wrapperTop + wrapperHeight
      // var titleOffset = wrapperBottom + 0.07 * this.data.windowHeight
      // var smTitleOffset = wrapperBottom + 0.12 * this.data.windowHeight
      // var smTitle2Offset = wrapperBottom + 0.15 * this.data.windowHeight
      // this.setData({
      //   'displayMode': 'widthFix',
      // })
    }
    this.setData({
      'imageHeight': imageHeight,
      'imageWidth': imageWidth,
      'wrapperWidth': wrapperWidth,
      'wrapperHeight': wrapperHeight,
      'wrapperTop': wrapperTop,
      'wrapperBottom': wrapperBottom,
      'titleOffset': titleOffset,
      'smTitleOffset': smTitleOffset,
      'smTitle2Offset': smTitle2Offset
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  getUserInfo(e) {
    console.log('cccccc', e)
    if (app.getDecryptedFromStorage() !== true || !app.globalData.userInfo) {
      wx.getUserProfile({
        desc: '获取你的个人信息',
        success: (res) => {
          console.log('777777', res)
          app.globalData.userInfo = res.userInfo
          app.globalData.hasUserInfo = true
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
          e.detail = {
            ...e.detail,
            ...res,
          }
          this.decryptInfo(e.detail, () => {
            this.upload()
          })
        }
      })
    } else {
      this.upload()
    }
  },


  decryptInfo(res, callback = null) {
    app.getAccesstoken(() => {
      wx.request({
        url: app.globalData.baseUrl + '/model-api/auth/wx/v4/decrytion',
        data: {
          encryptedData: res.encryptedData,
          iv: res.iv,
        },
        header: {
          Accesstoken: app.getTokenFromStorage(),
          'USER_SYSTEM': '2'
        },
        method: 'POST',
        success: ({
          data: data
        }) => {
          console.log('get decrypt', data)
          if (data.code === 9530) {
            app.reset()
            return
          }
          app.setDecryptedFromStorage(true)
          console.log('decrypt', data)
          if (callback) {
            callback()
          }
        }
      })
      // wx.request({
      //   url: app.globalData.baseUrl + '/model-api/api/vx/v1/getUserInfo',
      //   method: 'GET',
      //   header: {
      //     Accesstoken: app.getTokenFromStorage(),
      //     'USER_SYSTEM': '2'
      //   },
      //   success: ({ data: data }) => {
      //     if (data.code === -7) {
      //       app.reset()
      //       return
      //     }
      //     console.log('userlogin info', data)
      //   }
      // })
    })

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})