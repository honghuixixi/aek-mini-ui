
var util = require('../../utils/util.js')
var api = require('../../utils/api.js')
var p = 1
var l = []
var GetList = function (that, parmas) {
    // console.log("start requrest")
    // console.log(parmas)
    // console.log({
    //     sort: 1,
    //     'page.current': p,
    //     'page.size': 6,
    //     status: that.data.active,
    //     "tenantId": (parmas && parmas.tenantId) || wx.getStorageSync("userInfo").tenantId,
    //     deptId: that.data.deptId,
    //     keyword: parmas && parmas.keyword || '',

    // })
    api.zatzList({
        data: {
            sort: 1,
            'page.current': p,
            'page.size': 6,
            status: that.data.active,
            "tenantId": (parmas && parmas.tenantId) || wx.getStorageSync("userInfo").tenantId,
            deptId: that.data.deptId,
            keyword: parmas && parmas.keyword || '',

        },
        isNoToken: false,
        success: function (res) {
            //console.log("resquest success")
            // console.log(res)
            if (res.data.code == 200) {
                let isEnd = true,
                    filter = that.data.filter,
                    pullDown = that.data.pullDown,
                    records = p === 1 ? [] : that.data.cardList;
                if (res.data.data.records && res.data.data.records.length === 6) {
                    isEnd = false;
                } else {
                    filter = true;
                    pullDown = true;
                }
                if (res.data.data.records.length > 0) {
                    for (var i in res.data.data.records) {
                        res.data.data.records[i].assetsImg = res.data.data.records[i].assetsImg ? that.data.PIC_URL + res.data.data.records[i].assetsImg : null;
                        records.push(res.data.data.records[i]);
                    }
                    p++;
                }

                that.setData({
                    cardList: records,
                    filter: true,
                    pullDown: true,
                    isEnd: isEnd,
                    nomore: !isEnd
                });
            }
        },
        complete: function () {
            that.setData({
                loading: false
            })
        }
    });
}
var app = getApp()
Page({
    data: {
        tag: false,
        // 变量到时候看后台数据统一改
        uri: "/static/images/position.png",//设备图片
        deviceName: '哈哈哈哈哈哈哈哈',//设备名称
        producer: '哈哈哈',//生产商
        size: 'HY200',//规格型号
        dept: '',//所在部门
        status: '验收通过',
        cardList: [],
        over: false,//当有弹窗的时候页面不滚动
        filter: true,//控制过滤弹窗的变量
        active: '',//点击筛选里面的状态，加上点击的类,默认为全部
        nomore: true,//数据是否加载完毕
        userInfo: wx.getStorageSync("userInfo"),
        deptId: '',//部门
        pullDown: true,//控制上拉加载的变量
        searchName: '',
        deptList: [],
        showDeptlist: true,
        PIC_URL: app.globalData.PIC_URL,
        isEnd: false,
        loading: true,
        assetlistLimit: wx.getStorageSync("userInfo").authoritiesStr ? wx.getStorageSync("userInfo").authoritiesStr.indexOf('ASS_ASSETS_LIST_VIEW') != -1 : false, // 查看列表权限
        assetAdd: wx.getStorageSync("userInfo").authoritiesStr ? wx.getStorageSync("userInfo").authoritiesStr.indexOf('ASS_ASSETS_NEW') != -1 : false, // 新建台账权限
        totastHide: true,                        //自定义的totast显示隐藏变量
        totastContent: "您还没有权限...",
        totastHide2: true,                       //自定义的totast显示隐藏变量
        totastContent2: "暂时无法获取数据...",     //totast的内容
    },
    onLoad: function () {
        this.setData({
            assetlistLimit: wx.getStorageSync("userInfo").authoritiesStr ? wx.getStorageSync("userInfo").authoritiesStr.indexOf('ASS_ASSETS_LIST_VIEW') != -1 : false, // 查看列表权限
            assetAdd: wx.getStorageSync("userInfo").authoritiesStr ? wx.getStorageSync("userInfo").authoritiesStr.indexOf('ASS_ASSETS_NEW') != -1 : false
        })
        this.getDeptListTree()
    },
    scanLook: function () {
        var result = ''
        let _this = this
        // 是否只允许从相机扫码
        wx.scanCode({
            onlyFromCamera: false,
            success: (res) => {
                //   console.log(res)
                if (res.result.indexOf('http') == -1) {
                    result = res.result
                    // TODO
                    api.getDataByScan({
                        data: {
                            scanResult: res.result
                        },
                        isNoToken: false,
                        success: function (res2) {
                            if (res2.data.code == 200 && res2.data.data && res2.data.data.id) {
                                // console.log('getResult:' + JSON.stringify(res2));
                                api.zatzdetail({
                                    data: {
                                        id: res2.data.data.id
                                    },
                                    isNoToken: false,
                                    success: function (res) {
                                        // console.log(res.data.code)
                                        if (res.data.code == 200) {
                                            if (res.data.data) {
                                                if (res.data.data.assetsStatus == 1) {
                                                    wx.navigateTo({
                                                        url: 'assestdetail?id=' + res2.data.data.id,
                                                    })
                                                } else {
                                                    // 跳转到预台账详情
                                                    // wx.navigateTo({
                                                    //   url: '../beforeassestbook/beforeassestdetail?assestId=' + res2.data.data.id,
                                                    // })
                                                    // 暂时不做预台账，弹窗提示
                                                    //   console.log('nodata')
                                                    _this.displayMsg("totastHide2")
                                                }
                                            } else {
                                                _this.displayMsg("totastHide2")
                                            }
                                        }
                                    }
                                })
                            } else {
                                _this.displayMsg("totastHide2")
                            }
                        }
                    });
                } else {
                    _this.displayMsg("totastHide2")
                }

            }
        })
    },
    // 获取焦点，跳转到搜索设备页面
    search: function () {
        wx.navigateTo({
            url: '../search/search?k=assestSearch&p=设备名称/编码/院内编码/出厂编号',
        })
    },
    // 点击二维码扫描
    scan: function () {
        wx.scanCode({
            onlyFromCamera: true,
            success: (res) => {
                //console.log(res)
            }
        })
    },

    getDeptListTree: function () {
        let _this = this;
        api.getdeptTree({
            isNoToken: false,
            data: {
                "tenantId": wx.getStorageSync("userInfo").tenantId
            },
            success: function (res) {
                _this.setData({
                    deptList: _this.converToList(res.data.data)
                })
                //console.log(JSON.stringify(_this.data.deptList));
            }
        })
    },
    converToList: function (obj) {
        var arr = [];
        function getChild(obj, level) {
            arr.push({ id: obj.id, name: obj.name, preset: obj.preset, level: level });
            if (obj.subDepts.length) {
                for (var index in obj.subDepts) {
                    getChild(obj.subDepts[index], level + 1);
                }
            }
        }
        getChild(obj, 1);
        return arr;
    },
    chooseDeptId: function (e) {
        // console.log("设置");
        // console.log(e)
        this.setData({
            filter: !this.data.filter,
            showDeptlist: !this.data.showDeptlist,
            dept: e.target.dataset.name,
            deptId: e.target.dataset.id
        })

    },
    hiddendeptlist: function () {
        this.setData({
            showDeptlist: !this.data.showDeptlist,

        })
    },
    // 点击筛选，出现弹窗
    filter: function () {
        this.setData({
            filter: false,
            over: true
        })
    },

    // 点击弹窗自己消失
    filterClick: function () {
        this.setData({
            filter: true,
            over: false
            // active: '',
            // dept: ''
        })
    },
    // 点击当前的状态加上点击时的类
    statusClick: function (e) {
        this.setData({
            active: e.currentTarget.dataset.status
        })
    },
    // 点击筛选弹窗的确定按钮
    filterList: function () {
        // 传给后台的状态用active变量
        this.setData({
            over: false,
            cardList: []
        });
        var that = this
        p = 1
        l = []
        GetList(that, {
            "keyword": that.data.searchName || ''
        })
    },
    // 点击重置的按钮
    reset: function () {
        this.setData({
            active: '',
            deptId: '',
            dept: ''
        })
    },
    // 选择部门
    chooseDept: function () {
        this.setData({
            filter: !this.data.filter,
            showDeptlist: !this.data.showDeptlist
        })

    },
    // 跳转到资产台账详情页
    assestDetail: function (e) {
        var _this = this,
            limit = wx.getStorageSync("userInfo").authoritiesStr ? wx.getStorageSync("userInfo").authoritiesStr.indexOf('ASS_PREASSETS_DETAILED_VIEW') != -1 : false;
        if (limit) {
            wx.navigateTo({
                url: '../assestbook/assestdetail?id=' + e.currentTarget.dataset.assestId
            })
        } else {
            this.setData({
                totastHide: false
            })
            setTimeout(function () {
                _this.setData({
                    totastHide: true
                })
            }, 1000)
        }
    },
    // 添加资产台帐
    addassest: function () {
        wx.navigateTo({
            url: 'newassest',
        })
    },
    onShow: function () {
        console.log("onshow");
        var that = this
        p = 1;
        GetList(that, {
            "keyword": that.data.searchName || ''
        })
    },


    onPullDownRefresh: function () {
        //下拉  
        console.log("下拉");
        p = 1;
        this.setData({
            cardList: []
        });
        var that = this
        //GetList(that);
        GetList(that, {
            "keyword": that.data.searchName || ''
        });
        wx.stopPullDownRefresh()
    },
    onReachBottom: function () {
        //上拉  
        // pullDown
        this.setData({
            pullDown: false,
        })

    },
    // 跳转到资产台账详情页
    // assestDetail: function (e) {
    //     wx.navigateTo({
    //         url: 'assestdetail?id=' + e.currentTarget.dataset.assestId,
    //     })
    // },
    // 添加资产台帐
    addassest: function () {
        wx.navigateTo({
            url: 'newassest',
        })
    },
    onShow: function () {
        this.setData({
            tag: false
        })
        var that = this
        p = 1;
        GetList(that, {
            "keyword": that.data.searchName || ''
        })
    },


    onPullDownRefresh: function () {
        //下拉  
        //console.log("下拉");
        p = 1;
        this.setData({
            cardList: []
        });
        var that = this
        GetList(that, {
            "keyword": that.data.searchName || ''
        });
        wx.stopPullDownRefresh()
    },
    onReachBottom: function () {
        //上拉  
        // pullDown
        // console.log("reach bottom=====")
        if (!this.data.isEnd && this.data.pullDown) {
            //console.log("上拉")
            this.setData({
                pullDown: false
            });
            GetList(this, {
                "keyword": this.data.searchName || ''
            });
        }
    },
    //点击悬浮按钮显示菜单
    show: function () {
        this.setData({
            tag: true
        })
    },
    //点击悬浮按钮消失菜单
    hidden: function () {
        this.setData({
            tag: false
        })
    },
    // 悬浮按钮清查
    complat: function () {
        wx.navigateTo({
            url: './newassest?assetsSource=3',
        })
    },
    //悬浮按钮验收
    consult: function () {
        wx.navigateTo({
            url: './newassest?assetsSource=2',
        })
    },
    displayMsg: function (key) {
        let _this = this,
            obj = {};
        obj[key] = false
        this.setData(obj)
        setTimeout(() => {
            obj[key] = true;
            _this.setData(obj)
        }, 1500)
    }
})