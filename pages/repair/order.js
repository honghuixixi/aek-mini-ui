var util = require('../../utils/util.js')
var api = require('../../utils/api.js')
Page({
  data: {
    loading: true,//动画变量
    msgData:''

  },
  onLoad: function (options) {
    console.log('kkkk')
    var _this = this
    // 查看接单的接口
    api.optionGet({
      data: {
        id: options.applyid
      },
      isNoToken: false,
      success: function (res) {
        if (res.data.code == 200) {
          _this.setData({ 
            msgData: res.data.data
          })
          setTimeout(() => {
            _this.setData({
              loading: false
            })
          }, 500)
          _this.data.msgData.predictReachDate = util.formatTime(new Date(_this.data.msgData.predictReachDate))
          _this.setData({
            msgData: _this.data.msgData
          })
        
        }
      }
    })
  },
})