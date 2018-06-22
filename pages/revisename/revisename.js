// pages/revisename/revisename.js
var util = require('../../utils/util.js')
var api = require('../../utils/api.js')
Page({

  data: {
    username:'',//从上个页面传的用户姓名
    totastHide:true,//totast提示的显示隐藏
    totastContent:'仅能输入40个字符',//totast提示的内容
    content:'提交',
    disabled:false
  },

  onLoad: function (options) {
    this.setData({
      username: options.nowName
    })
  },
  // 监听input
  bindValue:function(e){
    // 每次都把值存起来
    this.setData({
      username: e.detail.value,
    })
    if (e.detail.value.length>40){
      // 超过40个字符，totast提示
      this.setData({
        totastHide: false,

      })
      setTimeout(() => {
        this.setData({
          totastHide: true
        })
      }, 1500)
    }
  },
  // 提交事件
btnClick:function(){
  let _this = this
  api.rewriteName({
    isNoToken: false,
    data: {
      'id': wx.getStorageSync("userInfo").id,
      'updateBy': wx.getStorageSync("userInfo").id,
      'realName': _this.data.username
    },
    success: function (res) {
      if (res.data.code == 200) {
        wx.navigateBack({
          url: '../user/user'
        })  
      }
    }
  })
}

})