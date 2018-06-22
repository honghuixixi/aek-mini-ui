// pages/assestbook/assestlist.js
var util = require('../../utils/util.js')
var api = require('../../utils/api.js')
var app = getApp()
Page({
  data: {
    // 变量到时候看后台数据统一改
    uri: "/static/images/position.png",//设备图片
    deviceName: '哈哈哈哈哈哈哈哈',//设备名称
    producer: '哈哈哈',//生产商
    size: 'HY200',//规格型号
    dept: '',//所在部门,
    deptId: '',
    status: '验收通过',
    userInfo: wx.getStorageSync("userInfo"),
    cardList: [],
    over: false,//当有弹窗的时候页面不滚动
    filter: true,//控制过滤弹窗的变量
    active:-1,//点击筛选里面的状态，加上点击的类,默认为全部
    searchName: '',
    deptList: [],
    showDeptlist: true,
    PIC_URL: app.globalData.PIC_URL,
    currentPage: 1,
    pullDown: true,
    nomore: true,
    all:0

  },
  onShow: function () {
    //获取设备列表
    this.getPreList({
      "keyword": this.data.searchName
    });
  },
  onLoad: function (query) {
    this.getdeptTree()
  },
  // 获取焦点，跳转到搜索设备页面
  search: function () {
    wx.navigateTo({
      url: 'beforeassestsearch',
    })
  },
  //获取部门列表树
  getdeptTree: function () {
    var _this = this;
    api.getdeptTree({
      isNoToken: false,
      data: {
        "tenantId": wx.getStorageSync("userInfo").tenantId
      },
      success: function (res) {
        _this.setData({
          deptList: res.data.data
        })
      }
    })
  },
  // 点击二维码扫描
  scan: function () {
    wx.scanCode({
      onlyFromCamera: true,
      success: (res) => {
        console.log(res)
      }
    })
  },
  // 点击筛选，出现弹窗
  filter: function () {
    this.setData({
      filter: false,
      over: true
    })
  },
  // 点击弹窗自己消失
  filterClick: function () {
    this.setData({
      filter: true,
      over: false
    })
  },
  getPreList: function (params, fun) {
    let _this = this;
    if (this.data.active ){

    }
    api.getPreassetsList({
      data: {
        'tenantId': (params && params.tenantId) || this.data.userInfo.tenantId || wx.getStorageSync("userInfo").tenantId,
        'deptId': params && params.deptId ? params.deptId : '',
        'page.current': (params && params.page) || 1,
        'page.size': (params && params.size) || 15,
        'sort': (params && params.sort) || 1,
        'keyword': (params && params.keyword) || '',
        'status': this.data.active == -1 ? "": this.data.active
      },
      isNoToken: false,
      success: function (res) {
        if(fun && typeof fun === "function") {
          fun();
        }
        if (!res.data.data.records) {
          this.setData({
            nomore: false,
            pullDown: true
          })
          return;
        }
        _this.setData({
          cardList: res.data.data.records,
          pullDown: true,
          nomore: true
        });
        for (let i = 0; i < _this.data.cardList.length; i++) {
          if (_this.data.cardList[i].assetsImg) {
            _this.data.cardList[i].assetsImg = _this.data.PIC_URL + _this.data.cardList[i].assetsImg.split(',')[0]
          }
        }
        _this.setData({
          cardList: _this.data.cardList
        });
      }
    })
  },
  // 点击当前的状态加上点击时的类
  statusClick: function (e) {
    this.setData({
      active: e.currentTarget.dataset.status,
      all: e.currentTarget.dataset.all,
      filter: false
    })
    console.log(this.data.filter)
  },
  // 点击筛选弹窗的确定按钮
  filterAssestList: function () {
    // 传给后台的状态用active变量
    this.getPreList({
      "deptId": this.data.deptId,
      "status": this.data.active,

    })
  },
  // 点击重置的按钮
  reset: function () {

    this.setData({
      active: -1,
      deptId: '',
      dept: '',
      filter:false
    })
    console.log(this.data.filter)
  },
  chooseDeptId: function (e) {
    this.setData({
      filter: !this.data.filter,
      showDeptlist: !this.data.showDeptlist,
      dept: e.target.dataset.name,
      deptId: e.target.dataset.id,
      over: true
    })
   console.log(this.data.over)
  },
  hiddendeptlist: function () {
    this.setData({
      showDeptlist: !this.data.showDeptlist,
      over:false
    })
    console.log(this.data.over)
  },
  // 选择部门
  chooseDept: function () {
    this.setData({
      filter: true,
      showDeptlist: false,
      over:true
    })
    console.log(this.data.over)
    this.getdeptTree()
  },
  /**
   * 加载更多
   */
  onPullDownRefresh: function () {
    this.getPreList({
      "keyword": this.data.searchName
    }, function () {
      wx.stopPullDownRefresh();
    });

  },
  onReachBottom: function () {
    console.log("上拉加载");
    this.setData({
      currentPage: this.data.currentPage + 1
    })
    this.setData({
      pullDown: false
    })
    this.getPreList({
      "page": this.data.currentPage
    })

  },
  // 跳转到预台账详情页
  beforeassestdetail: function (e) {
    wx.navigateTo({
      url: 'beforeassestdetail?assestId=' + e.currentTarget.dataset.id,
    })
  },
  // 添加预台帐
  addassest: function () {
    wx.navigateTo({
      url: 'newbeforeassest',
    })
  }
})