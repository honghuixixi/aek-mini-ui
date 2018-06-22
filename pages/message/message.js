var util = require('../../utils/util.js')
var api = require('../../utils/api.js')
var p = 1
var l = []
var GetList = function (that) {

    api.getMsgList({
        isNoToken: false,
        data: {
            "pageNo": p,
            "pageSize": 10,
            "messageStatus": '',
            "messageLevel": '',
            "time": '',
            "isAsc": false,
            "orderByField": 'message_time'
        },

        success: function (res) {
            if (res.data.code == 200) {

                // console.log(res.data.data.records.length)
                if (res.data.data.records.length == 0) {

                    that.setData({
                        nomore: false,

                        pullDown: true,
                    });
                    //   console.log(that.data.nomore)
                    if (p == 1) {
                        that.setData({
                            actionList: []
                        });
                    }
                } else {
                    l = l.concat(res.data.data.records)

                    //   console.log(l.length)
                    for (var i = 0; i < l.length; i++) {
                        l[i].show = true;
                        if (l[i].status == 2 || l[i].status == 5 || l[i].status == 7 || l[i].status == 8) {
                            l[i].show = false;
                        }
                        l[i].messageTime2 = util.formatTime(new Date(l[i].messageTime))
                    }

                    that.setData({
                        actionList: l,
                        pullDown: true
                    });
                    p++;
                }
            }

        }

    });
}

