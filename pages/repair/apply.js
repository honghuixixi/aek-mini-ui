var util = require('../../utils/util.js')
var api = require('../../utils/api.js')
var app = getApp()
Page({
    data: {
        baseImgUrl: app.globalData.PIC_URL.substr(0, app.globalData.PIC_URL.length - 1),
        loading: true,//动画变量
        imageList: ['/static/images/position.png'],//接单的故障图片
        msgData: '',//设备详情
        PIC_URL: app.globalData.PIC_URL,
        reportRepairDate: '',
        newFiles: '',
        totastHide1: true,                        //自定义的totast显示隐藏变量
        totastContent1: "该附件无法预览，请从网页版下载查看...",
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
    onLoad: function (options) {
        var _this = this
        this.setData({
            imageId: options.applyid
        })
        // 维修单详情的接口
        api.repairdetail({
            data: {
                id: options.applyid
            },
            isNoToken: false,
            success: function (res) {
                if (res.data.code == 200) {
                    if (res.data.data.assetsFile) {
                        res.data.data.assetsFile = JSON.parse(res.data.data.assetsFile);
                        _this.setImgFlag(res.data.data);
                    }
                    _this.setData({
                        status: res.data.data.status,
                        msgData: res.data.data,
                        newFiles: res.data.data.assetsFile ? res.data.data.assetsFile : '',
                        imageList: res.data.data.assetsImg ? res.data.data.assetsImg.split(',') : '',
                        faultDesc: res.data.data.faultDesc ? res.data.data.faultDesc : '',
                        reportRepairDate: util.formatTime(new Date(res.data.data.reportRepairDate)),
                        uri: res.data.data.assetsImg ? _this.data.PIC_URL + res.data.data.assetsImg.split(',')[0] : ''
                    })
                    setTimeout(() => {
                        _this.setData({
                            loading: false
                        })
                    }, 500)
                    console.log(_this.data.faultDesc)

                }
            }
        })

    },
    lookbigImg: function (e) {
        this.setData({
            current: e.currentTarget.dataset.currentIndex
        })
        wx.navigateTo({
            url: 'bigImg?applyid=' + this.data.imageId + '&current=' + this.data.current,
        })
    },
    setImgFlag: function (obj) {
        if (obj.assetsFile) {
            for (var i = 0, len = obj.assetsFile.length; i < len; i++) {
                obj.assetsFile[i].isImg = this.isImg(obj.assetsFile[i].uploadUrl);
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