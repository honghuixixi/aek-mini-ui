// pages/repair/bigImg.js
var util = require('../../utils/util.js')
var api = require('../../utils/api.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    msgData:[],
    PIC_URL: app.globalData.PIC_URL,
    current:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      current: options.current
      
    })
    let _this=this
    api.repairdetail({
      data: {
        id: options.applyid
      },
      isNoToken: false,
      success: function (res) {
        if (res.data.code == 200) {
          _this.setData({
            msgData: res.data.data,
          })
          console.log(_this.data.msgData)
          _this.data.msgData.assetsImg = _this.data.msgData.assetsImg ? _this.data.msgData.assetsImg.split(',') : ''
          _this.setData({
            msgData: _this.data.msgData
          })
        }
      }
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})