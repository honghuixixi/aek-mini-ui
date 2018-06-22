let api = require('../../utils/api.js')

Page({

    /**
     * 页面的初始数据
     */
    data: {
        partName: "",
        assetCount: 0,
        repairCount: 0,
        userCount: 0,
        modalState: {
            scanCode: false,
            equipmentInput: false
        },
        totastHide: true,                        //自定义的totast显示隐藏变量
        totastContent: "您还没有权限...",         //totast的内容
        totastHide2: true,                       //自定义的totast显示隐藏变量
        totastContent2: "暂时无法获取数据..."     //totast的内容
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let token = wx.getStorageSync("authToken")        
        if (!token) {
            wx.navigateTo({
                url: '../login/login',
            })
        }        
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        let token = wx.getStorageSync("authToken") 
        if(token){
            let userInfo = wx.getStorageSync("userInfo")  
            wx.showNavigationBarLoading()         
            if (userInfo) {
                this.setData({
                    partName: wx.getStorageSync("userInfo").tenantName
                })
                this.getStatistics()
            }else{
                this.getPerMissionList()
            }
        }      
    },

    /**
     * 显示弹框
     */
    showModal: function (e) {
        this.setModalSate(e.currentTarget.dataset.key, true)
    },

    /**
     * 隐藏弹框
     */
    hideModal: function (e) {
        this.setModalSate(e.currentTarget.dataset.key, false)
    },

    /**
     * 设置弹框状态
     */
    setModalSate: function (key, state) {
        let obj = this.data.modalState
        obj[key] = state
        this.setData({
            modalState: obj
        })
    },

    /**
     * 获取用户信息及权限
     */
    getPerMissionList: function () {
        let _this = this;
        api.getPermissionList({
            isNoToken: false,
            success: function (res) {
                wx.setStorageSync('userInfo', res.data)
                _this.setData({
                    partName: res.data.tenantName
                })
                _this.getStatistics()
            }
        })
    },

    /**
     * 获取统计数据
     */
    getStatistics: function () {
        let _this = this
        api.getAssetsDataCount({
            isNoToken: false,
            data: {
                "tenantId": wx.getStorageSync("userInfo").tenantId
            },
            success: function (res) {
                wx.hideNavigationBarLoading()
                _this.setData({
                    assetCount: res.assentsCount || 0,
                    repairCount: res.repairAssentCount || 0,
                    userCount: res.memberCount || 0
                })
            }
        })
    },

    // 扫码报修
    scanRepair: function () {
        let userInfo = wx.getStorageSync("userInfo") 
        if (userInfo.authoritiesStr.indexOf('REP_APPLY_NEW') != -1) {
            // 扫码只允许从相机
            wx.scanCode({
                onlyFromCamera: true,
                success: (res) => {
                    wx.navigateTo({
                        url: '../repair/newrepair?id=' + res.result,
                    })
                },
                fail: (res) => {
                }
            })
        } else {
            this.setData({
                totastHide: false
            })
            setTimeout(() => {
                this.setData({
                    totastHide: true
                })
            }, 1500)
        }
    },

    // 扫码查询
    scanSearch: function () {
        // 1155284
        var result = ''
        let _this = this
        wx.scanCode({
            success: (res) => {
                // 是否只允许从相机扫码
                onlyFromCamera: true,
                    result = res.result
                api.zatzdetail({
                    data: {
                        id: res.result
                    },
                    isNoToken: false,
                    success: function (res) {

                        if (res.data.code == 200) {
                            if (res.data.data) {
                                if (res.data.data.assetsStatus == 1) {
                                    wx.navigateTo({
                                        url: '../assestbook/assestdetail?id=' + result,
                                    })
                                } else {
                                    // 跳转到预台账详情
                                    // wx.navigateTo({
                                    //   url: '../beforeassestbook/beforeassestdetail?assestId=' + result,
                                    // })
                                    // 暂时不做预台账，弹窗提示
                                    _this.setData({
                                        totastHide2: false
                                    })
                                    setTimeout(() => {
                                        _this.setData({
                                            totastHide2: true
                                        })
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
                    }
                })
            }
        })
    }
})