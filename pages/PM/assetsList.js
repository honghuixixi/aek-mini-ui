
var util = require('../../utils/util.js')
var api = require('../../utils/api.js')
var p = 1
var l = []
var GetList = function (that) {
    var param = {
        pageNo: p,
        pageSize: 6
    }
    if (that.data.searchName.length) {
        param.keyword = that.data.searchName
    }

    api.PMassetsList({
        data: param,
        isNoToken: false,
        success: function (res) {
            if (res.data.code == 200) {
                let userInfo = wx.getStorageSync("userInfo");
                that.setData({
                    userInfo: userInfo,
                    dept: '',
                    limit: userInfo.authoritiesStr ? userInfo.authoritiesStr.indexOf('PM_PLAN_IMPLEMENT') != -1 : false,
                    loading: false
                })
                if (!that.data.limit) {
                    return that.showToast('你还没有PM实施权限，请联系管理员', function () {
                        wx.clearStorageSync();
                        wx.redirectTo({
                            url: '../login/login',
                        });
                    });
                }
                if (p == 1) {
                    l = []
                }
                if (res.data.data.records.length == 0) {
                    return that.setData({
                        nomore: false,
                        filter: true,
                        pullDown: true,
                        list: l
                    });
                } else {
                    l = l.concat(res.data.data.records);
                    for (let i = 0; i < l.length; i++) {
                        l[i].nextDate2 = util.formatday(new Date(l[i].nextDate));
                    }
                    console.log(l);
                    that.setData({
                        list: l,
                        filter: true,
                        pullDown: true
                    });
                    p++;
                }
            }
        }
    });
}
var app = getApp()
Page({
    data: {
        list: [],
        nomore: true,//数据是否加载完毕
        userInfo: {},
        pullDown: true,//控制上拉gif的变量
        searchName: '',//搜索的名字
        loading: true,//动画变量
        toasterShow: false,
        toasterTxt: '',
        limit: false,
        keyword: '',//关键字
        isRequest: false
    },
    showToast: function (a, b) {
        this.setData({
            toasterShow: true,
            toasterTxt: a
        });
        let _this = this;
        setTimeout(function () {
            _this.setData({
                toasterShow: false
            });
            b && b();
        }, 3000);
    },
    // 时间转化1
    transformData: function (data) {
        let _length = data.length;
        for (var i = 0; i < _length; i++) {
            data[i].reportRepairDate = util.formatTime(new Date(data[i].reportRepairDate))
        }
        return data;
    },
    onShow: function () {
        console.log('show');
        this.setData({
            loading: true
        })
        if (this.data.limit) {
            var that = this
            p = 1
            l = []
            GetList(that)
        } else {
            this.showToast('你还没有PM实施权限，请联系管理员', function () {
                wx.navigateBack();
            });
        }
    },
    // 获取焦点，跳转到搜索设备页面
    search: function () {
        wx.navigateTo({
            url: '../search/search?k=assetSearch&p=设备名称/编码',
        })
    },
    // 跳转到详情页面
    detail: function (e) {
        if (!this.data.isRequest) {
            this.data.isRequest = true
            let _this = this;
            let num = e.currentTarget.dataset.assetApplyId;
            api.PMassetsCheck({
                data: {
                    id: num
                },
                isNoToken: false,
                success: function (res) {
                    if (res.data.code == 200 && res.data.data.status == 1) {
                        wx.navigateTo({
                            url: 'editPMDetail?applyId=' + num
                        });
                    } else {
                        api.PMdelete({
                            isNoToken: false,
                            data: {
                                id: num
                            },
                            complete: function (res) {
                                if (res.data.code == 200) {
                                }
                            }
                        });
                        _this.showToast('该条数据处于' + res.data.data.msg + '状态，无法实施', function () {
                            p = 1, l = [];
                            GetList(_this);
                        });
                    }
                },
                fail: function (msg, res) {
                    p = 1, l = [];
                    _this.showToast(msg, function () {
                        GetList(_this);
                    });
                },
                complete: function () {
                    console.log('cccccccccccccccccccccccccccccccccc')
                    _this.data.isRequest = false
                }
            });
        }
    },
    // 扫描设备
    scanAsset: function () {
        let that = this;
        // 只允许从相机扫码
        wx.scanCode({
            onlyFromCamera: true,
            success: (_res) => {
                if (_res.result.indexOf('http') == -1) {
                    // TODO
                    api.getDataByScan({
                        data: {
                            scanResult: _res.result
                        },
                        isNoToken: false,
                        success: function (res2) {
                            if (res2.data.code == 200 && res2.data.data && res2.data.data.id) {
                                api.assetsPMScan({
                                    isNoToken: false,
                                    data: {
                                        id: res2.data.data.id
                                    },
                                    complete: function (resp) {
                                        if (resp.data.code == 200) {
                                            if (resp.data.data.status == 1) {// 设备不在范围
                                                that.showToast('此资产不在PM范围内');
                                            } else {
                                                api.PMassetsCheck({
                                                    data: {
                                                        id: resp.data.data.msg
                                                    },
                                                    isNoToken: false,
                                                    success: function (res) {
                                                        if (res.data.code == 200 && res.data.data.status == 1) {
                                                            wx.navigateTo({
                                                                url: 'editPMDetail?applyId=' + resp.data.data.msg
                                                            });
                                                        } else {
                                                            api.PMdelete({
                                                                isNoToken: false,
                                                                data: {
                                                                    id: resp.data.data.msg
                                                                },
                                                                complete: function (res) {
                                                                    if (res.data.code == 200) {
                                                                    }
                                                                }
                                                            });
                                                            that.showToast('该条数据处于' + res.data.data.msg + '状态，无法实施', function () {
                                                                p = 1, l = [];
                                                                GetList(that);
                                                            });
                                                        }
                                                    },
                                                    fail: function (msg, res) {
                                                        p = 1, l = [];
                                                        that.showToast(msg, function () {
                                                            GetList(that);
                                                        });
                                                    }
                                                });
                                            }
                                        }
                                    }
                                });
                            } else {
                                that.showToast('暂无数据，请检查二维码是否为本平台资产');
                            }
                        }
                    });
                } else {
                    that.showToast('暂无数据，请检查二维码是否为本平台资产');
                }
            }
        })
    },
    onLoad: function (options) {
        console.log(options);
        // 页面初始化 options为页面跳转所带来的参数 
        let userInfo = wx.getStorageSync("userInfo")
        this.setData({
            userInfo: userInfo,
            dept: '',
            limit: userInfo.authoritiesStr ? userInfo.authoritiesStr.indexOf('PM_PLAN_IMPLEMENT') != -1 : false
        })


    },
    onPullDownRefresh: function () {
        //下拉  
        console.log('下拉')
        if (this.data.limit) {
            p = 1;
            this.setData({
                list: []
            });

            l = []

            var that = this
            GetList(that)
        }
        wx.stopPullDownRefresh()
    },
    onReachBottom: function () {
        //上拉  
        // pullDown
        console.log('上拉')
        if (this.data.limit) {
            this.setData({
                pullDown: false,
            });
            var that = this
            GetList(that)
        }
    }
})