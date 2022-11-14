// pages/ground/ground.js
const app = getApp()
console.log('globalData', app.globalData)
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rate: 1,
    like: 100,
    currentPage: 1,
    windowWidth: app.globalData.windowWidth,
    previewImageWidthAndHeight: null,
    currentDetail: {},
    showDetail: false,
    activeButton: 3,
    buttons: [
      {
        name: '我的喜欢',
        index: 0,
      },
      {
        name: '我的惊喜',
        index: 1,
      },
      {
        name: '我的思考',
        index: 2,
      },
      {
        name: '上传记录',
        index: 3,
      }
    ],
    results: [],
    activeIndex: 1,
  },

  loadMore(e) {
    
    this.loadData()
  },

  switchActive(e) {
    console.log('e', e)
    let activeIndex = e.target.dataset.value.index
    this.setData({
      activeButton: activeIndex,
      results: [],
      currentPage: 0,
    })
    this.loadData()
  },

  setOperation(result, type) {
    app.getAccesstoken(() => {
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
        success: ({ data: { data: data } }) => {
          if (data && data.code === 9530) {
            app.reset()
            return
          }
          console.log('!!!!', data)
          let key = 'currentDetail.operation.like'
          this.setData({
            [key]: data.countNumber[0].count
          })
          key = 'currentDetail.operation.happy'
          this.setData({
            [key]: data.countNumber[1].count
          })
          key = 'currentDetail.operation.think'
          this.setData({
            [key]: data.countNumber[2].count
          })
        }
      })
    }) 
    
  },


  operate(e) {
    let result = e.detail.value
    let type = e.detail.type
    console.log('result', result)
    app.getAccesstoken(() => {
      this.setOperation(result, type)
    })
  },

  tapDetail(e) {
    console.log('eeeee', e)
    this.setData({
      showDetail: false,
    })
  },
  toRight() {
    if (this.data.activeIndex >= this.data.results.length - 1) {
      return
    }
    this.setData({
      activeIndex: this.data.activeIndex + 1
    })
  },

  loadDataCallback(data) {
    if (data && data.data && data.data.records) {
      data.data.records.forEach(record => {
        record.operation = {
          like: 0,
          happy: 0,
          think: 0
        }
        if (record.filePath && !(record.filePath.indexOf('http') > -1)) {
          record.filePath = app.globalData.baseUrl + '/' + record.filePath
        }
        if (record.map && record.map.countNumber && record.map.countNumber.length === 3) {
          record.operation.like = record.map.countNumber[0].count
          record.operation.happy = record.map.countNumber[1].count
          record.operation.think = record.map.countNumber[2].count
        }
      })
      this.setData({
        results: [...this.data.results, ...data.data.records],
      })
    } else {
      // no valid data
      console.log('no valid data')
      return
    }
    console.log('results', this.data.results)
  },

  loadData() {
    let urlPath = '/model-api/fh/v4/getUserToImgSupportRecord'
    if (this.data.activeButton === 0 || this.data.activeButton === 1 || this.data.activeButton === 2) {
      urlPath = '/model-api/fh/v4/getUserToImgSupportRecord'
      let type = 1
      if (this.data.activeButton === 0) {
        type = 1
      }
      if (this.data.activeButton === 1) {
        type = 2
      }
      if (this.data.activeButton === 2) {
        type = 3
      }
      app.getAccesstoken(() => {
        wx.request({
          url: app.globalData.baseUrl + urlPath,
          data: {
            current: this.data.currentPage,
            size: 10,
            type: type
          },
          header: {
            'content-type': 'application/json',
            Accesstoken: app.getTokenFromStorage(),
            'USER_SYSTEM': '2'
          },
          method: 'GET',
          success: ({ data: data }) => {
            console.log('get result', data)
            if (data && data.data && data.data.records && data.data.records.length > 0) {
              this.setData({
                currentPage: this.data.currentPage + 1,
              })
            }
            if (data.code === 9530) {
              app.refreshToken(() => {
                console.log('get refresh token again')
                this.loadData()
              })
              return
            }
            this.loadDataCallback(data)
          }
        })
      })
    } else {
      urlPath = '/model-api/fh/v4/getUserUploadHistoryRecord'
      app.getAccesstoken(() => {
        wx.request({
          url: app.globalData.baseUrl + urlPath,
          data: {
            current: this.data.currentPage,
            size: 10,
          },
          header: {
            'content-type': 'application/json',
            Accesstoken: app.getTokenFromStorage(),
            'USER_SYSTEM': '2'
          },
          success: ({ data: data }) => {
            if (data && data.data && data.data.records && data.data.records.length > 0) {
              this.setData({
                currentPage: this.data.currentPage + 1,
              })
            }
            if (data.code === 9530) {
              app.reset()
              return
            }
            console.log('get result', data)
            this.loadDataCallback(data)
          }
        })
      })
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
      previewImageWidthAndHeight: app.globalData.windowWidth * 0.3,
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  clickItem(e) {
    console.log('item', e)
    this.setData({
      currentDetail: e.target.dataset.item,
      showDetail: true,
    })
  },

  goA: function () {
    wx.redirectTo({
      url: '../index/index',
    })
  }
})