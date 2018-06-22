var util = require('../../utils/util.js')
var api = require('../../utils/api.js')
var p = 1
var l = []

function getAttention(val) {
    var dt = new Date(val),
        now = new Date(),
        result = '';
    if (val) {
        if (now.getFullYear() > dt.getFullYear()
            || (now.getFullYear() == dt.getFullYear() && now.getMonth() > dt.getMonth())
            || (now.getFullYear() == dt.getFullYear() && now.getMonth() == dt.getMonth() && now.getDate() > dt.getDate())) {
            result = '已过期';
        }
    }
    return result;
}

var GetList = function (that) {
    var param = {
        pageNo: p,
        pageSize: 6
    }
    if (that.data.searchName.length) {
        param.keyword = that.data.searchName
    }

    api.mtImplements({
        data: param,
        isNoToken: false,
        fail: function () { },
        complete: function (res) {
            if (res.data.code == 200) {
                let userInfo = wx.getStorageSync("userInfo");
                that.setData({
                    userInfo: userInfo,
                    dept: '',
                    limit: userInfo.authoritiesStr ? userInfo.authoritiesStr.indexOf('MT_PLAN_IMPLEMENT_MANAGE') != -1 : false,
                    loading: false
                })
                if (!that.data.limit) {
                    return that.showToast('你还没有保养实施权限，请联系管理员', function () {
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
                        l[i].nextImplementTime = util.formatday(new Date(l[i].nextImplementTime));
                        l[i].attention = getAttention(l[i].nextImplementTime)
                    }
                    // console.log(l);
                    that.setData({
                        list: l,
                        filter: true,
                        pullDown: true
                    });
                    p++;
                }
            } else {
                if (res.data.code != 302) {
                    that.showToast(res.data.msg, function () {
                        wx.navigateBack({})
                    });
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
    onShow: function () {
        console.log('show');
        this.setData({
            loading: true,
            isRequest: false
        })
        if (this.data.limit) {
            var that = this
            p = 1
            l = []
            GetList(that)
        } else {
            this.showToast('你还没有保养实施权限，请联系管理员', function () {
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
            api.mtImplementDetail({
                data: {
                    id: num
                },
                isNoToken: false,
                fail: function () { },
                complete: function (res) {
                    _this.data.isRequest = false;
                    if (res.data.code == 200) {
                        wx.navigateTo({
                            url: 'implement_execute?applyId=' + num
                        });
                    } else {
                        if (res.data.code != 302) {
                            _this.showToast(res.data.msg, function () {
                                _this.onShow();
                            });
                        }
                    }
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
                                api.assetsMTScan({
                                    isNoToken: false,
                                    data: {
                                        assetsId: res2.data.data.id
                                    },
                                    fail: function () { },
                                    complete: function (resp) {
                                        if (resp.data.code == '200') {
                                            wx.navigateTo({
                                                url: 'implement_execute?applyId=' + resp.data.data
                                            });
                                        } else {
                                            if (resp.data.code == 'MT_010') {
                                                wx.showModal({
                                                    title: '提示',
                                                    content: resp.data.msg,
                                                    success: function (res) {
                                                        if (res.confirm) {
                                                            wx.navigateTo({
                                                                url: 'implement_execute?applyId=' + resp.data.data
                                                            });
                                                        }
                                                    }
                                                })
                                            } else {
                                                that.showToast(resp.data.msg);
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
            limit: userInfo.authoritiesStr ? userInfo.authoritiesStr.indexOf('MT_PLAN_IMPLEMENT_MANAGE') != -1 : false
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