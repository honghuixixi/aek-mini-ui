// pages/service/noticedetail.js
var util = require('../../utils/util.js')
var api = require('../../utils/api.js')
Page({
    data: {
        list: '',
        totastHide1: true,                        //自定义的totast显示隐藏变量
        totastContent1: "该附件无法预览，请从网页版下载查看...",
        totastHide2: true,                        //自定义的totast显示隐藏变量
        totastContent2: "内容不存在",
        files: []
    },
    onLoad: function (options) {
        api.getnoticeInfo({
            isNoToken: false,
            data: options,
            complete: (res) => {
                if (res.data.code == 200) {
                    this.data.list = res.data.data
                    this.data.list.publishTime = util.formatTime(new Date(res.data.data.publishTime))
                    this.setData({
                        contents: util.convertImage(res.data.data.content),
                        list: this.data.list,
                        files: res.data.data.url ? JSON.parse(res.data.data.url) : []
                    })
                    console.log(this.data)
                }
               
            },
            fail:(msg,res) => {
              if(res.data.code == 'd_003') {
                this.setData({
                  totastHide2: false
                })
                setTimeout(() => {
                  this.setData({
                    totastHide2: true
                  })
                  wx.navigateBack({

                  })
                }, 1500)


              }
            }
        })
    },
    // 查看大图
    lookBig: function (e) {
        var uri = e.currentTarget.dataset.filesUrl
        var canlook = uri.indexOf('.jpg') != -1 || uri.indexOf('.jpeg') != -1 || uri.indexOf('.png') != -1
        if (canlook) {
            // 能查看
            wx.navigateTo({
                url: '../bigpicture/bigpicture?uri=' + uri,
            })

        } else {
            this.setData({
                totastHide1: false
            })
            setTimeout(() => {
                this.setData({
                    totastHide1: true
                })
            }, 500)
        }
    },

})