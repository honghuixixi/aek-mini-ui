
//获取应用实例
var app = getApp()
// 生成img文件的目录

var page;

// pages/index/index.js
 let tab=require("../../components/tab/tab.js")

var app = getApp()
Page({
  data: {
    userInfo: {},
    dataForTabbar: [
      {
        sIconUrl: tab.setImg("workblue"), //按钮图标
        sTitle: "工作台", //按钮名称
        url:"../workplat/workplat"
      },
      {
        sIconUrl: tab.setImg("message"), //按钮图标
        sTitle: "消息", //按钮名称
        url: "../message/message"
      },
      {
        sIconUrl: tab.setImg("my"), //按钮图标
        sTitle: "我的", //按钮名称
        url: "../user/user"
      },
    ],
    uri:'../../workplat/workplat',
    indexeq:0
  },
  onTabItemTap: tab.onTabItemTap,
  onLoad: function () {
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    })
  },
})
