//index.js
//获取应用实例
var app = getApp()
var util = require('../../utils/util.js')
var api = require('../../utils/api.js')
Page({
  data: {
    mobile: '',//手机号
    code: '',//验证码
    phonePass: false,//校验手机号格式的对勾显示掩藏变量,如果通过的话,获取验证码按钮即可点击
    disabled: true,//传给btn组件的变量，置灰控制变量
    content: "登录",//组件btn的文字
    getText:"获取验证码",//获取验证码的文字，后期要改成重新获取验证码
    count:60,//倒计时的秒数
    showNum:false,//控制获取验证码文字跟倒计时的切换的变量
    deviceId:"",
    totastHide:true,
    totastContent:''
  },
  
  // 校验手机号是否正确
  getPhone: function (e) {
    let tel = /^1[3|4|5|8|7]\d{9}$/
    if (tel.test(e.detail.value)) {
    //  手机号格式正确以后，将手机号存入相应变量，并且对勾显示
      this.setData({
        mobile: e.detail.value,
        phonePass: true
      })
    } else {
      this.setData({
        phonePass: false
      })
    }
    //如果已经输入密码，按钮高亮
    
    if (this.data.code && this.data.phonePass) {

      this.setData({
        disabled: false
      })
    } else {
      this.setData({
        disabled: true
      })
    }
  },
  // 获取验证码(可以点击在页面上已经控制了disabled)
  getCode: function () {
    // 请求成功之后，倒计时出现，并且按钮文字变成重新获取验证码,
    let _this=this
    _this.setData({
      deviceId: util.getUid()
    })
    api.getMsgCaptcha({
      isNoToken:true,
      data: {
        mobile: this.data.mobile,
        deviceId: this.data.deviceId
      },
      complete: function (res) {
        console.log("全执行");
        console.log(res)
        if (res.data.code != 200) {
          _this.setData({
            totastContent:res.data.msg,
            totastHide:false
          })
           setTimeout(function(){
             _this.setData({
              totastHide: true
             })
           },1500)
         }
      },
      contentType:"application/x-www-form-urlencoded",
      success: function (res) {
        _this.setData({
          showNum: true,
          getText: "重新获取验证码"
        })
        _this.setData({
          count: 60
        })
        // 倒计时
        util.getCountDown(_this);
      }
    })
  },
  // 输入验证码并且手机号通过按钮高亮可点击
  inputCode: function (e) {
    this.setData({
      code: e.detail.value,
    })
    if (e.detail.value && this.data.phonePass) {
      // 输入验证码,并且有对勾出现,存验证码,并且出现倒计时，按钮高亮
      this.setData({
        disabled: false
      })
    } else {
      this.setData({
        disabled: true
      })
    }
  },
  //事件处理函数
  // 跳转到密码登录
  passwordLogin: function () {
    wx.navigateBack({
      url: 'login'
    })
  },

  // 短信登录事件
  btnClick: function () {
    let _this=this
    api.login({
      isNoToken: true,
      data: {
        username: this.data.mobile,
        password: this.data.code,
        deviceId: this.data.deviceId,
        loginType: 1
      },
      complete: function (res) {
        console.log("全执行");
        console.log(res)
        if (res.data.code != 200) {
          _this.setData({
            totastContent: res.data.msg,
            totastHide: false
          })
          setTimeout(function () {
            _this.setData({
              totastHide: true
            })
          }, 1500)
        }
      },
      success: function (res) {
        if (res.data.code == 200) {

          wx.setStorageSync(
            'authToken', JSON.stringify({ 'token': res.data.token, 'expire': res.data.expire })
          )
          wx.switchTab({
            url: '../workplat/workplat',
          })
        }
      }
    })
  }

})
