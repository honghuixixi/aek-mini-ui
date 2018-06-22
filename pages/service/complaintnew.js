// pages/service/complaintnew.js
var util = require('../../utils/util.js')
var api = require('../../utils/api.js')
Page({

  data: {
    type:0,//类型
    typename:'',//类型名称
    optionsList: ['售后服务', '质量缺陷', '操作使用', '产品配置', '其它'],
    disabled:true,//a按钮
    email:'',
    wx:'',
    productor:'',
    manufacturer:'',
    title:'',
    content:'',
    totastHide:true,
    totastContent:'邮箱格式不正确！'
  },
  // 提交事件
  btnClick:function(){
    this.setData({
      disabled: true
    })
    // 先判断如果写了邮箱校验
    if (this.data.email){
      var myreg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/
      if (myreg.test(this.data.email)) {
        // 格式正确
        let param = {
          productor: this.data.productor,
          manufacturer: this.data.manufacturer,
          type: this.data.type,
          title: this.data.title,
          content: this.data.content,
        }
        if (this.data.wx) {
          param.wx = this.data.wx
        }
        if (this.data.email) {
          param.email = this.data.email
        }
        this.submint(param)
        
      }else{
        // 弹窗提示
        this.setData({
          totastHide:false
        })
        setTimeout(() => {
          this.setData({
            totastHide: true
          })
        }, 1500)
        this.setData({
          disabled: false
        })
      }
    }else{
      let param = {
        productor: this.data.productor,
        manufacturer: this.data.manufacturer,
        type: this.data.type,
        title: this.data.title,
        content: this.data.content,
      }
      if(this.data.wx){
        param.wx = this.data.wx
      }
      this.submint(param)

    }
  },
  submint:function(param){
    api.subcomplaint({
      isNoToken: false,
      data: param,
      success: res=> {
        if (res.data.code == 200) {
          wx.navigateTo({
            url: './complaintlist',
          })
        }

      },
      complete: (res) => {
        this.setData({
          disabled: false
        })
      }
    })
  },

  // actionsheet事件
  actionsheet:function(){
    wx.showActionSheet({
      itemList: this.data.optionsList,
      itemColor:'#333',
      success:(res) =>{
       
        this.setData({
          type: res.tapIndex + 1,
          typename: this.data.optionsList[res.tapIndex]
        })
        this.watch()
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
    
  },
  emailinput:function(e){
    this.setData({
      email: e.detail.value.replace(/^\s*/g, "")
    })
    this.watch()
  },
  wxinput: function (e) {
    this.setData({
      wx: e.detail.value.replace(/^\s*/g, "")
    })
    this.watch()
  },
  productorinput: function (e) {
    this.setData({
      productor: e.detail.value.replace(/^\s*/g, "")
    })
    this.watch()
  },
  manufacturerinput: function (e) {
    this.setData({
      manufacturer: e.detail.value.replace(/^\s*/g, "")
    })
    this.watch()
  },
  titleinput: function (e) {
    this.setData({
      title: e.detail.value.replace(/^\s*/g, "")
    })
    this.watch()
  },
  contentinput: function (e) {
    this.setData({
      content: e.detail.value.replace(/^\s*/g, "")
    })
    this.watch()
  },
  watch:function(){
    if (this.data.productor && this.data.manufacturer && this.data.title && this.data.content && this.data.type){
      this.setData({
        disabled:false
      })
    }else{
      this.setData({
        disabled: true
      }) 
    }
  }

})