var app = getApp();
Page({

    data: {
        index: 0,//点击没个菜单的索引，控制对应显
        msgList: [],
        toasterShow: false,
        toasterTxt: '',
        actionList: [],
        pullDown: true,//控制上拉gif的变量
        nomore: true,//数据是否加载完毕
        sum: '',
        orderLimit: wx.getStorageSync("userInfo").authoritiesStr ? wx.getStorageSync("userInfo").authoritiesStr.indexOf('REP_APPLY_TAKE_NEW') != -1 : false,//接单的权限
        acceptLimit: wx.getStorageSync("userInfo").authoritiesStr ? wx.getStorageSync("userInfo").authoritiesStr.indexOf('REP_APPLY_CHECK') != -1 : false,//验收的权限
        writeRepaotLimit: wx.getStorageSync("userInfo").authoritiesStr ? wx.getStorageSync("userInfo").authoritiesStr.indexOf('REP_APPLY_REPAIR') != -1 : false,//填写维修报告的权限
        total: 0,
        total1: 0,
        total2: 0,
        total3: 0,
        waitDoTxtList: [{
            title: '维修管理-待接单',
            des: '个维修单需要接单',
            moduleId: 5,
            src: 'weixius.png',
            module: '维修管理'
        }, {
            title: '维修管理-维修中',
            des: '个维修单需要维修',
            moduleId: 5,
            src: 'weixius.png',
            module: '维修管理'
        }, {
            title: '维修管理-待验收',
            des: '个维修单需要验收',
            moduleId: 5,
            src: 'weixius.png',
            module: '维修管理'
        }, {
            title: '维修管理-单据审批',
            des: '条维修单据需要审批',
            moduleId: 5,
            src: 'weixius.png',
            module: '维修管理'
        }, {
            title: '巡检管理-待巡检',
            des: '条巡检计划需要巡检',
            moduleId: 6,
            src: '6.png',
            module: '巡检管理'
        }, {
            title: 'PM管理-待实施',
            des: '条PM实施需要实施',
            moduleId: 7,
            src: 'pm.png',
            module: 'PM管理'
        }, {
            title: '转科管理-待审核',
            des: '条转科单需要审核',
            moduleId: 4,
            src: '5.png',
            module: '资产管理'
        }, {
            title: '报损管理-待审核',
            des: '条报损单需要审核',
            moduleId: 4,
            src: '5.png',
            module: '资产管理'
        }, {
            title: '巡检管理-待验收',
            des: '条报告单需要验收',
            moduleId: 6,
            src: '5.png',
            module: '巡检管理'
        }, {
            title: 'PM管理-待验收',
            des: '条报告单需要验收',
            moduleId: 7,
            src: '5.png',
            module: 'PM管理'
        }, {
            title: '质控管理-待审核',
            des: '条质控申报单需要审核',
            moduleId: 15,
            src: '5.png',
            module: '质控管理'
        }]
    },
    // 切换头部导航，控制相应的内容显示
    change: function (event) {
        this.setData({
            index: event.target.dataset.navIndex
        })
        if (this.data.index == 0) {
            this.getMsgStatus();
        } else if (this.data.index == 1) {
            // this.getMsgList()
            var that = this
            p = 1
            l = []
            GetList(that)
            //   console.log(this.data.nomore)
        }
    },
    transformData: function (data) {
        let _length = data.length;
        for (var i = 0; i < _length; i++) {
            //   console.log(data[i].messageTime)
            data[i].messageTime = util.formatTime(new Date(data[i].messageTime))
            //   console.log(new Date(data[i].messageTime))
        }
        return data;
    },
    // 点击消息进入详情
    goDetail: function (event) {
        // console.log(event);
        this.adjustMsg(1, { status: event.currentTarget.dataset.status });
    },
    // // //获取消息列表
    //  getMsgList:function(){
    //    let _this=this;
    //    api.getMsgList({
    //      isNoToken:false,
    //      data:{
    //        "pageNo":1,
    //        "pageSize":10,
    //        "messageStatus":'',
    //        "messageLevel":'',
    //        "time":'',
    //        "isAsc":false,
    //        "orderByField": 'message_time'
    //      },
    //      success:function(res){

    //        _this.data.actionList = _this.transformData(res.data.data.records )
    //        _this.setData({
    //          actionList: res.data.data.records
    //        });
    //      }
    //    })

    //  },
    //获取待办
    getMsgStatus: function () {
        let _this = this;
        api.getWaitDoList({
            isNoToken: false,
            success: function (res) {
                let arr = _this.data.waitDoTxtList;
                let waitDoList = [];
                let newArr = res.data.data;
                let total = 0;
                for (let i = 0; i < newArr.length; i++) {
                    let ele = arr[newArr[i].status - 1];
                    ele.status = newArr[i].status;
                    ele.total = newArr[i].total;

                    ele.show = true;
                    if (ele.status == 4 || ele.status == 7 || ele.status == 8 || ele.status == 11) {
                        ele.show = false;
                    } else {
                        total += ele.total;
                    }
                    waitDoList.push(ele);
                };
                //  console.log(waitDoList);
                _this.setData({
                    total: total,
                    actionList: waitDoList
                });
            }
        })
    },
    onShow() {
        // console.log('onshow');
        this.setData({
            index: 0
        })
        this.getMsgStatus()
        var that = this
        p = 1
        l = []
        GetList(that)
    },
    // 代办/消息/公告 验证
    adjustMsg(a, b) {
        let _this = this;
        api.adjustMsg({
            isNoToken: false,
            data: {
                tab: a,
                permissionId: b.status
            },
            success: function (res) {
                // console.log('-----------------');
                // console.log(res);
                if (res.data.code == 200) {
                    var url;
                    if (a == 2) {
                        _this.remarkMsg(b);
                    } else {
                        let url
                        switch (b.status) {
                            case 1:
                                url = "../repair/repairlist?status=1";
                                break
                            case 2:
                                url = "../repair/repairlist?status=2";
                                break
                            case 3:
                                url = "../repair/repairlist?status=3";
                                break
                            case 4:
                                url = ''; //维修单据
                                break
                            case 5:
                                url = '../polling/managelist'; //巡检实施
                                break
                            case 6:
                                url = '../PM/assetsList'; //PM
                                break
                            case 7:
                                url = ''; //转科
                                break
                            case 8:
                                url = ''; //报损
                                break;
                            case 9:
                                url = '../polling/accept'; // 巡检验收
                                break;
                            case 10:
                                url = '../PM/accept'; // PM验收
                                break;
                            case 11:
                                url = ''; // 质控审核
                                break;
                            default:
                                break
                        }
                        wx.navigateTo({
                            url: url,
                        })
                    }
                }
            },
            fail: function (parp, res) {
                // console.log(res);
                if (res.data.code == 202) {
                    _this.showToast(res.data.msg, function () {
                        wx.redirectTo({
                            url: '/pages/login/login',
                            success: function () {
                                wx.clearStorageSync();
                            }
                        })
                    });
                } else if (res.data.code == 201) {
                    _this.showToast(res.data.msg, function () {
                        _this.setData({
                            index: 0
                        })
                        _this.getMsgStatus()
                        p = 1
                        l = []
                        GetList(_this)
                    });
                } else {
                    _this.showToast(res.data.msg);
                }
            }
        })
    },
    //根据实施ID获取计划ID
    getPlanId: function (b) {
        api.getPlanId({
            isNoToken: false,
            data: {
                moduleId: b.moduleId
            },
            success: function (res) {
                if (res.data.code == 200) {

                } else {

                }
            }
        });
    },
    // toaster
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
    //读消息调的接口
    remarkMsg: function (b) {
        let _this = this
        function fun() {
            (b.status == 1) && (b.url = "../repair/repairoperate?applyid=" + b.moduleId);
            //  (b.status == 2) && (b.billApplyId = b.moduleId);
            (b.status == 3) && (b.url = '../polling/planDetail?id=' + b.moduleId);
            (b.status == 4) && (b.url = '../polling/assetList?id=' + b.moduleId);
            //  (b.status == 5) && (b.id = b.moduleId);
            (b.status == 6) && (b.url = "../PM/editPMDetail?applyId=" + b.moduleId);
            //  (b.status == 7) && (b.billId = b.moduleId);
            //  (b.status == 8) && (b.billId = b.moduleId);
            wx.navigateTo({
                url: b.url,
            })
        }
        if (b.messageStatus) {
            return fun();
        }
        api.remarkMsg({
            isNoToken: false,
            data: {
                messageid: b.id
            },
            success: function (res) {
                if (res.data.code == 200) {
                    fun();
                } else {

                }
            }
        });
    },
    //查看详情
    lookMsg: function (e) {
        // console.log(e.currentTarget.dataset)
        this.adjustMsg(2, e.currentTarget.dataset.item)
    },
    onPullDownRefresh: function () {
        //下拉  
        // console.log('下拉')
        if (this.data.index == 0) {
            this.getMsgStatus();
        } else if (this.data.index == 1) {
            p = 1;
            this.setData({
                actionList: [],
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
        // console.log('上拉')
        this.setData({
            pullDown: false
        });
        if (this.data.index == 0) {
            this.getMsgStatus();
        } else if (this.data.index == 1) {
            var that = this
            GetList(that)
        }
    }


})