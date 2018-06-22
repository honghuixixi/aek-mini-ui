/**
 * auther @aiyou
 */
let tab = require('./components/tab/tab');
//app.js
App({
    onLaunch: function () {
        //调用API从本地缓存中获取数据
        var logs = wx.getStorageSync('logs') || []
        logs.unshift(Date.now())
        wx.setStorageSync('logs', logs)
        wx.setEnableDebug({
            enableDebug: true
        })
    },
    getUserInfo: function (cb) {
        var that = this
        if (this.globalData.userInfo) {
            typeof cb == "function" && cb(this.globalData.userInfo)
        } else {
            //调用登录接口
            wx.getUserInfo({
                withCredentials: false,
                success: function (res) {
                    that.globalData.userInfo = res.userInfo
                    typeof cb == "function" && cb(that.globalData.userInfo)
                }
            })
        }
    },
    //刷新权限
    refreshPermission: function (query) {
        //api.getPermissionList();

    },
    //初始化进行跳转
    editTabBar: function () {
        var tabbar = this.globalData.tabbar,
            currentPages = getCurrentPages(),
            _this = currentPages[currentPages.length - 1],
            pagePath = _this.__route__;
        (pagePath.indexOf('/') != 0) && (pagePath = '/' + pagePath);
        for (var i in tabbar.list) {
            tabbar.list[i].selected = false;
            (tabbar.list[i].pagePath == pagePath) && (tabbar.list[i].selected = true);
        }
        _this.setData({
            tabbar: tabbar
        });
    },
    //自定义tabbar组件 
    globalData: {
        tabbar: {
            color: "#000000",
            selectedColor: "#0f87ff",
            backgroundColor: "#ffffff",
            borderStyle: "black",
            list: [
                {
                    pagePath: "/pages/workplat/workplat",
                    text: "工作台",
                    iconPath: "/static/images/work.png",
                    selectedIconPath: "/static/images/workblue.png",
                    selected: true
                },
                {
                    pagePath: "/pages/message/message",
                    text: "消息",
                    iconPath: "/static/images/message.png",
                    selectedIconPath: "/static/images/messageblue.png",
                    selected: false
                },
                {
                    pagePath: "/pages/user/user",
                    text: "我的",
                    iconPath: "/static/images/my.png",
                    selectedIconPath: "/static/images/myblue.png",
                    selected: false
                }
            ],
            position: "bottom"
        },
        isNavigate: true,
        isSave: true,
        userInfo: null,
        assetListIndex: 1,
        pollIndex: 2,
        // 线上地址
        // API_URL: "https://ebey.aek56.com/api",
        // PIC_URL: "https://ebey.aek56.com/api/file/"

        //测试环境-feat
        //  API_URL: 'http://feat.aek.com/api',
        //  PIC_URL:"http://feat.aek.com/api/file/"
        
        // 测试环境-dev
        API_URL: "http://dev.aek.com:8081/api",
        PIC_URL: "http://dev.aek.com:8081/api/file/"
    }
})
