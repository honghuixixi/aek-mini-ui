
var util = require('../../utils/util.js')
var api = require('../../utils/api.js')
var p = 1
var l = []
var GetList = function (that) {
  let params = {
    pageNo: p,
    pageSize: 12,    
    status: that.data.tabIndex
  }
  if (that.data.searchName) {
    params.keyword = that.data.searchName
  }
  api.pollingList({
    isNoToken: false,
    data: params,
    success: function (res) {
      if (res.data.code == 200) {

          that.setData({
              tag:true
             
          });


        if (p == 1) {
          that.setData({
            list2: [],
            list1: []
          });
          l = []
        }

        if (res.data.data.records.length == 0) {
          that.setData({
            nomore: false,
            pullDown: true,
          });
          if (p == 1) {
            if (that.data.tabIndex==2){
              that.setData({
                list2: []
              });
            }
            if (that.data.tabIndex == 1) {
              that.setData({
                list1: []
              });
            }
            
          }
        } else {
          l = l.concat(res.data.data.records)
          for (var i = 0; i < l.length; i++) {
            l[i].nextDate2 = util.formatday(new Date(l[i].nextDate))
          }

          
          if (that.data.tabIndex == 2) {
            that.setData({
              list2: l,
              pullDown: true
            });
          }
          if (that.data.tabIndex == 1) {
            that.setData({
              list1: l,
              pullDown: true
            });
          }
          p++;
          console.log(that.data.list2)
        }
      }

    }

  });
}

var app = getApp();
Page({

  data: {
    tabIndex: 2,
    list2: [],//巡检中的列表
    list1: [],//待巡检的列表
    pullDown: true,//控制上拉gif的变量
    nomore: true,//数据是否加载完毕
    keyword: '',//关键字
    pollingLimit: true,

    tag:true

  },
  onLoad:function(){
    this.setData({
      pollingLimit: wx.getStorageSync("userInfo").authoritiesStr ? wx.getStorageSync("userInfo").authoritiesStr.indexOf('QC_PLAN_IMPLEMENT') != -1 : false
    })
  },
  onShow() {
    this.setData({
      tabIndex: app.globalData.pollIndex
    })
    var that = this
    p = 1
    l = []
    GetList(that)
  },

  onPullDownRefresh: function () {

    p = 1;
    this.setData({
      list2: [],
      list1: [],
      tag:false
    });
    l = []
    var that = this
    GetList(that)
    wx.stopPullDownRefresh()
  },
  onReachBottom: function () {

      if(this.data.tag){
          this.setData({
              pullDown: false
          });

          var that = this
          GetList(that)
      }



  },
  // 点击跳转搜索页面
  search: function () {
    console.log('search')
    wx.navigateTo({
        url: '../search/search?k=manageSearch&p=请输入巡检计划名称/编号',
    })
  },
  // 跳转到消息的详情页面
  goDetail: function (e) {
    
    wx.navigateTo({
      url: '.?id=' + e.currentTarget.dataset.infoid,
    })
  },
   // 选择tabbar切换
  changeIndex:function(e){
    this.setData({
      tabIndex: e.target.dataset.chooseIndex,
      searchName:''
    })
    app.globalData.pollIndex = this.data.tabIndex
    var that = this
    p = 1
    l = []
    GetList(that)
  },      
  assetList:function(e){
    wx.navigateTo({
      url: '../polling/assetList?id=' + e.currentTarget.dataset.asset,
    })
  },
  startImp: function (e) {
    wx.navigateTo({
      url: '../polling/planDetail?id=' + e.currentTarget.dataset.asset,
    })
  }
})