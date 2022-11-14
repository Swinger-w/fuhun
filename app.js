// app.js
const accessTokenStorageKey = 'access_token'
const decryptedStorageKey = 'decrypted'

App({
  getTokenFromStorage() {
    console.log('!!!!!', wx.getStorageSync(accessTokenStorageKey))
    return wx.getStorageSync(accessTokenStorageKey)
  },

  getDecryptedFromStorage() {
    return wx.getStorageSync(decryptedStorageKey)
  },

  setDecryptedFromStorage(value) {
    console.log('set decrypted key to ', value)
    wx.setStorageSync(decryptedStorageKey, value)
  },

  setTokenToStorage(token) {
    this.setDecryptedFromStorage(false)
    wx.setStorageSync(accessTokenStorageKey, token)
  },
  getAccesstoken(callback) {
    if (this.getTokenFromStorage()) {
      callback()
      return
    }
    this.refreshToken(callback)
  },
  clear() {
    console.log('clear')
    this.setTokenToStorage(null)
    this.setDecryptedFromStorage(null)
    this.globalData.userInfo = null
  },
  reset() {
    console.log('reset')
    this.setTokenToStorage(null)
    wx.redirectTo({
      url: '../index/index',
    })
    this.onLaunch()
  },
  refreshToken(callback = null) {
    // 登录
    console.log('mmmmddddm')
    wx.login({
      success: res => {
        console.log('login result', res)
        if (res.code) {
          console.log('get code', res.code)
          wx.request({
            url: this.globalData.baseUrl + '/model-api/auth/wx/v1/getToken',
            data: {
              code: res.code
            },
            success: ({ data: data }) => {
              // this.globalData.accessToken = data.data
              console.log('get new access token', data.data)
              this.setTokenToStorage(data.data)
              // console.log('get accesstoken', this.globalData.accessToken)
              if (callback) {
                callback()
              }
            }
          })
        }
      }
    })
  },
  onLaunch() {
    // 在app.js里写下以下代码

    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
        console.log('onCheckForUpdate====', res)
        // 请求完新版本信息的回调
        if (res.hasUpdate) {
          console.log('res.hasUpdate====')
          updateManager.onUpdateReady(function () {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              success: function (res) {
                console.log('success====', res)
                // res: {errMsg: "showModal: ok", cancel: false, confirm: true}
                if (res.confirm) {
                  // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                  updateManager.applyUpdate()
                }
              }
            })
          })
          updateManager.onUpdateFailed(function () {
            // 新的版本下载失败
            wx.showModal({
              title: '已经有新版本了哟~',
              content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~'
            })
          })
        }
      })
    }
    // this.globalData.accessTokenStorageKey = 'token'
    this.globalData.baseUrl = 'https://wudaoai.cn'    // 产线环境,必须去校验域名
    // this.globalData.baseUrl = 'http://120.92.111.73'  // 测试环境,不需要校验域名
    // this.globalData.baseUrl = 'http://localhost'
    this.globalData.appId = '1356106039468142594'
    let menuButtonObject = wx.getMenuButtonBoundingClientRect();
    wx.getSystemInfo({
      success: res => {
        let statusBarHeight = res.statusBarHeight,
          navTop = menuButtonObject.top, //胶囊按钮与顶部的距离
          navHeight = statusBarHeight + menuButtonObject.height + (menuButtonObject.top - statusBarHeight) * 2; //导航高度
        this.globalData.navHeight = navHeight;
        this.globalData.navTop = navTop;
        this.globalData.windowHeight = res.windowHeight;
        this.globalData.windowWidth = res.windowWidth;
      },
      fail(err) {
        console.log(err);
      }
    })
    let token = this.getTokenFromStorage()
    console.log('init token', token)
    // if (!token) {
    //   console.log('token does not exists')
    //   this.refreshToken()
    // }
    console.log('dd')
    // 获取用户信息
    wx.getSetting({
      success: res => {
        console.log('res', res)
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserProfile({
            desc: '申请获取个人信息',
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              console.log(this.globalData)
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        } else {
          console.log('no')
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    //getAccessToken: getAccessToken
  }
})