var api = require('../../utils/api.js');
var util = require('../../utils/util.js');
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        baseImgUrl: app.globalData.PIC_URL.substr(0, app.globalData.PIC_URL.length - 1),
        id: 0,
        status: 2,
        record: {},
        showMsg: false,
        msg: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            id: options.id,
            status: +options.status
        });
        api.pmAcceptInfo(options.id, {
            isNoToken: false,
            data: {},
            success: (res) => {
                if (res.data.code == 200) {
                    res.data.data.endDateStr = util.formatday(new Date(res.data.data.endDate));
                    res.data.data.liveStr = {
                        '1': '正常工作',
                        '2': '小问题，不影响使用',
                        '3': '有故障，需要维修',
                        '4': '不能使用'
                    }[res.data.data.live];
                    res.data.data.files = res.data.data.files || [];
                    this.setImgFlag(res.data.data);
                    this.setData({
                        record: res.data.data
                    });
                }
            }
        });
    },
    accept: function () {
        api.pmAccept(this.data.id, {
            isNoToken: false,
            data: {},
            success: (res) => {
                this.showMsg('验收成功', () => {
                    wx.navigateBack({});
                });
            },
            fail: (msg) => {
                this.showMsg(msg, () => {
                    wx.navigateBack({});
                });
            }
        });
    },
    showMsg: function (msg, fun) {
        this.setData({
            showMsg: true,
            msg: msg
        });
        setTimeout(() => {
            this.setData({
                showMsg: false
            })
            if (typeof fun == 'function') {
                fun();
            }
        }, 2000);
    },
    lookBig: function (e) {
        wx.navigateTo({
            url: '../bigpicture/bigpicture?uri=' + e.currentTarget.dataset.filesUrl,
        });
    },
    lookFile: function (e) {
        this.showMsg('该附件无法预览，请从网页版下载查看');
    },
    setImgFlag: function (obj) {
        if (obj.files) {
            for (var i = 0, len = obj.files.length; i < len; i++) {
                obj.files[i].isImg = this.isImg(obj.files[i].url);
            }
        }
    },
    isImg: function (name) {
        var suportsuffix = "png|jpg|jpeg|gif|bmp",
            suffix = name.substr(name.lastIndexOf('.') + 1).toLocaleLowerCase();
        return suportsuffix.indexOf(suffix) >= 0;
    }
})