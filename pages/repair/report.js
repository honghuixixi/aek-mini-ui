// pages/repair/report.js
var util = require('../../utils/util.js')
var api = require('../../utils/api.js')
var app = getApp()
Page({

    data: {
        baseImgUrl: app.globalData.PIC_URL.substr(0, app.globalData.PIC_URL.length - 1),
        loading: true,//动画变量
        leftList: ['接单类型', '工作方式', '故障现象', '故障代码', '故障原因', '工作内容', '配件信息', '维修结果'],
        msgData: '',//接单时获取的对象
        appyid: '',//申请单id
        reportData: '',
        userInfo: wx.getStorageSync("userInfo"),
        repairStartDate: '',
        repairEndDate: '',
        actualStartDate: '',
        actualEndDate: '',
        repairIndex: 0,//维修报告的左边切换
        totastHide1: true,                        //自定义的totast显示隐藏变量
        totastContent1: "该附件无法预览，请从网页版下载查看...",
    },

    //查看维修报告
    getReport: function () {
        let _this = this
        api.getRepairreport({
            data: {
                id: this.data.applyid
            },
            isNoToken: false,
            success: function (res) {
                if (res.data.code == 200) {
                    setTimeout(() => {
                        if (res.data.data.attachment){
                            res.data.data.attachment = JSON.parse(res.data.data.attachment);
                            _this.setImgFlag(res.data.data);
                        }
                        _this.setData({
                            loading: false,
                            reportData: res.data.data,
                            //   repairStartDate:util.formatTime(new Date(res.data.data.repairStartDate)),
                            repairEndDate: util.formatTime(new Date(res.data.data.repairEndDate)),
                            // actualStartDate: util.formatTime(new Date(res.data.data.actualStartDate)),
                            actualEndDate: util.formatTime(new Date(res.data.data.actualEndDate)),
                            callRepairDate: util.formatTime(new Date(res.data.data.callRepairDate)),
                            arrivalDate: util.formatTime(new Date(res.data.data.arrivalDate)),
                            leaveDate: util.formatTime(new Date(res.data.data.leaveDate)),
                            newFiles: res.data.data.attachment ? res.data.data.attachment : '',
                        })
                        console.log(_this.data.reportData)
                    }, 500)
                }
            }
        })
    },
    onLoad: function (options) {
        this.setData({
            applyid: options.applyid
        })
        this.getReport()
        // 维修单详情的接口
        api.repairdetail({
            data: {
                id: options.applyid
            },
            isNoToken: false,
            success: (res) => {
                if (res.data.code == 200) {
                    this.setData({
                        repairStartDate: util.formatTime(new Date(res.data.data.reportRepairDate)),
                        msgData: res.data.data

                    })
                }
            }
        })
        api.repairopreate({
            data: {
                id: options.applyid
            },
            isNoToken: false,
            success: (res) => {
                if (res.data.code == 200) {
                    this.setData({
                        actualStartDate: util.formatTime(new Date(res.data.data.takeOrderTime))

                    })
                }
            }
        })
    },
    // 填写维修报告的事件==================
    repairChange: function (e) {
        this.setData({
            repairIndex: e.currentTarget.dataset.repairIndex
        })
    },
    // 查看大图
    lookBignew: function (e) {
        var uri = e.currentTarget.dataset.filesUrl
        var canlook = uri.indexOf('.jpg') != -1 || uri.indexOf('.jpeg') != -1 || uri.indexOf('.png') != -1
        if (canlook) {
            // 能查看
            wx.navigateTo({
                url: '../bigpicture/bigpicture?uri=' + uri,
            })

        } else {
            this.setData({
                totastHide1: false
            })
            setTimeout(() => {
                this.setData({
                    totastHide1: true
                })
            }, 500)
        }
    },
    setImgFlag: function (obj) {
        if (obj.attachment) {
            for (var i = 0, len = obj.attachment.length; i < len; i++) {
                obj.attachment[i].isImg = this.isImg(obj.attachment[i].uploadUrl);
            }
        }
    },
    isImg: function (name) {
        var suportsuffix = "png|jpg|jpeg|gif|bmp",
            suffix = name.substr(name.lastIndexOf('.') + 1).toLocaleLowerCase();
        console.log("url:" + name + "  ==> " + suportsuffix.indexOf(suffix) >= 0);
        return suportsuffix.indexOf(suffix) >= 0;
    }
})