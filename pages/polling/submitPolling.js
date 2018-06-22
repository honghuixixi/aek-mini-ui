var util = require('../../utils/util.js')
var api = require('../../utils/api.js')
Page({
    /**
     * 页面的初始数据
     */
    data: {
        nexDate: '',
        id: null,
        analysis: '',
        condition: '',
        suggestion: '',
        readOnly: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let _this = this;
        this.setData({
            nexDate: options.nexDate,
            id: options.id
        });

        api.getImplementDetail({
            isNoToken: false,
            data: {
                id: options.id
            },
            success: function (res) {
                if (+res.data.code == 200) {
                    var user = wx.getStorageSync("userInfo");
                    var names = [];
                    if (res.data.data.checkMan){
                        names = res.data.data.checkMan.map(item => item.name);
                    }
                    _this.setData({
                        id: options.id,
                        // nexDate: res.data.data.nextDate ? util.formatday(new Date(res.data.data.nextDate)) : util.formatday(new Date()),
                        analysis: res.data.data.analysis,
                        condition: res.data.data.condition,
                        suggestion: res.data.data.suggestion,
                        checkMan: res.data.data.checkMan,
                        checkManNames: names.join("；"),
                        nextChargeMan: { id: user.id, name: user.realName}
                    });
                }
            },
            fail: function (msg, res) {
                _this.showToast(msg, function () {
                    wx.redirectTo({
                        url: 'managelist',
                    })
                });
            }
        });
    },
    /**
     * 下次计划日期
     */
    bindDateChange: function (e) {
        this.setData({
            nexDate: e.detail.value
        })
    },
    bindChooseUser: function () {
        wx.navigateTo({
            url: 'chooseNextUser'
        })
    },
    /**
     * 提交巡检
     */
    submitImp: function () {
        let _this = this;
        wx.showModal({
            title: '',
            content: '确定提交巡检吗？',
            success: function (res) {
                if (res.confirm) {
                    // console.log('用户点击确定');
                    api.subImplement({
                        isNoToken: false,
                        data: {
                            actualEndDate: new Date().getTime(),
                            ..._this.data
                        },
                        success: function (res) {
                            if (res.data.code == 200) {
                                wx.redirectTo({
                                    url: 'managelist',
                                });
                            }
                        },
                        fail: function (msg, res) {
                            // console.log(msg, res);
                            if (res.data.code == 'Q_003') {
                                return _this.showToast(msg);
                            }
                            _this.showToast(msg, function () {
                                wx.redirectTo({
                                    url: 'managelist',
                                })
                            });
                        }
                    });
                } else if (res.cancel) {
                    // console.log('用户点击取消');
                }
            }
        })
    },
    showToast: function (a, b) {
        this.setData({
            readOnly: true,
            toasterShow: true,
            toasterTxt: a
        });
        let _this = this;
        setTimeout(function () {
            _this.setData({
                // readOnly: false,
                toasterShow: false
            });
            b && b();
        }, 3000);
    },
    /**
     * textarea同步data
     */
    contentinput: function (e) {
        let obj = {};
        obj[e.target.dataset.keyName] = e.detail.value;
        this.setData(obj);
    }
})