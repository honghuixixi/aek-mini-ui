// pages/msglist/msglist.js
var util = require('../../utils/util.js')
var api = require('../../utils/api.js')

var p = 1
var l = []
var GetList = function (that) {

  api.repairlist({
    data: {
     
      status: that.data.status,
      isAsc: false,
      pageNo: p,
      pageSize: 6,
     
      assetsDeptName: that.data.dept,//部门 
      tenantId:  wx.getStorageSync("userInfo").tenantId,
      
    },
    isNoToken: false,
    complete: function (res) {
      if (res.data.code == 403) {
        setTimeout(() => {
          that.setData({
            loading: false
          })
        }, 250)
      }
    },
    success: function (res) {
      if (res.data.code == 200) {

        that.setData({
          loading: false
        })
        if (res.data.data.records.length == 0) {
          that.setData({
            nomore: false,
            filter: true,
            pullDown: true,
          });
          if (p == 1) {
            that.setData({
              cardList: []
            });
          }
        } else {
          l = l.concat(res.data.data.records)
          that.setData({
            cardList: l,
            filter: true,
            pullDown: true
          });
          p++;
        }


        for (let i = 0; i < that.data.cardList.length; i++) {
          if (that.data.cardList[i].assetsImg) {
            that.data.cardList[i].assetsImg = that.data.cardList[i].assetsImg.indexOf(that.data.PIC_URL) != -1 ? that.data.cardList[i].assetsImg.split(',')[0] : that.data.PIC_URL + that.data.cardList[i].assetsImg.split(',')[0]
          }
          that.data.cardList[i].reportRepairDate = util.formatTime(new Date(that.data.cardList[i].reportRepairDate))
          console.log(that.data.cardList[i].assetsImg)
        }
        that.setData({
          cardList: that.data.cardList
        });

      }


    }

  });
}
var app = getApp()
Page({
  data: {
    longtapHide: true,//选择上传图片类型的modal控制显示隐藏
    longtapList: ['标记为已读', '置顶','删除'],//选择上传图片的模态框的列表
    longtapeq: -1,//选择状态的角标
    over: false,//当有弹窗的时候页面不滚动
    filter: true,//控制过滤弹窗的变量
    active: '',//点击筛选里面的状态，加上点击的类,默认为全部
    nomore: true,//数据是否加载完毕
    userInfo: wx.getStorageSync("userInfo"),
    deptId: '',//部门id
    pullDown: true,//控制上拉gif的变量
    searchName: '',//搜索的名字
    loading: true,//动画变量
   
    deptList: [],
    showDeptlist: true,
    dept: '',//部门名称
    isErweima: false,
    addapplyLimit: wx.getStorageSync("userInfo").authoritiesStr ? wx.getStorageSync("userInfo").authoritiesStr.indexOf('REP_APPLY_NEW') != -1 : false,//新建维修单的权限
    repairlistLimit: wx.getStorageSync("userInfo").authoritiesStr ? wx.getStorageSync("userInfo").authoritiesStr.indexOf('REP_APPLY_VIEW') != -1 : false,//查看维修     列表的权限
    PIC_URL: app.globalData.PIC_URL,
    keyword: '',//关键字
    status:'',
    total:'',
    msgList:''
  },
 

  // 弹窗方法
  chooseHost: function (event) {
    this.setData({
      longtapeq: event.currentTarget.dataset.hospId,
      longtapHide: true,
    })
  //选择的是拍照
    if (this.data.longtapeq == 0) {
   
    } else if (this.data.longtapeq == 1){
  
  }else{

  }
},
  // 时间转化1
  transformData: function (data) {
    let _length = data.length;
    for (var i = 0; i < _length; i++) {
      data[i].reportRepairDate = util.formatTime(new Date(data[i].reportRepairDate))
    }
    return data;
  },
  // 跳转到操作页面
  repairDetail: function (e) {
   if(this.data.status!=2){
     wx.navigateTo({
       url: '../repair/repairoperate?applyid=' + e.currentTarget.dataset.repairId
     })
   }else{
     wx.navigateTo({
       url: '../repair/repair?applyid=' + e.currentTarget.dataset.repairId
     })
   }
   
  },
  onLoad: function (options) {
    this.setData({
      status: options.status,
      total: options.total
     })
  },
  //获取消息的待办总数量
  getMsgStatus: function () {
    let sum = 0
    let _this = this;
    api.getMsgStatus({
      isNoToken: false,
      data: {
        tenantid: wx.getStorageSync("userInfo").tenantId
      },
      success: function (res) {
        res.data.data.splice(-1)
        _this.setData({
          msgList: res.data.data
        });
        if (_this.data.status == 1) {
          wx.setNavigationBarTitle({
            title: '维修管理-待接单' 
          })
        } else if (_this.data.status == 2) {
          wx.setNavigationBarTitle({
            title: '维修管理-待维修'
          })
        } else if (_this.data.status == 3) {
          wx.setNavigationBarTitle({
            title: '维修管理-待验收' 
          })
        }
      }

    })
  },
  onShow:function(){
    this.setData({
      addapplyLimit: wx.getStorageSync("userInfo").authoritiesStr ? wx.getStorageSync("userInfo").authoritiesStr.indexOf('REP_APPLY_NEW') != -1 : false,//新建维修单的权限
      repairlistLimit: wx.getStorageSync("userInfo").authoritiesStr ? wx.getStorageSync("userInfo").authoritiesStr.indexOf('REP_APPLY_VIEW') != -1 : false,//查看维修     列表的权限
    })

    this.getMsgStatus()


    var that = this
    p = 1
    l = []
    GetList(that)
  },
  onPullDownRefresh: function () {
    //下拉  
  
    p = 1;
    this.setData({
      cardList: [],

    });
    l = []

    var that = this
    GetList(that)
    wx.stopPullDownRefresh()

  },
  onReachBottom: function () {
    //上拉  
    // pullDown
  
    this.setData({
      pullDown: false,

    });

    var that = this
    GetList(that)

  },
  hostModal: function () {
    // 如果是选择图片的弹窗
    if (!this.data.longtapHide) {
      this.setData({
        longtapHide: true
      })
    }
  }
})



  
