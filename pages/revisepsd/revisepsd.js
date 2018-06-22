// pages/revisename/revisename.js
var util = require('../../utils/util.js')
var api = require('../../utils/api.js')
Page({
  data: {
    totastHide: true,//totast提示的显示隐藏
    totastContent: '当前密码不正确',//totast提示的内容
    content: '提交',//按钮的文字
    disabled: true,//按钮不可用
    oldpsd:'',//当前密码
    newpsd:'',//新密码
    oldflag:false,//当前密码的格式是否正确
    newflag:false,//新密码格式是否正确
    pathNew:'',
    pathOld:''
  },

  // 当前密码的input事件
  bindold: function (e) {
    let reg1 = /^[0-9a-zA-Z]{8,16}$/ 
    // 每次都把值存起来
    this.setData({
      oldpsd: e.detail.value,
     
    })
    let pathOld = reg1.test(this.data.oldpsd)
    this.setData({
    
      pathOld: pathOld
    })
    console.log(this.data.pathOld)
    // 如果当前密码格式正确，把当亲密码的标志变成true
    if (this.data.pathOld) {
      console.log('前端校验 当前密码格式正确')
      this.setData({
        oldflag: true,
      })
    }else{
     this.setData({
       oldflag: false,
     })
    }
    // 如果当前密码跟新密码格式都正确的话，按钮高亮
    if (this.data.newflag && this.data.oldflag) {
      console.log('按钮高亮')
      this.setData({
        disabled: false
      })
    } else {
      this.setData({
        disabled: true
      })
    }
  
 },
    // 新密码的input事件
  bindnew: function (e) {
    let reg = /^[0-9a-zA-Z]{8,16}$/ 
    // 每次都把值存起来
    this.setData({
      newpsd: e.detail.value,
    })
    let pathNew = reg.test(this.data.newpsd)
    this.setData({ 
     pathNew: pathNew
    })
    if (this.data.pathNew){
      this.setData({
        newflag: true,
      })
    } else {
      this.setData({
        newflag:false,
      })
     }
    if (this.data.newflag && this.data.oldflag) {
      console.log('按钮高亮')
      this.setData({
        disabled: false
      })
    }else{
      this.setData({
        disabled: true
      })
    }
  },
  onLoad:function(){
    this.setData({
      userInfoId: wx.getStorageSync("userInfo").id
    })
    console.log(this.data.userInfoId)
  },
  // 提交事件
  btnClick: function () {
    let _this = this
    api.nowPwd({
      isNoToken: false,
      data: {
        'userId': _this.data.userInfoId,
        'password': _this.data.oldpsd
      },
      success: function (res) {
        if (res.data.code == 200 ) {
          if (res.data.data != false){
          api.rewritePwd({
            isNoToken: false,
            data:{
              password: _this.data.newpsd
            },
            success: function (res) {
              if (res.data.code == 200) {
                // 修改成功
                // wx.navigateBack({
                //   url: '../user/user'
                // })  
                wx.clearStorageSync()
                wx.redirectTo({
                  url: '../login/login',
                })
              }
            }
          })
          }else{
            _this.setData({
              totastHide: false,
            })
            setTimeout(()=>{
              _this.setData({
                totastHide: true,
              })
            },1500)
          }
        }
      }
    })
  }
})