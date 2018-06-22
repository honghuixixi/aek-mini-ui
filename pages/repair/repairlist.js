
var util = require('../../utils/util.js')
var api = require('../../utils/api.js')
var p = 1
var l = []
var GetList = function (that) {

    api.repairlist({
        data: {
            status: that.data.active,
            isAsc: false,
            pageNo: p,
            pageSize: 6,
            keyword: that.data.searchName,//关键字
            assetsDeptName: that.data.dept,//部门 
            tenantId: that.data.userInfo.tenantId || wx.getStorageSync("userInfo").tenantId
        },
        isNoToken: false,
        complete: function (res) {
            console.log("全执行");
            if (res.data.code == 403) {
                setTimeout(() => {
                    that.setData({
                        loading: false
                    })
                }, 250)
            }
        },
        success: function (res) {
            if (res.data.code == 200) {

                that.setData({
                    loading: false
                })
                if (p == 1) {
                    that.setData({
                        cardList: []
                    });
                    l = []

                }
                if (res.data.data.records.length == 0) {
                    that.setData({
                        nomore: false,
                        filter: true,
                        pullDown: true,
                    });


                } else {
                    l = l.concat(res.data.data.records)
                    that.setData({
                        cardList: l,
                        filter: true,
                        pullDown: true
                    });
                    p++;
                }

                for (let i = 0; i < that.data.cardList.length; i++) {
                    if (that.data.cardList[i].assetsImg) {
                        that.data.cardList[i].assetsImg = that.data.cardList[i].assetsImg.indexOf(that.data.PIC_URL) != -1 ? that.data.cardList[i].assetsImg.split(',')[0] : that.data.PIC_URL + that.data.cardList[i].assetsImg.split(',')[0]
                    }
                    // that.data.cardList[i].reportRepairDate = util.formatTime(new Date(that.data.cardList[i].reportRepairDate))
                }
                that.setData({
                    cardList: that.data.cardList
                });

                console.log(that.data.cardList)


            }


        }

    });
}
var app = getApp()
Page({
    data: {
        tag: false,
        cardList: [],
        over: false,//当有弹窗的时候页面不滚动
        filter: true,//控制过滤弹窗的变量
        active: '',//点击筛选里面的状态，加上点击的类,默认为全部
        nomore: true,//数据是否加载完毕
        userInfo: wx.getStorageSync("userInfo"),
        deptId: '',//部门id
        pullDown: true,//控制上拉gif的变量
        searchName: '',//搜索的名字
        loading: true,//动画变量
        child: false,
        deptList: [],
        showDeptlist: true,
        dept: '',//部门名称
        isErweima: false,
        addapplyLimit: wx.getStorageSync("userInfo").authoritiesStr ? wx.getStorageSync("userInfo").authoritiesStr.indexOf('REP_APPLY_NEW') != -1 : false,//新建维修单的权限
        repairlistLimit: wx.getStorageSync("userInfo").authoritiesStr ? wx.getStorageSync("userInfo").authoritiesStr.indexOf('REP_APPLY_VIEW') != -1 : false,//查看维修列表的权限
        PIC_URL: app.globalData.PIC_URL,
        keyword: '',//关键字
        searchName: '',
        totastHide2: true,                       //自定义的totast显示隐藏变量
        totastContent2: "暂时无法获取数据...",     //totast的内容
    },
    // 时间转化1
    transformData: function (data) {
        let _length = data.length;
        for (var i = 0; i < _length; i++) {
            data[i].reportRepairDate = util.formatTime(new Date(data[i].reportRepairDate))
        }
        return data;
    },
    // //获取部门列表树
    // getdeptTree: function () {
    //   var _this = this;
    //   api.getdeptTree({
    //     isNoToken: false,
    //     data: {
    //       "tenantId": wx.getStorageSync("userInfo").tenantId
    //     },
    //     success: function (res) {
    //       _this.setData({
    //         deptList: res.data.data
    //       })
    //     }
    //   })
    // },
    chooseDeptId: function (e) {

        this.setData({
            filter: !this.data.filter,
            showDeptlist: !this.data.showDeptlist,
            dept: e.target.dataset.name,
            deptId: e.target.dataset.id,
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
                console.log(JSON.stringify(_this.data.deptList));
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


    hiddendeptlist: function () {
        this.setData({
            showDeptlist: !this.data.showDeptlist,

        })
    },
    onShow: function () {

        this.setData({
            userInfo: wx.getStorageSync("userInfo"),
            tag: false,
            loading: true,

        })
        if (this.data.repairlistLimit) {
            var that = this
            p = 1
            l = []
            GetList(that)
        } else {
            setTimeout(() => {
                this.setData({
                    loading: false
                })
            })
        }
        // var that = this
        // p = 1
        // l = []
        // GetList(that)

    },
    // 获取焦点，跳转到搜索设备页面
    search: function () {
        wx.navigateTo({
            url: '../search/search?k=repairSearch&p=设备名称/编码/院内编码/出厂编号',
        })
    },

    // 点击筛选，出现弹窗
    filters: function () {
        this.setData({
            filter: false,
            over: true
        })

    },
    // 点击弹窗自己消失
    filterClick: function () {
        this.setData({
            filter: true,
            over: false,
            active: '',
            dept: ''
        })

    },
    // 点击当前的状态加上点击时的类
    statusClick: function (e) {
        this.setData({
            active: e.currentTarget.dataset.status
        })
    },
    // 点击筛选弹窗的确定按钮
    sure: function () {
        // 传给后台的状态用active变量
        this.setData({
            over: false,
            nomore: true,
            pullDown: true

        });
        var that = this
        p = 1
        l = []
        GetList(that)

    },
    // 点击重置的按钮
    reset: function () {
        this.setData({
            active: '',
            dept: ''

        })
    },
    // 选择部门
    chooseDept: function () {
        this.setData({
            filter: true,
            showDeptlist: false
        })
        this.getDeptListTree()

    },
    complat: function () {
        wx.navigateTo({
            url: 'mannewrepair',
        })
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
    // 添加维修单
    addrepair: function () {
        let _this = this
        // 扫码只允许从相机
        wx.scanCode({
            onlyFromCamera: true,
            success: (res) => {
                if (res.result.indexOf('http') == -1) {
                    // TODO
                    api.getDataByScan({
                        data: {
                            scanResult: res.result
                        },
                        isNoToken: false,
                        success: function (res2) {
                            if (res2.data.code == 200 && res2.data.data && res2.data.data.id) {
                                if (res2.data.data.repairStatus == 1) {
                                    wx.navigateTo({
                                        url: 'newrepair?id=' + res2.data.data.id,
                                    })
                                } else {
                                    _this.setData({ 
                                        totastHide2: false,
                                        totastContent2: "此设备已在维修中..." 
                                    });
                                    setTimeout(() => {
                                        _this.setData({ 
                                            totastHide2: true,
                                            totastContent2: "暂时无法获取数据..." 
                                        });
                                    }, 1500)
                                }
                                
                            } else {
                                _this.setData({
                                    totastHide2: false
                                })
                                setTimeout(() => {
                                    _this.setData({
                                        totastHide2: true
                                    })
                                }, 1500)
                            }
                        }
                    });                   
                } else {
                    this.setData({
                        totastHide2: false
                    })
                    setTimeout(() => {
                        this.setData({
                            totastHide2: true
                        })
                    }, 1500)
                }


            },
            fail: (res) => {

            }
        })
    },
    // 跳转到操作页面
    repairDetail: function (e) {
        console.log('新建点击无效')
        console.log(e)
        if (e.currentTarget.dataset.repairStatus == 2) {
            wx.navigateTo({
                url: 'repair?applyid=' + e.currentTarget.dataset.repairId
            })
        } else {
            wx.navigateTo({
                url: 'repairoperate?applyid=' + e.currentTarget.dataset.repairId
            })
        }

    },
    onLoad: function (options) {
        // console.log(wx.getStorageSync("userInfo").authoritiesStr.indexOf('REP_APPLY_VIEW') != -1)
        // 页面初始化 options为页面跳转所带来的参数 
        this.setData({
            userInfo: wx.getStorageSync("userInfo"),
            dept: '',
            active: options.status || '',
            addapplyLimit: wx.getStorageSync("userInfo").authoritiesStr ? wx.getStorageSync("userInfo").authoritiesStr.indexOf('REP_APPLY_NEW') != -1 : false,//新建维修单的权限
            repairlistLimit: wx.getStorageSync("userInfo").authoritiesStr ? wx.getStorageSync("userInfo").authoritiesStr.indexOf('REP_APPLY_VIEW') != -1 : false,//查看维修列表的权限
        })


    },
    onPullDownRefresh: function () {
        //下拉  
        console.log('下拉')
        p = 1;
        this.setData({
            cardList: [],

        });

        l = []

        var that = this
        GetList(that)
        wx.stopPullDownRefresh()
    },
    onReachBottom: function () {
        //上拉  
        // pullDown
        console.log('上拉')
        this.setData({
            pullDown: false,

        });
        var that = this
        GetList(that)

    }
})