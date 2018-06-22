
var util = require('../../utils/util.js')
var api = require('../../utils/api.js')
var GetList = function (that) {
    api.mtImplementDetail({
        data: {
            id: that.data.detailId
        },
        isNoToken: false,
        fail: function () { },
        complete: function (res) {
            if (res.data.code == 200) {
                let userInfo = wx.getStorageSync("userInfo");
                res.data.data.live = 1; // 设备现状默认：正常工作
                res.data.data.templateItems.map((item) => {
                    item.answer = 1;    // 选项默认值：正常
                });
                that.setData({
                    loading: false,
                    userInfo: userInfo,
                    limit: userInfo.authoritiesStr ? userInfo.authoritiesStr.indexOf('MT_PLAN_IMPLEMENT_MANAGE') != -1 : false,
                    obj: res.data.data
                });
                if (!that.data.limit) {
                    return that.showToast('你还没有保养实施权限，请联系管理员', function () {
                        wx.clearStorageSync();
                        wx.redirectTo({
                            url: '../login/login',
                        });
                    });
                }
            }else{
                that.showToast(res.data.msg, function () {
                    wx.navigateBack({})
                });
            }
        }
    });
}
var app = getApp()
Page({
    data: {
        detailId: 1,
        obj: {},
        confirm: true,
        nextDate: util.formatday(new Date()),
        userInfo: {},
        loading: true,//动画变量
        toasterShow: false,
        toasterTxt: '',
        limit: false,
        keyword: '',//关键字
        iconList: [
            { id: 1, name: '合格' },
            { id: 2, name: '修复' },
            { id: 3, name: '可用' },
            { id: 4, name: '待修' }
        ],
        pindex: 0,
        cindex: 0,
        listShow: '',
        answerMy: '',
        remarkMy: '',
        measureMy: '',
        chooseShow: false,
        errorShow: false,
        typeHide: true,
        typeList: [{ statusNum: 1, status: "正常工作" }, { statusNum: 2, status: "小问题，不影响使用" }, { statusNum: 3, status: "有故障，需要维修" }, { statusNum: 4, status: "不能使用" },],
        typeeq: -1,
        phoneHide: true,//选择上传图片类型的modal控制显示隐藏
        phoneList: [{ statusNum: 1, status: "拍照" }, { statusNum: 2, status: "相册" }], //选择上传图片的模态框的列表
        phoneeq: -1,//选择状态的角标 portHide: true,
        scrollY: 0
    },
    chooseAnswer: function (e) {
        this.data.obj.templateItems.map(item => {
            if (+item.id == +e.currentTarget.dataset.id) {
                item.answer = +e.detail.value;
            }
        });
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
        // setTimeout(() => {
        //     this.setData({
        //         loading: false
        //     });
        // });
        // console.log();
    },
    // 备注
    remarksSet: function (e) {
        this.data.obj.remarks = e.detail.value
        this.setData(this.data);
    },
    onLoad: function (options) {
        // 页面初始化 options为页面跳转所带来的参数 
        let userInfo = wx.getStorageSync("userInfo")
        this.setData({
            userInfo: userInfo,
            detailId: options.applyId,
            loading: true,
            limit: userInfo.authoritiesStr ? userInfo.authoritiesStr.indexOf('MT_PLAN_IMPLEMENT_MANAGE') != -1 : false
        });
        if (this.data.limit) {
            var that = this
            GetList(that)
        } else {
            that.showToast('你还没有保养实施权限，请联系管理员', function () {
                wx.clearStorageSync();
                wx.redirectTo({
                    url: '../login/login',
                });
            });
        }
    },
    submitPM: function (a) {
        let dt = new Date(this.data.obj.nextImplementTime);
        dt.setDate(dt.getDate() + (this.data.obj.rate > 1 ? 7 : 1));
        return this.setData({
            nextDate: util.formatday(dt),
            confirm: false
        });
    },
    submitCon: function (a) {
        var _this = this;
        var param = {
            "endDate": (new Date()).getTime(),
            "files": [],
            "nextImplementTime": this.data.nextDate,
            "planId": this.data.obj.planId,
            "planImplementId": this.data.detailId,
            "assetsStatus": this.data.obj.live,
            "remarks": this.data.obj.remarks,
            "templateItemResults": []
        };
        for (var i = 0, len = this.data.obj.templateItems.length; i < len; i++) {
            param.templateItemResults.push({
                "itemRemarks": '',
                "itemResult": this.data.obj.templateItems[i].answer,
                "planTemplateId": this.data.obj.templateItems[i].planTemplateId,
                "planTemplateItemId": this.data.obj.templateItems[i].id,
                "planTemplateItemName": this.data.obj.templateItems[i].itemName
            });
        }
        if (this.data.obj.files) {
            for (var i = 0, len = this.data.obj.files.length; i < len; i++) {
                param.files.push({ fileName: this.data.obj.files[i].name, filePath: this.data.obj.files[i].url });
            }
        }
        if (app.globalData.isSave) {
            app.globalData.isSave = false;
            api.mtSubmit({
                data: param,
                isNoToken: false,
                fail: function () { },
                complete: function (res) {
                    app.globalData.isSave = true;
                    if (res.data.code == 200) {
                        wx.redirectTo({
                            url: 'implements',
                        });
                    } else {
                        _this.showToast(res.data.msg, function () {
                            wx.redirectTo({
                                url: 'implements',
                            });
                        });
                    }
                }
            });
        }
    },
    bindDateChange: function (e) {
        console.log(this.data);
        this.setData({
            nextDate: e.detail.value
        })
    },
    cancelIt: function () {
        this.setData({
            confirm: true
        });
    },
    confirm: function () {
        this.setData({
            confirm: true
        });
        this.submitCon(2);
    },
    onPullDownRefresh: function () {
        //下拉
        wx.stopPullDownRefresh()
    },
    onReachBottom: function () {
        //上拉
        // pullDown
    },
    // 弹窗的方法
    // 点击出现弹窗
    // clickShow: function (e) {
    //     var _this = this

    //     wx.createSelectorQuery().select('#PM').fields({
    //         dataset: true,
    //         size: true,
    //         scrollOffset: true,
    //         properties: ['scrollX', 'scrollY']
    //     }, function (res) {
    //         console.log(res)
    //         console.log(res.scrollY)
    //         _this.data.scrollY = res.scrollTop    // 节点 scroll-x 属性的当前值
    //         console.log(_this.data.scrollTop)
    //     }).exec()
    //     this.setData({
    //         chooseShow: true,
    //         errorShow: false,//必填提示
    //         answerMy: e.currentTarget.dataset.listShow.answer,
    //         remarkMy: e.currentTarget.dataset.listShow.remarks,
    //         measureMy: e.currentTarget.dataset.listShow.measure,
    //         listShow: e.currentTarget.dataset.listShow,
    //         pindex: e.currentTarget.dataset.pIndex,
    //         cindex: e.currentTarget.dataset.cIndex,
    //     })
    //     console.log(this.data.measureMy)
    // },
    // 弹窗消失
    // hostModal: function () {
    //     // 如果是选择图片的弹窗
    //     if (!this.data.phoneHide) {
    //         this.setData({
    //             phoneHide: true,
    //             phoneeq: -1
    //         })
    //     }
    //     // 如果是选择状态的弹窗
    //     if (!this.data.typeHide) {
    //         this.setData({
    //             typeHide: true
    //         })
    //     }
    // },
    // 备注的input
    // clickRemark: function (e) {
    //     this.setData({
    //         remarkMy: e.detail.value
    //     })
    // },
    // clickMeasure: function (e) {
    //     this.setData({
    //         measureMy: e.detail.value
    //     })
    // },
    // 点击取消
    cancel: function (e) {
        if (e.target.dataset.type) {
            this.setData({
                chooseShow: false
            })
        }
    },
    // 类型方法弹窗
    // 点击设备现状出现弹窗
    choosestatus: function (e) {
        this.setData({
            typeHide: false,
            typeeq: e.currentTarget.dataset.typeIndex - 1
        })
    },

    // 查看大图
    // lookBig: function (e) {
    //     var uri = e.currentTarget.dataset.filesUrl
    //     var canlook = uri.indexOf('.jpg') != -1 || uri.indexOf('.jpeg') != -1 || uri.indexOf('.png') != -1
    //     if (canlook) {
    //         // 能查看
    //         wx.navigateTo({
    //             url: '../bigpicture/bigpicture?uri=' + uri,
    //         })

    //     } else {
    //         this.setData({
    //             totastHide1: false
    //         })
    //         setTimeout(() => {
    //             this.setData({
    //                 totastHide1: true
    //             })
    //         }, 500)
    //     }
    // },
    // 删除图片
    delImg: function (e) {
        // var num = e.currentTarget.dataset.fujianList
        // var _index = e.currentTarget.dataset.fujianIndex
        this.data.obj.files.splice(e.currentTarget.dataset.index, 1)
        this.setData({
            obj: this.data.obj
        })
    },
    //点击添加图片,出现弹窗，相册和相机
    addimg: function (e) {
        this.setData({
            phoneHide: false
        })
    },
    // 弹窗方法
    chooseHost: function (event) {
        if (!this.data.typeHide) {
            this.setData({
                "obj.live": event.currentTarget.dataset.status,
                "typeeq": event.currentTarget.dataset.hospId,
                "typeHide": true,
            })
        }
        // 如果是选择图片的弹窗
        let _this = this;
        if (!this.data.phoneHide) {
            this.setData({
                phoneeq: event.currentTarget.dataset.hospId,
                phoneHide: true,
            })
            wx.chooseImage({
                count: 1, // 默认9
                sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                sourceType: [this.data.phoneeq == 0 ? 'camera' : 'album'],
                success: (res) => {
                    // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                    var tempFilePaths = res.tempFilePaths;
                    // 图片上传 http://dev.aek.com:8081/api/upload
                    wx.uploadFile({
                        url: app.globalData.API_URL + '/upload3', //仅为示例，非真实的接口地址
                        filePath: tempFilePaths[0],
                        name: 'files',
                        formData: {
                            'files': tempFilePaths[0]
                        },
                        success: (res) => {
                            let data = JSON.parse(res.data);
                            if (data.data.length > 0) {
                                if (!this.data.obj.files) {
                                    this.data.obj.files = []
                                }
                                this.data.obj.files.push({ 
                                    name: data.data[0].fileName, 
                                    url: data.data[0].uploadUrl,
                                    fullUrl: app.globalData.PIC_URL.substr(0, app.globalData.PIC_URL.length - 1) + data.data[0].uploadUrl
                                })
                                this.setData({
                                    obj: this.data.obj
                                })
                                // console.log(this.data.obj.files)
                            }

                        }
                    })

                }
            })
        }
    }
})