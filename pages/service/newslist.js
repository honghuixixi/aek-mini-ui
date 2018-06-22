var util = require('../../utils/util.js')
var api = require('../../utils/api.js')
var p = 1
var l = []
var GetList = function (that) {
  let params = {
    pageNo: p,
    pageSize: 6
  }
  if (that.data.searchName) {
    params.keyword = that.data.searchName
  }
  api.getnewsList({
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
              list: []
            });
          }
        } else {
          l = l.concat(res.data.data.records)
          for (var i = 0; i < l.length; i++) {
            l[i].publishTime2 = util.formatTime(new Date(l[i].publishTime))
            l[i].title2 = l[i].title ? l[i].title.length > 30 ? l[i].title.substring(0, 30) + '...' : l[i].title : ''
            l[i].content2 = util.getSubContent(l[i].content, 43) //l[i].content ? l[i].content.length > 43 ? l[i].content.substring(0, 43) + '...' : l[i].content : ''
          }

          that.setData({
            list: l,
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
    list: [],
    pullDown: true,//控制上拉gif的变量
    nomore: true,//数据是否加载完毕
    keyword: '',//关键字
  },

  onShow() {
    // console.log(this.data.keyword)
    var that = this
    p = 1
    l = []
    GetList(that)
  },

  onPullDownRefresh: function () {
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
  // 点击跳转搜索页面
  search: function () {
    wx.navigateTo({
      url: '../search/search?k=newsSearch&p=请输入关键字/监管机构名称查询',
    })
  },
  // 跳转到消息的详情页面
  goDetail: function (e) {
    // console.log(e)
    wx.navigateTo({
      url: './newsdetail?id=' + e.currentTarget.dataset.infoid,
    })
  }

})