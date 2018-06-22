//index.js
//获取应用实例
var app = getApp()
var util = require('../../utils/util.js')
var api = require('../../utils/api.js')
Page({
  data: {
    username: '',//手机号
    pwd: '',//密码
    phonePass: false,//手机号校验成功之后的对号显示隐藏变量
    password: true,//控制查看密码的眼睛的变量
    disabled: true,//传给btn组件的变量，置灰控制变量
    content: "登录",//组件btn的文字,
    totastHide: true,
    totastContent: ''
  },

  // 校验手机号邮箱格式是否正确，监听input的input事件
  getuserName: function (e) {
    // this.data.username = e.detail.value
    // this.data.username = this.data.username.replace(/&/, '')
    let telEmail = /(^[\w.\-]+@(?:[a-z0-9]+(?:-[a-z0-9]+)*\.)+[a-z]{2,3}$)|(^1[3|4|5|8|7]\d{9}$)/
    let reg2 = /^[^\u4E00-\u9FA5\s]{1,40}$/
    if (telEmail.test(e.detail.value) || reg2.test(e.detail.value)) {
      //如果手机号邮箱格式正确，存手机号跟对勾显示
      this.setData({
        username: e.detail.value,
        phonePass: true
      })
     
    } else {
      this.setData({
        phonePass: false
      })
    }
    //如果已经输入密码，按钮高亮
    if (this.data.pwd && this.data.phonePass) {

      this.setData({
        disabled: false
      })
    }else{
      this.setData({
        disabled: true
      })
    }
  },
  onLoad: function (option) {
      if(option.reLogin) {
          this.setData({
              totastContent: '权限变更，请重新登录',
              totastHide: false
          });
          setTimeout(() => {
              this.setData({
                  totastContent: '',
                  totastHide: true
              })
          }, 1500);
      }
    // //判断是否有token 并在有效期内
    // let authToken = wx.getStorageSync('authToken');
    // //console.log('lllllll======')
    // //wx.clearStorageSync();
    // //console.log(authToken)
    // if (!authToken) return;
    // authToken = JSON.parse(authToken);
    // if ((+new Date() - authToken.expire) < 0) {
    //   //console.log('跳转之前')
    //   wx.reLaunch({
    //     url: '../workplat/workplat',
    //   })
    // }
      wx.clearStorageSync()
  },
  // 输入密码并且手机号通过按钮高亮可点击，监听input的input事件
  getPassword: function (e) {
    this.setData({
      pwd: e.detail.value,
    })
    if (e.detail.value && this.data.phonePass) {
      // 如果有对勾的显示，并且密码我输入了，按钮可的点击
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
  setPwdVisable: function () {

    this.setData({
      password: !this.data.password
    })
    console.log (this.data.password)
  },

  //事件处理函数
  // 跳转到短信登录
  messageLogin: function () {
    wx.navigateTo({
      url: 'messageLogin',
    })
  },
  // 跳转忘记密码
  findPwd: function () {
    wx.navigateTo({
      url: 'findLogin',
    })
  },
  // 密码登录事件，登录成功是用跳转到tabber的导航
  btnClick: function () {
    this.data.username = this.data.username.toLowerCase()
    let _this=this
    api.login2({
      data: {
        username: this.data.username,
        password: this.data.pwd,
        deviceId: util.getUid()
      },
      isNoToken: true,
      complete: function (res) {
        //   console.log(res);
        if (res.data && res.data.code != 200 && res.data.code!=414) {
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
