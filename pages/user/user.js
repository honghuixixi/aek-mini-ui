var app = getApp()
var util = require('../../utils/util.js')
var api = require('../../utils/api.js')
Page({
    data: {
        userName: '嘻嘻哈哈',
        userMsg: {}
    },
    // 消息提醒开关的动作
    switch1Change: function (e) {
        //console.log('switch1 发生 change 事件，携带值为', e.detail.value)
        //enable=true||false&userId=1
        console.log(e)
        api.enableOrDisableReceiveWeChatMessage({
            isNoToken: false,
            data: {
                'userId': wx.getStorageSync("userInfo").id,
                'enable': e.detail.value
            },
            success: function (res) {
                if (res.data.code == 200) {
                    _this.data.userMsg.receiveWeChatMessageFlag = e.detail.value;
                    _this.setData(_this.data.userMsg)
                }
            }
        })
    },
    // 退出系统
    exit: function () {
        wx.showModal({
            // title: '提示',
            confirmColor: '#508cee',
            cancelColor: '#999',
            content: '确定退出系统吗？',
            success: function (res) {

                if (res.confirm) {
                    console.log('用户点击确定'),
                        // 退出
                        api.loginOut({
                            isNoToken: false,
                            data: {},
                            success: function (res) {
                                if (res.data.code == 200) {
                                    wx.clearStorageSync()
                                    wx.redirectTo({
                                        url: '../login/login',
                                    })
                                }
                            }
                        })
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
    },
    // 修改姓名
    reviseName: function (e) {
        wx.navigateTo({
            url: '../revisename/revisename?nowName=' + this.data.userMsg.realName
        })
    },
    // 修改密码
    revisePsd: function (e) {
        wx.navigateTo({
            url: '../revisepsd/revisepsd'
        })
    },
    // 意见反馈
    suggest: function () {
        console.log('跳到公众号里面')
    },
    onShow: function () {
        //app.editTabBar();
        let _this = this
        api.getUserDetail({
            isNoToken: false,
            data: {
                'id': wx.getStorageSync("userInfo").id
            },
            success: function (res) {
                if (res.data.code == 200) {
                    _this.setData({
                        userMsg: res.data.data,
                    })
                }
            }
        })
    },
    //拨打电话
    call: function () {
        wx.makePhoneCall({
            phoneNumber: '400-052-5256' //仅为示例，并非真实的电话号码
        })
    }
})