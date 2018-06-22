let api = require('../../utils/api.js')
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        partName: "",
        realName: "",
        deptName: "",
        assetCount: 0,
        repairCount: 0,
        userCount: 0,
        modalState: {
            scanCode: false,
            equipmentInput: false,
            inspection: false,
            pm: false
        },
        totastHide: true,                        //自定义的totast显示隐藏变量
        totastContent: "您还没有权限...",         //totast的内容
        totastHide2: true,                       //自定义的totast显示隐藏变量
        totastContent2: "暂时无法获取数据...",     //totast的内容
        suserInfo: '',//服务平台的用户信息
        assetAdd: wx.getStorageSync("userInfo").authoritiesStr ? wx.getStorageSync("userInfo").authoritiesStr.indexOf('ASS_ASSETS_NEW') != -1 : false, // 新建台账权限
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        //   console.log('onload====');
        this.setData({
            assetAdd: wx.getStorageSync("userInfo").authoritiesStr ? wx.getStorageSync("userInfo").authoritiesStr.indexOf('ASS_ASSETS_NEW') != -1 : false, // 新建台账权限
            repairAdd: wx.getStorageSync("userInfo").authoritiesStr ? wx.getStorageSync("userInfo").authoritiesStr.indexOf('REP_APPLY_NEW') != -1 : false, // 新建weixiu
        })
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        //   console.log('onShow+++++====');
        let token = wx.getStorageSync("authToken")
        //   console.log(token);
        //   console.log('------------------');
        if (!token) {
            this.sendCode();
        } else {
            let _this = this;
            api.checkToken({
                isNoToken: true,
                data: {
                    token: JSON.parse(token).token
                },
                fail: function (res) {
                },
                complete: (res) => {
                    //   console.log('check token-start');
                    //   console.log(res);
                    //   console.log('check token-start');
                    if (!res.data) {
                        _this.sendCode();
                    } else {
                        _this.checkUserInfo();
                    }
                }
            });
        }
    },

    /**
     * 显示弹框
     */
    showModal: function (e) {
        this.setData({
            assetAdd: wx.getStorageSync("userInfo").authoritiesStr ? wx.getStorageSync("userInfo").authoritiesStr.indexOf('ASS_ASSETS_NEW') != -1 : false, // 新建台账权限
            repairAdd: wx.getStorageSync("userInfo").authoritiesStr ? wx.getStorageSync("userInfo").authoritiesStr.indexOf('REP_APPLY_NEW') != -1 : false, // 新建weixiu
        })
        this.setModalSate(e.currentTarget.dataset.key, true)

        if (e.currentTarget.dataset.key == 'equipmentInput') {
            //   console.log(wx.getStorageSync("userInfo").authoritiesStr.indexOf('ASS_ASSETS_NEW') != -1)
            if (!this.data.assetAdd) {
                this.setModalSate(e.currentTarget.dataset.key, false)
                this.displayMsg("totastHide")
            }
        }
        if (e.currentTarget.dataset.key == 'scanCode') {
            //   console.log(wx.getStorageSync("userInfo").authoritiesStr.indexOf('ASS_ASSETS_NEW') != -1)
            if (!this.data.repairAdd) {
                this.setModalSate(e.currentTarget.dataset.key, false)
                this.displayMsg("totastHide")
            }
        }
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
     * 获取userInfo
     */
    checkUserInfo: function (userInfos) {
        let userInfo = userInfos || wx.getStorageSync("userInfo");
        // console.log('userInfo:' + userInfo);
        app.globalData.pollIndex = 2
        wx.showNavigationBarLoading()
        if (userInfo) {
            this.setData({
                partName: userInfo.tenantName,
                realName: userInfo.realName,
                deptName: userInfo.deptName
            })
            this.getStatistics(userInfo.tenantId)
        } else {
            this.getPerMissionList()
        }
        // 获取服务平台的用户信息
        let _this = this;
        api.getsUserInfo({
            isNoToken: false,
            success: (res) => {
                // console.log(res);
                wx.setStorageSync('suserInfo', res.data.data)
                _this.setData({
                    suserInfo: res.data.data
                })
            }
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
                    partName: res.data.tenantName,
                    realName: res.data.realName,
                    deptName: res.data.deptName
                })
                _this.getStatistics(res.data.tenantId)
            }
        })
    },

    /**
     * 获取deviceId
     */
    getDeviceId: function () {
        function S4() {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        }
        return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    },

    /**
     * 获取token&userInfo
     */
    sendCode: function () {
        let _this = this;
        wx.login({
            success: function (res) {
                // console.log(res);
                if (res.code) {
                    //发起网络请求
                    api.autoLogin({
                        data: {
                            code: res.code,
                            deviceId: _this.getDeviceId()
                        },
                        isNoToken: true,
                        complete: function (res) {
                            //   console.log(res);
                            if (res.errMsg != "request:ok" || (res.data && res.data.code != 200)) {
                                wx.navigateTo({
                                    url: '../login/login',
                                })
                            } else {
                                wx.setStorageSync('authToken', JSON.stringify({ 'token': res.data.token, 'expire': res.data.expire }));
                                wx.setStorageSync('userInfo', res.data.user_details);
                                // console.log('======================');
                                _this.checkUserInfo(res.data.user_details);
                            }
                        }
                    })
                } else {
                }
            }
        });
    },

    /**
     * 获取统计数据
     */
    getStatistics: function (tenantId) {
        // console.log('tenantId:', tenantId);
        let _this = this
        api.getAssetsDataCount({
            isNoToken: false,
            data: {
                "tenantId": tenantId || wx.getStorageSync("userInfo").tenantId
            },
            success: function (res) {
                // console.log(res);
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
            let _this = this
            // 扫码只允许从相机
            wx.scanCode({
                onlyFromCamera: true,
                success: (res) => {
                    if (res.result.indexOf('http') == -1) {
                        // TODO根据扫码信息获取资产id
                        api.getDataByScan({
                            data: {
                                scanResult: res.result
                            },
                            isNoToken: false,
                            success: function (res2) {
                                if (res2.data.code == 200 && res2.data.data && res2.data.data.id) {
                                    if (res2.data.data.repairStatus == 1) {
                                        wx.navigateTo({
                                            url: '../repair/newrepair?id=' + res2.data.data.id
                                        })
                                    } else {
                                        _this.setData({ totastContent2: "此设备已在维修中..."});
                                        _this.displayMsg("totastHide2", function () {
                                            _this.setData({ totastContent2: "暂时无法获取数据..." });
                                        })
                                    }
                                } else {
                                    _this.displayMsg("totastHide2")
                                }
                            }
                        });
                    } else {
                        _this.displayMsg("totastHide2")
                    }
                },
                fail: (res) => {
                }
            })
        } else {
            // this.setData({
            //     totastHide: false
            // })
            // setTimeout(() => {
            //     this.setData({
            //         totastHide: true
            //     })
            // }, 1500)
            this.displayMsg("totastHide")
        }
    },

    // 扫码查询
    scanSearch: function () {
        // // 1155284
        // var result = ''
        // let _this = this
        // // 是否只允许从相机扫码
        // wx.scanCode({
        //   onlyFromCamera: true,
        //   success: (res) => {
        //     if (res.result.indexOf('http') == -1) {
        //       result = res.result
        //       api.zatzdetail({
        //         data: {
        //           id: result
        //         },
        //         isNoToken: false,
        //         success: function (res) {
        //           if (res.data.code == 200) {
        //             if (res.data.data) {
        //               if (res.data.data.assetsStatus == 1) {
        //                 wx.navigateTo({
        //                   url: '../assestbook/assestdetail?id=' + result,
        //                 })
        //               } else {
        //                 // 跳转到预台账详情
        //                 // wx.navigateTo({
        //                 //   url: '../beforeassestbook/beforeassestdetail?assestId=' + result,
        //                 // })
        //                 // 暂时不做预台账，弹窗提示
        //                 _this.displayMsg("totastHide2")
        //               }
        //             } else {
        //               _this.displayMsg("totastHide2")
        //             }
        //           }
        //         }
        //       })
        //     } else {
        //       _this.displayMsg("totastHide2")
        //     }

        //   }
        // })
        wx.navigateTo({
            url: '../repair/mannewrepair'
        })
    },
    displayMsg: function (key, fun) {
        let _this = this,
            obj = {};
        obj[key] = false
        this.setData(obj)
        setTimeout(() => {
            obj[key] = true;
            if (fun) {
                fun();
            }
            _this.setData(obj)
        }, 1500)
    }
})