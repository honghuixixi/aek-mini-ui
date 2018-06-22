
var util = require('../../utils/util.js')
var api = require('../../utils/api.js')
var p = 1
var l = []
var GetList = function (that) {
    let params = {
        pageNo: p,
        pageSize: 12,
        id: that.data.implementId,
        status: that.data.tabIndex
    }
    if (that.data.searchName) {
        params.keyword = that.data.searchName
    }
    api.assetList({
        isNoToken: false,
        data: params,
        complete: function (res) {
            if (res.data.code == 200) {
                that.setData({
                    tag: true
                });
                let temp = {
                    pullDown: true,
                    nextDate: util.formatday(new Date(res.data.data.nextDate)),
                    inspectingNum: res.data.data.inspectingNum,
                    inspectedNum: res.data.data.inspectedNum
                };
                if (p == 1) {
                    temp.arr2 = [];
                    temp.arr1 = [];
                    l = []

                }
                if (res.data.data.records.length == 0) {
                    temp.nomore = false;
                    if (p == 1) {
                        if (that.data.tabIndex == 2) {
                            temp.arr2 = [];
                        }
                        if (that.data.tabIndex == 1) {
                            temp.arr1 = [];
                        }
                    }
                } else {
                    res.data.data.records.map(function (a) {
                        a.imgUrl = a.imgUrl ? (app.globalData.PIC_URL + a.imgUrl) : "/static/images/position.png";
                    });
                    l = l.concat(res.data.data.records);
                    if (that.data.tabIndex == 2) {
                        temp.arr2 = l;
                    }
                    if (that.data.tabIndex == 1) {
                        temp.arr1 = l;
                    }
                    p++;
                }
                that.setData(temp);
            }
        }
    });
}

var app = getApp();
Page({
    data: {
        tabIndex: 1,
        arr1: [],//待巡检的列表
        arr2: [],//已巡检的列表
        inspectingNum: 0,
        implementId: 1,
        inspectedNum: 0,
        nextDate: util.formatday(new Date()),
        confirm: true,
        toasterShow: false,
        toasterTxt: '',
        k: 'assetList',
        p: '设备名称/编号',
        pullDown: true,//控制上拉gif的变量
        nomore: true,//数据是否加载完毕
        searchName: '',//关键字
        tag: true,
        openHoverBtn: false // 展开底部浮层按钮
    },
    onLoad: function (options) {
        app.globalData.assetListIndex = 1;
        this.setData({
            implementId: options.id
        });
    },
    onShow() {
        this.setData({
            openHoverBtn: false,
            tabIndex: app.globalData.assetListIndex
        });
        var that = this;
        p = 1;
        l = [];
        GetList(that);
    },
    onPullDownRefresh: function () {
        p = 1;
        this.setData({
            arr2: [],
            arr1: [],
            tag: false
        });
        l = [];
        var that = this;
        GetList(that);
        wx.stopPullDownRefresh();
    },
    onReachBottom: function () {
        if (this.data.tag) {
            this.setData({
                pullDown: false
            });
            var that = this
        }
        ;
        GetList(that);
    },
    // 点击跳转搜索页面
    search: function () {
        wx.navigateTo({
            url: '../search/search?k=pollassetSearch&p=设备名称/编码/院内编码/出厂编码',
        })
    },
    // 跳转到消息的详情页面
    goDetail: function (e) {
        wx.navigateTo({
            url: '.?id=' + e.currentTarget.dataset.infoid,
        });
    },
    // 选择tabbar切换
    changeIndex: function (e) {

        this.setData({
            openHoverBtn: false,
            tabIndex: e.currentTarget.dataset.chooseIndex,
            nomore: true,
            searchName: ''
        });
        app.globalData.assetListIndex = this.data.tabIndex;
        var that = this;
        p = 1;
        l = [];
        GetList(that);
    },
    assetDetail: function (e) {
        wx.navigateTo({
            url: '../polling/editdetail?assetId=' + e.currentTarget.dataset.assetId + '&id=' + this.data.implementId + '&tag=' + this.data.tabIndex
        })
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
    disOpenHoverBtn: function () {
        this.setData({
            openHoverBtn: !this.data.openHoverBtn
        })
    },
    scanAsset: function () {
        let that = this;
        this.setData({
            openHoverBtn: false
        })
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
                                api.assetSearch({
                                    isNoToken: false,
                                    data: {
                                        assetId: res2.data.data.id,
                                        id: that.data.implementId
                                    },
                                    complete: function (res) {
                                        if (res.data.code == 200) {
                                            if (res.data.data == 1) {// 设备不在范围
                                                that.showToast('此资产不在巡检范围内');
                                            } else if (res.data.data == 2) {//待巡检设备-----标志位tag==1
                                                wx.navigateTo({
                                                    url: 'editdetail?assetId=' + res2.data.data.id + '&id=' + that.data.implementId + '&tag=1'
                                                })
                                            } else if (res.data.data == 3) {//已巡检设备
                                                that.showToast('此资产已巡检过，请继续巡检');
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
    // 批量巡检
    muiltyImplement: function () {
        this.IsCommit('../polling/muiltyImplement?id=' + this.data.implementId + '&tag=' + this.data.tabIndex);
        this.setData({
            openHoverBtn: false
        })
    },
    submitImp: function () {
        if (this.data.inspectingNum) {
            return this.showToast('巡检内容未完成，请检查后提交。');
        }
        this.IsCommit();
    },
    IsCommit: function (a) {
        let _this = this;
        api.IsCommit({
            isNoToken: false,
            data: {
                id: _this.data.implementId
            },
            complete: function (res) {
                console.log(res);
                if (res.data.code == 200) {
                    if (res.data.data) {
                        _this.showToast('该巡检实施报告已提交，请到PC端查看', function () {
                            wx.redirectTo({
                                url: 'managelist',
                            })
                        });
                    } else {
                        wx.navigateTo({
                            url: a || 'submitPolling?id=' + _this.data.implementId + '&nexDate=' + _this.data.nextDate,
                        });
                    }
                }
            }
        });
    }
})
