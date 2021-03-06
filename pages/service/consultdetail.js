// pages/service/noticedetail.js
var util = require('../../utils/util.js')
var api = require('../../utils/api.js')

var p = 1
var l = []
var GetList = function (that) {
  let params = {
    pageNo: p,
    pageSize: 6,
    id: that.data.id
  }
  api.getconsultcoment({
    isNoToken: false,
    data: params,
    success: function (res) {
      if (res.data.code == 200) {
        if (res.data.data.records.length == 0) {

          that.setData({
            nomore: false,
            pullDown: true,
          });
          if (p == 1) {
            that.setData({
              repalylist: []
            });
          }
        } else {
          l = l.concat(res.data.data.records)
          for (var i = 0; i < l.length; i++) {
            l[i].publishTime2 = util.formatTime(new Date(l[i].publishTime))
            l[i].replyTime2 = util.formatTime(new Date(l[i].replyTime))
          }

          that.setData({
            repalylist: l,
            pullDown: true,
            nomore: true,
          });
          p++;
        }
      }

    }
  

  });
}

var app = getApp();
Page({
  data: {
    list: '',
    repalylist: [],
    pullDown: true,//控制上拉gif的变量
    nomore: true,//数据是否加载完毕
    id: '',
    totastHide1: true,                        //自定义的totast显示隐藏变量
    totastContent1: "该附件无法预览，请从网页版下载查看...",
    files: [],
    totastHide2: true,                        //自定义的totast显示隐藏变量
    totastContent2: ""
  },
  onLoad: function (options) {
    this.setData({
      id: options.id
    })
  },
  detail:function(){
    api.getconsultInfo({
      isNoToken: false,
      data: { id: this.data.id },
      complete: (res) => {
        if (res.data.code == 200) {
          this.data.list = res.data.data
          this.data.list.publishTime = util.formatTime(new Date(res.data.data.publishTime))
          this.setData({
            list: this.data.list,
            files: res.data.data.url ? JSON.parse(res.data.data.url) : ''
          })

        }
        if (res.data.code == 'd_003') {
          this.data.totastContent2 = res.data.msg
          this.setData({
            totastHide2: false,
            totastContent2: this.data.totastContent2 
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
  onShow: function () {
    this.detail()
    // 回复列表
    var that = this
    p = 1
    l = []
    GetList(that)
  },
  onPullDownRefresh: function () {
    this.detail()
    p = 1;
    this.setData({
      list: [],
    });
    l = []
    var that = this
    GetList(that)
    wx.stopPullDownRefresh()
  },
  onReachBottom: function () {
    this.setData({
      pullDown: false
    });

    var that = this
    GetList(that)

  },
  // 回复看法
  btnClick: function () {
    wx.navigateTo({
      url: './articlesub?id=' + this.data.id,
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