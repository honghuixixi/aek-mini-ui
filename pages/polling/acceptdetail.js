var api = require('../../utils/api.js');
var util = require('../../utils/util.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
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
        api.pollingAcceptInfo(options.id, {
            isNoToken: false,
            data: {},
            success: (res) => {
                if (res.data.code == 200) {
                    res.data.data.checkManStr = res.data.data.checkMan.join('；');
                    res.data.data.planCycleStr = res.data.data.planCycle + (res.data.data.cycleType == 1 ? '个月' : '天');
                    res.data.data.endDateStr = util.formatday(new Date(res.data.data.endDate));
                    res.data.data.planTypeStr = res.data.data.planType == 1 ? '按科室巡检' : '';
                    this.setData({
                        record: res.data.data
                    });
                }
            }
        });
    },
    accept: function () {
        api.pollingAccept(this.data.id, {
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
    }
})