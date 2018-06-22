// pages/service/articlesub.js
var util = require('../../utils/util.js')
var api = require('../../utils/api.js')
Page({
  data: {
    sum:0,
    content:'',
    id:'',
    totastHide: true,
    totastContent: '请输入回复内容',
    disabled:false,
    totastHide2: true,                        //自定义的totast显示隐藏变量
    totastContent2: "内容不存在",
  },
  onLoad: function (options) {
    this.setData({
      id: options.id
    })
  },
  changenum:function(e){

    this.setData({
      content: e.detail.value.replace(/^\s*/g, "")
    })
    this.setData({
      sum: this.data.content.length,
    })
  },
  // 发表回复
  btnClick: function () {
    this.setData({
      disabled: true
    })
    if (this.data.content){
       console.log(this.data.content)
    let param = {
      id: this.data.id,
      content: this.data.content
    }
    api.subarticlecomment({
      isNoToken: false,
      data: param,
      success: (res)=> {
        if (res.data.code == 200) {
          wx.navigateBack({
            url: './articledetail',
          })
        }

      },
      fail:(msg,res) => {
        if (res.data.code == 'd_003') {

          this.setData({
            delect: false,
            totastHide2: false
          })
          setTimeout(() => {
            this.setData({
              totastHide2: true
            })
            wx.navigateBack({
              delta: 2,
            })
          }, 1500)
        }
      },
      complete:(res)=>{
        this.setData({
          disabled: false
        })
      

      }
    })
    } else {
      // 弹窗提示
      this.setData({
        totastHide: false
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
  }

  

})