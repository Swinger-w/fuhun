// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    init: true,
    imgUrl: "",
    imgUp: true,
    windowHeight: app.globalData.windowHeight,
    windowWidth: app.globalData.windowWidth,
    firstBtnMsg: "上传照片",
    secondBtnMsg: "来段文案",
    userInfo: {},
    hasUserInfo: false,
    infoText1: 'Hi～我是布灵',
    infoText2: '上传一张照片试试吧～',
    backgroundImgs: [],
    backgroundImg: '',
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // app.clear()
    // wx.redirectTo({
    //   url: '../success/success',
    // })
    this.loadBackground()
    this.animation1 = wx.createAnimation({
      duration: 2000,
      timingFunction: 'ease'
    });
    this.animation2 = wx.createAnimation({
      duration: 2000,
      timingFunction: 'ease'
    });
    this.setData({
      navHeight: app.globalData.navHeight,
      navTop: app.globalData.navTop,
      windowHeight: app.globalData.windowHeight,
      windowWidth: app.globalData.windowWidth,
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
        if (app.getDecryptedFromStorage() !== true) {
          this.decryptInfo(res)
        }
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
  decryptInfo(res) {
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
        success: ({ data: data }) => {
          console.log('decrypt', data)
          if (data.code === 9530) {
            app.reset()
            return
          }
          app.setDecryptedFromStorage(true)
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
  loadBackground() {
    wx.request({
      url: app.globalData.baseUrl + '/model-api/fh/v1/getBackgroundImg',
      success: ({ data: { data: images } }) => {
        console.log('data', images)
        let backgroundImg = images[Math.floor(Math.random() * images.length)]
        this.setData({
          backgroundImgs: images,
          imgUrl: backgroundImg
        })
      }
    })
  },
  getUserInfo(e) {
    console.log(e)
    // app.globalData.userInfo = e.detail.userInfo
    wx.getUserProfile({
      desc: '申请获取你的个人信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        app.globalData.userInfo = res.userInfo
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
    app.globalData.hasUserInfo = true

  },
  upload_pic: function () {
    if (this.data.firstBtnMsg === '上传照片') {
      wx.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
          console.log('res', res)
          if (res.tempFilePaths[0].indexOf('.jpg') < 0 && res.tempFilePaths[0].indexOf('.png') < 0 && res.tempFilePaths[0].indexOf('.jpeg') < 0) {
            wx.showToast({
              title: '图片格式不正确',
              icon: 'none',
              duration: 4000
            })
            return
          }
          this.setData({
            imgUrl: res.tempFilePaths ? res.tempFilePaths[0] : '',
            imgUp: false,
            init: false,
          })
          app.globalData.imgUrl = this.data.imgUrl
          console.log('set global data of img', app.globalData.imgUrl)
        },
      })
    } else {
      this.animation1.translateY(0).step();
      this.animation2.translateY(-app.globalData.windowHeight / 12).step();
      this.setData({
        animation1: this.animation1.export(),
        animation2: this.animation2.export(),
        firstBtnMsg: "上传照片",
        secondBtnMsg: "来段文案",
        infoText1: 'Hi～我是布灵',
        infoText2: '上传一张照片试试吧～',
        imgUp: false
      })
    }

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
            this.goB()
          })
        }
      })
    } else {
      this.goB()
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
  goB() {
    wx.redirectTo({
      url: '../ground/ground',
    })
  },
  fuhun() {
    console.log('this.data', this.data)
    if (this.data.secondBtnMsg === '来段文案') {
      console.log('6666', app.globalData.windowHeight)
      this.animation1.translateY(app.globalData.windowHeight * 3 / 5).step();
      this.animation2.translateY(app.globalData.windowHeight / 4).step();
      this.setData({
        animation1: this.animation1.export(),
        animation2: this.animation2.export(),
        firstBtnMsg: "再次上传",
        secondBtnMsg: "保存图片",
        infoText1: '马上就好哦～',
        infoText2: '客官请稍等哦～'
      });
      console.log('666')
      console.log('this.data,', this.data.imgUrl)
      app.getAccesstoken(() => {
        wx.uploadFile({
          filePath: this.data.imgUrl,
          name: 'file',
          url: app.globalData.baseUrl + '/model-api/dispatcher/img/forecastByFh',
          header: {
            Accesstoken: app.getTokenFromStorage(),
            'USER_SYSTEM': '2'
          },
          formData: {
            partten: '2',
            appId: app.globalData.appId
          },
          success: ({ data: data }) => {
            console.log('res', data, typeof data)
            if (data.indexOf('413 Request Entity Too Large') >= 0) {
              wx.showToast({
                title: '图片过大',
                icon: 'none',
                duration: 4000
              })
              return
            }
            if (typeof data === 'string') {
              data = JSON.parse(data)
            }
            if (data.code === 11306) {
              wx.showToast({
                title: '图片不符合规范',
                icon: 'none',
                duration: 4000
              })
              return
            }
            if (data.code === -1) {
              wx.showToast({
                title: '服务器繁忙',
                icon: 'none',
                duration: 4000
              })
              return
            }
            const des = data?.data?.des
            const fileId = data?.data?.fileId
            console.log('get des', des)
            console.log('get file', fileId)
            app.globalData.des = des
            app.globalData.fileId = fileId
            wx.redirectTo({
              url: '../success/success',
            })
          },
          fail: () => {
            wx.showToast({
              title: '服务器繁忙',
              icon: 'none',
              duration: 4000
            })
          }
        })
      })
    } else {
      this.animation1.translateY(-app.globalData.windowHeight * 3 / 5).step();
      this.animation2.translateY(-app.globalData.windowHeight / 6).step()
      this.setData({
        animation1: this.animation1.export(),
        animation2: this.animation2.export(),
        firstBtnMsg: "再次上传",
        secondBtnMsg: "保存图片",
        infoText1: 'Hi～我是布灵',
        infoText2: '上传一张照片试试吧～',
      });
    }
  },
  // 保存图片
  saveImg: function (e) {
    let that = this;
    //获取相册授权
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              //这里是用户同意授权后的回调
              that.saveImgToLocal();
            },
            fail() { //这里是用户拒绝授权后的回调
              that.setData({
                openSettingBtnHidden: false
              })
            }
          })
        } else { //用户已经授权过了
          that.saveImgToLocal();
        }
      }
    })
  },

  saveImgToLocal: function (e) {
    let that = this;
    let imgSrc = that.data.imgUrl;
    wx.downloadFile({
      url: imgSrc,
      success: function (res) {
        console.log(res);
        //图片保存到本地
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function (data) {
            wx.showToast({
              title: '保存成功',
              icon: 'success',
              duration: 2000
            })
          },
        })
      }
    })
  }
})