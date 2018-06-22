//index.js
//获取应用实例
var app = getApp()
var util = require('../../utils/util.js')
var api = require('../../utils/api.js')
Page({
  data: {
    resetmobile: '',//绑定的手机号
    resetcode: '',//绑定的验证码
    resetpassword:'',//绑定新的密码
    phonePass: false,//手机号通过对勾出现
    password: true,//查看密码的眼睛
    disabled: true,//传给btn组件的变量，置灰控制变量
    content: "确定",//组件btn的文字
    count: 60,//倒计时的秒数
    showNum: false,//控制获取验证码文字跟倒计时的切换的变量
    getText: "获取验证码",//获取验证码的文字，后期要改成重新获取验证码
    totastHide: true,
    totastContent: '',
    passNew:''
  },
  // 校验手机号是否正确
  getnewPhone: function (e) {
    let tel = /^1[3|4|5|8|7]\d{9}$/
    if (tel.test(e.detail.value)) {
      // 手机号格式正确，存入手机号并且对勾出来
      this.setData({
        resetmobile: e.detail.value,
        phonePass: true
      })
    } else {
      this.setData({
        phonePass: false
      })
    }
    console.log()
    if (this.data.pathNew && this.data.phonePass && this.data.resetcode ) {
      this.setData({
        disabled: false
      })
    } else {
      this.setData({
        disabled: true
      })
    }
  },
  //点击获取验证码
  getnewCode: function () {
    let _this=this
    api.getCaptcha({
      isNoToken:true,
      data: {
        "account": this.data.resetmobile
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
          // 请求成功之后，倒计时出现，并且按钮文字变成重新获取验证码
          _this.setData({
            showNum: true,
            getText: "重新获取验证码"
          })
          // 倒计时
          // count
          _this.setData({
            count:60
          })
          util.getCountDown(_this);
        }
      }
    })
   
  },
  // 输入验证码存入变量
  inputnewCode: function (e) {
      this.setData({
        resetcode: e.detail.value,
      })
      console.log(this.data.resetcode)
      if (this.data.pathNew && this.data.phonePass && this.data.resetcode ) {
        this.setData({
          disabled: false
        })
      } else {
        this.setData({
          disabled: true
        })
      }
  },
  // 输入新密码，如果手机号格式正确，并且验证也输入了
  getnewPassword:function(e){
    let reg = /^[0-9a-zA-Z]{8,16}$/ 
    this.setData({
      resetpassword: e.detail.value,
    })
    let pathNew = reg.test(this.data.resetpassword)
    this.setData({
      pathNew: pathNew
    })
    if (this.data.pathNew && this.data.phonePass && this.data.resetcode ) {
      this.setData({
        disabled: false
      })
    } else {
      this.setData({
        disabled: true
      })
    }
  },
  // 点击眼睛查看密码
  showPassword: function () {
    this.setData({
      password: true
    })
  },
  hidePassword: function () {
    this.setData({
      password: false
    })
  },
  //事件处理函数
  // 重置密码登录事件
  btnClick: function () {
    let _this=this;
    api.resetPassword({
      isNoToken:true,
      data: {
        "account": this.data.resetmobile,
        "code": this.data.resetcode,
        "password": this.data.resetpassword
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
          wx.navigateTo({
            url: 'login',
          })
        }
      }
    })
  },
})
