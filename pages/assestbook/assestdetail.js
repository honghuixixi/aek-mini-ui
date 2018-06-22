// pages/assestbook/assestdetail.js
var util = require('../../utils/util.js')
var api = require('../../utils/api.js')
var app = getApp()
Page({
    data: {
        disabled: false,//按钮
        index: "0",//点击上部导航实现还会切换
        moreList: true,//点击更多显示隐藏
        tag: false,//控制炫富按钮的变量
        assestId: '',//列表页的 参数
        assetsDetailInfo: '',
        page: 1,
        pageSize: 10,
        nodata: true,
        nomore: true,
        pullDown: true,
        repairList: [],
        addapplyLimit: wx.getStorageSync("userInfo").authoritiesStr ? wx.getStorageSync("userInfo").authoritiesStr.indexOf('REP_APPLY_NEW') != -1 : false,//新建维修单的权限
        editapplyLimit: wx.getStorageSync("userInfo").authoritiesStr ? wx.getStorageSync("userInfo").authoritiesStr.indexOf('ASS_ASSETS_EDIT') != -1 : false, // 资产编辑权限
        PIC_URL: app.globalData.PIC_URL,
        totastHide: true,                        //自定义的totast显示隐藏变量
        totastContent: "您还没有权限...",
        totastHide1: true,                        //自定义的totast显示隐藏变量
        totastContent1: "该附件无法预览，请从网页版下载查看...",
        totastHide2: true,                        //自定义的totast显示隐藏变量
        totastContent2: "",
        look1: true,
        look2: true,
        assestInfo: '',//
        phoneHide: true,//选择上传图片类型的modal控制显示隐藏
        phoneList: [{ statusNum: 1, status: "拍照" }, { statusNum: 2, status: "相册" }], //选择上传图片的模态框的列表

        PIC_URL: app.globalData.PIC_URL,
        look: true,
        assestInfo: '',//
        phoneeq: -1,//选择状态的角标 portHide: true,
        isNotHide: true, //巡检设备
        isList: [{ statusNum: 1, status: "是" }, { statusNum: 0, status: "否" }],
        isNoteq: -1,
        portHide: true,
        portList: [{ statusNum: 1, status: "国产" }, { statusNum: 2, status: "进口" }],
        porteq: -1,
        statusHide: true,//选择状态的modal控制显示隐藏
        statusList: [{ statusNum: 1, status: "在库" }, { statusNum: 2, status: "在用" }, { statusNum: 3, status: "预登" }],//选择状态的模态框的列表
        statuseq: -1,//选择状态的角标

        applyeq: -1,
        applyHide: true,//选择状态的modal控制显示隐藏
        applyList: [{ statusNum: 1, status: "新增" }, { statusNum: 2, status: "添置" }, { statusNum: 3, status: "报废更新" }],//选择状态的模态框的列表
        isFujian: '',//上传图片与上传附件的区分
        fujianNo: '',//区分第几组附件
        hoverShow: true,
        isJLHide: true,
        isJLeq: -1 // 计量设备
    },
    onLoad: function (options) {
        this.setData({
            assestId: options.id,
            addapplyLimit: wx.getStorageSync("userInfo").authoritiesStr ? wx.getStorageSync("userInfo").authoritiesStr.indexOf('REP_APPLY_NEW') != -1 : false,//新建维修单的权限
            editapplyLimit: wx.getStorageSync("userInfo").authoritiesStr ? wx.getStorageSync("userInfo").authoritiesStr.indexOf('ASS_ASSETS_EDIT') != -1 : false
        })
        this.detailzc()

    },
    detailzc: function () {
        let _this = this
        api.zatzdetail({
            data: {
                id: this.data.assestId
            },
            isNoToken: false,
            success: function (res) {
                if (res.data.code == 200) {
                    res.data.data.invoiceNos = res.data.data.invoiceNos ? res.data.data.invoiceNos.replace(/,/g, ";") : "";
                    _this.setData({
                        originJL: res.data.data.JLFlag,
                        assetsDetailInfo: res.data.data,
                        assestInfo: res.data.data,
                        assetsImg: res.data.data.assetsImg
                    })
                    _this.resetDate(_this.data.assestInfo);
                    _this.setData({
                        "assestInfo": _this.data.assestInfo,
                        "assetsImg2": _this.data.assetsImg
                    })
                    _this.resetDate(_this.data.assetsDetailInfo);
                    _this.setData({
                        "assetsDetailInfo": _this.data.assetsDetailInfo
                    })
                }
            }
        })

    },
    // 时间转化
    resetDate: function (obj) {

        obj.acceptanceDate = obj.acceptanceDate ? util.formatday(new Date(obj.acceptanceDate)) : null;
        obj.applyDate = obj.applyDate ? util.formatday(new Date(obj.applyDate)) : null;
        obj.arrivalDate = obj.arrivalDate ? util.formatday(new Date(obj.arrivalDate)) : null;
        obj.createTime = obj.createTime ? util.formatday(new Date(obj.createTime)) : null;
        obj.purchaseDate = obj.purchaseDate ? util.formatday(new Date(obj.purchaseDate)) : null;
        obj.startDate = obj.startDate ? util.formatday(new Date(obj.startDate)) : null;
        obj.startUseDate = obj.startUseDate ? util.formatday(new Date(obj.startUseDate)) : null;
        obj.updateTime = obj.updateTime ? util.formatday(new Date(obj.updateTime)) : null;
        obj.warrantyDate = obj.warrantyDate ? util.formatday(new Date(obj.warrantyDate)) : null;
    },
    onReachBottom: function () {
        if (this.data.index === "2" && this.data.nomore && this.data.nodata) {
            this.setData({
                pullDown: false,
                page: this.data.page + 1
            })
            this.getRepairRecord()
        }
    },
    getRepairRecord: function () {
        console.log('lllll')
        let _this = this;
        api.getRepairRecord({
            data: {
                pageNo: this.data.page,
                pageSize: this.data.pageSize,
                assetsId: this.data.assestId
            },
            isNoToken: false,
            success: function (res) {
                let list = _this.data.repairList,
                    nomore = _this.data.nomore,
                    nodata = _this.data.nodata,
                    tempList = res.data.data.records

                for (let i = 0, len = tempList.length; i < len; i++) {
                    tempList[i].reportRepairDate = tempList[i].reportRepairDate ? util.formatTime2(new Date(tempList[i].reportRepairDate)) : ""
                    tempList[i].repairDate = tempList[i].repairDate ? util.formatTime2(new Date(tempList[i].repairDate)) : ""
                    tempList[i].totalCost = tempList[i].totalCost ? tempList[i].totalCost.toFixed(2) : "0.00"
                    list.push(tempList[i])
                }

                _this.setData({
                    nodata: list.length > 0,
                    nomore: !(list.length > 0 && tempList.length < _this.data.pageSize),
                    pullDown: true,
                    repairList: list
                })
            }
        })
    },
    // 从页面编辑信息过来的时候需要更新数据，再调请求
    onShow: function () {
        this.setData({
            tag: false//让悬浮按钮变回原来的样子  
        })
    },
    // 切换基本信息和采购信息
    changeMsg: function (e) {
        this.setData({
            index: e.currentTarget.dataset.setIndex,
            tag: false,//让悬浮按钮变回原来的样子  
            hoverShow: true,
            assestInfo: '',
            assetsImg2: '',
            look1: true,
            look2: true
        })
        this.detailzc()
        if (this.data.index == 2) {
            // 获取维修记录
            this.setData({
                repairList: []
            })
            this.getRepairRecord()
        }
    },
    // 点击展开更多
    more: function () {
        this.setData({
            moreList: false
        })
    },
    // 点击收起
    slidup: function () {
        this.setData({
            moreList: true
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
    // 编辑的方法跳转到编辑资产台账页面
    edit: function () {
        this.setData({
            tag: false,
            hoverShow: false
        })
        if (this.data.index == 0) {
            this.setData({
                look1: false,
                look2: true
            })
        } else if (this.data.index == 1) {
            this.setData({
                look2: false,
                look1: true
            })
        }
    },
    //悬浮按钮报修
    repair: function () {
        wx.navigateTo({
            url: '../repair/newrepair?id=' + this.data.assestId,
        })
    },
    showRepairePort: function (e) {
        var _this = this,
            limit = wx.getStorageSync("userInfo").authoritiesStr ? wx.getStorageSync("userInfo").authoritiesStr.indexOf('REP_APPLY_REPORT_VIEW') != -1 : false;
        if (limit) {
            wx.navigateTo({
                url: '../repair/report?applyid=' + e.currentTarget.dataset.applyid
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
    //点击添加图片,出现弹窗，相册和相机
    addimg: function (e) {
        console.log(e.currentTarget.dataset.fujian)
        this.setData({
            phoneHide: false,
            isFujian: e.currentTarget.dataset.fujian,
            fujianNo: e.currentTarget.dataset.fujianList
        })
        console.log(this.data.isFujian)
    },
    // 点击选择状态出现弹窗
    choosestatus: function () {

        if (this.data.assestInfo.statusName == '在库') {
            this.data.statuseq = 0
        }
        if (this.data.assestInfo.statusName == '在用') {
            this.data.statuseq = 1
        }
        if (this.data.assestInfo.statusName == '预登') {
            this.data.statuseq = 2
        }
        if (!this.data.assestInfo.statusName) {
            this.data.statuseq = -1
        }
        this.setData({
            statusHide: false,
            statuseq: this.data.statuseq
        })
    },
    // 点击选择购置类别出现弹窗
    gouzhiType: function () {
        // applyeq
        if (this.data.assestInfo.applyType == 1) {
            this.data.applyeq = 0
        } else if (this.data.assestInfo.applyType == 2) {
            this.data.applyeq = 1
        } else if (this.data.assestInfo.applyType == 3) {
            this.data.applyeq = 2
        } else {
            this.data.applyeq = -1
        }
        this.setData({
            applyHide: false,
            applyeq: this.data.applyeq
        })
    },
    // 启用日期
    bindDateChange: function (e) {
        this.setData({
            "assestInfo.startUseDate": e.detail.value
        })
    },
    // 保修期至
    warrantyDateChange: function (e) {
        this.setData({
            "assestInfo.warrantyDate": e.detail.value
        })
    },
    // 购入日期
    purchaseDateChange: function (e) {
        this.setData({
            "assestInfo.purchaseDate": e.detail.value
        })
    },
    // 到货日期
    arrivalDateChange: function (e) {
        this.setData({
            "assestInfo.arrivalDate": e.detail.value
        })

    },
    // 申购日期
    bindapplyDate: function (e) {
        this.setData({
            "assestInfo.applyDate": e.detail.value
        })
    },
    // 验收日期
    bindacceptData: function (e) {
        this.setData({
            "assestInfo.acceptanceDate": e.detail.value
        })

    },
    // 国产、进口
    chooseport: function () {
        if (this.data.assestInfo.madeIn == 1) {
            this.data.porteq = 0
        } else if (this.data.assestInfo.pollingFlag == 2) {
            this.data.porteq = 1
        } else {
            this.data.porteq = -1
        }
        this.setData({
            portHide: false,
            porteq: this.data.porteq
        })
    },
    // 巡检设备
    chooseIsNot: function () {
        if (this.data.assestInfo.pollingFlag == 1) {
            this.data.isNoteq = 0
        } else if (this.data.assestInfo.pollingFlag == 0) {
            this.data.isNoteq = 1
        } else {
            this.data.isNoteq = -1
        }
        this.setData({
            isNotHide: false,
            isNoteq: this.data.isNoteq
        })
    },
    // 计量设备
    chooseJL: function () {
        if (this.data.assestInfo.JLFlag == 1) {
            this.data.isJLeq = 0
        } else if (this.data.assestInfo.JLFlag == 0) {
            this.data.isJLeq = 1
        } else {
            this.data.isJLeq = -1
        }
        this.setData({
            isJLHide: false,
            isJLeq: this.data.isJLeq
        })
    },
    // 弹窗方法
    chooseHost: function (event) {
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
                                console.log(data)
                                if (!this.data.isFujian) {
                                    // 说明是基本信息的图片上上传
                                    this.setData({
                                        // imageList: [app.globalData.PIC_URL + data.data[0]],
                                        assetsImg2: data.data[0].uploadUrl,//编辑的设备图片
                                    })
                                } else {
                                    // 是附件的上传
                                    if (this.data.fujianNo == 1) {
                                        this.data.assestInfo.acceptanceAnnexList.push(data.data[0])
                                        this.setData({
                                            'assestInfo.acceptanceAnnexList': this.data.assestInfo.acceptanceAnnexList
                                        })
                                    }
                                    if (this.data.fujianNo == 2) {
                                        this.data.assestInfo.contractAnnexList.push(data.data[0])
                                        this.setData({
                                            'assestInfo.contractAnnexList': this.data.assestInfo.contractAnnexList
                                        })
                                    }
                                }
                            }
                        }
                    })

                }
            })
        }
        // 如果是选择状态的弹窗
        if (!this.data.statusHide) {

            this.setData({
                "assestInfo.status": event.currentTarget.dataset.status,
                "assestInfo.statusName": event.currentTarget.dataset.statusname,
                "statuseq": event.currentTarget.dataset.hospId,
                "status": event.currentTarget.dataset.statusname,
                "statusHide": true
            })
            // console.log(this.data.assestInfo.status)
        }
        // 如果是选择国产的弹窗
        if (!this.data.portHide) {
            // console.log(event.currentTarget.dataset.status)
            this.setData({
                "assestInfo.madeIn": event.currentTarget.dataset.status,
                "porteq": event.currentTarget.dataset.hospId,
                "portHide": true
            })
            // console.log(this.data.assestInfo.madeIn)
        }
        // 如果是选择国产的弹窗
        if (!this.data.isNotHide) {
            // console.log(event.currentTarget.dataset.status)
            this.setData({
                "assestInfo.pollingFlag": event.currentTarget.dataset.status,
                "isNoteq": event.currentTarget.dataset.hospId,
                "isNotHide": true
            })
            // console.log(this.data.assestInfo.madeIn)
        }
        // 如果是选择购置类别的弹窗
        if (!this.data.applyHide) {
            // console.log(event.currentTarget.dataset.status)
            this.setData({
                "assestInfo.applyType": event.currentTarget.dataset.status,
                "applyeq": event.currentTarget.dataset.hospId,
                "applyHide": true
            })
            // console.log(this.data.assestInfo.madeIn)
        }

        // 如果是选择计量设备的弹窗
        if (!this.data.isJLHide) {
            // console.log(event.currentTarget.dataset
            if (this.data.assestInfo.measureFlag == 1 && event.currentTarget.dataset.status == 0 ) {
                wx.showModal({
                    title: '提示',
                    content: '确定要将此计量设备修改为非计量设备吗？',
                    success: (res) => {
                        if (res.confirm) {
                            this.setData({
                                "assestInfo.measureFlag": event.currentTarget.dataset.status,
                                "isJLeq": event.currentTarget.dataset.hospId
                            })
                        }
                    }
                })
            } else {
                this.setData({
                    "assestInfo.measureFlag": event.currentTarget.dataset.status,
                    "isJLeq": event.currentTarget.dataset.hospId
                })
            }  
            this.setData({
                "isJLHide": true
            })
            // console.log(this.data.assestInfo.madeIn)
        }
    },
    // 弹窗消失
    hostModal: function () {
        // 如果是选择图片的弹窗
        if (!this.data.phoneHide) {
            this.setData({
                phoneHide: true
            })
        }
        // 如果是选择状态的弹窗
        if (!this.data.statusHide) {
            this.setData({
                statusHide: true
            })
        }
        // 如果是选择国产的弹窗
        if (!this.data.portHide) {
            this.setData({
                portHide: true
            })
        }
        // 如果是选择国产的弹窗
        if (!this.data.isNotHide) {
            this.setData({
                isNotHide: true
            })
        }
        // 如果是选择计量设备
        if (!this.data.jsJLHide) {
            this.setData({
                jsJLHide: true
            })
        }
    },
    // 字段赋值
    fillField: function (e) {
        //console.log("fill feild");
        let data = {
            assestInfo: this.data.assestInfo
        };
        //console.log(this.data);
        data['assestInfo'][e.currentTarget.dataset.key] = e.detail.value;


        //console.log(data);
        this.setData(data);
        //console.log(this.data);
        // 按钮状态校验
        if (this.data.assestInfo.assetsName && this.data.assestInfo.factoryName) {
            this.setData({
                disabled: false
            })
        } else {
            this.setData({
                disabled: true
            })
        }

    },
    // 点击提交按钮
    btnClick: function () {
        this.updataAssest();
    },
    //更新设备信息
    updataAssest: function () {
        this.data.assestInfo.purchaseWay = this.data.assestInfo.purchaseWay ? this.data.assestInfo.purchaseWay : null
        this.data.assestInfo.tenderForm = this.data.assestInfo.tenderForm ? this.data.assestInfo.tenderForm : null
        this.data.assestInfo.acceptancePersonName = this.data.assestInfo.acceptancePersonName ? this.data.assestInfo.acceptancePersonName : null
        this.data.assestInfo.applyType = this.data.assestInfo.applyType ? this.data.assestInfo.applyType : null

        if (app.globalData.isSave) {
            app.globalData.isSave = false;
            let arr = this.data.assestInfo.invoiceNos.split(";");
            let listInvoice = [];
            for (var i in arr) {
                listInvoice.push({
                    assetsId: this.data.assestInfo.assetsId,
                    invoiceNo: arr[i]
                });
            }
            this.data.assestInfo.assetsImg = this.data.assetsImg2
            this.data.assestInfo.contractPrice = this.data.assestInfo.contractPrice ? parseFloat(this.data.assestInfo.contractPrice) : null
            this.data.assestInfo.contractPriceStr = this.data.assestInfo.contractPrice ? this.data.assestInfo.contractPrice + "" : ""
            // this.data.assestInfo.price = this.data.assestInfo.price ? parseFloat(this.data.assestInfo.price) : null
            this.data.assestInfo.priceStr = this.data.assestInfo.price / 100
            this.data.assestInfo.listInvoice = listInvoice
            this.data.assestInfo.acceptanceDate = this.data.assestInfo.acceptanceDate ? (new Date(this.data.assestInfo.acceptanceDate)).getTime() : null
            this.data.assestInfo.applyDate = this.data.assestInfo.applyDate ? (new Date(this.data.assestInfo.applyDate)).getTime() : null
            this.data.assestInfo.arrivalDate = this.data.assestInfo.arrivalDate ? (new Date(this.data.assestInfo.arrivalDate)).getTime() : null

            this.data.assestInfo.createTime = this.data.assestInfo.createTime ? (new Date(this.data.assestInfo.createTime)).getTime() : null
            this.data.assestInfo.purchaseDate = this.data.assestInfo.purchaseDate ? (new Date(this.data.assestInfo.purchaseDate)).getTime() : null
            this.data.assestInfo.startDate = this.data.assestInfo.startDate ? (new Date(this.data.assestInfo.startDate)).getTime() : null
            this.data.assestInfo.startUseDate = this.data.assestInfo.startUseDate ? (new Date(this.data.assestInfo.startUseDate)).getTime() : null
            this.data.assestInfo.updateTime = this.data.assestInfo.updateTime ? (new Date(this.data.assestInfo.updateTime)).getTime() : null
            this.data.assestInfo.winTenderDate = this.data.assestInfo.winTenderDate ? (new Date(this.data.assestInfo.winTenderDate)).getTime() : null
            this.data.assestInfo.warrantyDate = this.data.assestInfo.warrantyDate ? (new Date(this.data.assestInfo.warrantyDate)).getTime() : null
            this.data.assestInfo.contractPriceStr = this.data.assestInfo.contractPrice / 100
            this.data.assestInfo.listFundSources.map(item => {
                item.fundSourceMoneyStr = (item.fundSourceMoney / 100).toFixed(2)
            })
            this.data.assestInfo.singleBudgetStr = this.data.assestInfo.singleBudget / 100
            if (this.data.index == 0) {
                this.data.assestInfo.moduleType = 1
            }
            if (this.data.index == 1) {
                this.data.assestInfo.moduleType = 2
            }

            api.updateAssetName({
                isNoToken: false,
                data: {
                    assetssId: this.data.assestInfo.assetsId,
                    assetsName: this.data.assestInfo.assetsName
                },
                success: function (res) {

                }
            });
            api.updateFactoryName({
                isNoToken: false,
                data: {
                    assetssId: this.data.assestInfo.assetsId,
                    factoryName: this.data.assestInfo.factoryName
                },
                success: function (res) {

                }
            });
            this.baseSubmit();          
        }
    },
    baseSubmit: function () {
        this.data.assestInfo.priceD = this.data.assestInfo.priceD == '' ? null : this.data.assestInfo.priceD;
        api.editAssest({
            isNoToken: false,
            data: this.data.assestInfo,
            success: (res) => {
                this.setData({
                    hoverShow: true
                })
                if (this.data.index == 0) {
                    this.setData({
                        look1: true
                    })
                }
                if (this.data.index == 1) {
                    this.setData({
                        look2: true
                    })
                }
                this.detailzc()
            },
            complete: (res) => {
                app.globalData.isSave = true;
                if (res.data.code == 'C_010') {
                    this.setData({
                        totastHide2: false,
                        totastContent2: res.data.msg
                    })
                    setTimeout(() => {
                        this.setData({
                            totastHide2: true
                        })
                    }, 1000)
                }
            }
        });
    },
    // 启用日期
    bindDateChange: function (e) {
        this.setData({
            "assestInfo.startUseDate": e.detail.value
        })
    },
    purchaseDateChange: function (e) {
        this.setData({
            "assestInfo.purchaseDate": e.detail.value
        })
    },
    // 查看大图
    lookBig: function (e) {
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
    // 删除图片
    delImg: function (e) {
        var num = e.currentTarget.dataset.fujianList
        var _index = e.currentTarget.dataset.fujianIndex
        if (num == 1) {
            this.data.assestInfo.acceptanceAnnexList.splice(_index, 1)
        }
        if (num == 2) {
            this.data.assestInfo.contractAnnexList.splice(_index, 1)
        }
        this.setData({
            assestInfo: this.data.assestInfo
        })
    }
})