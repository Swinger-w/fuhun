// pages/ground/ground.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeButton: 0,
    currentPage: 1,
    buttons: [{
      index: 0,
      name: '最新上传',
    },
    {
      index: 1,
      name: '最受欢迎',
    },
    {
      index: 2,
      name: '随便看看'
    }
    ],
    results: [],
    activeIndex: 0,
  },

  setOperation(result, type, resultIndex) {
    wx.request({
      url: app.globalData.baseUrl + '/model-api/fh/v4/agreeDo',
      header: {
        'content-type': 'application/json',
        Accesstoken: app.getTokenFromStorage(),
        'USER_SYSTEM': '2'
      },
      method: 'POST',
      data: {
        fileId: result.fileId.toString(),
        type: type
      },
      success: ({
        data: {
          data: data,
          code: code
        }
      }) => {
        if (code === -7) {
          app.reset()
          return
        }
        if (code === -1) {
          console.log('error')
          return
        }
        console.log('!!!!', data)

        let key = 'results[' + resultIndex + '].operation.like'
        this.setData({
          [key]: data ? data.countNumber[0].count : 0
        })
        key = 'results[' + resultIndex + '].operation.happy'
        this.setData({
          [key]: data ? data.countNumber[1].count : 0
        })
        key = 'results[' + resultIndex + '].operation.think'
        this.setData({
          [key]: data ? data.countNumber[2].count : 0
        })
      }
    })
  },

  switchActive(e) {
    console.log('e', e)
    let activeIndex = e.target.dataset.value.index
    this.setData({
      activeButton: activeIndex,
      results: []
    })
    this.loadData()
  },

  loadMore() {
    console.log('load more')
    this.setData({
      currentPage: this.data.currentPage + 1,
    })
    this.loadData()
  },

  operate(e) {
    console.log('e, ', e)
    let result = e.target.dataset.value
    let resultIndex = e.target.dataset.index
    let type = e.target.dataset.type
    console.log('result', result)
    app.getAccesstoken(() => {
      this.setOperation(result, type, resultIndex)
    })
  },

  toRight() {
    if (this.data.activeIndex >= this.data.results.length - 1) {
      return
    }
    this.setData({
      activeIndex: this.data.activeIndex + 1
    })

    // load when max
    console.log('this.data.activeIndex', this.data.activeIndex)
    console.log('this.data.this.data.currentPage', this.data.currentPage)

    if (this.data.activeIndex === (this.data.currentPage + 1) * 10 - 1) {
      this.loadMore()
    }
  },

  toLeft() {
    if (this.data.activeIndex === 0) {
      return
    }
    this.setData({
      activeIndex: this.data.activeIndex - 1
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      navHeight: app.globalData.navHeight,
      navTop: app.globalData.navTop,
      windowWidth: app.globalData.windowWidth,
      windowHeight: app.globalData.windowHeight,
      userInfo: app.globalData.userInfo
    })
    let menuOffset = app.globalData.windowHeight * 0.42
    let menuOffset2 = menuOffset
    this.setData({
      menuOffset: menuOffset - 0.01 * app.globalData.windowHeight,
      menuOffset2: menuOffset2 + 0.01 * app.globalData.windowHeight
    })
    this.loadData()
  },

  imgLoadFunc(e) {
    var width = e.detail.width
    var height = e.detail.height
    var wrapperWidth = 0.6 * this.data.windowWidth
    if (height / width > 4 / 3) {
      var imageWidth = wrapperWidth
      var imageHeight = imageWidth * height / width
      var wrapperHeight = 4 * wrapperWidth / 3
      var wrapperTop = 0.38 * this.data.windowHeight
      var wrapperBottom = wrapperTop + wrapperHeight
      var titleOffset = wrapperBottom + 0.07 * this.data.windowHeight
      var smTitleOffset = wrapperBottom + 0.12 * this.data.windowHeight
      var smTitle2Offset = wrapperBottom + 0.15 * this.data.windowHeight
      this.setData({
        'displayMode': 'widthFix',
      })
    } else if (height / width > 1) {
      var imageWidth = wrapperWidth
      var imageHeight = imageWidth * height / width
      var wrapperHeight = wrapperWidth
      var wrapperTop = 0.45 * this.data.windowHeight
      var wrapperBottom = wrapperTop + wrapperHeight
      var titleOffset = wrapperBottom + 0.10 * this.data.windowHeight
      var smTitleOffset = wrapperBottom + 0.15 * this.data.windowHeight
      var smTitle2Offset = wrapperBottom + 0.18 * this.data.windowHeight
      this.setData({
        'displayMode': 'widthFix',
      })
    } else {
      var imageHeight = wrapperWidth
      var imageWidth = imageHeight * width / height
      var wrapperHeight = wrapperWidth
      var wrapperTop = 0.45 * this.data.windowHeight
      var wrapperBottom = wrapperTop + wrapperHeight
      var titleOffset = wrapperBottom + 0.1 * this.data.windowHeight
      var smTitleOffset = wrapperBottom + 0.15 * this.data.windowHeight
      var smTitle2Offset = wrapperBottom + 0.18 * this.data.windowHeight
      this.setData({
        'displayMode': 'heightFix',
      })
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

  imgLoadFuncLeft(e) {
    var width = e.detail.width
    var height = e.detail.height
    var wrapperWidth = 0.6 * this.data.windowWidth
    if (height / width > 4 / 3) {
      var imageWidth = wrapperWidth
      var imageHeight = imageWidth * height / width
      var wrapperHeight = 4 * wrapperWidth / 3
      var wrapperTop = 0.38 * this.data.windowHeight
      var wrapperBottom = wrapperTop + wrapperHeight
      var titleOffset = wrapperBottom + 0.07 * this.data.windowHeight
      var smTitleOffset = wrapperBottom + 0.12 * this.data.windowHeight
      var smTitle2Offset = wrapperBottom + 0.15 * this.data.windowHeight
      this.setData({
        'displayModeLeft': 'widthFix',
      })
    } else if (height / width > 1) {
      var imageWidth = wrapperWidth
      var imageHeight = imageWidth * height / width
      var wrapperHeight = wrapperWidth
      var wrapperTop = 0.45 * this.data.windowHeight
      var wrapperBottom = wrapperTop + wrapperHeight
      var titleOffset = wrapperBottom + 0.10 * this.data.windowHeight
      var smTitleOffset = wrapperBottom + 0.15 * this.data.windowHeight
      var smTitle2Offset = wrapperBottom + 0.18 * this.data.windowHeight
      this.setData({
        'displayModeLeft': 'widthFix',
      })
    } else {
      var imageHeight = wrapperWidth
      var imageWidth = imageHeight * width / height
      var wrapperHeight = wrapperWidth
      var wrapperTop = 0.45 * this.data.windowHeight
      var wrapperBottom = wrapperTop + wrapperHeight
      var titleOffset = wrapperBottom + 0.1 * this.data.windowHeight
      var smTitleOffset = wrapperBottom + 0.15 * this.data.windowHeight
      var smTitle2Offset = wrapperBottom + 0.18 * this.data.windowHeight
      this.setData({
        'displayModeLeft': 'heightFix',
      })
    }
    this.setData({
      'imageHeightLeft': imageHeight,
      'imageWidthLeft': imageWidth,
      'wrapperWidthLeft': wrapperWidth,
      'wrapperHeightLeft': wrapperHeight,
      'wrapperTopLeft': wrapperTop,
      'wrapperBottomLeft': wrapperBottom,
      'titleOffsetLeft': titleOffset,
      'smTitleOffsetLeft': smTitleOffset,
      'smTitle2OffsetLeft': smTitle2Offset
    })
  },

  imgLoadFuncRight(e) {
    var width = e.detail.width
    var height = e.detail.height
    var wrapperWidth = 0.6 * this.data.windowWidth
    if (height / width > 4 / 3) {
      var imageWidth = wrapperWidth
      var imageHeight = imageWidth * height / width
      var wrapperHeight = 4 * wrapperWidth / 3
      var wrapperTop = 0.38 * this.data.windowHeight
      var wrapperBottom = wrapperTop + wrapperHeight
      var titleOffset = wrapperBottom + 0.07 * this.data.windowHeight
      var smTitleOffset = wrapperBottom + 0.12 * this.data.windowHeight
      var smTitle2Offset = wrapperBottom + 0.15 * this.data.windowHeight
      this.setData({
        'displayModeRight': 'widthFix',
      })
    } else if (height / width > 1) {
      var imageWidth = wrapperWidth
      var imageHeight = imageWidth * height / width
      var wrapperHeight = wrapperWidth
      var wrapperTop = 0.45 * this.data.windowHeight
      var wrapperBottom = wrapperTop + wrapperHeight
      var titleOffset = wrapperBottom + 0.10 * this.data.windowHeight
      var smTitleOffset = wrapperBottom + 0.15 * this.data.windowHeight
      var smTitle2Offset = wrapperBottom + 0.18 * this.data.windowHeight
      this.setData({
        'displayModeRight': 'widthFix',
      })
    } else {
      var imageHeight = wrapperWidth
      var imageWidth = imageHeight * width / height
      var wrapperHeight = wrapperWidth
      var wrapperTop = 0.45 * this.data.windowHeight
      var wrapperBottom = wrapperTop + wrapperHeight
      var titleOffset = wrapperBottom + 0.1 * this.data.windowHeight
      var smTitleOffset = wrapperBottom + 0.15 * this.data.windowHeight
      var smTitle2Offset = wrapperBottom + 0.18 * this.data.windowHeight
      this.setData({
        'displayModeRight': 'heightFix',
      })
    }
    this.setData({
      'imageHeightRight': imageHeight,
      'imageWidthRight': imageWidth,
      'wrapperWidthRight': wrapperWidth,
      'wrapperHeightRight': wrapperHeight,
      'wrapperTopRight': wrapperTop,
      'wrapperBottomRight': wrapperBottom,
      'titleOffsetRight': titleOffset,
      'smTitleOffsetRight': smTitleOffset,
      'smTitle2OffsetRight': smTitle2Offset
    })
  },

  shuffle(array) {
    let counter = array.length;

    // While there are elements in the array
    while (counter > 0) {
      // Pick a random index
      let index = Math.floor(Math.random() * counter);

      // Decrease counter by 1
      counter--;

      // And swap the last element with it
      let temp = array[counter];
      array[counter] = array[index];
      array[index] = temp;
    }

    return array;
  },

  loadData() {
    let urlPath = '/model-api/fh/v4/getUserUploadHistoryRecord'
    if (this.data.activeButton === 0) {
      // todo: repalce url
      urlPath = '/model-api/fh/v4/getUserUploadHistoryRecord'
      //urlPath = '/model-api/app/fh/bestPopular'
    } else {
      urlPath = '/model-api/fh/v1/bestPopular'
    }
    app.getAccesstoken(() => {
      wx.request({
        url: app.globalData.baseUrl + urlPath,
        header: {
          Accesstoken: app.getTokenFromStorage(),
          'USER_SYSTEM': '2'
        },
        data: {
          current: this.data.currentPage,
          size: 10,
          // total: 10,
        },
        success: ({
          data: data
        }) => {
          if (data.code === -7) {
            app.reset()
            return
          }
          console.log('get result', data)
          if (data && data.data && data.data.records) {
            // only shuffle when activeButton == 2
            // if (this.data.activeButton === 2) {
            //   data.data.records = this.shuffle(data.data.records)
            // }
            // console.log('shuffle', data.data.records)
            // data.data.records.forEach(record => {
            //   record.operation = {
            //     like: 0,
            //     happy: 0,
            //     think: 0
            //   }
            //   if (record.map && record.map.countNumber && record.map.countNumber.length === 3) {
            //     record.operation.like = record.map.countNumber[0].count
            //     record.operation.happy = record.map.countNumber[1].count
            //     record.operation.think = record.map.countNumber[2].count
            //   }
            // })
            this.setData({
              results: [...this.data.results, ...data.data.records],
              activeIndex: 0,
            })
          }
        }
      })
    })
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

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

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



  getUserInfoClick(e) {
    console.log('6666', e)
    console.log('cccccc', e)
    if (app.getDecryptedFromStorage() !== true) {
      wx.getUserProfile({
        desc: '获取你的个人信息',
        success: (res) => {
          console.log('777777', res)
          app.globalData.userInfo = res.userInfo
          if (e.detail && res.iv) {
            console.log('?')
            e.detail = {
              ...e.detail,
              ...res
            }
            this.decryptInfo(e.detail, () => {
              this.operate(e)
            })
          }
        }
      })
    } else {
      this.operate(e)
    }
  },

  uploadAgain() {
    wx.navigateTo({
      url: '../index/index',
    })
  },
  copyData() {
    wx.setClipboardData({
      data: this.data.results[this.data.activeIndex].des,
      success (res) {
        wx.getClipboardData({
          success (res) {
            console.log(res.data) // data
          }
        })
      }
    })
  },

  deleteData() {
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success: (res) =>{
        if (res.confirm) {
          app.getAccesstoken(() => {
            wx.request({
              url: app.globalData.baseUrl + '/fh/v4/delete',
              data: {
                fileId: this.data.results[this.data.activeIndex].fileId,
              },
              header: {
                Accesstoken: app.getTokenFromStorage(),
                'USER_SYSTEM': '2'
              },
              // method: 'DELETE',
              success: ({
                data: data
              }) => {
                console.log('delete data', data)
                this.loadData()
              }
            })
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
    
  
  },

  getUserInfoToUserCenter(e) {
    console.log('dddddddddddddddd', e)
    if (e.detail && e.detail.detail && !e.detail.detail.iv) {
      // reject
      return
    }
    if (e.detail && e.detail.detail && e.detail.detail.userInfo) {
      // app.globalData.userInfo = e.detail.detail.userInfo
      wx.getUserProfile({
        desc: '申请获取你的个人信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
        success: (res) => {
          app.globalData.userInfo = res.userInfo
        }
      })
    }
    console.log('888', e)
    if (app.getDecryptedFromStorage() !== true) {
      this.decryptInfo(e.detail.detail, () => {
        wx.redirectTo({
          url: '../mine/mine',
        })
      })
    } else {
      wx.redirectTo({
        url: '../mine/mine',
      })
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
          console.log('decrypt', data)
          if (data.code === 9530) {
            app.reset()
            return
          }
          app.setDecryptedFromStorage(true)
          if (data.code === 10010) {
            return
          }
          try {
            // set userInfo
            let d = JSON.parse(data?.data)
            app.globalData.userInfo = d
          } catch (e) {

          }

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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  goA: function () {
    wx.redirectTo({
      url: '../index/index',
    })
  }
})